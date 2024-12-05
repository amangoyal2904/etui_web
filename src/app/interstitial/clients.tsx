"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCookie , setCookieToSpecificTime} from 'utils/utils';
import styles from "./interstitial.module.scss";
import { redirect } from 'next/navigation'



declare global {
  interface Window {
    isprimeuser: number;
    googletag:any;
  }
}


const RenderInterstitialAds = (userType) => {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current =true;
        renderDfpAds(); 
        //setCookieToSpecificTime("interstitial_done", "1",  0, 0);
 
    }           
  
  }, []);
function renderDfpAds(){
  try{
    let intsFequencyCap = 2;
    let fcap: any;
    let googleTag: any;
    let maxTry = 20;
    let counter = 1;
    let adExecuted = 0;
    fcap = getCookie("int_fcapcount") || 0;
    let ref_interval = setInterval(() => {
      googleTag = window.googletag || {};
      if (googleTag.apiReady && adExecuted == 0) {
        console.log("--------RENDERED---------");
        window.googletag = window.googletag || { cmd: [] };
        googleTag.cmd.push(function () {
              googleTag.defineSlot('/7176/Economictimes/ET_Home/ET_Home_Home/ET_HP_Inter_728', [[728, 500], [1320, 570], [1260, 570]], 'div-gpt-ad-1567824605790-0').addService(googleTag.pubads());
              //googleTag.defineSlot('/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_INT', [[304, 350], [300,250], [320, 480], [1, 1]], 'div-gpt-ad-1567824605790-0').addService(googleTag.pubads());
              googleTag.pubads().enableSingleRequest();
              googleTag.enableServices();
          });
        googleTag.cmd.push(function () { googleTag.display('div-gpt-ad-1567824605790-0'); });
        updateCounter();
        clearInterval(ref_interval);
        adExecuted = 1; 
        let new_fcap = parseInt(fcap) + 1;
        if(new_fcap <= intsFequencyCap){
          setCookieToSpecificTime('int_fcapcount', new_fcap, '23:59:59', 0);
        }
        
      }
      counter++;
    }, 100);
    if (counter >= maxTry) {
      clearInterval(ref_interval);
    }
  }catch(e){
    console.log("renderDfpAds:"+e);
  }
}

function updateCounter(){
  const int_duration = 10; 
  let timer : any; 
  //const router = useRouter();
  timer = document.getElementById('timer');
  let pageUrl = document.referrer ? document.referrer : "https://economictimes.indiatimes.com/";
  let current_val = int_duration;
  let ref_timer = setInterval(function(){ 
    current_val = current_val - 1;
    timer.innerHTML = current_val;
    if(current_val == 0 || current_val < 0){
        current_val = int_duration;
        console.log("finish");
        
        window.location.replace(pageUrl);
       // window.location.href = "http://localhost:3002/markets/stocks/news/30-stocks-poised-to-benefit-from-fm-sitharamans-announcements/videoshow/112100874.cms"
        //router.push("/markets/stocks/news/30-stocks-poised-to-benefit-from-fm-sitharamans-announcements/videoshow/112100874.cms");
        clearInterval(ref_timer);
        
    }
}, 1000);

}
function goBack(){
  let pageUrl = document.referrer ? document.referrer : "https://economictimes.indiatimes.com/";
  window.location.replace(pageUrl);

}
      return (
        <>
        <div className={styles.header}>
          <a className={styles.et_logo} href="https://economictimes.indiatimes.com" >
              <img src="https://img.etimg.com/photo/msid-74451948,quality-100/et-logo.jpg" width="330" loading="lazy" />
          </a>
          <a className={styles.pg_link} href="#" onClick={goBack}>
          <div className={styles.tm_text} >
                  Click here to go to economictimes.com
              <div className={styles.load_tm}>Site will load in <span id="timer">10</span> seconds.</div>
          </div>
            </a>
        </div>
        <div className={styles.ad_label}>Advertisement</div>
        <div className={styles.ad_wrap} id='div-gpt-ad-1567824605790-0'></div>
        </>
      )
}

export default RenderInterstitialAds;
