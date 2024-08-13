"use client";

import { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import {
  APP_ENV,
  verifyLogin,
  initSSOWidget,
  logout,
  loadPrimeApi,
  setCookieToSpecificTime,
  delete_cookie,
  saveLogs,
  userMappingData
} from "../../utils";
import { useStateContext } from "../../store/StateContext";
import GLOBAL_CONFIG from "../../network/global_config.json";
import Image from "next/image";
import APIS_CONFIG from "../../network/config.json";
import { gotoPlanPage } from '../../utils/utils';

const Login = ({headertext}) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;

  //console.log(state.login);

  const verifyLoginSuccessCallback = async () => {
    try {
      //document.body.classList.add("isprimeuser");
      const primeRes = await loadPrimeApi();
      if (primeRes?.status === "SUCCESS") {
        const isPrime =
          primeRes?.data &&
          primeRes?.data.permissions.some(function (item: any) {
            return !item.includes("etadfree") && item.includes("subscribed");
          });
        window.objUser.permissions = primeRes?.data?.permissions || [];
        window.objUser.accessibleFeatures =
          primeRes.data.accessibleFeatures || [];
        window.objUser.primeInfo = primeRes?.data;
        window.objUser.isPrime = isPrime;
        setCookieToSpecificTime("isprimeuser", isPrime, 30, 0, 0, "");
        if (primeRes && primeRes?.token) {
          setCookieToSpecificTime("OTR", primeRes.token, 30, 0, 0, "");
        }

        
        isPrime && document.body.classList.add("isprimeuser");

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
        window.objUser.primeInfo = {};
        window.objUser.isPrime = false;
        delete_cookie("isprimeuser");
        if (primeRes && primeRes.token) {
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
          accessibleFeatures: window.objUser.accessibleFeatures,
          //[
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
          // ],
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
        // ssoReady: true,
        // isLogin: true,
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
    //console.log("authFailCallback");
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
      },
    });
  };

  const jssoLoadedCallback = () => {
    verifyLogin();
  };

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
          <div className={`${styles.flr} ${styles.subSign} ${isPrime ? styles.pink_theme : ""}`}>
            {!isPrime && <span className={`${styles.subscribe}`} onClick={gotoPlanPage}>Subscribe</span>}
            <div className={`${styles.dib} ${styles.loginBoxWrap}`}>
              {
                isLogin 
                ? <>
                  <span className={styles.dd} title={userInfo?.loginId}>{userInfo?.firstName}</span>
                  <div className={styles.signMenu}>
                    <div className={styles.outerContainer}>
                      <p className={styles.emailLbl}>{userInfo?.loginId}</p>
                      <div className={styles.bgWhite}>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}userprofile.cms`} rel="noreferrer" target="_blank" className={`${styles.cSprite_b} ${styles.edit}`}>Edit Profile</a>
                        {/* <a href="" target="_blank" className="cSprite_b streamIcon jsStreamIcon hide"></a> */}
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}plans_mysubscription.cms?fornav=1`} rel="nofollow noreferrer" target="_blank" className={`${styles.subscribe} ${styles.cSprite_b}`}>My Subscriptions</a>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}prime_preferences.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.mypref} ${styles.cSprite_b}`}>My Preferences</a>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}et_benefits.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.etBenefits} ${styles.cSprite_b}`}>Redeem Benefits</a>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}subscription`} rel="nofollow noreferrer" target="_blank" className={`${styles.newsltr} ${styles.cSprite_b}`}>Manage Newsletters</a>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}marketstats/pageno-1,pid-501.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.wthlist} ${styles.cSprite_b}`}>My Watchlist</a>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}bookmarkslist`} rel="nofollow noreferrer" className={`${styles.cSprite_b} ${styles.savedStories}`}>Saved Stories</a>
                        <a href="#" onClick={handleRedeemVoucher} className={`${styles.cSprite_b} ${styles.rdm_tab} ${styles.eu_hide}`}>Redeem Voucher</a>
                        <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}contactus.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.contactus} ${styles.cSprite_b}`}>Contact Us</a>
                        <a href="#" onClick={logout} className={`${styles.cSprite_b} ${styles.logOut}`}>Logout</a>
                      </div>
                    </div>
                  </div>
                </>
                : <a onClick={handleLoginToggle} href="#" className={styles.signInLink}>Sign In</a>
              }
            </div>
            {
              !isPrime && <div className={styles.soWrapper}>
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

