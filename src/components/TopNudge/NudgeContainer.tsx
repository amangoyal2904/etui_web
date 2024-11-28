import React, { useEffect, useState } from "react";
import jStorage from "jstorage-react";
import { ET_IMG_DOMAIN } from "../../utils/common";
import styles from "./styles.module.scss";
import { fireTracking, grxEvent } from "utils/ga";
import { currPageType } from "utils";
import { gotoPlanPage } from "utils/utils";

function NudgeContainer({subsContent}) {
    const [nudgeShow, setNudgeShow] = useState(true);
    const [topValue, setTopValue] = useState('0px');
    const {
      et_topnudge_bgColor,
      et_topnudge_crossFrequency,
      et_topnudge_ctaText,
      et_topnudge_header,
      et_topnudge_hideClose,
      et_topnudge_icon,
      et_topnudge_show,
      et_topnudge_subHeader,
      et_topnudge_type,
      et_topnudge_ctaLink
    } = subsContent || {};

    useEffect(() => {
        if(et_topnudge_type) {
            fireTracking("et_push_event", {category:"Platform Nudge - Web", action:"Banner Viewed - True",label:et_topnudge_type + ' | Banner Location '+ currPageType()})
        }
    }, [et_topnudge_type]);

    const onBannerClick = (e) => {
        var isCloseRef = e.target.classList.contains('info_cross');
        if(e.target.classList.contains('adFree')) {
            // customDimension.dimension1 = 'Adfree expired';
            fireTracking("et_push_event", {category:"Subscription Flow ET'", action:"SYFT | Flow Started",label:"Adfree expired"});
        }
        if(!isCloseRef) {
            fireTracking("et_push_event", {category:"Platform Nudge - Web", action:"Banner Click",label:et_topnudge_type + ' | Banner Location '+ currPageType()})
            gotoPlanPage({url: et_topnudge_ctaLink});   
        }
    }

    const onCloseClick = (e) => {
        var frequencyVal =  et_topnudge_crossFrequency;
        if(frequencyVal) {
            var reActivatedOn = +new Date() + (Number(frequencyVal) * 1000 * 60 * 60 * 24);
            jStorage.set('topNudgeObj', JSON.stringify({reActivatedOn: reActivatedOn}));
        }
        fireTracking("et_push_event", {category:"Platform Nudge - Web", action:"Banner Dismiss",label:et_topnudge_type + ' | Banner Location '+ currPageType()})
        setNudgeShow(false);
    }

    useEffect(() => {
        const userInfoBand = document.querySelector<HTMLElement>('#topUserInfoBand');
        const topnavBlk = document.getElementById('topnavBlk');

        if (topnavBlk) {
            const height = userInfoBand?.offsetHeight || 78; // Get the height of the topUserInfoBand
            const newHeight = userInfoBand ? `${height}px` : '0px'; // Determine the new height
            setTopValue(newHeight); // Set top value based on nudgeShow
            topnavBlk.style.top = newHeight; // Apply the style directly
        }
    }, [nudgeShow, et_topnudge_show]);

    return (
        <>
            {nudgeShow && et_topnudge_show && <div id="topUserInfoBand" className={`${styles?.topUserInfoBand} ${et_topnudge_type}`} data-ga-impression={`Assisted_Buying#Impression#Soft Nudge - Top Banner`} onClick={onBannerClick}>
                {/* style={`background: ${banner_bg}`} */}
                <div className={styles?.info_content}>
                    <span className={styles?.info_icon}>
                        <img height="100%" src={et_topnudge_icon} />
                    </span>
                    <div className={styles?.tac}>
                        <p className={styles?.info_text}>{et_topnudge_header}</p>
                        {et_topnudge_subHeader && <p className={styles?.info_subtext}>{et_topnudge_subHeader}</p>}
                    </div>
                    <a className={styles?.info_cta} data-url={et_topnudge_ctaLink}>{et_topnudge_ctaText}</a>
                </div>
                {et_topnudge_crossFrequency && <span className={styles?.info_cross} data-frequency={et_topnudge_crossFrequency} onClick={(e) => { e.stopPropagation(); onCloseClick(e); }}  />}
            </div>}
        </>
    );
}

export default NudgeContainer;
