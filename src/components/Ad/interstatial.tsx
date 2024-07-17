"use client";
import { getCookie } from 'utils/utils';

declare global {
  interface Window {
    googletag: any;
    arrDfpAds: {}[];
  }
}
const int_duration =10;
const setCookieToSpecificTime = function(name, value, time, seconds){
    try{
        var domain = ".indiatimes.com"; 
        var cookiestring ='';
        if(name && value && time){
            cookiestring=name+"="+ escape(value) + "; expires=" + new Date(new Date().toDateString() + ' ' + time).toUTCString() +'; domain='+domain+'; path=/;';
        }
        if(name && value && seconds){ //temp cookie
            var exdate = new Date();
            exdate.setSeconds(exdate.getSeconds() + seconds);
            var c_value = escape(value) + ((seconds == null) ? "" : "; expires=" + exdate.toUTCString()) + '; domain='+domain+'; path=/;';
            cookiestring=name+"="+ c_value;
        }
        document.cookie=cookiestring;
    }catch(e){
        
    }
    
}
const renderInterstatialAds = (userType = true) => {
  try {
    var urlParams =window.location.search ? window.location.search : "";
                let aff_param_check = urlParams.indexOf("utm_medium=display_aff") == -1 ;
                let objVc = window.objVc || {};
                let interstitialFlag = objVc.interstitial_web == 1 ? 1 : 0;
                if(window.location.search.indexOf('ints=0') != -1) {
                    interstitialFlag = 0;
                }
                if(interstitialFlag && aff_param_check) {
                        let tId = getCookie('TicketId'); 
                        let checkPrime = [];
                        let permissions = checkPrime && checkPrime.permissions || [],
                            isSubscribed = permissions.indexOf("subscribed") == -1 || permissions.indexOf("etadfree_subscribed") == -1 || permissions.length == 0 || 0;
                        var ssoid = getCookie('ssoid') || getCookie('MSCSAuthID');
                if(!ssoid || ssoid && !isSubscribed) {  
            		let intsCountryChk = objVc.int_countrychk_web ? parseInt(objVc.int_countrychk_web) : 1;
            		let intsAllowedCountry = objVc.int_allowedcountry_web;
            		intsAllowedCountry = intsAllowedCountry && intsAllowedCountry.split ? intsAllowedCountry.split(',') : ["1"];
            		let intsFequencyCap = objVc.int_fequencycap_web ? parseInt(objVc.int_fequencycap_web) : 3;
            		let current = new Date();
                    let currHrs = current. getHours();
                    if(typeof objVc !="undefined" && objVc.extended_fcap_hrs_web!=0 && currHrs >= objVc.extended_fcap_hrs_web){
                        intsFequencyCap = intsFequencyCap + 1;
                    }
                    let chkMdr =/(\?|&)?(from=mdr)/, wl = window.location;
                    let ua = navigator && navigator.userAgent && navigator.userAgent.toLowerCase() || '',
                    isBot = (ua.indexOf('bot') != -1),
                    isLighthouse = (ua.indexOf('lighthouse') != -1),
                    isSpeedInsight = (ua.indexOf('speed insights') != -1),
                    isWebPageTest = (ua.indexOf('ptst_x/') != -1);
                    let fcap = getCookie("int_fcapcount") || 0;
                    let nextInterstitial = getCookie("et_interstitial_active");
                    let geolocation = window.geoinfo && window.geoinfo.geolocation || '1';
                    let countryCheck = intsAllowedCountry.indexOf(geolocation) ;
                    //  if(!chkMdr.test(wl.href) && !isBot && !isLighthouse && !isWebPageTest && !isSpeedInsight && !nextInterstitial && fcap < intsFequencyCap  && (intsCountryChk == 0 || countryCheck != -1)) {
                    //     setCookieToSpecificTime &&
                    //     setCookieToSpecificTime("et_interstitial_active",'true', '', 40);
                    //     let new_fcap = parseInt(fcap) + 1;
                    //     if(new_fcap <= intsFequencyCap){
                    //         setCookieToSpecificTime &&
                    //         setCookieToSpecificTime('int_fcapcount', new_fcap, '23:59:59', 0);
                    //     }
                    //       let timer = document.getElementById('timer')
                    //      if(timer){
                    //          timer.innerHTML = int_duration;
                    //          objAd.intsStartTimer();
                    //      }
                    //       document.getElementById("interstatial_layer")?.style.display = 'block';
                    //       document.getElementById("#interstatial_layer").on("click", function(){
                	// 		 objAd.intsCloseAd();
                	// 	  });
                    //       //refreshCounter();
                    //       ga('send', 'pageview');
                    //      var wlh = window.location.href;
                         
            		// 	//return false;
                    //  }
                }     
             } 
  } catch (e) {
    console.log("renderInterstatialAds:" + e);
  }
};

export default renderInterstatialAds;
