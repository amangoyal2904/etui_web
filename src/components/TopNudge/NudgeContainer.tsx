import React from "react";

import { ET_IMG_DOMAIN } from "../../utils/common";
import styles from "./styles.module.scss";

function NudgeContainer(props) {
    const { 
        banner_type = "adFree",
        banner_bg = "#f7653c",
        image_msid = "99612531",
        banner_text = "You're missing out on all member-benefits.",
        button_link = "Renew now and save 20% on ETPrime 1 year plan.",
        button_text = "Subscribe Now",
        banner_subtext = "Act Now and continue enjoying premium benefits!",
        banner_cross = true,
        cross_frequency = 7 
    } = props;

    return (
        <div className={`${styles?.topUserInfoBand} ${banner_type}`}>
            {/* style={`background: ${banner_bg}`} */}
    		<div className={styles?.info_content}>
    	        <span className={styles?.info_icon}>
    	            <img height="100%" src={`${ET_IMG_DOMAIN}/photo/msid-${image_msid},quality-100,imgsize-100.cms`} />
    	        </span>
    	        <div className={styles?.tac}>
    	            <p className={styles?.info_text}>{banner_text}</p>
    	            {banner_subtext && <p className={styles?.info_subtext}>{banner_subtext}</p>}
    	        </div>
    	        <a className={styles?.info_cta} data-url={button_link}>{button_text}</a>
            </div>
            {banner_cross === 'true' && <span className={styles?.info_cross} data-frequency={cross_frequency} />}
        </div>
    );
}

export default NudgeContainer;
