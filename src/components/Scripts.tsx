'use client';

import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { FC, useEffect } from "react";
import { APP_ENV, updateDimension } from "../utils";
import * as Config from "../utils/common";
import { Interstatial } from "../utils/interstitial";

import GLOBAL_CONFIG from "../network/global_config.json";

interface Props {
  isprimeuser?: number | boolean;
  objVc?: object;
  page?: string;
}

declare global {
  interface Window {
    optCheck: boolean;
    e$: {
      jStorage: {
        set(arg1: string, arg2: any, arg3: Object): any;
        get(arg1: string): any;
        deleteKey(arg1: string);
      };
    };
    objInts: any;
    __APP: any;
    google: {
      accounts: {
        id: {
          disableAutoSelect;
        }
      }
    };
    googletag: any;
    ispopup: any;
    jsso?: {
      getValidLoggedInUser?: any;
      getUserDetails?: any;
      signOutUser?: any;
      v1AddUpdateMobile?: any;
      v1VerifyAlternateMobile?: any;
    };
    isSurveyLoad: any;
    dataLayer: [];
    ssoWidget?: any;
    verifyLoginSuccess?: any;
    objUser: {
      ssoid?: any;
      ticketId?: any;
      email?: any;
      info?: {
        thumbImageUrl: any;
        primaryEmail: string;
        firstName: string;
        ssoid: any;
      };
      isPrime?: any;
      permissions?: any;
      accessibleFeatures?: any;
      primeInfo?: any;
      afterLoginCall?: any;
      loadSsoApi?: any;
    };
    _sva: any;
    tpName?: string;
  }
}

declare var JssoCrosswalk: any;

const Scripts: FC<Props> = ({ isprimeuser, objVc = {} }) => {

  console.log({ APP_ENV });


  const router = useRouter();
  const searchParams = useSearchParams();

  const minifyJS = APP_ENV === "development" ? 0 : 1;

  const jsDomain = "https://etdev8243.indiatimes.com"; //APP_ENV === "development" ? "https://etdev8243.indiatimes.com" : "https://js.etimg.com";



  useEffect(() => {
    // window.optCheck = router.asPath.indexOf("opt=1") != -1;
    //updateDimension();
    Interstatial();
  }, []);

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
              var comps = value.split(',')
              (function(item) { return item.trim(); });                                              
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

          document.addEventListener("geoLoaded", () => {
            if (window.geoinfo && window.geoinfo.CountryCode != "IN") {
                function loadOnetrustSdk() {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
                  script.async = true; 
                  script.charSet = 'UTF-8';
                  script.setAttribute('data-domain-script', '2e8261f2-d127-4191-b6f6-62ba7e124082');
                  document.head.appendChild(script);
                }
                if('requestIdleCallback' in window){
                  window.requestIdleCallback(function(){          
                    loadOnetrustSdk();
                  }, { timeout: 2500 })
                } else {
                  loadOnetrustSdk();
                }
            }
          });
        `}
      </Script>

      {!searchParams?.get('opt') && (
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
                grx('init', window.objVc.growthRxId || 'gc2744074');
                window.customDimension = { ...window["customDimension"], url: window.location.href };
                //grx('track', 'page_view', {url: window.location.href});
                const grxLoaded = new Event('grxLoaded');
                document.dispatchEvent(grxLoaded);                
              `
            }}
          />
          <Script
            id="tag-manager"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${Config.GA.GTM_KEY}`}
          />
          {/* {isTopicPage ? ( */}
          <Script
            id="tag-manager-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${Config.GA.GTM_ID}', { page_path: window.location.pathname });
              `
            }}
          />
          <Script strategy="lazyOnload" src="https://agi-static.indiatimes.com/cms-common/ibeat.min.js" />
          <Script strategy="lazyOnload" src="https://sb.scorecardresearch.com/beacon.js" />

          <Script strategy="lazyOnload" src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" />
          <Script strategy="lazyOnload" src="https://tvid.in/sdk/loader.js" onLoad={() => {
            const slikeReady = new Event("slikeReady");
            document.dispatchEvent(slikeReady);
          }} />

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
              {searchParams?.get("skip_ctn") == '1' && (
                <Script src="https://static.clmbtech.com/ad/commons/js/2501/colombia_v2.js" strategy="lazyOnload" />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Scripts;
