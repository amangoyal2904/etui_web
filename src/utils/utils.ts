import os from "os";
import { grxPushData } from "./articleUtility";
const serverHost = os.hostname() || "";

declare global {
  interface Window {
    geolocation: any;
    geoinfo: any;
    chrome: any;
    _mfq?: any[];
  }
}

export const getMarketBandData = (): (() => void) => {
  let interval: NodeJS.Timeout;
  let currentInterval = 0;

  const fetchData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Set a 5-second timeout

    try {
      const response = await fetch(`https://${window.isDev ? '' : 'json.'}bselivefeeds.indiatimes.com/marketband.json`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const text = await response.text();

      // Extract JSON data from the response text
      const jsonData = extractJsonFromText(text);

      // Process and store the band data
      processBandData(jsonData);

      // Adjust the interval based on market status
      const newInterval = jsonData?.marketStatus?.currentMarketStatus !== "LIVE" ? 120e3 : 12e3; // 2 min or 12 sec
      if (newInterval !== currentInterval) {
        updateInterval(newInterval);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      // If fetching fails, set the interval to retry after 2 minutes
      updateInterval(120e3); // 2 minutes in milliseconds
    }
  };

  const extractJsonFromText = (text: string): any => {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf(")");
      const jsonText = text.substring(start, end);
      return JSON.parse(jsonText);
    } catch (e) {
      throw new Error("Failed to parse JSON data");
    }
  };

  const processBandData = (data: any) => {
    if (data && data.marketBandList) {
      window.objMarketBand = window.objMarketBand || {};
      window.objMarketBand.bandData = {};

      data.marketBandList.forEach((item: any) => {
        window.objMarketBand.bandData[item.sectionName] = item.bandServiceMetas;
      });

      window.objMarketBand.bandData["common"] = data.marketStatus;
    }
  };

  const updateInterval = (newInterval: number) => {
    if (interval) {
      clearInterval(interval);
    }
    currentInterval = newInterval;
    interval = setInterval(fetchData, newInterval);
  };

  fetchData();

  return () => clearInterval(interval);
};

export const setCookieToSpecificTime = (name, value, time, seconds) => {
  try {
    let domain = ".indiatimes.com";
    location.hostname == "localhost" ? (domain = "localhost") : (domain = ".indiatimes.com");
    let cookiestring = "";
    if (name && value && time) {
      cookiestring =
        name +
        "=" +
        value +
        "; expires=" +
        new Date(new Date().toDateString() + " " + time).toUTCString() +
        "; domain=" +
        domain +
        "; path=/;";
    }
    if (name && value && seconds) {
      //temp cookie
      let exdate = new Date();
      exdate.setSeconds(exdate.getSeconds() + seconds);
      let c_value =
        value + (seconds == null ? "" : "; expires=" + exdate.toUTCString()) + "; domain=" + domain + "; path=/;";
      cookiestring = name + "=" + c_value;
    }
    document.cookie = cookiestring;
  } catch (e) {
    console.log("setCookieToSpecificTime", e);
  }
};
export const getCookie = (name) => {
  try {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (e) {
    console.log("getCookie", e);
  }
};
//Email validate
export const validateEmail = () => {
  try {
    var b = 0,
      c = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
    if (a && a.indexOf(",") != -1) {
      for (var a = a.split(","), d = 0, d = 0; d < a.length; d += 1) c.test(a[d]) && (b += 1);
      return d == b ? !0 : !1;
    } else {
      return c.test(a) ? !0 : !1;
    }
  } catch (e) {
    console.log("validateEmail", e);
  }
};
// Date format
export const appendZero = (num) => (num >= 0 && num < 10 ? "0" + num : num);
export const dateFormat = (dt, format = "%Y-%M-%d") => {
  let objD: any = dt instanceof Date ? dt : new Date(dt);
  let shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let fullMonthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let shortDaysName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  let fullDaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let newDate = "";
  if (objD != "Invalid Date") {
    let hour = objD.getHours();
    let dList = {
      "%ss": objD.getMilliseconds(),
      "%Y": objD.getFullYear(),
      "%y": objD.getFullYear().toString().substr(-2),
      "%MMM": shortMonthName[objD.getMonth()],
      "%MM": fullMonthName[objD.getMonth()],
      "%M": objD.getMonth() + 1,
      "%d": objD.getDate(),
      "%h": hour <= 12 ? hour : hour - 12,
      "%H": hour,
      "%m": objD.getMinutes(),
      "%s": objD.getSeconds(),
      "%DD": fullDaysName[objD.getDay() + 1],
      "%D": shortDaysName[objD.getDay()],
      "%p": objD.getHours() > 11 ? "PM" : "AM"
    };
    newDate = format;

    for (let key in dList) {
      let regEx = new RegExp(key, "g");
      newDate = newDate.replace(regEx, appendZero(dList[key]));
    }
  }
  return newDate;
};
export const queryString = (params) =>
  Object.keys(params)
    ?.map((key) => key + "=" + params[key])
    .join("&");

export const isProductionEnv = () => {
  const isProd = process.env.NODE_ENV.trim() === "production";
  return isProd;
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
//Get any parameter value from URL
export const getParameterByName = (name)=>{
  try{
      if (name) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
          return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      } else {
          return '';
      }
     }catch(e){
     console.log('getParameterByName', e);        
  }
};
export const isDevEnv = () => {
  const isDev = process.env.NODE_ENV.trim() === "development";
  return isDev;
};

export const isVisible = (elm) => {
  if (elm) {
    var rect = elm.getBoundingClientRect();
    var innerHeight = window.innerHeight - 200;
    var clientHeight = document.documentElement.clientHeight - 200;
    return (
      (rect.height > 0 || rect.width > 0) &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (innerHeight || clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  } else {
    return false;
  }
};

export const mgidGeoCheck = (pos) => {
  try {
    let geoinfo = window.geoinfo;
    if (pos == "mid") {
      if (
        typeof geoinfo != "undefined" &&
        ((geoinfo.CountryCode.toUpperCase() == "AU" && geoinfo.geolocation == "6") ||
          (geoinfo.CountryCode.toUpperCase() == "CA" && geoinfo.geolocation == "2") ||
          (geoinfo.CountryCode.toUpperCase() == "US" && geoinfo.geolocation == "2") ||
          (geoinfo.CountryCode.toUpperCase() == "GB" && geoinfo.geolocation == "5") ||
          (geoinfo.CountryCode.toUpperCase() == "AE" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "SA" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "QA" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "OM" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "KW" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "BH" && geoinfo.geolocation == "3"))
      ) {
        return true;
      } else {
        return false;
      }
    } else if (pos == "eoa") {
      if (
        typeof geoinfo != "undefined" &&
        ((geoinfo.CountryCode.toUpperCase() == "AU" && geoinfo.geolocation == "6") ||
          (geoinfo.CountryCode.toUpperCase() == "CA" && geoinfo.geolocation == "2"))
      ) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {}
};

export const removeBackSlash = (val) => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};

export const loadAssets = (filename, fileType, attrType, position, cb, attr?, attrVal?, objAttr?) => {
  try {
    if (filename) {
      let fileRef: any = "";
      if (fileType == "js") {
        fileRef = document.createElement("script");
        fileRef.setAttribute("type", "text/javascript");
        fileRef.setAttribute("src", filename);
        if (attrType) {
          fileRef.setAttribute(attrType, attrType);
        }
        if (attr && attrVal) {
          fileRef.setAttribute(attr, attrVal);
        }
        if (typeof objAttr == "undefined") {
          objAttr = {};
        }
        if (Object.keys(objAttr).length > 0 && objAttr.constructor === Object) {
          for (var key in objAttr) {
            fileRef.setAttribute(key, objAttr[key]);
          }
        }
        if (typeof cb == "function") {
          fileRef.addEventListener("load", cb);
        }
      } else if (fileType == "css") {
        fileRef = document.createElement("link");
        fileRef.setAttribute("rel", "stylesheet");
        fileRef.setAttribute("type", "text/css");
        fileRef.setAttribute("href", filename);
      }
      if (typeof fileRef != "undefined") {
        var positionToAppend = position ? position : "head";
        document.getElementsByTagName(positionToAppend)[0].appendChild(fileRef);
      }
    }
  } catch (e) {
    console.log("loadAssets:", e);
  }
};

export const socialUrl = {
  fb: "https://www.facebook.com/sharer.php",
  twt: "https://twitter.com/share?",
  gp: "https://plus.google.com/share?url=",
  lin: "https://www.linkedin.com/cws/share?url=",
  whatsapp: "https://api.whatsapp.com//send?text=",
  //message: 'sms:' + (navigator.userAgent.toLowerCase().indexOf('iphone') != -1 ? '&body=' :'?body='),
  pinit: "https://pinterest.com/pin/create/link/?url=",
  openerName: "sharer",
  popUpSettings: "toolbar=0,status=0,width=626,height=436"
};

export const encodeQueryData = (data) => {
  const ret: string[] = [];
  for (let d in data) ret.push(`${encodeURIComponent(d)} = ${encodeURIComponent(data[d])}`);
  return ret.join("&");
};

export const getApiUrl = (api, param, index, apidomain = "") => {
  let env = "";
  if (typeof window == "undefined") {
    // env = window.__APP && window.__APP.env;
  } else {
    env = process.env.NODE_ENV.toLowerCase();
  }
  let domain = "";
  if (api.dns) {
    domain = api.dns[env][index] ? api.dns[env][index] : api.dns[env][0];
  }

  const path = api.path;
  if (path.indexOf("request") > -1) {
    domain = apidomain ? apidomain : domain;
  }
  const querystring = encodeQueryData(param);
  let url = domain + path;
  if (querystring) {
    url = `${url}?${querystring}`;
  }
  return url;
};

export const isHostPreprod = () => {
  return (
    serverHost.indexOf("3632") > -1 ||
    serverHost.indexOf("3633") > -1 ||
    serverHost.indexOf("13120") > -1 ||
    serverHost.indexOf("35115") > -1
  );
};

export const urlValidation = (url: string) => {
  let _url = url;
  let checkVideoUrl = _url.indexOf("/videoshow/") !== -1 && _url.indexOf("economictimes.indiatimes.com") !== -1;
  if (checkVideoUrl) {
    return _url.split("https://economictimes.indiatimes.com").pop();
  }
  return url;
};

export const isMobileSafari = () => {
  let result: any = "";
  try {
    let ua = window.navigator.userAgent;
    let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    let webkit = !!ua.match(/WebKit/i);
    result = iOS && webkit && !ua.match(/(CriOS|FxiOS|OPiOS|mercury)/i);
  } catch (e) {
    console.log("isMobileSafari:", e);
  }
  return result;
};

export const gotoPlanPage = (options: any) => {
  options = options || {};
  // options = {
  //   upgrade : true,
  //   url: 'https://dev-buy.indiatimes.com/ET/plans'
  // }
  console.log("customDimension params", window.customDimension, options, window.isprimeuser);
  const planDim = window.customDimension || {};
  if (options.cd) {
    planDim.dimension28 = options.cd;
  }
  if (options.dim1) {
    planDim.dimension1 = options.dim1;
  }
  if (options.dim48) {
    planDim.dimension48 = options.dim48;
  }

  var planUrl =
    options.upgrade || window.isprimeuser
      ? window.objVc && window.objVc.planPageUpgrade
      : window.objVc && window.objVc.planPage;
  if (options.url) {
    planUrl = options.url;
  }
  grxPushData(planDim, planUrl);
};

let output = {
  urlValidation,
  socialUrl,
  removeBackSlash,
  isVisible,
  isDevEnv,
  isProductionEnv,
  queryString,
  dateFormat,
  appendZero,
  validateEmail,
  getParameterByName,
  allowGDPR,
  pageType,
  mgidGeoCheck
};

export default output;

export const getDevStatus = (host: string | string[]) => {
  if (host.indexOf("localhost") !== -1 || host.indexOf("etwebpre.indiatimes.com") !== -1) {
    return true;
  }
  return false;
};
