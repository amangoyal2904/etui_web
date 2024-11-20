"use client";

import { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import {
  verifyLogin,
  initSSOWidget,
  logout,
  loadPrimeApi,
  setCookieToSpecificTime,
  delete_cookie,
  saveLogs,
  userMappingData,
  setAdFreeData,
  getCookie,
  loadPrimeApiNew
} from "../../utils";
import { useStateContext } from "../../store/StateContext";
import GLOBAL_CONFIG from "../../network/global_config.json";
import Image from "next/image";
import APIS_CONFIG from "../../network/config.json";
import { getParameterByName, gotoPlanPage } from '../../utils/utils';
import jStorage from "jstorage-react";

const Login = ({headertext}) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, isPink, isAdfree, permissions, ssoid, ticketId, email } = state.login;
  const [profileStatus, setProfileStatus] = useState(false);

  //console.log(state.login);

  const adFreeEx = () => {
    
    // const isAddFreeEnabled = 1 || 0,
    const isAddFreeEnabled = window.objVc && window.objVc.adfree_campign_isactive || 0,
        isExpiredUser = window.objUser.permissions.some(function (item: any) {
          return !item.includes("etadfree") && item.includes("expired_subscription");
        }),
        getSSOID = window.objUser?.ssoid || getCookie('_grx'),
        addFreeCampignRef = jStorage.get('adFreeCampign_'+getSSOID);
  
        if(isExpiredUser && Number(isAddFreeEnabled)) {
          setAdFreeData(window.objVc && window.objVc.adfree_campign_counter || 30, getSSOID, window.objUser?.ticketId, dispatch);
      }
      
      if(!Number(isAddFreeEnabled)) {
        jStorage.deleteKey('adFreeCampign_'+ssoid);
      }
  }

  const verifyLoginSuccessCallback = async () => {
    try {
      
      const docRef = document.referrer;
      const getStorePrimeDetial = jStorage.get('prime_' + window.objUser?.ticketId);
      const otrCookieExist = getCookie('OTR');
      const refreshFlag = window.localStorage && localStorage.getItem("etsub_refreshTokenFlag");

      if (typeof window !== "undefined" && window.location.href.includes("default_prime.cms")) {
        window.objUser.isPink = true;
        window.objUser.isPink && document.body.classList.add("isprimeuser");
        dispatch({
          type: "SETPINKTHEME",
          payload: {
            isPink: true
          },
        });
      }

      if(docRef.indexOf('/plans_success') > -1 || docRef.indexOf('?transcode') > -1 || docRef.indexOf('buy.indiatimes.com/') > -1 || 
      refreshFlag == 'true' || getParameterByName('fromsrc') == 'etprime' || !otrCookieExist ||
      !getStorePrimeDetial){
        localStorage.removeItem("etsub_refreshTokenFlag");
        jStorage.deleteKey('tokenDataExist');
        jStorage.deleteKey('et_profilelog'); 
      }

      const isTokenDataExist = jStorage.get('tokenDataExist');
      const primeRes = isTokenDataExist ? getStorePrimeDetial : await loadPrimeApiNew();
      
      if (primeRes?.code === "200") {
        const resObj = primeRes?.data.productDetails.filter((item: any) => {
          return item.productCode == "ETPR";
        });
        const oauthAPiRes = resObj[0];
        const isPrime =
          primeRes.data &&
          oauthAPiRes.permissions.some(function (item: any) {
            return !item.includes("etadfree") && item.includes("subscribed");
          });
        const isExpired =
          primeRes?.data &&
          oauthAPiRes.permissions.some(function (item: any) {
            return !item.includes("etadfree") && item.includes("expired_subscription");
          });  

        jStorage.set('prime_' +window.objUser?.ticketId, primeRes, {TTL: 2*60*60*1000}); 
        jStorage.set('tokenDataExist', 1, {TTL: isPrime ? 2*60*60*1000 : 5*60*1000});

        window.objUser.permissions = oauthAPiRes.permissions || [];
        window.objUser.accessibleFeatures =
          oauthAPiRes.accessibleFeatures || [];
        window.objUser.userAcquisitionType =
          oauthAPiRes.subscriptionDetail &&
          "userAcquisitionType" in oauthAPiRes.subscriptionDetail
            ? oauthAPiRes.subscriptionDetail.userAcquisitionType
            : "free";
        window.objUser.primeInfo = oauthAPiRes;
        window.objUser.isPrime = isPrime;
        window.objUser.isPink = isPrime ? true : false;
        setCookieToSpecificTime("isprimeuser", isPrime, 30, 0, 0, "");
        if (primeRes && primeRes?.data?.token) {
          setCookieToSpecificTime("OTR", primeRes?.data?.token, 30, 0, 0, ".indiatimes.com");
        }
        setCookieToSpecificTime("etprc", oauthAPiRes.prc, 30, 0, 0);

        
        (isPink || isPrime) && document.body.classList.add("isprimeuser");

        if(isExpired){
          adFreeEx();
        }

        const primeUserLoginMap_check = Number(localStorage.getItem("primeUserLoginMap_check")) == 1 || false;
        if(primeUserLoginMap_check){
          userMappingData({res: primeRes?.data, userInfo : window.objUser?.info, isPrime, email: window.objUser?.info?.primaryEmail})
          localStorage.removeItem("primeUserLoginMap_check");
        }

        // saveLogs({
        //   type: "Desktop",
        //   res: "SUCCESS",
        //   msg: "verifyLoginSuccessCallback",
        //   resData: primeRes,
        //   objUser: window.objUser,
        // });
      } else {
        window.objUser.permissions = [];
        window.objUser.accessibleFeatures = [];
        window.objUser.userAcquisitionType = "free";
        window.objUser.primeInfo = {};
        window.objUser.isPrime = false;
        delete_cookie("isprimeuser");
        if (primeRes && primeRes?.data?.token) {
          delete_cookie("OTR");
        }
        saveLogs({
          type: "Mercury",
          res: "Fail",
          msg: "verifyLoginSuccessCallback",
          resData: primeRes,
          objUser: window.objUser,
        });
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ssoReady: true,
          isLogin: true,
          isPrime: window.objUser.isPrime, // true, //,
          userInfo: window.objUser?.info,
          ssoid: window.objUser?.ssoid,
          email: window.objUser?.info?.primaryEmail || "",
          ticketId: window.objUser?.ticketId,
          isPink: window.objUser?.isPink,
          accessibleFeatures: window.objUser.accessibleFeatures,
          subscriptionDetails: window.objUser.primeInfo?.subscriptionDetails,
          // [
          //   "ETSCREE",
          //   "TOIARTCL",
          //   "ETADF",
          //   "TOIADL",
          //   "ETARTICLES",
          //   "TOIPRED",
          //   "ETCHPTR",
          //   "TOIUNLM",
          //   "ETPRED",
          //   "ETINVID",
          //   "TOICRWD",
          //   "MATAEPPR",
          //   "TOIPDEV",
          //   "ETNEWSL",
          //   "ETWEED",
          //   "TOIBRF",
          //   "TOITA",
          //   "ETMBSR",
          //   "ETEPPR",
          //   "TOIEPPR",
          //   "ETSHKP",
          //   "TOINEWSLT",
          //   "ETSRP",
          //   "TOISPCL",
          //   "ETSTKAN"
          // ], // 
          permissions: window.objUser.permissions,
          // [
          //   "loggedin",
          //   "subscribed",
          //   "subscriber",
          //   "active_subscription",
          //   "etadfree_can_buy_subscription",
          //   "etredcarpet_can_buy_subscription"
          // ], // 
        },
      });
    } catch (e) {
      console.log("verifyLogin Catch", e);
    }
  };

  const getUserDetailsSuccessCallback = () => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        ssoReady: true,
        isLogin: true,
        isPrime: window.objUser.isPrime,
        userInfo: window.objUser?.info,
        ssoid: window.objUser?.ssoid,
        email: window.objUser?.info?.primaryEmail || "",
        ticketId: window.objUser?.ticketId,
        accessibleFeatures: window.objUser.accessibleFeatures,
        permissions: window.objUser.permissions,
      },
    });

    
  };

  const authFailCallback = () => {
    if (typeof window !== "undefined" && window.location.href.includes("default_prime.cms")) {
      window.objUser.isPink = true;
      window.objUser.isPink && document.body.classList.add("isprimeuser");
      dispatch({
        type: "SETPINKTHEME",
        payload: {
          isPink: true
        },
      });
    }
    console.log("authFailCallback");
    dispatch({
      type: "LOGOUT",
      payload: {
        ssoReady: true,
        isLogin: false,
        isPrime: false,
        userInfo: {},
        ssoid: "",
        email: "",
        ticketId: "",
        accessibleFeatures: [],
        permissions: [],
        isAdfree: false,
        isPink: window.objUser.isPink || false
      },
    });
  };

  const jssoLoadedCallback = () => {
    verifyLogin();
  };

  const fetchQuestionnaireHit = async () => {
    let serviceUrl = APIS_CONFIG["FetchQuestionnaire_v3"][window.APP_ENV];

    const params = new URLSearchParams({
      isPaidUser: isPrime,
      email: email,
      isEdit: 'true'
    });

    try{
      // Fetching the questionnaire data
      const fetchQues = await fetch(`${serviceUrl}?${params.toString()}`, {
          method: 'GET',
          headers: {
              'Authorization': ssoid,
              'Content-Type': 'application/json'
          }
      });

      // Checking if the response is OK (status code 200-299)
      if (!fetchQues.ok) {
          throw new Error(`HTTP error! Status: ${fetchQues.status}`);
      }

      // Parsing the response to JSON
      const jsonFetchQues = await fetchQues.json();

      const profileObj = jsonFetchQues.questionnaireDto && jsonFetchQues.questionnaireDto.screens.filter(ele => ele.key === "screen1");
      const profileCompleted = profileObj && profileObj.length && profileObj[0].status.toLowerCase() === "complete";
      if(!profileCompleted){
        setProfileStatus(true);
      }
    }catch(error){

    }
  }

  useEffect(() => {
    if(isPrime !== null && typeof isPrime != "undefined" && ssoid && email){
      fetchQuestionnaireHit();
    }
  }, [isPrime])

  useEffect(() => {
    document.addEventListener("jssoLoaded", jssoLoadedCallback);
    document.addEventListener("verifyLoginSuccess", verifyLoginSuccessCallback);
    document.addEventListener("verifyLoginFail", authFailCallback);
    document.addEventListener(
      "getUserDetailsSuccess",
      getUserDetailsSuccessCallback,
    );
    document.addEventListener("getUserDetailsFail", authFailCallback);
    return () => {
      document.removeEventListener("jssoLoaded", jssoLoadedCallback);

      document.removeEventListener(
        "verifyLoginStatus",
        verifyLoginSuccessCallback,
      );
      document.removeEventListener("verifyLoginFail", authFailCallback);

      document.removeEventListener(
        "getUserDetailsSuccess",
        getUserDetailsSuccessCallback,
      );
      document.removeEventListener("getUserDetailsFail", authFailCallback);
    };
  }, []);

  const handleLoginToggle = () => {
    //alert(1);
    if (isLogin) {
      //setLogout();
    } else {
      initSSOWidget();
    }
  };

  const handleRedeemVoucher = () => {
    const voucherClicked = new Event("voucherClicked");
    document.dispatchEvent(voucherClicked);
  };
  const headerText = () => {
    let permissions = (typeof window !="undefined" && window.objInts && window.objInts.permissions) || [];
    let hText = 'Special Offer on ETPrime';
    if(isLogin) {
      permissions = (window.objInts && window.objInts.permissions) || [];
    }
    if(permissions.includes('expired_subscription')) {
      hText = headertext?.expired
    } else if(permissions.includes('cancelled_subscription')) {
      hText = headertext?.cancelled
    } else {
      hText = headertext?.free
    }

    return hText;
  }

  return (
    <>
      {
        ssoReady ? (
          <div className={`${styles.flr} ${styles.subSign} ${isPink ? styles.pink_theme : ""}`}>
            <a className={styles.watchlist} href="https://economictimes.indiatimes.com/watchlist?source=homepage&medium=header&campaign=watchlist">My Watchlist</a>
            {!isPrime && <span className={`${styles.subscribe}`} onClick={gotoPlanPage}>Subscribe</span>}
            <div className={`${styles.dib} ${styles.loginBoxWrap}`}>
              {
                isLogin 
                ? <>
                  {
                    isPink ? <>
                      <span className={styles.prime_icon}></span>
                      <div className={styles.userDeatils}>
                        <p className={styles.userPrime}>{isPrime ? 'Prime Member' : 'Free Member'}</p>
                        <p className={styles.dd} title={userInfo?.loginId}>{userInfo?.firstName}</p>
                      </div>
                    </> : <>
                      <p className={styles.free_dd} title={userInfo?.loginId}>{userInfo?.firstName[0] || ''}</p>
                    </>
                  }
                  <div className={styles.signMenu}>
                    <div className={styles.outerContainer}>
                    <p className={styles.userName}>{`Hi ${userInfo?.firstName}`}</p>
                      <p className={styles.emailLbl}>{userInfo?.loginId}</p>
                      <div className={styles.bgWhite}>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}userprofile.cms`} rel="noreferrer" target="_blank" className={`${styles.menulist} ${styles.cSprite_b} ${styles.edit}`}>Edit Profile {profileStatus && <span className={styles.incomplete_badge}>INCOMPLETE<span>!</span></span>}</a>
                        {/* <a href="" target="_blank" className="cSprite_b streamIcon jsStreamIcon hide"></a> */}
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}plans_mysubscription.cms?fornav=1`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.subscribe} ${styles.cSprite_b}`}>My Subscriptions</a>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}prime_preferences.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.mypref} ${styles.cSprite_b}`}>My Preferences</a>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}referrals`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.refer} ${styles.cSprite_b}`}>Refer & Earn <img src="https://img.etimg.com/photo/107514300.cms" width="36" height="17" className={styles.new_badge} alt="New Feature"></img></a>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}et_benefits.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.etBenefits} ${styles.cSprite_b}`}>Redeem Benefits</a>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}subscription`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.newsltr} ${styles.cSprite_b}`}>Manage Newsletters</a>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}marketstats/pageno-1,pid-501.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.wthlist} ${styles.cSprite_b}`}>My Watchlist</a>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}bookmarkslist`} rel="nofollow noreferrer" className={`${styles.menulist} ${styles.cSprite_b} ${styles.savedStories}`}>Saved Stories</a>
                        <span onClick={handleRedeemVoucher} className={`${styles.menulist} ${styles.cSprite_b} ${styles.rdm_tab} ${styles.eu_hide}`}>Redeem Voucher</span>
                        <a href={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}contactus.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.menulist} ${styles.contactus} ${styles.cSprite_b}`}>Contact Us</a>
                        <span onClick={logout} className={`${styles.menulist} ${styles.cSprite_b} ${styles.logOut}`}>Logout</span>
                      </div>
                    </div>
                  </div>
                </>
                : <a onClick={handleLoginToggle} href="#" className={styles.signInLink}>Sign In</a>
              }
            </div>
            {
              (!isPrime || isAdfree) && <div className={styles.soWrapper}>
                <a className={`${styles.hdr_spcl_ofr}`} onClick={gotoPlanPage}>{headerText()}</a>
              </div>
            }
          </div>
        ) : (
          <div className={styles.loginSpace} />  
        )
      }
    </>
  )
};

export default Login;

