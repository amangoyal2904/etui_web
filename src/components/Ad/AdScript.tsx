"use client";
import { loadAssets } from "../../utils/utils";
declare global {
  interface Window {
    googletag: any;
    arrDfpAds: {}[];
    _auds:any;
    _taboola:any;
    TRC:any;
    ga:any;
  }
}
export const loadAndBeyondScript = function(userType = true){
    try{
        if(!userType){
            setTimeout(() => {
            let isExist = document.querySelector("script[src*='https://rtbcdn.andbeyond.media/prod-global-34387.js']");
            if(!isExist){
                loadAssets("https://rtbcdn.andbeyond.media/prod-global-34387.js", "js", "async", "head",  "", {});
            }
            }, 10000);
        }
    }catch(e){
    console.log("loadAndBeyondScript::" +e);
    }

}
export const loadTaboolaScript = function(userType = true){
    if(window.location.href.indexOf('opt=1') !== -1) return;
    try{
        if(!userType){ 
            let tbl_length = document.getElementsByClassName("wdt-taboola") && document.getElementsByClassName("wdt-taboola").length || 0;
            if(tbl_length > 0){
                    const urlParams =window.location.search ? window.location.search : "";
                    const isExist = document.querySelector("script[src*='//cdn.taboola.com/libtrc/timesinternetlimited-economictimes/loader.js']");
                    if(!isExist ){
                    if(typeof urlParams !="undefined" && urlParams.indexOf("skip_taboola=1") == -1 ) {
                        window._taboola = window._taboola || [];
                        loadAssets("https://cdn.taboola.com/libtrc/timesinternetlimited-economictimes/loader.js", "js", "async", "head",  function(){
                            executeTaboolaAd();
                        }, {"id":"tb_loader_script"});
                    }
                }
            }
       }
      }catch(e){}
  }

function executeTaboolaAd(){
    try{
          let tbl_length = document.getElementsByClassName("wdt-taboola") && document.getElementsByClassName("wdt-taboola").length || 0;
          if(tbl_length > 0){
              const currUrl = window.location.href ? window.location.href : "";
              if(typeof window.TRC === 'undefined') return;
              let isTrue = true;
              window._taboola = window._taboola || [];
              let type = "category";
              if(location.pathname == "/"){
                  type="home";
              }else if(location.pathname.indexOf("/videoshow/") == -1){
                  type = "video";
              }
             Array.from(document.getElementsByClassName("wdt-taboola")).forEach(
                function(e) {
                    let _mode = e.getAttribute('data-mode');
                    let _container = e.getAttribute('id');
                    let _target_type = e.getAttribute('data-target_type');
                    let _placement = e.getAttribute('data-placement');
                  
                    if(isTrue) {
                        if(window.ga){ window.ga('send', 'event','taboola_ad_widget', 1, 1, 1,{'nonInteraction': 1});}
                        let _tabObj = {url:currUrl};
                        _tabObj[type] = 'auto';
                        window._taboola.push(_tabObj);
                                                
                    }
                    isTrue = false;
                    window._taboola.push({
                        mode: _mode,
                        container: _container,
                        placement: _placement,
                        target_type: _target_type
                    });
                    e.classList.remove("wdt-taboola");
                }
            );
        }
    }catch(e){console.log("executeTaboolaAd:"+e);}
}


//export default renderDfpAds;
