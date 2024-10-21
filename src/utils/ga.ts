// @ts-nocheck

import * as Config from "./common";
import { getCookie } from "../utils/index"
import APIS_CONFIG from "../network/config.json"
import Service from "../network/service";
import GLOBAL_CONFIG from "../network/global_config.json";
import grxMappingObj from "../utils/grxMappingObj.json";
import cdpObj from "../utils/cdpObj.json";
import jStorageReact from "./jStorage";

export const grxEvent = (type, data, isGA = 0) => {

};

export const pageview = (url) => {
  window["gtag"] &&
    window["gtag"]("config", Config.GA.GTM_KEY, {
      page_path: url
    });
  const page = window.location.href;
  window.customDimension = { ...window.customDimension, url: page, page, hitType: "pageview" };
  // send the page views
  window.ga && window.ga("send", "pageview", window.customDimension);
  grxEvent("page_view", window.customDimension);
};

export const gaObserverInit = (newImpressionNodes = [], newClickNodes = []) => {
  function observeNodesImpression(nodeArray) {
    nodeArray.forEach(function (item) {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }
          const el = entry.target;
          if (el) {
            const gaData = el?.getAttribute("data-ga-impression")?.split("#") || [];
            gaData[2] =
              typeof gaData[2] != "undefined" && gaData[2] != ""
                ? gaData[2] == "url"
                  ? window.location.href
                  : gaData[2]
                : "";
            const href = el.getAttribute("href");
            if (href) {
              gaData[2] = gaData[2].replace("href", href);
            }
            gaData[2] = gaData[2].replace("url", window.location.href);
            if (gaData.length > 2) {                            
              grxEvent("event", {
                event_category: gaData[0],
                event_action: gaData[1],
                event_label: gaData[2]
              });
            }
          }
          observer.unobserve(item);
        },
        {
          root: null,
          threshold: 0.1 // set offset 0.1 means trigger if atleast 10% of element in viewport
        }
      );
      observer.observe(item);
    });
  }
  function observeNodesClick(nodeArray) {
    nodeArray.forEach((item) => {
      item.addEventListener("click", () => {
        const trackVal = item.getAttribute("data-ga-onclick").split("#");
        let track2 = trackVal[2];
        track2 = track2 ? track2 : "";
        const href = item.getAttribute("href") || "";
        track2 = track2.indexOf("href") != -1 ? track2.replace("href", href) : track2;
        track2 = track2.indexOf("url") != -1 ? track2.replace("url", window.location.href) : track2;
        if (trackVal.length > 1) {
          console.log(trackVal);
          //window.ga("send", "event", trackVal[0], trackVal[1], track2, window.customDimension);
          // Growth RX Event
          grxEvent("event", {
            event_category: trackVal[0],
            event_action: trackVal[1],
            event_label: track2
          });
        } else {
          console.log("There is some error in firing onclick ga event");
        }
      });
    });
  }
  try {
    if (newImpressionNodes != null) {
      if (newImpressionNodes?.length > 0) {
        observeNodesImpression(newImpressionNodes);
        return;
      }
      const nodeList = document.querySelectorAll("[data-ga-impression]");
      nodeList?.length > 0 && observeNodesImpression(nodeList);
    }
  } catch (e) {
    console.log("Error in intersection observer in data-ga-impression");
  }
  try {
    if (newClickNodes != null) {
      if (newClickNodes?.length > 0) {
        observeNodesClick(newClickNodes);
        return;
      }
      const nodeList = document.querySelectorAll("[data-ga-onclick]");
      nodeList?.length > 0 && observeNodesClick(nodeList);
    }
  } catch (e) {
    console.log("error in on click listener data-ga-onclick");
  }
};

export const growthRxInit = () => {
  (function (g, r, o, w, t, h, rx) {
    (g[t] =
      g[t] ||
      function (...args) {
        (g[t].q = g[t].q || []).push(...args);
      }),
      (g[t].l = 1 * +new Date());
    (g[t] = g[t] || {}), (h = r.createElement(o)), (rx = r.getElementsByTagName(o)[0]);
    h.async = 1;
    h.src = w;
    rx.parentNode.insertBefore(h, rx);
  })(window, document, "script", "https://static.growthrx.in/js/v2/web-sdk.js", "grx");
  window.grx("init", window.objVc.growthRxId || "gc2744074");
  // window.grx("init", Config.GA.GRX_ID);
};

export const trackingEvent = (type, data) => {
  console.log("trackingEvent------->",data, type);
  const payload = getPageSpecificDimensions(window.pageSeo);
  window.customDimension = { ...window.customDimension, ...payload };
  const objGrx = generateGrxFunnel(data.prevPath);
  window.customDimension = { ...window.customDimension, ...objGrx };
  console.log("CD_----------->",window.customDimension);
  let grxDimension ={};
  for (const key in window.customDimension) {
      if (grxMappingObj[key] && [key] && typeof window.customDimension[key] !== "undefined") {
          grxDimension[grxMappingObj[key]] = window.customDimension[key];
      } else if ([key] && typeof window.customDimension[key] !== "undefined") {
          grxDimension[key] = window.customDimension[key];
      }
  } 
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    _gtmEventDimension = updateGtm(_gtmEventDimension, data.prevPath);
    _gtmEventDimension["event"] = type;
    _gtmEventDimension = Object.assign(_gtmEventDimension, data);
    window.dataLayer.push(_gtmEventDimension);
  }
  let checkGrxready = false;
  if (type == "et_push_pageload") {
    const objCDP = generateCDPPageView(data.prevPath, false);
    if (window.grx || window.isGrxLoaded) {
      if (!checkGrxready) {
        checkGrxready = true;
        window.grx("track", "page_view", grxDimension);
        window.grx("track", "page_view", objCDP);
      }
    } else {
      document.addEventListener("ready", () => {
        if (!checkGrxready) {
          window.isGrxLoaded = true;
          checkGrxready = true;
          window.grx("track", "page_view", grxDimension);
          window.grx("track", "page_view", objCDP);
        }
      });
    }
  }
};

export const redirectToPlanPage = (
  objTracking,
  type = "select_item",
  redirect = true,
) => {
  try {
    if (redirect) {
      trackingEvent("et_push_event", {
        event_category: objTracking.category,
        event_action: objTracking.action,
        event_label: objTracking.label,
      });
    } else {
      trackingEvent("et_push_event", {
        event_category: objTracking.category,
        event_action: objTracking.action,
        event_label: objTracking.label,
        widget_name: objTracking.widget_name ? objTracking.widget_name : "",
        tab_name: objTracking.tab_name ? objTracking.tab_name : "",
      });
    }
    goToPlansPage(type, objTracking.obj, redirect, objTracking.cdp);
  } catch (Err) {
    console.log("redirectToPlanPage Err:", Err);
    goToPlansPage(type, {}, redirect);
  }
};

export const goToPlansPage = (type, data, redirect, cdpSend = {}) => {
  if (window.dataLayer) {
    let _gtmEventDimension = {};
    _gtmEventDimension = updateGtm(_gtmEventDimension);
    _gtmEventDimension["event"] = type;
    let items = [];
    data["subscription_status"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    data["subscription_type"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    items.push(data);
    _gtmEventDimension["items"] = items;
    window.dataLayer.push(_gtmEventDimension);
    //trackPushData(_gtmEventDimension, data, redirect, cdpSend);
  }
};

export const trackPushData = (
  _gtmEventDimension: any,
  planDim: any,
  redirect,
  cdpSend,
) => {
  let url = (APIS_CONFIG as any)?.PUSHDATA[window.APP_ENV],
    grxMapObj = {},
    newGrxMapObj = grxMappingObj,
    objUserData = {},
    ga4Items = {};

  const objGTMdata = Object.assign({}, _gtmEventDimension);
  let sendGTMdata = Object.assign({}, planDim);
  sendGTMdata["feature_name"] = objGTMdata.feature_name;
  sendGTMdata["site_section"] = objGTMdata.site_section;
  sendGTMdata["site_sub_section"] = objGTMdata.site_sub_section;
  if (typeof window.objUser.info != "undefined") {
    const { primaryEmail, firstName, lastName } = window.objUser.info;
    const fullName = firstName + (lastName ? " " + lastName : "");
    objUserData.email = primaryEmail;
    objUserData.mobile =
      window?.objUser?.info?.mobileList &&
      Object.keys(window?.objUser?.info?.mobileList).length > 0
        ? Object.keys(window?.objUser?.info?.mobileList)[0]
        : "";
    objUserData.fname = firstName;
    objUserData.fullname = fullName;
  }

  const getGrxData = generateGrxFunnel(window?.objUser?.prevPath);
  let cdpData = generateCDPPageView(window?.objUser?.prevPath, redirect);
  cdpData = { ...cdpData, ...cdpSend };

  if (typeof grx != "undefined") {
    grx("init", (GLOBAL_CONFIG as any)[window.APP_ENV]?.grxId);
    grx("track", cdpData.event_name, cdpData);
  }
  const dataToPost = {
    ET: generateGrxFunnel(window?.objUser?.prevPath),
    grxMappingObj: newGrxMapObj,
    objUserData: objUserData,
    analytics_cdp: cdpData,
    ga4Items: sendGTMdata,
  };
  const pushData = {
    logdata: JSON.stringify(dataToPost),
    merchantType: "ET",
    grxId: getCookie("_grx"),
  };
  const ticketId = getCookie("encTicket")
    ? `&ticketid=${getCookie("encTicket")}`
    : "";
  const ACQ_SUB_SOURCE = `${sendGTMdata?.item_category}|${sendGTMdata?.item_category2}|${sendGTMdata?.item_category3}|${sendGTMdata?.item_category4.replace(" ", "_")}`;
  const planUrl = (GLOBAL_CONFIG as any)[window.APP_ENV]["Plan_PAGE"];
  const newPlanUrl =
    planUrl +
    (planUrl.indexOf("?") == -1 ? "?" : "&") +
    "ru=" +
    encodeURI(window.location.href) +
    "&grxId=" +
    getCookie("_grx") +
    ticketId +
    "&meta=market_tools&acqSubSource=" +
    ACQ_SUB_SOURCE;
  const headers = {
    "Content-Type": "application/json",
  };

  Service.post({
    url,
    headers: headers,
    body: JSON.stringify(pushData),
    params: {},
  })
    .then((res) => {
      if (redirect) {
        window.location.href = newPlanUrl;
      }
    })
    .catch((err) => {
      if (redirect) {
        window.location.href = newPlanUrl;
      }
    });
};

export const getUserType = (permissionsArr) => {
  try {
    var userType = "New";
    if (permissionsArr.length > 0) {
      if (permissionsArr.some((str) => str.includes("expired_subscription"))) {
        userType = "expired";
      } else if (
        permissionsArr.some((str) => str.includes("subscribed")) &&
        permissionsArr.some((str) => str.includes("cancelled_subscription")) &&
        permissionsArr.some((str) => str.includes("can_buy_subscription"))
      ) {
        userType = "trial";
      } else if (
        permissionsArr.some((str) => str.includes("cancelled_subscription"))
      ) {
        userType = "cancelled";
      } else if (
        permissionsArr.some((str) => str.includes("active_subscription")) ||
        permissionsArr.some((str) => str.includes("subscribed"))
      ) {
        userType = "Paid Active";
      } else if (
        permissionsArr.some((str) => str.includes("can_buy_subscription"))
      ) {
        userType = "free";
      }
    }
    return userType;
  } catch (e) {
    console.log("checkUserPermissions:" + e);
  }
};

export const getPageName = (pageURL = "") => {
  const pagePathName = pageURL || (window && window.location.pathname);
  let pageName = "";
  let pageDetails = { pageName: "", featureName: "" };
  if (pagePathName.includes("/stockreports")) {
    pageName = "Stock Report";
  } else if (pagePathName.includes("/stockreportscategory") || pagePathName.includes("/stockreports_benefits")) {
    pageName = "Mercury_StockReportPlus";
  } else if (pagePathName.includes("/stocks")) {
    pageName = "Mercury_CompanyPage";
  } else if (pagePathName.includes("/default")) {
    pageName = "homepage";
  } else if (pagePathName.includes("/print_edition")) {
    pageName = "HP_ePaper_Print";
  } else if (pagePathName.includes("/etgrandmasters")) {
    pageName = "Grandmaster";
  } else if (pagePathName.includes("/videoshow")) {
    pageName = "videoshow";
  } else if (pagePathName.includes("/articleshow_exclusive") || pagePathName.includes("/articleshow_exclusive2")) {
    pageName = "Premium";
  } else if (pagePathName.includes("/articleshow")) {
    pageName = "articleshow";
  } else {
    pageName = "other";
  }
  return pageName;
};

export const updateGtm = (_gtmEventDimension, prevPath) => {
  try {
    console.log("window.seo----->",window.pageSeo);
    const pagePathName = window.location.pathname;
    const pageElem = window.location.pathname.split("/");
    let site_section = pagePathName.slice(1);
    let lastSlash = site_section.lastIndexOf("/");
    _gtmEventDimension["feature_name"] = getPageName().replace("Mercury_", "");
    _gtmEventDimension["site_section"] =
      site_section.indexOf("/") == -1
        ? site_section.substring(site_section.indexOf("/") + 1)
        : site_section.substring(0, site_section.indexOf("/"));
    _gtmEventDimension["login_status"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    _gtmEventDimension["user_login_status_hit"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    _gtmEventDimension["user_login_status_session"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    _gtmEventDimension["last_click_source"] = site_section;
    let trafficSource = "direct";
    let dref = document.referrer,
      wlh = window.location.href.toLowerCase();
    if (/google|bing|yahoo/gi.test(prevPath)) {
      trafficSource = "organic";
    } else if (
      /facebook|linkedin|instagram|twitter/gi.test(prevPath) ||
      wlh.indexOf("utm_medium=social") != -1
    ) {
      trafficSource = "social";
    } else if (wlh.indexOf("utm_medium=email") != -1) {
      trafficSource = "newsletter";
    } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
      trafficSource = "notifications";
    }
    _gtmEventDimension["internal_source"] = trafficSource;
    _gtmEventDimension["user_id"] =
      typeof window.objUser != "undefined" && window.objUser?.ssoid
        ? window.objUser.ssoid
        : "";
    _gtmEventDimension["site_sub_section"] = site_section;
    _gtmEventDimension["user_grx_id"] = getCookie("_grx")
      ? getCookie("_grx")
      : "";
    _gtmEventDimension["subscription_status"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    _gtmEventDimension["current_subscriber_status"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    _gtmEventDimension["user_subscription_status"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    _gtmEventDimension["platform"] = "Web";
    _gtmEventDimension["page_template"] = site_section.substring(lastSlash + 1);
    _gtmEventDimension["feature_permission"] =
      typeof window.objUser != "undefined" &&
      window.objUser.accessibleFeatures &&
      window.objUser.accessibleFeatures.length > 0
        ? window.objUser.accessibleFeatures
        : "";
    _gtmEventDimension["country"] = window?.geoinfo.CountryCode;
    _gtmEventDimension["email"] = window?.objUser?.info?.primaryEmail
      ? window?.objUser?.info?.primaryEmail
      : "";
    _gtmEventDimension["et_product"] = getPageName();
    _gtmEventDimension["et_uuid"] = getCookie("peuuid")
      ? getCookie("peuuid")
      : getCookie("pfuuid");
    _gtmEventDimension["first_name"] = window?.objUser?.info?.firstName
      ? window?.objUser?.info?.firstName
      : "";
    _gtmEventDimension["last_name"] = window?.objUser?.info?.lastName
      ? window?.objUser?.info?.lastName
      : "";
    _gtmEventDimension["loggedin"] =
      typeof window.objUser.info != "undefined" ? "Yes" : "No";
    _gtmEventDimension["pageTitle"] = document.title;
    _gtmEventDimension["referral_url"] =
      window.location.pathname == prevPath ? "" : prevPath;
    _gtmEventDimension["ssoid"] = getCookie("ssoid") ? getCookie("ssoid") : "";
    _gtmEventDimension["user_region"] = window?.geoinfo.region_code;
    _gtmEventDimension["web_peuuid"] = getCookie("peuuid");
    _gtmEventDimension["web_pfuuid"] = getCookie("pfuuid");
    return _gtmEventDimension;
  } catch (e) {
    console.log("Error", e);
    return {};
  }
};

export const generateGrxFunnel = (prevPath) => {
  try {
    const pagePathName = window.location.pathname;
    const pageElem = window.location.pathname.split("/");
    let site_section = pagePathName.slice(1);
    let lastSlash = site_section.lastIndexOf("/");
    let objGrx = {};
    objGrx["dimension1"] = getPageName();
    objGrx["dimension3"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    objGrx["dimension5"] = "ET";
    objGrx["dimension6"] = "ET";
    objGrx["dimension10"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    objGrx["dimension20"] = "Web";
    // objGrx["dimension25"] = site_section.substring(lastSlash + 1);
    // objGrx["dimension26"] =
    //   site_section.indexOf("/") == -1
    //     ? site_section.substring(site_section.indexOf("/") + 1)
    //     : site_section.substring(0, site_section.indexOf("/"));
    // objGrx["dimension27"] = site_section;
    objGrx["dimension37"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    objGrx["dimension93"] = pageSource();
    objGrx["dimension92"] = site_section;
    objGrx["dimension96"] = 0;
    objGrx["dimension94"] = 0;
    objGrx["dimension98"] = 0;
    objGrx["dimension109"] = window?.geoinfo.region_code;
    objGrx["dimension143"] =
      typeof window.objUser != "undefined" &&
      window.objUser.accessibleFeatures &&
      window.objUser.accessibleFeatures.length > 0
        ? window.objUser.accessibleFeatures
        : "";
    objGrx["dimension146"] =
      typeof window.objUser.info != "undefined" ? "Logged In" : "Not Logged In";
    objGrx["dimension147"] =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "Free User";
    objGrx["dimension145"] = getPageName();
    objGrx["dimension148"] = getPageName().replace("Mercury_", "");
    objGrx["dimension149"] = "";
    objGrx["dimension150"] =
      typeof window.objUser != "undefined" && window.objUser?.ssoid
        ? window.objUser.ssoid
        : "";
    objGrx["dimension151"] = getCookie("_grx") ? getCookie("_grx") : "";
    objGrx["dimension152"] = document.title;
    objGrx["dimension153"] =
      window.location.pathname == prevPath ? "" : prevPath;
    return objGrx;
  } catch (e) {
    console.log("Error ", e);
    return {};
  }
};

export const generateCDPPageView = (prevPath, redirect) => {
  try {
    const pagePathName = window.location.pathname;
    let pageElem = window.location.pathname.split("/");
    const arr = pageElem.shift();
    let site_section = pagePathName.slice(1);
    let lastSlash = site_section.lastIndexOf("/");
    cdpObj["feature_name"] = getPageName().replace("Mercury_", "");
    cdpObj["level_1"] = pageElem[0] != undefined ? pageElem[0] : "";
    cdpObj["level_2"] = pageElem[1] != undefined ? pageElem[1] : "";
    cdpObj["level_3"] = pageElem[2] != undefined ? pageElem[2] : "";
    cdpObj["level_4"] = pageElem[3] != undefined ? pageElem[3] : "";
    cdpObj["level_full"] = site_section;
    // const n = prevPath ? prevPath.lastIndexOf("/") : 0;
    // const lastClick = n == 0 ? "" : prevPath.substring(n + 1);
    // cdpObj["last_click_source"] = lastClick;
    cdpObj["referral_url"] =
      window.location.pathname == prevPath ? "" : prevPath;
    cdpObj["page_template"] = site_section.substring(lastSlash + 1);
    cdpObj["url"] = window.location.href;
    cdpObj["title"] = document.title;
    if (redirect) {
      const uniqueID = getCookie("_grx") + "_" + +new Date();
      cdpObj["unique_subscription_id"] = uniqueID;
    }
    let trafficSource = "direct";
    let dref = document.referrer,
      wlh = window.location.href.toLowerCase();
    if (/google|bing|yahoo/gi.test(prevPath)) {
      trafficSource = "organic";
    } else if (
      /facebook|linkedin|instagram|twitter/gi.test(prevPath) ||
      wlh.indexOf("utm_medium=social") != -1
    ) {
      trafficSource = "social";
    } else if (wlh.indexOf("utm_medium=email") != -1) {
      trafficSource = "newsletter";
    } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
      trafficSource = "notifications";
    }
    cdpObj["source"] = trafficSource;
    cdpObj["loggedin"] = typeof window.objUser.info != "undefined" ? "y" : "n";
    cdpObj["email"] = window?.objUser?.info?.primaryEmail
      ? window?.objUser?.info?.primaryEmail
      : "";
    cdpObj["phone"] =
      typeof window.objUser != "undefined" &&
      window?.objUser?.info?.mobileList &&
      Object.keys(window?.objUser?.info?.mobileList).length > 0
        ? Object.keys(window?.objUser?.info?.mobileList)[0]
        : "";
    cdpObj["login_method"] = window?.objUser?.loginType
      ? window?.objUser?.loginType
      : "";
    const subscription_status =
      typeof window.objUser != "undefined" && window?.objUser?.permissions
        ? getUserType(window.objUser.permissions)
        : "free";
    cdpObj["subscription_status"] =
      subscription_status == "Paid Active" ? "paid" : subscription_status;
    cdpObj["subscription_type"] =
      typeof window.objUser != "undefined" &&
      window?.objUser?.userAcquisitionType
        ? window.objUser.userAcquisitionType
        : "free";
    cdpObj["business"] = "et";
    cdpObj["embedded"] = "";
    cdpObj["paywalled"] = "n";
    cdpObj["product"] = "mercury";
    cdpObj["client_source"] = "cdp";
    cdpObj["dark_mode"] = "n";
    cdpObj["monetizable"] =
      typeof window.objUser != "undefined" && window.objUser.isPrime
        ? "n"
        : "y";
    cdpObj["utm_source"] = getParameterByName("utm_source")
      ? getParameterByName("utm_source")
      : "";
    cdpObj["utm_medium"] = getParameterByName("utm_medium")
      ? getParameterByName("utm_medium")
      : "";
    cdpObj["utm_campaign"] = getParameterByName("utm_campaign")
      ? getParameterByName("utm_campaign")
      : "";
    cdpObj["variant_id"] = getParameterByName("variant_id")
      ? getParameterByName("variant_id")
      : "";
    cdpObj["cohort_id"] = getParameterByName("cohort_id")
      ? getParameterByName("cohort_id")
      : "";
    return cdpObj;
  } catch (e) {
    console.log("Error___" + e);
    return {};
  }
};

export const getjStorageVal = (keyName) => {
  let value = "";
  try {
    value = jStorageReact?.get(keyName);
  } catch (e) {
    console.log("error", e);
  }
  return value;
};
export const prepSeoListData = (data) => {
  let primaryList = data || [];
  primaryList = primaryList.filter((i) => {
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
export function setVisitInfo() {
  let source = jStorageReact.get("etu_source");
  let wlp = window.location.pathname;
  if (!source) {
    source = pageSource();
  }
  jStorageReact.set("etu_source", source, { TTL: 30 * 60 * 1000 });
  if (wlp.indexOf("articleshow") !== -1) {
    const msid = parseInt(window.msid || 0);
    const dt = dateFormat(new Date(), "%Y%M%d");
    const key = "et_article_" + dt;
    const articlesList = jStorageReact.get(key) || [];
    const existInList = articlesList.indexOf(msid) === -1 ? 0 : 1;
    if (!existInList) {
      articlesList.push(msid);
      jStorageReact.set(key, articlesList, { TTL: 30 * 24 * 60 * 60 * 1000 });
    }
    setTimeout(function () {
      let blocker_layer = document.getElementById("blocker_layer");
      if (blocker_layer && !existInList) {
        var prime_key = "et_primearticle_" + dt;
        var prime_count = jStorageReact.get(prime_key) || 0;
        jStorageReact.set(prime_key, prime_count + 1, { TTL: 30 * 24 * 60 * 60 * 1000 });
      }

      var continuousPaywalled = jStorageReact.get("et_continuousPaywalled") || [];
      if (!blocker_layer) {
        continuousPaywalled = [];
      } else {
        if (continuousPaywalled.indexOf(msid) == -1) {
          continuousPaywalled.push(msid);
        }
      }

      jStorageReact.set("et_continuousPaywalled", continuousPaywalled);

      //Set dimension in window object
      let {
        trafficSource,
        lastClick,
        articleReadCountToday,
        articleReadCountMonth,
        paidArticleReadCountToday,
        paidArticleReadCountMonth,
        continuousPaywallHits
      } = fetchAdaptiveData();
      const customDimension = window.customDimension || {};
      customDimension.dimension92 = lastClick;
      customDimension.dimension93 = trafficSource;
      customDimension.dimension94 = articleReadCountToday;
      customDimension.dimension95 = articleReadCountMonth;
      customDimension.dimension96 = continuousPaywallHits;
      customDimension.dimension97 = paidArticleReadCountMonth;
      customDimension.dimension98 = paidArticleReadCountToday;
    }, 2000);
  }
    
}
export const fetchAdaptiveData = function () {
  const referrer = typeof document != "undefined" && document?.referrer;
  let trafficSource = "Direct";
  if (getjStorageVal("etu_source")) {
    trafficSource = getjStorageVal("etu_source");
  }else{
    trafficSource = pageSource();
  }
  
  const loginStatus = getCookie("ssoid") ? "Logged In" : "Not Logged In";
  const lastClick = getjStorageVal("etu_last_click") || "direct_landing_articleshow";
  const dtObject = new Date(),
    dt = dtObject.getFullYear() + "" + appendZero(dtObject.getMonth() + 1) + "" + appendZero(dtObject.getDate());
  const key = "et_article_" + dt;
  const articleReadCountToday = (getjStorageVal(key) || []).length;
  let articleReadCountMonth = 0;
  let paidArticleReadCountMonth: any = 0;
  try {
    const jstorageKeys = jStorageReact.index();
    jstorageKeys
      .filter(function (key) {
        return key.indexOf("et_article_") !== -1;
      })
      .forEach(function (key) {
        articleReadCountMonth += getjStorageVal(key).length;
      });
    jstorageKeys
      .filter(function (key) {
        return key.indexOf("et_primearticle_") !== -1;
      })
      .forEach(function (key) {
        paidArticleReadCountMonth += getjStorageVal(key) || 0;
      });
  } catch (e) {
    console.log("error", e);
  }
  const paidArticleReadCountTodayKey = "et_primearticle_" + dt;
  const paidArticleReadCountToday = getjStorageVal(paidArticleReadCountTodayKey) || 0;
  const continuousPaywallHits = (getjStorageVal("et_continuousPaywalled") || []).length;
  return {
    trafficSource,
    loginStatus,
    lastClick,
    articleReadCountToday,
    articleReadCountMonth,
    paidArticleReadCountToday,
    paidArticleReadCountMonth,
    continuousPaywallHits
  };
};
export const pageSource = () => {
  let trafficSource = "";
  let dref = document.referrer,
      wlh = window.location.href.toLowerCase();
    if (/google|bing|yahoo/gi.test(dref)) {
      trafficSource = "organic";
    } else if (
      /facebook|linkedin|instagram|twitter/gi.test(dref) ||
      wlh.indexOf("utm_medium=social") != -1
    ) {
      trafficSource = "social";
    } else if (wlh.indexOf("utm_medium=email") != -1) {
      trafficSource = "newsletter";
    } else if (wlh.indexOf("utm_source=etnotifications") != -1) {
      trafficSource = "notifications";
    } else {
      trafficSource = "direct";
    }
  return trafficSource;
}
export const fetchImmediateSubsec = (objSec) => {
  return objSec.subsecname4
    ? objSec.subsecname4
    : objSec.subsecname3
      ? objSec.subsecname3
      : objSec.subsecname2
        ? objSec.subsecname2
        : objSec.subsecname1
          ? objSec.subsecname1
          : "";
};
export const updateDimension = ({
  dimensions = {},
  payload = {},
  url = "",
  type = "",
  pageName = "",
  msid = "",
  subsecnames = {}
}: any) => {
  try {
    if (typeof window !== "undefined") {
      const sendEvent = () => {
        dimensions["dimension20"] = "PWA";
        window.customDimension = { ...window.customDimension, ...dimensions };
        createGAPageViewPayload(payload);
        const userInfo = typeof objUser !== "undefined" && objUser.info && objUser.info;
        const isSubscribed =
          typeof window.objInts != undefined && window.objInts.permissions.indexOf("subscribed") > -1;
        const product = pageName == "stock_report_plus" ? "prime" : "other";
        const nonAdPageArray = ["shortvideos", "quickreads"];
        let isMonetizable = "y";
        if (isSubscribed || nonAdPageArray.indexOf(pageName) !== -1) {
          isMonetizable = "n";
        }
        let subsStatus = "free";
        if (typeof window.objInts != "undefined") {
          if (window.objInts.permissions.indexOf("expired_subscription") > -1) {
            subsStatus = "expired";
          } else if (
            window.objInts.permissions.indexOf("subscribed") > -1 &&
            window.objInts.permissions.indexOf("cancelled_subscription") > -1 &&
            window.objInts.permissions.indexOf("can_buy_subscription") > -1
          ) {
            subsStatus = "trial";
          } else if (window.objInts.permissions.indexOf("subscribed") > -1) {
            subsStatus = "paid";
          } else if (window.objInts.permissions.indexOf("etadfree_subscribed") > -1) {
            subsStatus = "adfree";
          } else if (window.objInts.permissions.indexOf("cancelled_subscription") > -1) {
            subsStatus = "cancelled";
          }
        }
        const { trafficSource, lastClick } = fetchAdaptiveData();
        const ticketId = getCookie("TicketId");
        const userAccountDetails = ticketId && jStorageReact.get(`prime_${ticketId}`);
        const subscriptionDetails =
          (userAccountDetails && userAccountDetails.subscriptionDetails && userAccountDetails.subscriptionDetails[0]) ||
          {};
        window.grxDimension_cdp = {
          url: window.location.href,
          title: document.title,
          referral_url: document.referrer,
          platform: "pwa"
        };
        window.grxDimension_cdp["section_id"] =
          (window.customDimension["dimension29"] && window.customDimension["dimension29"]) || "";
        window.grxDimension_cdp["level_1"] =
          (window.customDimension["dimension26"] && window.customDimension["dimension26"].toLowerCase()) || "";
        window.grxDimension_cdp["level_full"] =
          (window.customDimension["dimension27"] && window.customDimension["dimension27"].toLowerCase()) || "";
        window.grxDimension_cdp["paywalled"] = window.customDimension["dimension59"] == "Yes" ? "y" : "n";
        window.grxDimension_cdp["content_id"] =
          (window.customDimension["msid"] && parseInt(window.customDimension["msid"])) || parseInt(msid);
        window.grxDimension_cdp["last_click_source"] = lastClick || "";
        window.grxDimension_cdp["source"] = trafficSource || "";
        window.grxDimension_cdp["business"] = "et";
        window.grxDimension_cdp["dark_mode"] = "n";
        window.grxDimension_cdp["event_name"] = "page_view";
        window.grxDimension_cdp["client_source"] = "cdp";
        window.grxDimension_cdp["product"] = product;
        window.grxDimension_cdp["loggedin"] =
          window.customDimension["dimension3"] && window.customDimension["dimension3"] == "LOGGEDIN"
            ? "y"
            : userInfo && userInfo.isLogged
              ? "y"
              : "n";
        window.grxDimension_cdp["email"] = (userInfo && userInfo.primaryEmail) || "";
        window.grxDimension_cdp["phone"] =
          userInfo && userInfo.mobileData && userInfo.mobileData.Verified && userInfo.mobileData.Verified.mobile
            ? userInfo.mobileData.Verified.mobile
            : "";
        window.grxDimension_cdp["subscription_status"] = subsStatus;
        window.grxDimension_cdp["page_template"] =
          (window.customDimension["dimension25"] && window.customDimension["dimension25"].toLowerCase()) ||
          (pageName && pageName.toLowerCase());
        window.grxDimension_cdp["subscription_type"] =
          (subscriptionDetails &&
            subscriptionDetails.userAcquisitionType &&
            subscriptionDetails.userAcquisitionType.toLowerCase()) ||
          "free";
        window.grxDimension_cdp["monetizable"] = isMonetizable;
        const navigator: any = window.navigator;
        window.grxDimension_cdp["browser_name"] = (navigator && navigator.sayswho) || "";
        window.grxDimension_cdp["level_2"] = subsecnames?.subsecname2 || "";
        window.grxDimension_cdp["level_3"] = subsecnames?.subsecname3 || "";
        window.grxDimension_cdp["level_4"] = subsecnames?.subsecname4 || "";
        const utmParams_dim = window.URLSearchParams && new URLSearchParams(window.location.search);
        const utmSource_dim = utmParams_dim.get && utmParams_dim.get("utm_source");
        const utmMedium_dim = utmParams_dim.get && utmParams_dim.get("utm_medium");
        const utmCamp_dim = utmParams_dim.get && utmParams_dim.get("utm_campaign");
        const campaign_id = utmParams_dim.get && utmParams_dim.get("campaign_id");
        window.grxDimension_cdp["utm_source"] = utmSource_dim || "";
        window.grxDimension_cdp["utm_medium"] = utmMedium_dim || "";
        window.grxDimension_cdp["utm_campaign"] = utmCamp_dim || "";
        window.grxDimension_cdp["campaign_id"] = campaign_id || "";
        window.grxDimension_cdp["login_method"] = getCookie("LoginType") || "";
        url
          ? pageview(url, payload, type)
          : pageview(
              (location.pathname + location.search).length > 1
                ? (location.pathname + location.search).substr(1)
                : location.pathname + location.search,
              payload,
              type
            );
      };
      const objUser = (window.objUser && window.objUser.info) || {};
      if (Object.keys(objUser).length) {
        dimensions["dimension3"] = "LOGGEDIN";
      } else {
        dimensions["dimension3"] = "NONLOGGEDIN";
      }
      window.customDimension = { ...window.customDimension, ...dimensions };
      if (typeof window.objInts !== "undefined" && window.objUser) {
        window?.objInts?.afterPermissionCall(sendEvent);
      } else {
        window?.objInts?.afterPermissionCall(sendEvent);
      }
    }
  } catch (e) {
    console.log("updateDimension error: ", e);
  }
};
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
      "%DD": fullDaysName[objD.getDay()],
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
export const getPageSpecificDimensions = (seo) => {
  const { subsecnames = {}, msid, updated = "", keywords, agency, page = "videoshow",authors } = seo;
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
    dimension5: authors,
    // dimension8: formattedDate,
    dimension9: subsecname2,
    dimension12: keywords,
    dimension13: timeString,
    dimension25: page,
    dimension26: subsecname1,
    dimension27: sectionsList,
    dimension29: subsec1,
    dimension48: msid
  };
  //console.log("Date Value:-" + dimension8)
  return payload;
};