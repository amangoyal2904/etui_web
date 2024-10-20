/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
import React from 'react' ;
import { ePaper_URL } from '../../utils/common';
import styles from "./styles.module.scss";
import LOGO from "./logo.json";
import Login from "../Login";
import { useStateContext } from "../../store/StateContext";
import { dateFormat } from "../../utils/utils";

const EditionTimeStamp = ({ APP_ENV }) => {
  const currentDate = new Date();
  const siteDateTime = dateFormat(currentDate, "%d %MM, %Y, %h:%m %p IST");

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
        <span> | </span>
        <span>{siteDateTime}</span>
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
    case "primehome":  
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
  const {subsec1} = subsecnames;

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
  const { state } = useStateContext();
  const { isPink } = state.login;

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
        <EditionTimeStamp APP_ENV={props.APP_ENV} />
        <Login headertext={headertext}/>
      </div>
    </div>
  )
}

export default HeaderLogo
