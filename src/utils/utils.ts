import os from "os";
const serverHost = os.hostname() || "";
import Router from 'next/router'

declare global {
    interface Window { 
      geolocation: any;
      geoinfo: any;
    }
}

export const setCookieToSpecificTime = (name, value, time, seconds) =>{
      try{
          var domain = document.domain; 
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
           console.log('setCookieToSpecificTime', e);
      }
};
export const getCookie = (name) =>{
   try{
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
     }catch(e){
        console.log('getCookie', e);   
    }
};
// Check if GDPR policy allowed for current location
export const allowGDPR = ()=>{
  try{
   var flag = false, ginfo = window["geoinfo"] || {};
    if(window.geolocation && window.geolocation != 5 && (window.geolocation != 2 || ginfo.region_code != 'CA')) {flag = true;}
    return flag;
    }catch(e){
     console.log('allowGDPR', e);        
  }
};
export const pageType = pathurl => {
  if (pathurl == "/" || pathurl == "/index.html") {
    return "home";
  } else if (pathurl.indexOf("primearticleshow") != -1) {
    return "primearticle";
  } else if (pathurl.indexOf("articleshow") != -1) {
    return "articleshow";
  } else if (pathurl.indexOf("primearticlelist") != -1  || /prime\/\w/.test(pathurl)) {
    return "primearticlelist";
  } else if (pathurl == "/prime") {
    return "primehome";
  } else if (pathurl.indexOf("/et-tech") != -1) {
    return "techhome";
  }else if (pathurl.indexOf("/videoshow/") != -1) {
      return "videoshow";
  } else if (pathurl.indexOf("/topic/") != -1) {
    return "topic";
  } else {
    return "articlelist";
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
//Email validate
export const validateEmail = () =>{
   try{
      var b = 0,
          c = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
          if (a && a.indexOf(",") != -1) {
            for (var a = a.split(","), d = 0, d = 0; d < a.length; d += 1)
              c.test(a[d]) && (b += 1);
            return d == b ? !0 : !1
          } else{
            return c.test(a) ? !0 : !1
          }
   }catch(e){
     console.log('validateEmail', e);        
  }
};
// Date format
export const appendZero = (num) => (num >= 0 && num < 10) ? '0' + num : num;
export const dateFormat = (dt, format = '%Y-%M-%d') => {
  let objD:any = (dt instanceof Date) ? dt : new Date(dt);
  let shortMonthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let fullMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let shortDaysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  let fullDaysName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  let  newDate = '';
  if(objD != 'Invalid Date') {
    let hour = objD.getHours();
    let dList = {
      '%ss': objD.getMilliseconds(),
      '%Y': objD.getFullYear(),
      '%y': objD.getFullYear().toString().substr(-2),
      '%MMM': shortMonthName[objD.getMonth()],
      '%MM': fullMonthName[objD.getMonth()],
      '%M': objD.getMonth() + 1,
      '%d': objD.getDate(),
      '%h': (hour <= 12 ? hour : (hour - 12)),
      '%H': hour,
      '%m': objD.getMinutes(),
      '%s': objD.getSeconds(),
      '%DD': fullDaysName[objD.getDay() + 1],
      '%D': shortDaysName[objD.getDay() + 1],
      '%p': (objD.getHours() > 11 ? 'PM' : 'AM')
    };
    newDate = format;

    for(let key in dList) {
      let regEx = new RegExp(key, 'g');
      newDate = newDate.replace(regEx, appendZero(dList[key]));
    }
  }
  return newDate;
};
export const processEnv = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase().trim() || "production";
export const queryString = (params) => Object.keys(params)?.map(key => key + '=' + params[key]).join('&');

export const isProductionEnv = () => {
  const isProd = process.env.NODE_ENV.trim() === "production";
  return isProd;
};

export const isDevEnv = () => {
  const isDev = process.env.NODE_ENV.trim() === "development";
  return isDev;
};

export const isVisible = elm => {
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

export const mgidGeoCheck = (pos) =>{
  try{
        let geoinfo = window.geoinfo;
        if(pos == "mid"){
            if(typeof geoinfo !="undefined" && ((geoinfo.CountryCode.toUpperCase() =="AU" && geoinfo.geolocation == "6") || (geoinfo.CountryCode.toUpperCase() =="CA" && geoinfo.geolocation == "2") || (geoinfo.CountryCode.toUpperCase() =="US" && geoinfo.geolocation == "2") || (geoinfo.CountryCode.toUpperCase() =="GB" && geoinfo.geolocation == "5") || (geoinfo.CountryCode.toUpperCase() =="AE" && geoinfo.geolocation == "3") || (geoinfo.CountryCode.toUpperCase() =="SA" && geoinfo.geolocation == "3") || (geoinfo.CountryCode.toUpperCase() =="QA" && geoinfo.geolocation == "3") || (geoinfo.CountryCode.toUpperCase() =="OM" && geoinfo.geolocation == "3") || (geoinfo.CountryCode.toUpperCase() =="KW" && geoinfo.geolocation == "3") || (geoinfo.CountryCode.toUpperCase() =="BH" && geoinfo.geolocation == "3"))){
              return true;   
            }else{
              return false;
            }
        }else if(pos == "eoa"){
            if(typeof geoinfo !="undefined" && ((geoinfo.CountryCode.toUpperCase() =="AU" && geoinfo.geolocation == "6") || (geoinfo.CountryCode.toUpperCase() =="CA" && geoinfo.geolocation == "2"))){
              return true;   
            }else{
              return false;
            }
        }
      }catch(e){}
      
  };

export const removeBackSlash = val => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};

export const loadAssets = (filename, fileType, attrType, position, cb, attr?, attrVal?, objAttr?) => { 
  try { 
    if(filename){ 
      let fileRef: any = '';
      if (fileType == "js") { 
        fileRef = document.createElement('script'); 
        fileRef.setAttribute("type", "text/javascript"); 
        fileRef.setAttribute("src", filename); 
        if (attrType) { 
          fileRef.setAttribute(attrType, attrType); 
        } 
        if (attr && attrVal) { 
          fileRef.setAttribute(attr, attrVal); 
        } if (typeof objAttr == "undefined") { objAttr = {}; } if (Object.keys(objAttr).length > 0 && objAttr.constructor === Object) { for (var key in objAttr) { fileRef.setAttribute(key, objAttr[key]); } } if (typeof cb == "function") { fileRef.addEventListener("load", cb); } } else if (fileType == "css") { fileRef = document.createElement("link"); fileRef.setAttribute("rel", "stylesheet"); fileRef.setAttribute("type", "text/css"); fileRef.setAttribute("href", filename) } if (typeof fileRef != "undefined") { var positionToAppend = position ? position : "head"; document.getElementsByTagName(positionToAppend)[0].appendChild(fileRef); } } } catch (e) { console.log("loadAssets:", e) } }


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

export const ImageClickHandler = (url:string)=>{
  let _url = url;
  let checkVideoUrl = _url.indexOf('/videoshow/') !== -1 && _url.indexOf('economictimes.indiatimes.com') !== -1
  if(checkVideoUrl){
    let videoShowurl = _url.split("https://economictimes.indiatimes.com").pop()
    return Router.push(videoShowurl)
  }
  return window.location.href = url
}


export const encodeQueryData = data => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

export const getApiUrl = (api, param, index, apidomain = '') => {
  let env = '';
  if (typeof(window) == "undefined") {
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
  return serverHost.indexOf("3632") > -1
          || serverHost.indexOf("3633") > -1
          || serverHost.indexOf("13120") > -1
          || serverHost.indexOf("35115") > -1;
}

export const urlValidation = (url:string) =>{
  let _url = url;
  let checkVideoUrl = _url.indexOf('/videoshow/') !== -1 && _url.indexOf('economictimes.indiatimes.com') !== -1
  if(checkVideoUrl){
    return _url.split("https://economictimes.indiatimes.com").pop()
  }
  return url;
}

let output = {urlValidation,ImageClickHandler, socialUrl,removeBackSlash,isVisible, isDevEnv, isProductionEnv, queryString, processEnv, dateFormat, appendZero, validateEmail, getParameterByName, allowGDPR, getCookie, setCookieToSpecificTime, pageType, mgidGeoCheck}

export default output
