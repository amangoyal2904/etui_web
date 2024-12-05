import { useEffect, useState } from "react";

import API_CONFIG from "../../network/config.json"
import jStorageReact from "utils/jStorage";
import styles from "./styles.module.scss";
import { getCookie } from "utils/utils";

export default function SponserBanner() {
  const [bannersDetail, setBannersDetail]: any = useState({});
  const [hideBanner, setHideBanner] = useState(false);

  const fetchData = (code: string) => {
    if(Object.keys(bannersDetail).length) {
      setBannersDetail(bannersDetail);
    } else if(code) {
      try {
        const url = `${API_CONFIG.SPONSER_BANNER_DATA[window.APP_ENV]}?aqCode=${code}`;
  
        fetch(url)
          .then((response) => response.json())
          .then((data) => {        
            console.log(data, 'Sponser Banner content');
            if(data) {
              setBannersDetail(data);
              setHideBanner(false);
            } else {
              window.saveLogs({
                'type': 'nextjs_sponserbanner_log', 
                'response': data, 
                'userData': window.objUser.info, 
                'origin' : 'fetchBandContent', 
                'msg': code + "- blank response"
              })
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  const onRedirect = (url: string) => {
    window.open(url,'_blank','');
  }

  const hideBannerCB = () => {
    const savedData = jStorageReact.get('sponserBanner') || {};
    savedData['homepage'] = new Date().getDate();
    
    jStorageReact.set('sponserBanner', savedData);
    setHideBanner(true);
  }

  useEffect(() => {
    const ticketId = getCookie("TicketId");
    const userAccountDetails = ticketId && jStorageReact.get(`prime_${ticketId}`);
    const sponsorPartnerCode = userAccountDetails?.subscriptionDetail?.sponsorPartnerCode || '';
    var isUserClosed = jStorageReact.get('sponserBanner')?.['homepage'];
    const currDate = new Date().getDate();
    console.log(sponsorPartnerCode, 'sponsorPartnerCode', userAccountDetails);

    if(sponsorPartnerCode && ((isUserClosed ? isUserClosed !== currDate : true))) {
      fetchData(sponsorPartnerCode);
    } else if(isUserClosed) {
      console.log('User already closed this for today.');
    } else {
      console.log('Not Sponsered Account.');
    }
  }, [])

  return (
    <>
      {!hideBanner && <>
          {bannersDetail?.homeBanner?.sponsorMsg ?  
              <div id={styles.bannerBox} className={styles.sponserBannerContainer}>
                <div className={styles.sponserContainer}>
                  <span>{bannersDetail?.homeBanner?.sponsorText}</span>
                  <span className={styles.sponserTitle}>{bannersDetail?.homeBanner?.sponsorName}</span>
                  <img loading="lazy"  height='76' src='https://economictimes.indiatimes.com/photo/110959062.cms' className={styles.sponserArw} />
                  <img loading="lazy"  height='76' src='https://economictimes.indiatimes.com/photo/110959062.cms' className={styles.sponserArw2} />
                </div>
                <div className={styles.msgContainer}>
                  <img loading="lazy"  className={styles.logo} height='48' src={bannersDetail?.homeBanner?.logo} />
                  <span className={styles.sponserMsg}>{bannersDetail?.homeBanner?.sponsorMsg}</span>
                  <a href={bannersDetail?.homeBanner?.ctaUrl} className={styles.knowCta} target='_blank'>{bannersDetail?.homeBanner?.ctaText}</a>
                </div>
                <div className={styles.closeIconBox}>
                  <img loading="lazy"  className={styles.closeIcon} height='14' src='https://economictimes.indiatimes.com/photo/105255513.cms' onClick={hideBannerCB} />
                </div>
              </div>
            :
            (bannersDetail?.homeBanner?.logo && bannersDetail?.homeBanner.ctaUrl) &&
              <div id='bannerBox' className={`${styles.sponserBannerContainer} ${styles.imgOnlyContainer}`}>
                <img loading="lazy"  onClick={() => onRedirect(bannersDetail?.homeBanner.ctaUrl)} className={styles.imageOnlyBanner} height='76' src={bannersDetail?.homeBanner?.logo} />
                <div className={styles.closeIconBox}>
                  <img loading="lazy"  className={styles.closeIcon} height='14' src='https://economictimes.indiatimes.com/photo/105255513.cms' onClick={hideBannerCB}/>
                </div>
              </div>
          }
        </>
      }
    </>
  )
}
