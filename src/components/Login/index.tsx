'use client';
import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { setLoggedIn, setLoggedOut, setIsPrime } from "../../Slices/login";
import styles from "./styles.module.scss";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV, getCookie, setCookieToSpecificTime } from "../../utils";

interface Props {}

interface IUser {
  firstName?: string;
  ssoid?: string;
  primaryEmail?: string;
}

const Login: React.FC<Props> = () => {
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
    }
  };
  const permissionCallback = () => {
    const permissions = (window.objInts && window.objInts.permissions) || [];
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

  return (
    <>
      <div className={`${styles.flr} ${styles.subSign} ${isPrime ? styles.pink_theme : ""}`}>
        {!isPrime && <span data-ga-onclick="Subscription Flow#SYFT#ATF - url" className={`${styles.subscribe}`}>Subscribe</span>}
        <div className={`${styles.dib} ${styles.loginBoxWrap}`}>
          {
            isLogin 
            ? <>
              <span className={styles.dd} title={userInfo.primaryEmail}>{userInfo.firstName}</span>
              <div className={styles.signMenu}>
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
            </>
            : <a data-ga-onclick="ET Login#Signin - Sign In - Click#ATF - url" onClick={handleLoginToggle} href="#" className={styles.signInLink}>Sign In</a>
          }
        </div>
        {
          !isPrime && <div className={styles.soWrapper}>
            <a data-url="https://economictimes.indiatimes.com/plans.cms" data-ga-onclick="Subscription Flow#SYFT#HomepageOfferHeader" className={`${styles.hdr_spcl_ofr} ${styles.top_f_us}`}>Special Offer on ETPrime</a>
          </div>
        }
      </div>
    </>
  );
};

export default Login;