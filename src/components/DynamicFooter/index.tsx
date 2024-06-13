import styles from "./styles.module.scss";
import { FC, useState, useEffect } from "react";
import GreyDivider from "components/GreyDivider";
import { isNoFollow } from "utils";
import SearchBar from "components/SearchBar";

const DynamicFooter: FC<{ dynamicFooterData: any }> = ({ dynamicFooterData }) => {
  const [isExpanded, setIsExpanded] = useState({});
  const hide_footer = false;

  const [isPrime, setIsPrime] = useState(false);

  const intsCallback = () =>  {
    window?.objInts?.afterPermissionCall(() => {
      window.objInts.permissions.includes("subscribed") && setIsPrime(true);
    });
  }

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(intsCallback);
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  const paymentButtonListener = () => {
    const paymentUrl = "";
    window.location.href = paymentUrl;
  };

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
            <div
              onClick={() => paymentButtonListener()}
              data-ga-onclick="Prime Distribution - Web#Footer#Web Footer Prime Click"
            >
              <span className={`${styles.primeLogo} ${styles.commonSprite}`} />
            </div>
          </div>
        )}
        <div className={`${styles.row} ${styles.contentRight}`}>
          <span className={`${styles.subscribe} ${styles.commonSprite}`} />
          <h4>subscribe to our newsletter</h4>
        </div>
      </div>
    );
  };
  const copyrightSection = () => {
    return (
      <div className={styles.row}>
        <div className={styles.copyright}>
          Copyright © {new Date().getFullYear()} Bennett Coleman & Co. All rights reserved. Powered by Indiatimes.
        </div>
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
    <div id="footer" className={`${hide_footer ? styles.hide_footer : ""} ${isPrime ? styles.pink_theme : ""}`}>
      <div className={styles.dynamicContainer}>
        {!isPrime && <GreyDivider />}
        {
          isPrime ? <div className={styles.sbr_wrap}>
            <SearchBar footerSearch={true}/>
            {browseCompany()}  
          </div> : <>
            <SearchBar footerSearch={true}/>
            {browseCompany()}
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
