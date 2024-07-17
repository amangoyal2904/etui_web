"use client";
import { getCookie } from 'utils/utils';

const renderInterstatialAds = (userType = true) => {
    let urlParams =window.location.search ? window.location.search : "";

    let ext_param_check = urlParams.indexOf("utm_medium=display_ext") == -1 ;
    let aff_param_check = urlParams.indexOf("utm_medium=display_aff") == -1 ;
    if(!aff_param_check){
        sessionStorage.setItem("aff_campaign", "1");
    }
    if(ext_param_check && aff_param_check){
    (function () {
    let objVc = window.objVc || {};
    let intsCountryChk = objVc.int_countrychk_web ? parseInt(objVc.int_countrychk_web) : 1;
    let intsAllowedCountry = objVc.int_allowedcountry_web;
    intsAllowedCountry = intsAllowedCountry && intsAllowedCountry.split ? intsAllowedCountry.split(',') : ["1"];
    let intsFequencyCap = objVc.int_fequencycap_web ? parseInt(objVc.int_fequencycap_web) : 3;
    let current = new Date();
    let currHrs = current. getHours();
    if(typeof objVc !="undefined" && objVc.extended_fcap_hrs_web!=0 && currHrs >= objVc.extended_fcap_hrs_web){
        intsFequencyCap = intsFequencyCap + 1;
    }
        let objIntsV2 = {
        setCookieToSpecificTime: function (name, value, time, seconds){
            try{
                let domain = ".indiatimes.com"; 
                let cookiestring ='';
                if(name && value && time){
                    cookiestring=name+"="+ escape(value) + "; expires=" + new Date(new Date().toDateString() + ' ' + time).toUTCString() +'; domain='+domain+'; path=/;';
                }
                if(name && value && seconds){ //temp cookie
                    let exdate = new Date();
                    exdate.setSeconds(exdate.getSeconds() + seconds);
                    let c_value = escape(value) + ((seconds == null) ? "" : "; expires=" + exdate.toUTCString()) + '; domain='+domain+'; path=/;';
                    cookiestring=name+"="+ c_value;
                }
                document.cookie=cookiestring;
            }catch(e){
                
            }
        },
    init: function() {
    var interstitialFlag = objVc.interstitial_web == 1 ? 1 : 0;
    if(window.location.search.indexOf('ints=0') != -1) {
    interstitialFlag = 0;
    } 
    if(interstitialFlag) {
    var tId = getCookie('TicketId'); 
    //var checkPrime = objIntsV2.getOauthJStorage(tId);
    //var permissions = checkPrime && checkPrime.permissions || [],
        //isSubscribed = permissions.indexOf("subscribed") == -1 || permissions.indexOf("etadfree_subscribed") == -1 || permissions.length == 0 || 0;
        let isSubscribed = 0;   
    var ssoid = getCookie('ssoid') || getCookie('MSCSAuthID');
    
    if(!ssoid || ssoid && !isSubscribed) {
        objIntsV2.loadInterstitial();
    }
    } 
    },
    getDeviceType:function () {
    try {
    var ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
    } catch (e) {
    console.log("getDeviceType:" + e);
    }
    },
    loadInterstitial:function(){
    try{
    let chkMdr =/(\?|&)?(from=mdr)/, wl = window.location;
    let ua = navigator && navigator.userAgent && navigator.userAgent.toLowerCase() || '';
    let isBot = (ua.indexOf('bot') != -1);
    let isLighthouse = (ua.indexOf('lighthouse') != -1);
    let isInsights = (ua.indexOf('insights') != -1);
    let isWebPageTest1 = (ua.indexOf('ptst/') != -1);
    let isWebPageTest = (ua.indexOf('ptst_x/') != -1);
    let fcap:any;
        fcap = getCookie("int_fcapcount") || 0;
    let nextInterstitial = getCookie("et_interstitial_active");
    let geolocation = window.geoinfo && window.geoinfo.geolocation || '1';
    let countryCheck = intsAllowedCountry.indexOf(geolocation) ;
        //if(!chkMdr.test(wl.href) && !isBot && !isLighthouse && !isWebPageTest && !nextInterstitial && fcap < intsFequencyCap  && (intsCountryChk == 0 || countryCheck != -1)) {
        if(objIntsV2.getDeviceType()!="mobile" && !isBot && !isLighthouse && !isInsights && !isWebPageTest && !isWebPageTest1 && !nextInterstitial && fcap < intsFequencyCap  && (intsCountryChk == 0 || countryCheck != -1)) {
        objIntsV2.setCookieToSpecificTime("et_interstitial_active",'true', '', 30);
        var new_fcap = parseInt(fcap) + 1;
        if(new_fcap <= intsFequencyCap){
            objIntsV2.setCookieToSpecificTime('int_fcapcount', new_fcap, '23:59:59', 0);
        }
        window.sessionStorage && window.sessionStorage.setItem('intsRef', window.location.href);
        //var now = Date.now();
        //var intsUrl = '/defaultinterstitial.cms' + "?now="+now; // '/configspace/etmain_static/content/defaultinterstitial.html'
        var intsUrl = '/defaultinterstitial.cms'; 
        // window.location.replace("//economictimes.indiatimes.com" + intsUrl);
        window.location.replace(intsUrl);
        return false;
        }
    
    }catch(e){
        //window.errorLogs && errorLogs({href:JSON.stringify(objVc), localName:'interstitial_error', attributes:''}, 1);
    }
    },
        getOauthJStorage: function(tId) {
        try{
        //jStorageData = window.localStorage && localStorage.jStorage ? JSON.parse(localStorage.jStorage) : {};
        //return jStorageData['prime_'+tId];
        }catch(e){}
        }
    }
    objIntsV2.init();
    })();
    }

}
export default renderInterstatialAds;
