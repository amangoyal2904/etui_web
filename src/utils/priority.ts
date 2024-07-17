import * as ga from './ga';
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
  window.adDivIds = [];
  //=== destroy all dfp ad slots on route change
  if (typeof window.googletag != "undefined" && window.googletag.apiReady) {      
    window.googletag.destroySlots();
  }
  // ga.pageview(url);
}
