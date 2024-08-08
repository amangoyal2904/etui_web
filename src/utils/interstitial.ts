import { getCookie , setCookieToSpecificTime} from 'utils/utils';

export const Interstatial = ()=>{
    debugger;
    console.log("HERE I AM.");
    let fcap: any;
    let intsFequencyCap = 2;
    fcap = getCookie("int_fcapcount") || 0;
    fcap = parseInt(fcap);
    let isIntActive = getCookie('et_interstitial_active'); 
    console.log(isIntActive);
    if(isIntActive!="true" && fcap < intsFequencyCap){
        var intsUrl = '/interstitial'; 
        setCookieToSpecificTime("et_interstitial_active",'true', '', 30);
    // setCookieToSpecificTime("interstitial_done", "1",  '23:59:59', 0);
        
        window.location.replace(intsUrl);
    }
} 

// function setCookieToSpecificTime (name, value, time, seconds){
//     try{
//         //var domain = ".indiatimes.com"; 
//         var domain = "localhost"; 
//         var cookiestring ='';
//         if(name && value && time){
//             cookiestring=name+"="+ value + "; expires=" + new Date(new Date().toDateString() + ' ' + time).toUTCString() +'; domain='+domain+'; path=/;';
//         }
//         if(name && value && seconds){ //temp cookie
//             var exdate = new Date();
//             exdate.setSeconds(exdate.getSeconds() + seconds);
//             var c_value = value + ((seconds == null) ? "" : "; expires=" + exdate.toUTCString()) + '; domain='+domain+'; path=/;';
//             cookiestring=name+"="+ c_value;
//         }
//         document.cookie=cookiestring;
//     }catch(e){
        
//     }
// }