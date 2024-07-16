'use client';
import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { setLoggedIn, setLoggedOut, setIsPrime } from "../../Slices/login";
import styles from "./styles.module.scss";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV, getCookie, setCookieToSpecificTime } from "../../utils";
import { detectBrowser, isMobileSafari, loadAssets } from "utils/utils";
import { gotoPlanPage } from '../../utils/utils';

interface Props {}
declare global {
  interface Window { 
    OneTapLogins:any;
    oneTabloginProcess:any;
    default_gsi:any;
    oneTap:any;
    __APP:any;
    objUser:any;
    objInts:any;
  }
}
interface IUser {
  firstName?: string;
  ssoid?: string;
  primaryEmail?: string;
}

const Login: React.FC<Props> = (props) => {
  const { headertext }:any = props;
  const [userInfo, setUserInfo] = useState<IUser>({});
  const [isLogin, setIsLogin] = useState(false);
  const [isPrime, setIsPrime] = useState(false);
  // const dispatch = useDispatch();

  const loginCallback = () => {
    const objUser = (window.objUser && window.objUser.info) || {};
    if (Object.keys(objUser).length) {
      setUserInfo(objUser);
      setIsLogin(true);
      // dispatch(
      //   setLoggedIn({
      //     userInfo: objUser,
      //     login: true,
      //     permissions: [],
      //     isprimeuser: 1
      //   })
      // );
      window.__APP.login = {
        status: true,
        ssoid: objUser.ssoid,
        email: objUser.primaryEmail,
        firstName: objUser.firstName
      };

      window.customDimension["dimension3"] = "LOGGEDIN";
      window.customDimension["email"] = objUser.primaryEmail;
      if (objUser.ssoid) window.customDimension["userId"] = objUser.ssoid;
    } else {
      window.customDimension["dimension3"] = "NONLOGGEDIN";
      console.log("@@@@@@--->>",detectBrowser("safari"));
      if (!(detectBrowser("safari") || isMobileSafari())) {
        //let userTraffic = typeof objVc !== 'undefined' && objVc.userTraffic || 0;
        setTimeout(()=> oneTapLogin(),10000);
      }
    }
  };
  const permissionCallback = () => {
    const permissions = (window && window.objInts && window.objInts.permissions) || [];
    if (permissions.includes("subscribed")) {
      // set state
      setIsPrime(true);
      // set prime status in redux
      // dispatch(setIsPrime(1));
      // add isprimeuser class in the body
      window.isprimeuser = 1;
      document.cookie = "isprimeuser=1";
      document.body.classList.add("isprimeuser");
      window.customDimension["dimension37"] = "Paid User";
    } else {
      window.isprimeuser = 0;
      window.customDimension["dimension37"] = "Free User";
      // remove isprimeuser class from the body
      document.body.classList.remove("isprimeuser");
    }
  };
  const intsCallback = () => {
    if (typeof window.objUser !== "undefined") {
      window.objUser.afterLoginCall(loginCallback);
    }
    window.objInts.afterPermissionCall(permissionCallback);
  };

  useEffect(() => {
    console.log({APP_ENV});
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  const setLogout = (cb = null) => {
    const userSsoId = userInfo.ssoid
    // dispatch(setLoggedOut());
    setUserInfo({});
    window.__APP.login = {
      status: false,
      ssoid: "",
      email: "",
      firstName: ""
    };
    if (typeof cb == "function") {
      // cb();
    } else {
      window.objUser.logout(() => {
        window.ga('send', 'event', 'SignOut', window.location.href);
        const tId = getCookie('TicketId');
        try {
          var currentDate = new Date();
          var a = new Date();
          currentDate.setDate(a.getDate() + 1);
          var b  = new Date(currentDate.toDateString());
          var pendingTo12Pm = (b.getTime() - a.getTime());
          //  current date 12 PM.
          window.e$.jStorage.set('c_oneTapLogin', 1, {TTL: pendingTo12Pm});

          window.google 
          && window.google.accounts 
          && window.google.accounts.id 
          && window.google.accounts.id.disableAutoSelect 
          && window.google.accounts.id.disableAutoSelect();
        } catch (e) {}

        window.localStorage && localStorage.removeItem('et_logintype');
        window.e$.jStorage.deleteKey('et_profilelog'); // to reinitiate grx profile log
        window.e$.jStorage.deleteKey('et_subscription_profile');
        window.e$.jStorage.deleteKey('et_member_data');
        window.e$.jStorage.deleteKey('accessPassData');
        window.e$.jStorage.deleteKey('etbenefits_data'); // to reinitiate vouchers data

        const url = `https://${window.objVc.oauth}.economictimes.indiatimes.com/oauth/api/merchant/ET/token/logout`;
        const clientId = APP_ENV == "development" ? 'b2a8e883ec676f417520f422068a4742' : 'w2a8e883ec676f417520f422068a4741';
        const deviceId = getCookie('_grx');
        const params = JSON.stringify({ticketId: tId});
        const headers = {          
            Accept: "application/json",
            'X-CLIENT-ID': clientId,
            'X-DEVICE-ID': deviceId,
            'x-sso-id': userSsoId
        }
        
        Service.post({ url, headers, payload: params, params: {} })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log("Next WEB cookie consent err: ", err);
        });

        //window.location.reload();
      });
    }
  };

  const handleRedeemVoucher = (): void => {
    const voucherClicked = new Event("voucherClicked");
    document.dispatchEvent(voucherClicked);
  };

  const handleLoginToggle = (): void => {
    if (isLogin) {
      setLogout();
    } else {
      window.objUser.initSSOWidget()
    }
  };

  const resetInfo = () => {
    window.e$.jStorage.deleteKey('userInfo');
  }
  const oneTapLogin = () => {
    let oneTapUrl = window.objVc.lib_googlelogin;
    if (
      typeof window.e$ != "undefined" && window.e$.jStorage &&
      localStorage.getItem("jStorage")
    ) {
     
      if (window.e$.jStorage.get("c_oneTapLogin") != 1 ) {
        window.ispopup = true;
        console.log("@@@@@--->>",oneTapUrl);
        loadAssets(oneTapUrl, "js", "async", "body");
        const oneTabPrompt = () => {
          if (typeof window != "undefined" && typeof window.oneTabloginProcess != "undefined") {
            window.OneTapLogins.init();
            if (typeof window.default_gsi != "undefined") {
              google.accounts.id.prompt(notification => {
                console.log("One Tab Login --",notification)
                window.oneTap = notification;
                if (notification.isDisplayed() || (notification.h || notification.g ) == 'display') {
                  // window.customDimension.dimension72 = window.customDimension.dimension72 ? window.customDimension.dimension72 + "Free Access Chrome login" : "Free Access Chrome login";
                } if (notification.h == 'display' && notification.i == false && (notification.l == "opt_out_or_no_session" || notification.l == "suppressed_by_user" || notification.l == "missing_client_id")) {
                  console.log("One Tab Login closed --",notification);
                }
                if ((notification.l || notification.m) == 'user_cancel') {
                  console.log("One Tab Login closed --",notification);
                }
                if ((notification.g || notification.h) == 'skipped' && ((notification.l || notification.m) == 'tap_outside' || (notification.l || notification.m) == 'auto_cancel')) {
                  console.log("One Tab Login closed --",notification);
                }
                if (notification.getMomentType() == "dismissed" && notification.getDismissedReason() == "credential_returned") {
                  console.log('oneTap', notification);
                }

              });
            } else {
              setTimeout(oneTabPrompt, 500);
            }
          } else {
            setTimeout(oneTabPrompt, 500);
          }
        }
        oneTabPrompt();
      }
    }
  }

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
      <div className={`${styles.flr} ${styles.subSign} ${isPrime ? styles.pink_theme : ""}`}>
        {!isPrime && <span data-ga-onclick="Subscription Flow#SYFT#ATF - url" className={`${styles.subscribe}`} onClick={gotoPlanPage}>Subscribe</span>}
        <div className={`${styles.dib} ${styles.loginBoxWrap}`}>
          {
            isLogin 
            ? <>
              <span className={styles.dd} title={userInfo.primaryEmail}>{userInfo.firstName}</span>
              <div className={styles.signMenu}>
                <div className={styles.outerContainer}>
                  <p className={styles.emailLbl}>{userInfo.primaryEmail}</p>
                  <div className={styles.bgWhite}>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}userprofile.cms`} rel="noreferrer" target="_blank" className={`${styles.cSprite_b} ${styles.edit}`} onClick={resetInfo}>Edit Profile</a>
                    {/* <a href="" target="_blank" className="cSprite_b streamIcon jsStreamIcon hide"></a> */}
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}plans_mysubscription.cms?fornav=1`} rel="nofollow noreferrer" target="_blank" className={`${styles.subscribe} ${styles.cSprite_b}`}>My Subscriptions</a>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}prime_preferences.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.mypref} ${styles.cSprite_b}`}>My Preferences</a>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}et_benefits.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.etBenefits} ${styles.cSprite_b}`}>Redeem Benefits</a>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}subscription`} rel="nofollow noreferrer" target="_blank" className={`${styles.newsltr} ${styles.cSprite_b}`}>Manage Newsletters</a>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}marketstats/pageno-1,pid-501.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.wthlist} ${styles.cSprite_b}`}>My Watchlist</a>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}bookmarkslist`} rel="nofollow noreferrer" className={`${styles.cSprite_b} ${styles.savedStories}`}>Saved Stories</a>
                    <a href="#" onClick={handleRedeemVoucher} className={`${styles.cSprite_b} ${styles.rdm_tab} ${styles.eu_hide}`}>Redeem Voucher</a>
                    <a href={`${APIS_CONFIG.DOMAIN[APP_ENV]}contactus.cms`} rel="nofollow noreferrer" target="_blank" className={`${styles.contactus} ${styles.cSprite_b}`}>Contact Us</a>
                    <a href="#" onClick={handleLoginToggle} className={`${styles.cSprite_b} ${styles.logOut}`}>Logout</a>
                  </div>
                </div>
              </div>
            </>
            : <a data-ga-onclick="ET Login#Signin - Sign In - Click#ATF - url" onClick={handleLoginToggle} href="#" className={styles.signInLink}>Sign In</a>
          }
        </div>
        {
          !isPrime && <div className={styles.soWrapper}>
            <a data-ga-onclick="Subscription Flow#SYFT#HomepageOfferHeader" className={`${styles.hdr_spcl_ofr}`} onClick={gotoPlanPage}>{headerText()}</a>
          </div>
        }
      </div>
    </>
  );
};

export default Login;