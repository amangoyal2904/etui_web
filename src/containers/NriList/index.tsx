"use client"
import DfpAds from "components/Ad/DfpAds";
import styles from "./styles.module.scss";
import NriWidget from 'components/NriWidget'
import React from 'react'

const NriList = (props) => {
  const { seo = {}, version_control, parameters, isprimeuser } = props;
  console.log('version_control---DAta', version_control)
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


  return (
    <>
      <div className='banner'>
        <img width="994" height="107" alt="top banner" src='https://img.etimg.com/photo/114221839.cms' />
      </div>
      {/* <NriPagenav/> */}
      <section className={styles.nrilistTop}>
        <div className={styles.frist}>
        <NriWidget title="USA" tabsData={tabsUSA} />
        <NriWidget title="Canada" tabsData={tabs} />
        </div>
        <div className={styles.second}>
            <div className="adContainer">
              <DfpAds adInfo={{ key: "atf300", index: 0 }} objVc={version_control} />
            </div>
        </div>
      </section>
      
    </>
  )
}

export default NriList