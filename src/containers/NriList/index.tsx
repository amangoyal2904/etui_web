"use client"
import DfpAds from "components/Ad/DfpAds";
import styles from "./styles.module.scss";
import NriPagenav from "components/NriPagenav";
import NriWidget from 'components/NriWidget'
import React, { useEffect } from 'react'

declare global {
  interface Window {  
      objVc: any;
  }
}

const NriList = (props) => {
  const { seo = {}, version_control, parameters, isprimeuser, tabsCanadaData, tabsUSData } = props;
  let adInfo = props.addata;
  const canadaData = tabsCanadaData?.searchResult?.find(item => item.name === "plist")?.data || [];
  const usData = tabsUSData?.searchResult?.find(item => item.name === "plist")?.data || [];
  const tabs = [
    { tabId: 'Study', plistId: 110522920 },
    { tabId: 'Work', plistId: 110526445 },
    { tabId: 'Immigrate', plistId: 110528760 }
  ];

  const tabsUSA = [
    { tabId: 'Study', plistId: 108463119 },
    { tabId: 'Work', plistId: 108463362 },
    { tabId: 'Green Card', plistId: 108463669 },
    { tabId: 'Citizenship', plistId: 108463751 },
    { tabId: 'Travel', plistId: 108464257 }
  ];
  useEffect(() => {
    if(window && window.objVc){
      window.objVc.dfp = props.addata ? props.addata : {};
    }
  }, []);
  //console.log("@@@@-->NRI",tabsCanadaData, tabsUSData)
  return (
    <>
      <div className="banner">
        <img loading="lazy"  width="994" height="107" alt="top banner" src="https://img.etimg.com/photo/114221839.cms" />
      </div>
      {/* <NriPagenav/> */}
      <section className={styles.nrilistTop}>
        <div className={styles.frist}>
        <NriWidget title="USA" tabsData={tabsUSA} data={usData} />
        <NriWidget title="Canada" tabsData={tabs} data={canadaData} />
        </div>
        <div className={styles.second}>
            <div className="adContainer">
              <DfpAds adInfo={{ key: "atf300", index: 0 }} objVc={adInfo.atf300} />
            </div>
            <div className="adContainer">
              <DfpAds adInfo={{ key: "mtf", index: 0 }} objVc={adInfo.mtf} />
            </div>
        </div>
      </section>
      
    </>
  )
}

export default NriList;
