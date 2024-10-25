import * as ga from './ga';
import { trackingEvent } from './ga';
import { getCookie } from './utils';
declare global {
  interface Window { 
    adDivIds: any;
  }
}
export function InitialJsOnAppLoad(): void {
  console.log("InitialJsOnAppLoad called");
  try {
    window["arrPageAds"] = [];
    window.adDivIds = [];
    // document.addEventListener('gaLoaded', ()=> {
    //   ga.gaObserverInit();
    // });
    ga.growthRxInit();
    // ga.GTMInit();
  } catch (error) {
    console.error("Error in InitialJsOnAppLoad: ", error);
  }
}

export function callJsOnRouteChange(url?): void {
  console.log("callJsOnRouteChange called");
  ga.setVisitInfo();
  window.adDivIds = [];
  //=== destroy all dfp ad slots on route change
  if (typeof window.googletag != "undefined" && window.googletag.apiReady) {      
    window.googletag.destroySlots();
  }
  // ga.pageview(url);
}
export const callJsOnAppLoad = () => {
  try {
      // window.arrPageAds = [];
      // window.adDivIds = [];
      // window.adSplitDivIds = [];
      // window.adKeysMrec = 1;
      // window.pageAdcounter = 0;
      // window.spaNavigation = 0;
      // window.onloadDfpAds=[];
      // configureGA();
      // typeof extCampaign != "undefined" ? extCampaign() : "";
      // typeof loadAndBeyond != "undefined" ? setTimeout(() => {loadAndBeyond()}, 10000) : "";
      // function onGeolocationLoad() {
      //   let optout = univCookies().get("optout")
      //     ? univCookies().get("optout")
      //     : "";
      //   if(!optCheck){
      //     if (gdprCheck() || (gdprCheck("5") && optout == "0")) {
      //       setTimeout(function () {
      //         getAudienceData();
      //       }, 1000);

      //       document.body.classList.remove("gdpr");
      //     } else {
      //       document.body.classList.add("gdpr");
      //     }
      //   }
      // }

      // if (is_geolocation_loaded) {
      //   onGeolocationLoad();
      // } else {
      //   document.addEventListener('geolocationLoaded', function (e) {
      //     onGeolocationLoad();
      //   }, false);
      // }
      window.updateGAObserver = function(newImpressionNodes = [], newClickNodes = []){
        function observeNodesImpression(nodeArray) {
          nodeArray.forEach(function(item){
            const observer = new window.IntersectionObserver(([entry]) => {
              if (!entry.isIntersecting) {
                return
              }
              let el:any = entry.target;
              if (el) {
                var gaData = el.getAttribute('data-ga-impression').split('#');
                gaData[2] = typeof(gaData[2]) != 'undefined' && gaData[2] != ''?( gaData[2] == 'url'? window.location.href: gaData[2]):'';
                var href = el.getAttribute('href');
                if(href) {
                  gaData[2] = gaData[2].replace('href', href);
                }
                gaData[2] = gaData[2].replace('url', window.location.href);
                if(gaData.length > 2){
                  trackingEvent("et_push_event", {
                    event_category:  gaData[0],
                    event_action: gaData[1],
                    event_label: gaData[2],
                  });
                }
              }
              observer.unobserve(item);
            }, {
              root: null,
              threshold: 0.1, // set offset 0.1 means trigger if atleast 10% of element in viewport
            })
            observer.observe(item);
          });
        }
        function observeNodesClick(nodeArray) {
          nodeArray.forEach(item => {
            item.addEventListener('click', event => {
              var trackVal = item.getAttribute('data-ga-onclick').split('#');
              var track2 = trackVal[2];
              track2 = track2 ? track2 : '';
              var href = item.getAttribute('href') || '';
              track2 = track2.indexOf('href') != -1 ? (track2.replace('href', href)) : track2;
              track2 = track2.indexOf('url') != -1 ? (track2.replace('url', window.location.href)) : track2;
              if(trackVal.length > 1) {
                trackingEvent("et_push_event", {
                  event_category:  trackVal[0],
                  event_action: trackVal[1],
                  event_label: track2,
                });
                // ga('send', 'event', trackVal[0], trackVal[1], track2, window.customDimension);
                // // Growth RX Event
                // grxEvent('event', {'event_category': trackVal[0], 'event_action': trackVal[1], 'event_label': track2});
              } else {
                console.log("There is some error in firing onclick ga event")
              }
            })
          })
        }
        try {
          if (newImpressionNodes != null && newImpressionNodes.length > 0) {
            observeNodesImpression(newImpressionNodes);
          } else {
            let nodeList = document.querySelectorAll('[data-ga-impression]');
            nodeList.length > 0 && observeNodesImpression(nodeList);
          }
        } catch (e) {
          console.log("Error in intersection observer in data-ga-impression")
        }
        try {
          if (newClickNodes != null) {
            if (newClickNodes.length > 0) {
              observeNodesClick(newClickNodes);
              return;
            }
            let nodeList = document.querySelectorAll('[data-ga-onclick]');
            nodeList.length > 0 && observeNodesClick(nodeList);
          }
        } catch (e) {
          console.log("error in on click listener data-ga-onclick")
        }
      }
      window.addEventListener("load", () => {
        window.updateGAObserver();
      });
  } catch (error) {
    console.log("error in callJsOnAppLoad", error);
  }
};