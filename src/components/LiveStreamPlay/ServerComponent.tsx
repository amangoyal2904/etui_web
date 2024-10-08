import jStorageReact from "jstorage-react";
import APIS_CONFIG from "network/config.json";
import GLOBAL_CONFIG from "network/global_config.json";
import { getCookie } from "utils/utils";
const API_SOURCE = 0;
declare var ssoWidget: any;
const isBrowser = typeof window !== "undefined";
const isServer = !isBrowser;

const defaultEnv = isServer
  ? process.env.NEXT_PUBLIC_APP_ENV || (process.env.NODE_ENV && process.env.NODE_ENV.trim()) || "production"
  : window.location.host === "economictimes.indiatimes.com"
  ? "production"
  : "development";

export const APP_ENV = defaultEnv;

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
      required: false
    },
    closeIcon: !0,
    defaultSelected: !0,
    socialLoginRu:
      window.location.protocol +
      "//" +
      window.location.host +
      (window.location.host == "economictimes.indiatimes.com" ? "/login_code.cms" : "/login_code.html"),
    nonSocialLogin: {
      loginVia: ["email", "mobile"],
      loginWith: ["Password", "otp"]
    },
    socialLogin: [
      {
        type: "Google",
        clientId:
          window.location.host == "economictimes.indiatimes.com"
            ? "936221589938.apps.googleusercontent.com"
            : "891351984915-kodsh6b9vik3h6ue008fh8jgfstageh6.apps.googleusercontent.com"
      },
      {
        type: "Apple",
        clientId: "com.economictimes.login"
      }
    ],
    gaChannelName: "et",
    last_clicked_lob: "ET",
    signInCallback: function () {
      const freeTrialData = jStorageReact.get("et_freetrial");
      console.log(freeTrialData, "freeTrialData signInCallback");
      verifyLogin();
      ssoClose();
      if (!freeTrialData || !freeTrialData?.hitAccessPass) {
        window.location.reload();
      }
    },
    signupForm: {
      defaultFirstName: "Guest",
      signUpFields: {
        Email: {
          placeholder: "enter email",
          required: true
        },
        MobileNumber: {
          placeholder: "enter mobile number",
          required: true
        },
        firstName: {
          placeholder: "enter first name",
          required: true
        }
      },
      signupVia: ["Password"],
      MandatoryVerifyVia: ["email"]
    },
    termsConditionLink: "/terms-conditions",
    privacyPolicyLink: "/privacypolicy.cms",
    //defaultSelected:true,
    closeCallBack: function () {
      //console.log("Central SSO closeCallBack");
      ssoClose();
    }
  };

  ssoWidget("init", centralSSOObj);
};

export const verifyLogin = () => {
  window?.jsso?.getValidLoggedInUser(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS");

      if (typeof window.objUser == "undefined") window.objUser = {};
      //generateFpid(true);}
      createPeuuid();
      window.objUser.ticketId = response.data.ticketId;
      window.objUser.loginType = response.data.loginType;
      window.objUser.afterCheckUserLoginStatus = true;
      setUserData();
    } else {
      window.objUser.afterCheckUserLoginStatus = false;
      ssoLoginWidget();
    }

    const verifyLoginStatus = new Event(response.status == "SUCCESS" ? "verifyLoginSuccess" : "verifyLoginFail");
    document.dispatchEvent(verifyLoginStatus);
  });
};
export const ssoClose = () => {
  const ssoWidgetElement = document.getElementById("ssoLoginWrap");
  ssoWidgetElement?.classList.add("hide");
  const ssoLoginElm = document.getElementById("ssoLogin") as HTMLDivElement | null;
  if (ssoLoginElm) ssoLoginElm.innerHTML = "";
};

export const createPeuuid = async () => {
  try {
    let url = (APIS_CONFIG as any)?.PERSONALISATION[APP_ENV];
    url = url + `?type=0&source=${API_SOURCE}`;
    const res: any = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json"
      }
    });
    const data = await res.json();
    console.log("res", res, data);
    if (data && data.id != 0) {
      const peuuid: any = data.id;
      setCookieToSpecificTime("peuuid", peuuid, 365, 0, 0);
    }
  } catch (e) {
    console.log("error in creating peuuid ", e);
    saveLogs({
      type: "Mercury",
      res: "error",
      msg: "Error in creating peuuid"
    });
  }
};
export const setCookieToSpecificTime = (
  name: string,
  value: string | number | boolean,
  days = 0,
  time = 0,
  seconds = 0,
  domain = ".indiatimes.com"
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
    console.log("Domain for Cookie-----", options.domain, options.path);
    cookiestring += `domain=${options.domain}; path=${options.path};`;

    document.cookie = cookiestring;
  } catch (e) {
    console.log("setCookieToSpecificTime Error:", e);
  }
};

export const setUserData = () => {
  window?.jsso?.getUserDetails(function (response: any) {
    if (response.status == "SUCCESS") {
      //console.log("SUCCESS", response);
      window.objUser.info = response.data;
      window.objUser.ssoid = response.data.ssoid;
    } else {
      console.warn("getUserDetails failed");
    }

    const getUserDetailsStatus = new Event(
      response.status == "SUCCESS" ? "getUserDetailsSuccess" : "getUserDetailsFail"
    );
    document.dispatchEvent(getUserDetailsStatus);
  });
};
export const ssoLoginWidget = () => {
  const scriptElements = document.querySelectorAll('script[src*="/widget/main.bundle"]');
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
export const saveLogs = (data: any) => {
  if (typeof window !== "undefined") {
    // Check if running in a browser environment
    if (data && window.location.hostname != "localhost") {
      try {
        const isLive = APP_ENV == "development" ? 0 : 1;
        data.TicketId = getCookie("TicketId");
        data.ssoid = getCookie("ssoid");
        data.gid = getCookie("_grx") || "-";
        if (window.objUser) {
          if (!data.emailid && window.objUser.info && window.objUser.info.primaryEmail) {
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
            url: window.location.href
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
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(logdata);
      } catch (e) {
        console.log("Error in save logs api");
      }
    }
  } else {
    console.log("saveLogs: window is not defined, skipping log save.");
  }
};
