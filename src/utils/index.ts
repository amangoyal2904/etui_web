//@ts-nocheck

import GLOBAL_CONFIG from "../network/global_config.json";
import APIS_CONFIG from "../network/config.json";
import service from "../network/service";
import jStorage from "jstorage-react";
import {dateFormat} from "./utils"

declare global {
  interface Window {
    geolocation: any;
    customDimension: any;
    geoinfo: any;
    opera?: string;
    MSStream?: string;
  }
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}

declare var ssoWidget: any;

const API_SOURCE = 0;

export const isBrowser = () => typeof window !== "undefined";
export const queryString = (params) =>
  Object.keys(params)?.map((key) => key + "=" + params[key]).join("&");

export const loadScript = (
  src: string,
  async: boolean = true,
  type: string = "text/javascript",
  position: "head" | "body" = "body",
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = type;
    script.async = async;
    script.src = src;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    if (position === "head") {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });
};
export const sendMouseFlowEvent = async (): Promise<void> => {
  try {
    await loadScript(
      "//cdn.mouseflow.com/projects/81baae85-f91c-464e-ac38-15a987752b7a.js",
    );
    if (typeof window !== "undefined") {
      window._mfq = window._mfq || [];
      window._mfq.push(["setVariable", "ETCore"]);
    }
  } catch (error) {
    console.error("Failed to load Mouseflow script", error);
  }
};
export const setCookieToSpecificTime = (
  name: string,
  value: string | number | boolean,
  days = 0,
  time = 0,
  seconds = 0,
  domain = ".indiatimes.com",
) => {
  try {
    if (typeof document === "undefined") {
      // Document is not available, handle accordingly
      return;
    }

    let cookiestring = `${name}=${encodeURIComponent(value)};`;
    const options = { domain: domain, path: "/" };

    if (days) {
      const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      cookiestring += `expires=${expirationDate.toUTCString()};`;
    }

    if (time) {
      const date = new Date();
      const [hours, minutes] = (time as any).split(":");
      date.setHours(hours);
      date.setMinutes(minutes);
      cookiestring += `expires=${date.toUTCString()};`;
    }

    if (seconds) {
      const expirationDate = new Date(Date.now() + seconds * 1000);
      cookiestring += `expires=${expirationDate.toUTCString()};`;
    }

    cookiestring += `domain=${options.domain}; path=${options.path};`;

    document.cookie = cookiestring;
  } catch (e) {
    console.log("setCookieToSpecificTime Error:", e);
  }
};

export const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (e) {
    console.log("getCookie", e);
  }
};
// Check if GDPR policy allowed for current location
export const allowGDPR = () => {
  try {
    if (typeof window.geoinfo == "undefined") {
      return false;
    }
    return (
      window.geoinfo &&
      window.geoinfo.geolocation != "5" &&
      (window.geoinfo.geolocation != "2" || window.geoinfo.region_code != "CA")
    );
  } catch (e) {
    console.log("allowGDPR", e);
  }
};
export const pageType = (pathurl) => {
  if (pathurl.indexOf("/videoshow/") != -1) {
    return "videoshow";
  } else {
    return "notfound";
  }
};

export const prepareMoreParams = ({ all, page, msid }) => {
  interface MoreParams {
    msid?: string | number;
    query?: string;
    tab?: string;
  }

  const moreParams: MoreParams = {};

  if (msid) moreParams.msid = msid;

  if (page === "topic") {
    const query: string = all?.slice(1, 2).toString();
    const type: string = all?.slice(2, 3).toString() || "All";
    moreParams.query = query;
    moreParams.tab = `${type ? type : ""}`;
  }

  return moreParams;
};

export const getMSID = (url) => (url && url.split(".cms")[0]) || "";

export const getMobileOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
};

export const removeBackSlash = (val) => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};

export const isBotAgent = () => {
  const ua = (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) || "";
  return ua.indexOf("bot") != -1 ? 1 : 0;
};

export const isNoFollow = (link: string) => {
  let nofollow = false;
  try {
    if (link.indexOf("http://") === 0 || link.indexOf("https://") === 0) {
      if (
        link.indexOf("m.economictimes.com") > -1 ||
        (link.indexOf("economictimes.indiatimes.com") > -1 &&
          link.indexOf("gujarati.economictimes.indiatimes.com") == -1)
      ) {
        nofollow = false;
      } else {
        nofollow = true;
      }
    }
  } catch (e) {
    console.log("isNoFollow:" + e);
  }
  return nofollow;
};
export const createGAPageViewPayload = (payload = {}) => {
  const objInts = window.objInts;
  try {
    let subsStatus = "Free User";
    if (typeof objInts != "undefined") {
      if (localStorage.getItem("et_logintype") != null) {
        const loginType = localStorage.getItem("et_logintype");
        payload["dimension22"] = loginType;
      }
      if (objInts.permissions.indexOf("expired_subscription") > -1) {
        subsStatus = "Expired User";
      } else if (
        objInts.permissions.indexOf("subscribed") > -1 &&
        objInts.permissions.indexOf("cancelled_subscription") > -1 &&
        objInts.permissions.indexOf("can_buy_subscription") > -1
      ) {
        subsStatus = "Paid User - In Trial";
      } else if (objInts.permissions.indexOf("subscribed") > -1) {
        subsStatus = "Paid User";
      } else if (objInts.permissions.indexOf("etadfree_subscribed") > -1) {
        subsStatus = "Ad Free User";
      }
    }
    let a: any = (window.localStorage && localStorage.getItem("et_syftCounter")) || "";
    a = (a && JSON.parse(a)) || {};
    // if (ssoid) {
    //   payload["userId"] = ssoid;
    // }
    if (a.beforeSyft) {
      payload["dimension32"] = a.beforeSyft;
    }
    if (a.afterSyft) {
      payload["dimension33"] = a.afterSyft;
    }
    payload["dimension37"] = subsStatus;
    window.customDimension = { ...window.customDimension, ...payload };
  } catch (e) {
    console.log("Error in createGAPageViewPayload:", e);
  }
};
export const updateDimension = (dimensions = {}, payload = {}) => {
  // if (typeof window !== "undefined") {
  //   const sendEvent = () => {
  //     dimensions["dimension20"] = "PWA";
  //     window.customDimension = { ...window.customDimension, ...dimensions };
  //     createGAPageViewPayload(payload);
  //     pageview(
  //       (location.pathname + location.search).length > 1
  //         ? (location.pathname + location.search).substr(1)
  //         : location.pathname + location.search
  //     );
  //   };
  //   const objUser = (window.objUser && window.objUser.info) || {};
  //   if (Object.keys(objUser).length) {
  //     dimensions["dimension3"] = "LOGGEDIN";
  //   } else {
  //     dimensions["dimension3"] = "NONLOGGEDIN";
  //   }
  //   window.customDimension = { ...window.customDimension, ...dimensions };
  //   if (typeof window.objInts !== "undefined") {
  //     window.objInts.afterPermissionCall(sendEvent);
  //   } else {
  //     document.addEventListener("objIntsLoaded", () => {
  //       window?.objInts?.afterPermissionCall(sendEvent);
  //     });
  //   }
  // }
};

export const prepSeoListData = (data) => {
  let primaryList = data || [];
  primaryList = primaryList?.filter((i) => {
    return i.layoutType && i.layoutType == "break"
      ? false
      : i.type !== "colombia" && i.type !== "liveblog" && i.name !== "dfp";
  });
  primaryList?.map((i) => {
    const data = { ...i };
    data.title = removeBackSlash(i.title);
  });
  return primaryList;
};

export const saveLogs = (data: any) => {
  if (typeof window !== "undefined") {
    // Check if running in a browser environment
    if (data) {
      try {
        const isLive = window.APP_ENV == "development" ? 0 : 1;
        data.TicketId = getCookie("TicketId");
        data.ssoid = getCookie("ssoid");
        data.gid = getCookie("_grx") || "-";
        if (window.objUser) {
          if (
            !data.emailid &&
            window.objUser.info &&
            window.objUser.info.primaryEmail
          ) {
            data.emailid = window.objUser.info.primaryEmail;
          }
          if (!data.ssoid && window.objUser.ssoid) {
            data.ssoid = window.objUser.ssoid;
          }
          if (!data.TicketId && window.objUser.ticketId) {
            data.TicketId = window.objUser.ticketId;
          }
        }
        data.geoinfo = window?.geoinfo;
        data.ua = (navigator && navigator.userAgent) || "";
        var logdata =
          "logdata=" +
          JSON.stringify({
            ref: (isLive ? "live" : "dev") + "_react",
            data: data,
            url: window.location.href,
          });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });
        //console.log("Log Data>>>>",logdata);

        xhr.open("POST", "https://etx.indiatimes.com/log?et=desktop");
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded",
        );
        xhr.send(logdata);
      } catch (e) {
        console.log("Error in save logs api");
      }
    }
  } else {
    console.log("saveLogs: window is not defined, skipping log save.");
  }
};

export const delete_cookie = (name: any) => {
  try {
    if (typeof document === "undefined") {
      // Document is not available, handle accordingly
      return;
    }

    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } catch (err) {
    console.log("delete_cookie Error: ", err);
  }
};

export const loadPrimeApi = async () => {
  try {
    const url = (APIS_CONFIG as any)["AUTH_TOKEN"][window.APP_ENV],
      oauthClientId = (GLOBAL_CONFIG as any)[window.APP_ENV]["X_CLIENT_ID"],
      deviceId = getCookie("_grx"),
      ticketId = getCookie("TicketId"),
      userSsoId = window?.objUser?.ssoid || getCookie("ssoid");

    // const body = JSON.stringify({
    //   grantType: "refresh_token",
    //   ticketId: ticketId,
    //   deviceDetail: getMobileOS(),
    //   allMerchant: true,
    // });
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "X-CLIENT-ID": oauthClientId,
      "X-DEVICE-ID": deviceId,
      "x-sso-id": userSsoId,
      "x-site-app-code": (GLOBAL_CONFIG as any)[window.APP_ENV]["X_SITE_CODE"],
    };

    const response = await service.post({
      url,
      headers,
      payload: {
        grantType: "refresh_token",
        ticketId: ticketId,
        deviceDetail: getMobileOS(),
        allMerchant: true,
      },
      // body,
      params: {},
    });

    return response.data || {};
    // Handle the successful response data
  } catch (e) {
    console.log("loadPrimeApi: " + e);
  }
};

export const loadPrimeApiNew = async () => {
  try {
    const url =
        (APIS_CONFIG as any)["AUTH_NEW_TOKEN"][window.APP_ENV] +
        "&grantType=refresh_token",
      oauthClientId = (GLOBAL_CONFIG as any)[window.APP_ENV]["X_CLIENT_ID"],
      deviceId = getCookie("_grx"),
      ticketId = getCookie("TicketId"),
      userSsoId = window?.objUser?.ssoid || getCookie("ssoid");

    const body = JSON.stringify({
      grantType: "refresh_token",
    });
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "X-CLIENT-ID": oauthClientId,
      "X-DEVICE-ID": deviceId,
      "x-sso-id": userSsoId,
      "x-site-app-code": (GLOBAL_CONFIG as any)[window.APP_ENV]["X_SITE_CODE"],
      "X-TICKET-ID": ticketId,
    };

    const response = await fetch(url, {
      method: 'GET', // or 'POST' if you need to send a payload
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response?.json();
    // Handle the successful response data
  } catch (e) {
    console.log("loadPrimeApiNew: " + e);
  }
};

export const logout = async () => {
  window?.jsso?.signOutUser(async function (response: any) {
    if (response.status == "SUCCESS") {
      delete_cookie("OTR");
      delete_cookie("isprimeuser");
      delete_cookie("pfuuid");
      delete_cookie("peuuid");
      delete_cookie("fpid");
      delete_cookie("etprc");

      const url = (APIS_CONFIG as any)["LOGOUT_AUTH_TOKEN"][window.APP_ENV],
        oauthClientId = (GLOBAL_CONFIG as any)[window.APP_ENV]["X_CLIENT_ID"],
        deviceId = getCookie("_grx"),
        userSsoId = window?.objUser?.ssoid || getCookie("ssoid"),
        ticketId = getCookie("TicketId");

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "X-CLIENT-ID": oauthClientId,
        "X-DEVICE-ID": deviceId,
        "x-sso-id": userSsoId,
        "x-site-app-code": (GLOBAL_CONFIG as any)[window.APP_ENV]["X_SITE_CODE"],
      };

      const response = await service.post({
        url,
        headers,
        payload: {
          ticketId: ticketId
        },
        params: {},
      });

      //const logoutSuccess = await response?.json();
      window.location.reload();
    } else {
      console.log("failure");
    }
  });
};

export const createPeuuid = async (cb) => {
  try {
    let url = (APIS_CONFIG as any)?.PERSONALISATION[window.APP_ENV];
    url = url + `?type=0&source=${API_SOURCE}`;
    const res: any = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await res.json();
    // console.log("res", res, data);
    if (data && data.id != 0) {
      const peuuid: any = data.id;
      setCookieToSpecificTime("peuuid", peuuid, 365, 0, 0);
      if (typeof cb == "function") {
        cb(peuuid);
      }
    }
  } catch (e) {
    console.log("error in creating peuuid ", e);
    saveLogs({ res: "error", msg: "Error in creating peuuid" });
  }
};

export const verifyLogin = () => {
  //@ts-nocheck
  window?.jsso?.getValidLoggedInUser(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS");

      if (typeof window.objUser == "undefined") window.objUser = {};
      //generateFpid(true);
      createPeuuid({});
      window.objUser.ticketId = response.data.ticketId;
      setUserData();
    } else {
      console.log("failure");
      //generateFpid(false);
      ssoLoginWidget();
    }

    const verifyLoginStatus = new Event(
      response.status == "SUCCESS" ? "verifyLoginSuccess" : "verifyLoginFail",
    );
    document.dispatchEvent(verifyLoginStatus);
  });
};

export const setUserData = () => {  
  window?.jsso?.getUserDetails(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS", response);
      window.objUser.info = response.data;
      window.objUser.ssoid = response.data.ssoid;
    } else {
      console.log("failure");
    }

    const getUserDetailsStatus = new Event(
      response.status == "SUCCESS"
        ? "getUserDetailsSuccess"
        : "getUserDetailsFail",
    );
    document.dispatchEvent(getUserDetailsStatus);
  });
};

export const ssoLoginWidget = () => {
  const scriptElements = document.querySelectorAll(
    'script[src*="/widget/main.bundle"]',
  );
  const numberOfScripts = scriptElements.length;
  if (numberOfScripts == 0) {
    (function (w: any, s, el) {
      var sc = document.createElement("script");
      w[el] =
        w[el] ||
        function () {
          w[el] = w[el] || {};
          w[el].ev = w[el].ev || [];
          w[el].ev.push(arguments);
        };
      sc.type = "text/javascript";
      if (sessionStorage.getItem("openLogin_popup") == "true") {
        (sc as any).onload = initSSOWidget();
        sessionStorage.removeItem("openLogin_popup");
      }
      sc.src = s;
      document.getElementsByTagName("head")[0].appendChild(sc);
    })(window, (GLOBAL_CONFIG as any)[window.APP_ENV]["ssoWidget"], "ssoWidget");
  }
};

export const ssoClose = () => {
  const ssoWidgetElement = document.getElementById("ssoLoginWrap");
  ssoWidgetElement?.classList.add("hide");
  const ssoLoginElm = document.getElementById(
    "ssoLogin",
  ) as HTMLDivElement | null;
  if (ssoLoginElm) ssoLoginElm.innerHTML = "";
};

export const initSSOWidget = () => {
  //console.log("Central SSO initSSOWidget");
  const ssoWidgetElement = document.getElementById("ssoLoginWrap");
  ssoWidgetElement?.classList.remove("hide");
  var centralSSOObj = {
    channelName: "et",
    element: "ssoLogin",
    resendOtpTimer: 160,
    channelLogo: "https://economictimes.indiatimes.com/photo/103927173.cms",
    recaptcha: {
      required: false,
    },
    closeIcon: !0,
    defaultSelected: !0,
    socialLoginRu:
      window.location.protocol +
      "//" +
      window.location.host +
      (window.location.host == "economictimes.indiatimes.com"
        ? "/login_code.cms"
        : "/login_code.html"),
    nonSocialLogin: {
      loginVia: ["email", "mobile"],
      loginWith: ["Password", "otp"],
    },
    socialLogin: [
      {
        type: "Google",
        clientId:
          window.location.host == "economictimes.indiatimes.com"
            ? "936221589938.apps.googleusercontent.com"
            : "891351984915-kodsh6b9vik3h6ue008fh8jgfstageh6.apps.googleusercontent.com",
      },
      {
        type: "Apple",
        clientId: "com.economictimes.login",
      },
    ],
    gaChannelName: "et",
    last_clicked_lob: "ET",
    signInCallback: function () {
      localStorage.setItem("primeUserLoginMap_check", "1");
      verifyLogin();
      ssoClose();
      //window.location.reload();
    },
    signupForm: {
      defaultFirstName: "Guest",
      signUpFields: {
        Email: {
          placeholder: "enter email",
          required: true,
        },
        MobileNumber: {
          placeholder: "enter mobile number",
          required: true,
        },
        firstName: {
          placeholder: "enter first name",
          required: true,
        },
      },
      signupVia: ["Password"],
      MandatoryVerifyVia: ["email"],
    },
    termsConditionLink: "/terms-conditions",
    privacyPolicyLink: "/privacypolicy.cms",
    //defaultSelected:true,
    closeCallBack: function () {
      //console.log("Central SSO closeCallBack");
      ssoClose();
    },
  };

  ssoWidget("init", centralSSOObj);
};

export const currPageType = () =>  {
  let type = 'home_page';
  const tpNameListArr = ['articlelist','primehome','markets','newshome','politicsnation','personalfinance','mutual_funds','techhome','opinionshome','nri','panache','videohome']
  const pn = window.location.pathname;

  if(pn.includes('articleshow')) {
      type = 'articleshow_page';
  } else if(pn === "/") {
      type = 'home_page';
  } else {
      type = 'listing_page';
  }
  return type;
}

export const userMappingData = ({res, userInfo, isPrime, email}) => {
  let primeUserLoginMap:any = {};
  if (isPrime) {
    //const userData = jStorage.get('userInfo');
  const resObj = res.productDetails.filter((item: any) => {
    return item.productCode == "ETPR";
  });
  const oauthAPiRes = resObj[0];  
  var primaryEmail = userInfo.primaryEmail ? userInfo.primaryEmail : email;
  var mobile = userInfo.mobileData && userInfo.mobileData.Verified && userInfo.mobileData.Verified.mobile && (userInfo.mobileData.Verified.code  + '-' + userInfo.mobileData.Verified.mobile) || '';
  var emailIdStatus = userInfo.emailList && userInfo.emailList[email];
    primeUserLoginMap = {
      expiry: oauthAPiRes.subscriptionDetail.expiryDate,
      loginId:
          primaryEmail && emailIdStatus === 'Verified'
          ? primaryEmail
          : mobile
          ? mobile
          : email,
      lastClosedNudgeDate_web_pw: '',
      lastClosedNudgeDate_web: '',
      lastClosedNudgeDate_PW: '',
      lastClosedNudgeDate: '',
      showInSameSession: true,
      count_web_pw_perday: 2,
      count_mweb_pw_perday: 2,
      ssoid: userInfo.ssoid,
      count_web_pw: 7,
      count_web: 2,
      count_pw: 7,
      count: 2,
    };
  } else {
    primeUserLoginMap = JSON.parse(jStorage.get('primeUserLoginMap'));
    if (primeUserLoginMap) {
      primeUserLoginMap.count = 2;
    }
  }

  if (primeUserLoginMap) {
    jStorage.set('primeUserLoginMap', JSON.stringify(primeUserLoginMap));
  }
};

export const isSameDay = (flag) => {
  return new Date(flag).getDate() === new Date().getDate();
}

export const setAdFreeExp = (nudgeFlag, ssoid, dispatch) => {
  var ssoGrxId = ssoid ? ssoid : getCookie('_grx');
  var isAdFreeExpRef = jStorage.get('adFreeCampign_' + ssoGrxId);
  if(isAdFreeExpRef.eligible && !isAdFreeExpRef.availed) {
      //objAd.type == 'adfree';
      window.objUser.isPink = true;
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          isAdfree: true,
          isPink: window.objUser.isPink
        },
      });
      // $('.dib.subScribe, .soWrapper').remove();
      //$('html').addClass('prime_header skip_cube skipStickyBand skip_popup');

      //objUserSubscriptions.appendBand(nudgeFlag);
  }
};

export const setAdFreeData = (counter, ssoid, ticketId, dispatch) => {
  var ssoGrxId = ssoid ? ssoid : getCookie('_grx');
  var addFreeCampignRef = jStorage.get('adFreeCampign_' + ssoGrxId);

  if(!addFreeCampignRef) {
      var userDetails = window?.objUser?.primeInfo; //jStorage.get('prime_' + ticketId);
      var timeStampDiff = (+new Date()) - (+new Date(userDetails?.subscriptionDetail.graceEndDate));
      var dayDiff = Math.round(timeStampDiff / (1000 * 3600 * 24));
      var isValidForCampaign = Number(window.objVc.adfree_campign_eud || 900) > dayDiff;
      if(isValidForCampaign) {
        jStorage.set('adFreeCampign_' + ssoGrxId, {lastVisitedTime: +new Date(), availed: false, eligible: true, counter: 1});
        setAdFreeExp("adFree", ssoid, dispatch);
        //grxEvent('event', {'event_category': 'Adfree expired',  'event_action': 'True', 'event_label':  ''}, 1);
      }
  } else if(!addFreeCampignRef.availed) {
      var adFreeExpAvailed = addFreeCampignRef.counter >= Number(counter);
      if(adFreeExpAvailed) {
          var updatedObj = {lastVisitedTime: +new Date(), availed: true, eligible: false, counter: Number(window.objVc.adfree_campign_counter || 20)}
          jStorage.set('adFreeCampign_' + ssoGrxId, updatedObj);
      } else {
          addFreeCampignRef.lastVisitedTime = +new Date();
          if(!isSameDay(+new Date())) {
            addFreeCampignRef.counter = addFreeCampignRef.counter + 1;
            //grxEvent('event', {'event_category': 'Adfree expired',  'event_action': 'True', 'event_label':  ''}, 1);
          }
          jStorage.set('adFreeCampign_' + ssoGrxId, addFreeCampignRef);
          setAdFreeExp("adFree", ssoid, dispatch);
      }
  }
}

export const getPageSpecificDimensions = (seo) => {
  const { subsecnames = {}, msid, updated = "", keywords, agency, page = "" } = seo;
  const dateArray = updated.split(",");
  function formatDate(inputDate) {
    // Parse the input date string
      const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
      const parsedDate = new Date(inputDate);

      // Extract and format the date parts
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const hours = String(parsedDate.getHours()).padStart(2, '0');
      const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
      const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

      // Format as "YYYY-MM-DD HH:mm:ss"
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const dateValue = dateArray;
  const formattedDate = formatDate(dateValue);
  //console.log("Date Value:-" + formattedDate);

  const dateString = dateArray[0] || "";
  const timeString = dateArray[1] || "";
  const { subsec1, subsecname1, subsecname2, subsecname3 } = subsecnames;
  const sectionsList =
    subsecname1 && subsecname2 && subsecname3
      ? `/${subsecname1}/${subsecname2}/${subsecname3}/`
      : subsecname1 && subsecname2
      ? `$/${subsecname1}/${subsecname2}/`
      : subsecname1
      ? `/${subsecname1}/`
      : "";

  const payload = {
    dimension4: agency,
    dimension8: formattedDate,
    dimension9: subsecname2,
    dimension12: keywords,
    dimension13: timeString,
    dimension25: page,
    dimension26: subsecname1,
    dimension27: sectionsList,
    dimension29: subsec1,
    dimension48: msid
  };
  console.log("test for date:--" + dateString);
  return payload;
};

export const convertMilliseconds = (milliseconds) => {
  // Convert milliseconds to total seconds
  let totalSeconds = Math.floor(milliseconds / 1000);
  
  // Calculate hours, minutes, and remaining seconds
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let remainingSeconds = totalSeconds % 60;
  
  // Add leading zeros to minutes and seconds
  minutes = String(minutes).padStart(2, '0');
  remainingSeconds = String(remainingSeconds).padStart(2, '0');
  
  // Conditional formatting based on available hours and minutes
  if (hours > 0) {
      hours = String(hours).padStart(2, '0');
      return `${hours}:${minutes}:${remainingSeconds}`;
  } else if (minutes > 0) {
      return `${minutes}:${remainingSeconds}`;
  } else {
      return `00:${remainingSeconds}`;
  }
}

export function changeImageWidthHeight({imageUrl, desiredWidth, desiredHeight, desiredResizeMode = 0, quality = 0}) {
  let newUrl = imageUrl?.replace(/width-\d+/g, `width-${desiredWidth}`).replace(/height-\d+/g, `height-${desiredHeight}`) || "";

  if(desiredResizeMode) {
    // replace if resizemode is already present, else add it
    if(newUrl?.includes('resizemode-')) {
      newUrl = newUrl?.replace(/resizemode-\w+/g, `resizemode-${desiredResizeMode}`);
    } else {
      // add after width
      newUrl = newUrl?.replace(/(width-\d+)/g, `$1,-resizemode-${desiredResizeMode}`); 
    }
  } else {
    // just remove the resizemode-<mode> part
    newUrl = newUrl?.replace(/resizemode-\w+/g, '');
  }

  if(quality) {
    // replace if quality is already present, else add it
    if(newUrl.includes('quality-')) {
      newUrl = newUrl?.replace(/quality-\d+/g, `quality-${quality}`);
    } else {
      // add after width
      newUrl = newUrl?.replace(/(width-\d+)/g, `$1,-quality-${quality}`);
    }
    
  } else {
    // just remove the quality-<quality> part
    newUrl = newUrl?.replace(/quality-\d+/g, '');
  }

  return newUrl;
}

export const formatNumber = (
  number: number,
  uptoDecimal: number = 2,
  noData?: string,
): string => {
  if ((!!number && isNaN(number)) || number == null)
    return !!noData ? noData : "-";
  const isInteger = Number.isInteger(Number(number));
  if (isInteger) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "decimal",
      minimumFractionDigits: uptoDecimal, // Ensure at least 2 decimal places
      maximumFractionDigits: uptoDecimal, // Allow maximum of 2 decimal places
    });

    const formattedNumber = formatter.format(number);
    return formattedNumber.replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); // Add commas for thousands separators
  }
};

export const getStockUrl = (
  id: string,
  seoName: string,
  stockType: string,
  subType: string = "company",
) => {
  if (stockType == "index") {
    return "/markets/indices/" + seoName;
  } else if (stockType === "sector") {
    return "/stocks/sectors/" + seoName;
  } else {
    if (seoName?.indexOf(" ") >= 0) {
      seoName = seoName
        .replaceAll(" ", "-")
        .replaceAll("&", "")
        .replaceAll(".", "")
        .toLowerCase();
    }
    if ((stockType == "dvr" || stockType == "pp") && id.includes("1111")) {
      id = id.substring(0, id.length - 4);
    }
    let stockUrl =
      (APIS_CONFIG as any)?.DOMAIN[window.APP_ENV] +
      "/" +
      seoName +
      "/stocks/companyid-" +
      id +
      ".cms";
    if (
      stockType != "equity" &&
      stockType !== "" &&
      stockType !== "company" &&
      stockType.toLowerCase() !== "etf"
    )
      stockUrl = stockUrl + "?companytype=" + stockType?.toLowerCase();

    if (subType == "NonList") {
      stockUrl =
        (APIS_CONFIG as any)?.DOMAIN[window.APP_ENV] +
        "/company/" +
        seoName +
        "/" +
        id;
    }
    if (stockType == "ETF") {
      stockUrl =
        (APIS_CONFIG as any)?.DOMAIN[window.APP_ENV] +
        "/" +
        seoName +
        "/mffactsheet/schemeid-" +
        id +
        ".cms";
    }
    return stockUrl;
  }
};

export const fetchSelectedFilter = async (
  seoNameOrIndexId?: string | number,
) => {
  try {
    const data = await fetchFilters({ marketcap: true });
    if (
      !data ||
      !data.keyIndices ||
      !data.sectoralIndices ||
      !data.otherIndices ||
      !data.marketcap
    ) {
      return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
    }

    const allIndices = [
      ...(data.keyIndices.nse || []),
      ...(data.keyIndices.bse || []),
      ...(data.sectoralIndices.nse || []),
      ...(data.sectoralIndices.bse || []),
      ...(data.otherIndices.nse || []),
      ...(data.otherIndices.bse || []),
      ...(data.marketcap.nse || []),
      ...(data.marketcap.bse || []),
    ];

    let foundIndex;
    if (
      !isNaN(seoNameOrIndexId as number) ||
      typeof seoNameOrIndexId === "string"
    ) {
      foundIndex = allIndices.find(
        (index) =>
          index.indexId === String(seoNameOrIndexId) ||
          index.seoname === seoNameOrIndexId,
      );
    }

    if (foundIndex) {
      let exchange = "";
      if (
        (data.keyIndices.nse || []).includes(foundIndex) ||
        (data.sectoralIndices.nse || []).includes(foundIndex) ||
        (data.otherIndices.nse || []).includes(foundIndex) ||
        (data.marketcap.nse || []).includes(foundIndex)
      ) {
        exchange = "nse";
      } else if (
        (data.keyIndices.bse || []).includes(foundIndex) ||
        (data.sectoralIndices.bse || []).includes(foundIndex) ||
        (data.otherIndices.bse || []).includes(foundIndex) ||
        (data.marketcap.bse || []).includes(foundIndex)
      ) {
        exchange = "bse";
      }

      return {
        name: foundIndex.name,
        indexId: foundIndex.indexId,
        seoname: foundIndex.seoname,
        exchange: exchange,
      };
    } else {
      return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
    return { name: "All Stocks", indexId: 0, seoname: "", exchange: "nse" };
  }
};

export const fetchFilters = async ({
  all = false,
  watchlist = false,
  mostrecent = false,
  marketcap = false,
}) => {
  let apiUrl = (APIS_CONFIG as any)?.["INDEX_FILTERS"][window.APP_ENV];
  let queryParams = [];
  if (all) queryParams.push("all=true");
  if (watchlist) queryParams.push("watchlist=true");
  if (mostrecent) queryParams.push("mostrecent=true");
  if (marketcap) queryParams.push("marketcap=true");
  const queryString = queryParams.join("&");
  if (!!queryString) {
    apiUrl = apiUrl + "?" + queryString;
  }
  const response = await fetch(apiUrl);
  return response?.json();
};

export const getAllShortUrls = async () => {
  const url = (APIS_CONFIG as any)["MARKET_STATS_SHORTURLS_MAPPING"][window.APP_ENV];
  const response = await fetch(url);
  return await response?.json();
};

export const getCurrentMarketStatus = async () => {
  try {
    const url = (APIS_CONFIG as any)?.MARKET_STATUS[window.APP_ENV];
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

    if (res?.status === 200) {
      return await res.json();
    } else {
      saveLogs({
        res: "error",
        msg: "Unexpected response status",
        status: res?.status,
      });
      return null;
    }
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Error in fetching market status", errorMessage);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in fetching market status",
      error: errorMessage,
    });
    return null;
  }
};

export const saveStockInWatchList = async (followData: any) => {
  const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
  const isLocalhost = window.location.origin.includes("localhost");
  let postBodyData = {};
  if (isLocalhost) {
    postBodyData = {
      _authorization: authorization,
      followData,
    };
  } else {
    postBodyData = followData;
  }
  const apiUrl = `${(APIS_CONFIG as any)?.WATCHLISTAPI.addWatchList[window.APP_ENV]}`;
  const headers = new Headers({
    Authorization: authorization,
    "Content-Type": "application/json",
  });
  const options: any = {
    method: "POST",
    cache: "no-store",
    headers: headers,
    body: JSON.stringify(postBodyData),
  };
  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error saving stock in watchlist:", error);
    throw error;
  }
};

export const fetchAllWatchListData = async (
  type: any,
  usersettingsubType: any,
) => {
  const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
  const isLocalhost = window.location.origin.includes("localhost");
  if (authorization === "") {
    console.log("peuuid is not getting please check cookie__", authorization);
  }
  const apiUrl = `${APIS_CONFIG?.WATCHLISTAPI.getAllWatchlist[window.APP_ENV]}?stype=${type}&usersettingsubType=${usersettingsubType}`;
  const headers = new Headers({ Authorization: authorization });
  const options: any = {
    cache: "no-store",
    headers: headers,
  };
  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      window.watchListApiHitStatus = 'failed';
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    window.watchListApiHitStatus = 'failed';
    console.error("Error fetching watchlist data:", error);
    throw error;
  }
};

export const getOverviewData = async (indexid: number, pageno: number) => {
  const response = await fetch(`${(APIS_CONFIG as any)?.MARKETMOODS_OVERVIEW[APP_ENV]}?indexid=${indexid}&pageno=${pageno}&pagesize=100`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          // Add any other headers you might need here
      }
  });
  const originalJson = await response?.json();
  return {
    labels: originalJson.labels,
    dataList: originalJson.dataList.map((item: any) => ({
      date: dateFormat(item.date, "%d %MMM"),
      indexPrice: formatNumber(item.indexPrice),
      percentChange: item.percentChange.toFixed(2),
      trend:
        item.percentChange > 0
          ? "up"
          : item.percentChange < 0
            ? "down"
            : "neutral",
      others: item.count.map((count: number, index: number) => ({
        count: count,
        percent: item.percent[index],
        color: item.color[index],
      })),
    })),
    pageSummary: originalJson.pageSummary,
  };
};