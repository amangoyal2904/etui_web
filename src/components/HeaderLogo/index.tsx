/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react' ;
import {dateFormat} from '../../utils/utils';
import { APP_ENV } from 'utils';
import { ePaper_URL } from '../../utils/common';
import styles from "./styles.module.scss";
import LOGO from "./logo.json";
import Login from "../Login";
import { useStateContext } from "../../store/StateContext";
// import { useSelector } from 'react-redux';

const EditionTimeStamp = () => {
  const currentDate = new Date(),
  siteTime = dateFormat(currentDate, '%d %MM, %Y, %h:%m %p IST');

  return (
    <>
      <div className={styles.edition_wrap}>
        <div className={styles.editionList}>
          <span role="heading">English Edition</span>
          <span className={styles.edMenu}>
            <span className={styles.ed}>English Edition</span>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://hindi.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">हिन्दी</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://gujarati.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">ગુજરાતી</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://marathi.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">मराठी</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://bengali.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">বাংলা</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://kannada.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">ಕನ್ನಡ</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://malayalam.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">മലയാളം</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://tamil.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">தமிழ்</a>
              <a className={styles.edHin} target="_blank" rel="noopener dofollow noreferrer" href="https://telugu.economictimes.com/?utm_source=logo&utm_medium=referral&utm_campaign=et">తెలుగు</a>
          </span>
        </div>
        {/* <div><span> | </span>{siteTime}</div> */}
        <span> | </span>
        <div>
          <a rel="nofollow" data-ga-onclick="Web Top Nav Epaper link#Click on Epaper link#url" className={`dib ${styles.epaper}`} href={`${ePaper_URL[APP_ENV]}/timesepaper/publication-the-economic-times,city-delhi.cms`} target="_blank">Today's Paper</a>
        </div>
      </div>
    </>
  )
}

const getETLogo = (page) => {
  switch(page){
    case "home":
      return {etLogo: LOGO.ethomelogo, etLogoWidth: 464, etLogoHeight: 51}
    case "articleshow":
    case "primearticleshow": 
      return {etLogo: LOGO.etarticleshowlogo, etLogoWidth: 274, etLogoHeight: 26}
    default:
      return {etLogo: LOGO.etlogo, etLogoWidth: 407, etLogoHeight: 39}
  }
}

const ETSecLogo = (props) => {
  const {subsecnames, sectiondetail} = props;
  const {subsec1, subsec2, subsec3, subsec4, subsec5} = subsecnames;
   
  // console.log(LOGO[subsec1])
  /*if(subsec2 == 1052732854){
    return {title: "Politics", href: "/news/politics-nation"}
  }else if(subsec1 == 1977021501 || subsec2 == 58105720){
    return {title: "ET Markets", href: "/markets", img: LOGO.martketLogo, width:"163", height:"37"}
  }else if(subsec1 == 13357270){
    return {title: "ET Tech", href: "/tech", img: LOGO.techLogo, width:"85"}
  }else if(subsec1 == 5575607){
    return {title: "Small Biz", href: "/small-biz", img: LOGO.riseLogo, width:"87"}
  }else if(subsec1 == 837555174 || subsec2 == 58105710){
    return {title: "Wealth", href: "/personal-finance", img: LOGO.riseLogo, width:"176"}
  }else if(subsec1 == 1466318837){
    return {title: "Panache", href: "/panache", img: LOGO.panacheLogo, width:"173"}
  }else if(subsec2 == 48897386 && subsec3 == 0){
    return {title: "ET TV", href: "/news/et-tv/videolist/48897386.cms", img: LOGO.techLogo, width:"173"}
  }else if(subsec1 == 359241701){
    return {title: "Mutual Funds", href: "/mutual-funds", img: LOGO.mfLogo, width:"230", height:"29"}
  }else if(subsec1 == 60000487){
    return {title: "ET Prime", href: "/prime", img: LOGO.etPrimeLogo, width:"140"}
  }else if(subsec1 == 58494366){
    return {title: "Hindi", href: "/hindi"}
  }else if(subsec1 != ""){
    return {title: subsec1, href: "/hindi"}
  }*/
  return <>
    {
      LOGO[subsec1]?.im 
      ?
      <span>
        <img src={LOGO[subsec1].im} width={LOGO[subsec1].width} height={LOGO[subsec1].height || "auto"} />
      </span>
      : <span className={styles.sec_name}>{sectiondetail?.title}</span>
    }
    </>
}

const HeaderLogo = (props) => {
  const {page, subsecnames, sectiondetail, headertext} = props;
  const {etLogo, etLogoWidth, etLogoHeight} = getETLogo(page);
  const { state, dispatch } = useStateContext();
  const { isPrime, isPink } = state.login;

  // const loginState = useSelector((state: any) => state.login);
  // const isPrimeUserCls = loginState.login && loginState.isprimeuser ? 'prime_user' : '';

  // console.log(sectiondetail)

  return (
    <div className={`${styles.logo_part} ${isPink ? styles.pink_theme : ""}`}>
      <div id="headerWrap" className={`${styles.headerWrap}`}>
        <a title="The Economic Times" href="/">
          <img src={etLogo} width={etLogoWidth} height={etLogoHeight} className="dib" alt="The Economic Times"/>
        </a>
        {page != "home" && 
        <a className={`${styles.sec_logo} ${styles.head_name}`} href={sectiondetail?.url} title={sectiondetail?.title}>
          <ETSecLogo subsecnames={subsecnames} sectiondetail={sectiondetail} />
        </a>}
        <EditionTimeStamp />
        <Login headertext={headertext}/>
      </div>
    </div>
  )
}

export default HeaderLogo
