import styles from "./styles.module.scss";
import { FC, useState, useEffect } from "react";
import GreyDivider from "components/GreyDivider";
import { isNoFollow } from "utils";
import SearchBar from "components/SearchBar";
import { useStateContext } from "../../store/StateContext";
import Global_Config from "../../network/global_config.json";

const DynamicFooter: FC<{ dynamicFooterData: any, page: any, APP_ENV: string }> = ({ dynamicFooterData, page, APP_ENV }) => {
  const [isExpanded, setIsExpanded] = useState({});
  const [isCCPA, setIsCCPA] = useState(false);
  const hide_footer = false;

  const { state, dispatch } = useStateContext();
  const { isPrime, isPink } = state.login;

  const paymentButtonListener = () => {
    const paymentUrl = "";
    window.location.href = paymentUrl;
  };

  const handleCCPA = () => {
    try{
      const checkCCPA =
        typeof window != "undefined" && 
        window.geoinfo &&
        window.geoinfo.geolocation == "2" &&
        window.geoinfo.region_code == "CA";
      setIsCCPA(checkCCPA);
    }catch(err){
      console.log('error in handleCCPA', err);
    }
  };

  useEffect(() => {
    if (typeof window != "undefined" && window.geoinfo && window.geoinfo.geolocation) {
      handleCCPA();
    } else {
      document.addEventListener("geoLoaded", handleCCPA);
    }
    return () => {
      document.removeEventListener("geoLoaded", handleCCPA);
    };
  }, []);

  const downloadSection = (isSubscribed = false) => {
    return (
      <div className={styles.downloadSection} key="downloadSec">
        <div className={`${styles.row} ${styles.contentLeft}`}>
          <p>follow us on</p>
          <div className={styles.shareIcons}>
            <a
              href="https://www.facebook.com/EconomicTimes"
              title="Facebook"
              target="_blank"
              data-ga-onclick="PWA Footer Follow us icon Click#Facebook - Click#Facebook-href"
              rel="noopener nofollow noreferrer"
              aria-label="Facebook"
              className={`${styles.fbShare} ${styles.commonSprite}`}
            ></a>
            <a
              href="https://twitter.com/economictimes"
              target="_blank"
              title="Twitter"
              data-ga-onclick="PWA Footer Follow us icon Click#Twitter - Click#Twitter-href"
              rel="noopener nofollow noreferrer"
              aria-label="Twitter"
              className={`${styles.inShare} ${styles.commonSprite}`}
            ></a>
            <a
              href="https://www.linkedin.com/company/economictimes"
              target="_blank"
              title="Linkedin"
              data-ga-onclick="PWA Footer Follow us icon Click#Linkedin - Click#Linkedin-href"
              rel="noopener nofollow noreferrer"
              aria-label="Linkedin"
              className={`${styles.twShare} ${styles.commonSprite}`}
            ></a>
            <a
              href="https://economictimes.indiatimes.com/rss.cms"
              target="_blank"
              title="RSS"
              data-ga-onclick="Rss - Click#Twitter-href"
              rel="noopener nofollow noreferrer"
              aria-label="RSS"
              className={`${styles.rss} ${styles.commonSprite}`}
            ></a>
          </div>
        </div>
        <div className={`${styles.row} ${styles.contentLeft}`}>
          <p>Download ET App:</p>
          <a
            className={styles.appstore_parent}
            href="https://play.google.com/store/apps/details?id=com.et.reader.activities"
            target="_blank"
            rel="noopener nofollow noreferrer"
            aria-label="Play Store"
            data-ga-onclick="Footer Element Clicks#Download ET App#href"
          >
            <span className={`${styles.appstoredownload} ${styles.commonSprite}`} />
          </a>
          <a
            href="http://itunes.apple.com/us/app/the-economic-times/id474766725?ls=1&amp;t=8apple.com/us"
            target="_blank"
            rel="noopener nofollow noreferrer"
            aria-label="App Store"
            data-ga-onclick="Footer Element Clicks#Download ET App#href"
          >
            <span className={`${styles.gpdownload} ${styles.commonSprite}`} />
          </a>
        </div>

        {!isSubscribed && (
          <div className={`${styles.row} ${styles.contentRight}`}>
            <a
              href={Global_Config[APP_ENV]["Prime_Page"]}
              data-ga-onclick="Prime Distribution - Web#Footer#Web Footer Prime Click"
            >
              <span className={`${styles.primeLogo} ${styles.commonSprite}`} />
            </a>
          </div>
        )}
        <div className={`${styles.row} ${styles.contentRight}`}>
          <a href={`${Global_Config[APP_ENV]["ET_WEB_URL"]}/subscription`}>
            <span className={`${styles.subscribe} ${styles.commonSprite}`} />
            <h4>subscribe to our newsletter</h4>
          </a>
        </div>
      </div>
    );
  };
  const copyrightSection = () => {
    return (
      <div className={styles.row}>
        <div className={`copyright ${styles.copyright}`}>
          Copyright © {new Date().getFullYear()} Bennett Coleman & Co. All rights reserved. Powered by Indiatimes.
          {isCCPA && (
            <button id="ot-sdk-btn" className="ot-sdk-show-settings"></button>
          )}
        </div>
        <style jsx>{`
          .copyright {
            #ot-sdk-btn {
              &.ot-sdk-show-settings {
                border: 0;
                color: #9b9b9b;
                text-decoration: underline;
                font-size: 14px;
                line-height: 1;
                padding: 0 0 0 10px;
                &:hover {
                  background: 0;
                }
              }
            }
          }
        `}</style>
      </div>
    )
  }
  const onMoreClick = (item) => {
    setIsExpanded(prevState => {
      return {
        ...prevState,
        [item]: !isExpanded[item]
      }
    });
  }
  const Interlinking = () => {
    let interLinkingData = dynamicFooterData?.widgets || [];
    const interLinkingList = interLinkingData?.map((i, index) => (
      interLinkingData[index].title != "Browse Company" ?
      <div data-attr="interlinking" className={`${styles.category} ${isExpanded[index] ? styles.visible :""}`} key={`inkl_${index}`}>
        {interLinkingData[index]["data"] && Array.isArray(interLinkingData[index]["data"]) && (
            <>
              <p>{interLinkingData[index].title}</p>
              <div className={`${styles.show_hide_interlinking} ${isExpanded[index] ? styles.moreStyle :""}`} onClick={()=>onMoreClick(index)}>{isExpanded[index] ? 'Less' : 'More'}</div>
              <div className={styles.content}>
                {interLinkingData[index]["data"]?.map((item, key) => {
                  const noFollow = isNoFollow(item.url) && item.noFollow != "false" ? { rel: "nofollow" } : {};
                  return (
                    <a key={`${key}_${index}`} href={item.url} {...noFollow} className={styles.ellipsis} data-ga-onclick={`Web Footer Link Click#${item.title}#${interLinkingData[index].title}-${item.url}`}>
                      {item.title}
                    </a>
                  );
                })}
              </div>
            </>
        )}
      </div>: ""
    ));

    return <div className={styles.dynamicCategories}>{interLinkingList}</div>;
  };

   const browseCompany = () =>{
     const browseCompData = dynamicFooterData?.widgets?.filter((data) => data.title == "Browse Company");
     if (browseCompData && browseCompData[0] && browseCompData[0].data && browseCompData[0].data.length) {
       return (
         <div className={styles.browseCompany}>
           <div className={styles.browse}>
             <div className={styles.browseTitle}>
               <span>Browse</span>
               <span className={styles.comp}>Companies:</span>
             </div>
             <div className={styles.compList}>
               <div>
                 {
                   browseCompData[0]?.data?.map((comp, i) => {
                     return (
                       <a href={comp.url} key={`comp_${i}`}> {comp.title}</a>
                     )
                   })
                 }
               </div>
               <div>
                 {
                   browseCompData[0]?.Numdata?.map((comp, i) => {
                     return (
                       <a href={comp.url} key={`comp1_${i}`}> {comp.title}</a>
                     )
                   })
                 }
               </div>
             </div>
           </div>
         </div>
       )
     }
   }
  return (
    <div id="footer" className={`${hide_footer ? styles.hide_footer : ""} ${isPink ? styles.pink_theme : ""}`}>
      <div className={styles.dynamicContainer}>
        {!isPink && <GreyDivider />}
        {
          isPink ? <div className={styles.sbr_wrap}>
            <SearchBar footerSearch={true}/>
            {page == "home" && browseCompany()}  
          </div> : <>
            <SearchBar footerSearch={true}/>
            {page == "home" && browseCompany()}
          </>
        }
        {Interlinking()}
        {downloadSection()}
        {copyrightSection()}
      </div>
    </div>

  );
};

export default DynamicFooter;
