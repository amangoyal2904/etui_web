import React, { useEffect, useState } from "react";
import jStorage from "jstorage-react";
import { ET_IMG_DOMAIN } from "../../utils/common";
import styles from "./styles.module.scss";
import { grxEvent } from "utils/ga";
import { currPageType } from "utils";
import { gotoPlanPage } from "utils/utils";

function NudgeContainer({data}) {
    useEffect(() => {
        if(data?.bannerType) {
            grxEvent('event', {'event_category': 'Platform Nudge - Web',  'event_action': 'Banner Viewed - True', 'event_label': data?.bannerType + ' | Banner Location '+ currPageType()});
        }
    }, [data]);

    const onBannerClick = (e) => {
        var isCloseRef = e.target.classList.contains('info_cross');
        if(e.target.classList.contains('adFree')) {
            // customDimension.dimension1 = 'Adfree expired';
            grxEvent('event', {'event_category': 'Subscription Flow ET',  'event_action': 'SYFT | Flow Started', 'event_label': "Adfree expired"}, 1);
        }
        if(!isCloseRef) {
            grxEvent('event', {'event_category': 'Platform Nudge - Web',  'event_action': 'Banner Click', 'event_label': data.bannerType + ' | Banner Location '+ currPageType()});
            gotoPlanPage({url: data?.button_link.replace('https://economictimes.indiatimes.com','') || ""});   
        }
    }

    const onCloseClick = (e) => {
        var frequencyVal = data?.cross_frequency;
        if(frequencyVal) {
            var reActivatedOn = +new Date() + (Number(frequencyVal) * 1000 * 60 * 60 * 24);
            jStorage.set('topNudgeObj', JSON.stringify({reActivatedOn: reActivatedOn}));
        }
        
        grxEvent('event', {'event_category': 'Platform Nudge - Web',  'event_action': 'Banner Dismiss', 'event_label': data.bannerType + ' | Banner Location '+ currPageType()});
        // $("#topnavBlk").css("top", "0");
        // $('.topUserInfoBand').slideUp();
        // $('.topUserInfoBand').remove();
    }

    return (
            <div className={`${styles?.topUserInfoBand} ${data?.banner_type}`} onClick={onBannerClick}>
                {/* style={`background: ${banner_bg}`} */}
                <div className={styles?.info_content}>
                    <span className={styles?.info_icon}>
                        <img height="100%" src={`${ET_IMG_DOMAIN}/photo/msid-${data?.image_msid},quality-100,imgsize-100.cms`} />
                    </span>
                    <div className={styles?.tac}>
                        <p className={styles?.info_text}>{data?.banner_text}</p>
                        {data?.banner_subtext && <p className={styles?.info_subtext}>{data?.banner_subtext}</p>}
                    </div>
                    <a className={styles?.info_cta} data-url={data?.button_link}>{data?.button_text}</a>
                </div>
                {data?.banner_cross === 'true' && <span className={styles?.info_cross} data-frequency={data?.cross_frequency} onClick={onCloseClick} />}
            </div>
    );
}

export default NudgeContainer;
