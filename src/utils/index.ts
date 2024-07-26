import getConfig from "next/config";
import { pageview } from "./ga";
import GLOBAL_CONFIG from "../network/global_config.json";
import APIS_CONFIG from "../network/config.json";
import service from "../network/service";

// const { publicRuntimeConfig = {} } = getConfig();
export const APP_ENV = "development";  //(process.env.NODE_ENV && process.env.NODE_ENV.trim()) || "production";

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

export function loadScript(src) {
  return new Promise(function (resolve, reject) {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));

    document.head.append(script);
  });
}

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
  if (pathurl.indexOf("/topic/") != -1) {
    return "topic";
  } else if (pathurl.indexOf("/videoshow/") != -1) {
    return "videoshow";
  } else if (pathurl.indexOf("/videoshownew/") != -1) {
    return "videoshownew";
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

//Get any parameter value from URL
export const getParameterByName = (name) => {
  try {
    if (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    } else {
      return "";
    }
  } catch (e) {
    console.log("getParameterByName", e);
  }
};

export const processEnv =
  (process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase().trim()) || "production";
export const queryString = (params) =>
  Object.keys(params)?.map((key) => key + "=" + params[key]).join("&");

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

export const getPageSpecificDimensions = (seo) => {
  const { subsecnames = {}, msid, updated = "", keywords, agency, page = "videoshow" } = seo;
  const dateArray = updated.split(",");
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
    dimension8: dateString,
    dimension9: subsecname2,
    dimension12: keywords,
    dimension13: timeString,
    dimension25: page,
    dimension26: subsecname1,
    dimension27: sectionsList,
    dimension29: subsec1,
    dimension48: msid
  };
  return payload;
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
        const isLive = APP_ENV == "development" ? 0 : 1;
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
    const url = (APIS_CONFIG as any)["AUTH_TOKEN"][APP_ENV],
      oauthClientId = (GLOBAL_CONFIG as any)[APP_ENV]["X_CLIENT_ID"],
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
      "x-site-app-code": (GLOBAL_CONFIG as any)[APP_ENV]["X_SITE_CODE"],
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

export const logout = async () => {
  window?.jsso?.signOutUser(async function (response: any) {
    if (response.status == "SUCCESS") {
      delete_cookie("OTR");
      delete_cookie("isprimeuser");
      delete_cookie("pfuuid");
      delete_cookie("peuuid");
      delete_cookie("fpid");

      const url = (APIS_CONFIG as any)["LOGOUT_AUTH_TOKEN"][APP_ENV],
        oauthClientId = (GLOBAL_CONFIG as any)[APP_ENV]["X_CLIENT_ID"],
        deviceId = getCookie("_grx"),
        userSsoId = window?.objUser?.ssoid || getCookie("ssoid"),
        ticketId = getCookie("TicketId");

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "X-CLIENT-ID": oauthClientId,
        "X-DEVICE-ID": deviceId,
        "x-sso-id": userSsoId,
        "x-site-app-code": (GLOBAL_CONFIG as any)[APP_ENV]["X_SITE_CODE"],
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

export const createPeuuid = async () => {
  try {
    let url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
    url = url + `?type=0&source=${API_SOURCE}`;
    const res: any = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await res.json();
    console.log("res", res, data);
    if (data && data.id != 0) {
      const peuuid: any = data.id;
      setCookieToSpecificTime("peuuid", peuuid, 365, 0, 0);
    }
  } catch (e) {
    console.log("error in creating peuuid ", e);
    saveLogs({ res: "error", msg: "Error in creating peuuid" });
  }
};

export const verifyLogin = () => {
  window?.jsso?.getValidLoggedInUser(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS");

      if (typeof window.objUser == "undefined") window.objUser = {};
      //generateFpid(true);
      createPeuuid();
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
    })(window, (GLOBAL_CONFIG as any)[APP_ENV]["ssoWidget"], "ssoWidget");
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
        type: "Facebook",
        clientId: "424450167700259",
      },
      {
        type: "Apple",
        clientId: "com.economictimes.login",
      },
    ],
    gaChannelName: "et",
    last_clicked_lob: "ET",
    signInCallback: function () {
      verifyLogin();
      ssoClose();
      window.location.reload();
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