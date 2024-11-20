"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { FC, useEffect, useState } from "react";
import { getCookie, loadPrimeApiNew, sendMouseFlowEvent, updateDimension } from "../utils";
import * as Config from "../utils/common";
import GLOBAL_CONFIG from "../network/global_config.json";
import { getUserType, trackingEvent } from "utils/ga";
import { loadAndBeyondScript, loadTaboolaScript } from "./Ad/AdScript";
import { useStateContext } from "../store/StateContext";
import { callJsOnAppLoad } from "utils/priority";
import jStorage from "jstorage-react";

interface Props {
  isprimeuser?: number | boolean;
  objVc?: object;
  APP_ENV: string;
  page?: any;
}

declare global {
  interface Window {
    optCheck: boolean;
    dataLayer: [];
    geolocation: any;
    customDimension: any;
    grxDimension_cdp: any;
    _gtmEventDimension: any;
    grx:any;
    opera?: string;
    MSStream?: string;
    geoinfo: any;
    pageSeo: any;
    CleoClient: any;
    objInts: any;
    __APP: any;
    google: {
      accounts: {
        id: {
          disableAutoSelect;
        };
      };
    };
    googletag: any;
    ispopup: any;
    tpName: any;
    jsso?: {
      getValidLoggedInUser?: any;
      getUserDetails?: any;
      signOutUser?: any;
      v1AddUpdateMobile?: any;
      v1VerifyAlternateMobile?: any;
    };
    isSurveyLoad: any;
    ssoWidget?: any;
    verifyLoginSuccess?: any;
    APP_ENV: string;
    isDev: boolean;
    objUser: {
      ssoid?: any;
      ticketId?: any;
      loginType?: string;
      afterCheckUserLoginStatus?: boolean;
      email?: any;
      primaryEmail?: any;
      prevPath?: string;
      isPink?: any;
      info?: {
        thumbImageUrl: any;
        primaryEmail: string;
        firstName: string;
        ssoid: any;
        isLogged: any;
        mobile: any;
        lastName: any;
        email: any;
      };
      isPrime?: any;
      permissions?: any;
      accessibleFeatures?: any;
      primeInfo?: any;
      afterLoginCall?: any;
      loadSsoApi?: any;
      userAcquisitionType?: any;
    };
    _ibeat_track?: any;
    _sva: any;
    bookmarkApiHitStatus: any;
    bookmarkApiRes: any;
    watchListApiHitStatus: any;
    watchListApiRes: any;
    updateGAObserver:any;
  }
}
declare var JssoCrosswalk: any;

const Scripts: FC<Props> = ({ isprimeuser, objVc = {}, APP_ENV, page }) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [prevPath, setPrevPath] = useState<any>(null);
  const minifyJS = APP_ENV === "development" ? 0 : 1;
  const jsDomain = "https://etdev8243.indiatimes.com"; //APP_ENV === "development" ? "https://etdev8243.indiatimes.com" : "https://js.etimg.com";
  const jsIntsURL = `${jsDomain}/js_ints_web.cms?v=${objVc["js_interstitial"]}&minify=${minifyJS}&x=1`;
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, permissions } = state.login;
  const ET_WEB_URL = GLOBAL_CONFIG[APP_ENV]["ET_WEB_URL"];

  let execution = 0;
  const surveyLoad = () => {
    if (window._sva && window._sva.setVisitorTraits) {
      const subscribeStatus =
        typeof window.objUser != "undefined" && window?.objUser?.permissions
          ? getUserType(window.objUser.permissions)
          : "";
      var jString = localStorage.getItem("jStorage"),
        objJstorage = (jString && JSON.parse(jString)) || {};
      var cnt = Object.keys(objJstorage).filter(function (key) {
        return key.indexOf("et_article_") != -1;
      }).length;
      var loyalCount = 15;
      window._sva.setVisitorTraits({
        user_subscription_status: subscribeStatus,
        user_login_status: typeof window.objUser != "undefined" ? "logged-in" : "logged-out",
        prime_funnel_last_step: "",
        country_code: (window.geoinfo && window.geoinfo.CountryCode) || "",
        email_id: window?.objUser?.info?.primaryEmail ? window?.objUser?.info?.primaryEmail : "",
        grx_id: getCookie("_grx"),
        Loyal: cnt >= loyalCount ? "Yes" : "No"
      });
    }
  };
  useEffect(() => {
    try {
      setPrevPath(pathName || document.referrer);
      if (typeof window.objUser == "undefined") window.objUser = {};
      window.objUser && (window.objUser.prevPath = prevPath);
      if (window.isSurveyLoad) {
        surveyLoad();
      } else {
        document.addEventListener(
          "surveyLoad",
          () => {
            window.isSurveyLoad = true;
            surveyLoad();
          },
          { once: true }
        );
      }
    } catch (e) {
      console.log("Error-- ", e);
    }
  }, [router, isPrime]);

  useEffect(() => {
    if (typeof isPrime != "undefined" && typeof permissions != "undefined" && execution == 0) {
      loadAndBeyondScript(isPrime);
      loadTaboolaScript(isPrime);
      execution = 1;
    }
  }, [isPrime, permissions]);

  useEffect(() => {
    window.APP_ENV = APP_ENV;
    window.isDev = APP_ENV === "development";
    window._ibeat_track = {
      visitor_cat: isPrime ? 1 : isLogin ? 2 : 3,
      ct: window.tpName == "videoshow" ? 2 : 20
    };
    sendMouseFlowEvent();
    callJsOnAppLoad();
    if(window.grx){
      trackingEvent("et_push_pageload", {
        url: window.location.href,
        prevPath: pathName || document.referrer
      });
    }else{
    document.addEventListener("gtmLoaded",()=>{
      trackingEvent("et_push_pageload", {
        url: window.location.href,
        prevPath: pathName || document.referrer
      });
    })
  }
  }, []);

  const _redirectPage = () => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const tdId = getCookie('TicketId'),
      grx = getCookie('_grx'),
      ssoid = getCookie('ssoid') || (jStorage.get('userInfo')?.ssoid),
      userData = jStorage.get(`prime_${tdId}`) || {},
      resObj = userData?.data?.productDetails?.filter((item: any) => {
        return item.productCode == "ETPR";
      }),
      oauthAPiRes = resObj?.[0] || [],
      isPrimeUser = userData.data && oauthAPiRes.permissions.some(function (item: any) {
        return !item.includes("etadfree") && item.includes("subscribed");
      }),
      isExpiredUserEligible = typeof ssoid != "undefined" && jStorage.get('adFreeCampign_'+ssoid) && jStorage.get('adFreeCampign_'+ssoid).eligible || 0,
      b = document.getElementsByTagName('html')[0], lsKey = 'et_nhp_' + ssoid, 
      bucket = window.localStorage && localStorage.getItem(lsKey) || '', 
      bucketArr = bucket.split('-');
      const _redirect = () => {
        window.location.href = ET_WEB_URL; // Ensure ET_WEB_URL is defined
      }
      const hitPrimeApi = async () => {
        const primeRes = await loadPrimeApiNew();
        if (primeRes?.code === "200") {
          const primeResObj = primeRes?.data?.productDetails?.filter((item: any) => {
            return item.productCode == "ETPR";
          }),
          oauthAPiResObj = primeResObj[0] || [],
          isPrime = primeRes?.data && oauthAPiResObj?.permissions.some(function (item: any) {
            return !item.includes("etadfree") && item.includes("subscribed");
          });
           if(isPrime){
            b.classList.add("prime_header");
            b.classList.remove("pg_hide")
           }else{
            _redirect(); 
           }
        }else{
          _redirect()  
        }
      }
      if(window.location.search.indexOf('dev=1') != -1 || (isPrimeUser || isExpiredUserEligible)) {
          b.classList.add("prime_header");
          b.classList.remove("pg_hide")
      } else if(ssoid) {
        hitPrimeApi();
      } else {_redirect()}
    }
  }

  return (
    <>
      <Script id="main-script">
        {`
          window.__APP = {
              env: "${APP_ENV}"
          }
          window.customDimension = window.customDimension || {};
          window.adDivIds = [];
          window._log = function(){
              let currDate = new Date().toString().split(" GMT")[0];
              let args = Array.prototype.slice.call(arguments);
              console.log(currDate + ' >', args.toString());
          }
          var _comscore = _comscore || [];
          _comscore.push({ c1: "2", c2: "6036484" });
        `}
      </Script>
      <Script
        src={(GLOBAL_CONFIG as any)[APP_ENV]?.jssoSDK}
        onLoad={() => {
          window.jsso = new JssoCrosswalk("et", "web");
          const jssoLoaded = new Event("jssoLoaded");
          document.dispatchEvent(jssoLoaded);
        }}
      />
      <Script id="geoinfo-call">
        {`
        function getGeoInfo() {    
            var value = "", info = {};               
            var name = "geoinfo=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                value = c.substring(name.length, c.length);
              }
            }

            if(value) {
              var comps = value.split(',').map(function(item) { return item.trim(); });
              var map = {'CC': 'CountryCode', 'RC': 'region_code', 'CT': 'city', 'CO': 'Continent', 'GL': 'geolocation'}
              for(var i=0; i<comps.length; i++) {
                var compSplit = comps[i].split(':');
                info[map[compSplit[0]]] = compSplit[1];
              }
            }

            return info;
          }

          var geoinfo = getGeoInfo();

          if(geoinfo && !geoinfo.CountryCode) {
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= 'https://economictimes.indiatimes.com/geoapiet/?cb=et';
            script.onload = function() {
              const geoLoaded = new Event("geoLoaded");
              document.dispatchEvent(geoLoaded);
            };
            document.head.appendChild(script);
          } else {
            const geoLoaded = new Event("geoLoaded");
            document.dispatchEvent(geoLoaded);
          }
        `}
      </Script>
      <Script
        src="https://cdn.cookielaw.org/consent/9c436ed7-68da-4e62-86c3-bc55a27afd97/otSDKStub.js"
        data-domain-script="9c436ed7-68da-4e62-86c3-bc55a27afd97" strategy="lazyOnload"
        onLoad={() => {
          function OptanonWrapper() {}
        }}
      />
      <Script
        src="https://survey.survicate.com/workspaces/0be6ae9845d14a7c8ff08a7a00bd9b21/web_surveys.js"
        strategy="lazyOnload"
        onLoad={() => {
          const surveyLoad = new Event("surveyLoad");
          document.dispatchEvent(surveyLoad);
        }}
      />
      <Script
        id="tag-manager-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GLOBAL_CONFIG.gtmId}');
            const gtmLoaded = new Event('gtmLoaded');
            document.dispatchEvent(gtmLoaded);         
          `,
        }}
      />
      <Script
        src="https://cdn.cookielaw.org/consent/9c436ed7-68da-4e62-86c3-bc55a27afd97/otSDKStub.js"
        data-domain-script="9c436ed7-68da-4e62-86c3-bc55a27afd97"
        onLoad={() => {
          function OptanonWrapper() { }
        }}
      />
      <Script
        id="growthrx-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
                  (function (g, r, o, w, t, h, rx) {
                  g[t] = g[t] || function () {(g[t].q = g[t].q || []).push(arguments)
                  }, g[t].l = 1 * new Date();
                  g[t] = g[t] || {}, h = r.createElement(o), rx = r.getElementsByTagName(o)[0];
                  h.async = 1;h.src = w;rx.parentNode.insertBefore(h, rx)
              })(window, document, 'script', 'https://static.growthrx.in/js/v2/web-sdk.js', 'grx');
                  grx('init', '${(GLOBAL_CONFIG as any)[APP_ENV]?.grxId}');
                  const grxLoaded = new Event('grxLoaded');
                  document.dispatchEvent(grxLoaded);               
            `
        }}
      />
      {!searchParams?.get("opt") && (
        <>
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '${Config.GA.GA_ID}', 'auto');
              const gaLoaded = new Event('gaLoaded');
              document.dispatchEvent(gaLoaded);
              `
            }}
          />
          <Script strategy="lazyOnload" src="https://agi-static.indiatimes.com/cms-common/ibeat.min.js" />
          <Script strategy="lazyOnload" src="https://sb.scorecardresearch.com/beacon.js" />

          <Script strategy="lazyOnload" src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" />
          <Script
            strategy="lazyOnload"
            src="https://tvid.in/sdk/loader.js"
            onLoad={() => {
              const slikeReady = new Event("slikeReady");
              document.dispatchEvent(slikeReady);
            }}
          />

          {!isprimeuser && (
            <>
              <Script
                src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
                strategy="lazyOnload"
                onLoad={() => {
                  const gptLoaded = new Event("gptLoaded");
                  document.dispatchEvent(gptLoaded);
                }}
              />
              {searchParams?.get("skip_ctn") == "1" && (
                <Script src="https://static.clmbtech.com/ad/commons/js/2501/colombia_v2.js" strategy="lazyOnload" />
              )}
            </>
          )}
        </>
      )}
      {page == "primehome" && <Script id="page-redirection" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          try {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
              ${_redirectPage()}
            }
          } catch (e) {
            console.log("Error Redirection -- ", e);
          }
        `
        }}
      />}
    </>
  );
};

export default Scripts;
