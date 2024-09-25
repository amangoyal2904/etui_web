import React, { useState } from "react";
import CryptoVideo from './CryptoVideo';
import CryptoExpert from './CryptoExpert';
import CryptoGainerLooser from './CryptoGainerLooser';
const CryptoRhs = ({ dataTv, dataExpert, titleTv, titleExpert }) => {
    return(
        <>
        <div className="video_expert_wrap">
            <CryptoVideo  data={dataTv} title={titleTv}/>
            <CryptoExpert data={dataExpert} title={titleExpert}/>
        </div>
        <div className="gainers_loosers">
            <CryptoGainerLooser />
        </div>
        <style jsx>{`
            .video_expert_wrap{width:255px;display:inline-block;margin-left:20px;vertical-align:top;}
            .gainers_loosers{padding:28px 14px;margin-left:14px;width:271px;box-sizing:border-box;vertical-align:top;background-color:#ffded4;display:inline-block;}
        `}</style>
        </>
    )
}
export default CryptoRhs;