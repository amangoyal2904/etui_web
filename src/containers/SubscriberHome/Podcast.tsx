import React, { useState } from "react";
import APIS_CONFIG from "../../network/config.json";
import { dateFormat } from "utils/utils";
import { ET_WEB_URL } from "../../utils/common";

const Podcast = ({ data }) => {
    const [selectedAudio, setSelectedAudio] = useState<any>("");
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);

    const playAudio = (item) => {
        setSelectedAudio(item);
        setShowAudioPlayer(true);
    }
    return (
        <>
            <div className="podcastSection" data-ga-impression={`Subscriber Homepage#ET Podcasts widget impression#`}>
                <div className="podcastHead">
                    <p className="subSprite pcIcon"></p>
                    <p className="title">ET PODCASTS</p>
                    <p className="desc">Money, Markets, Business, &amp; Mutual Funds</p>
                    <a href={`${ET_WEB_URL}/markets/stocks/etmarkets-podcasts`} target="_blank" data-ga-onclick="Subscriber Homepage#ET Podcasts widget click#see-more" className="subSprite seeMore"></a>
                </div>
                <div className="podcastStories">
                    <ul>
                        {data?.map((item:{
                            title:string|any, 
                            img:string,
                            duration:string,
                            insertdate:string,
                        }, index:Number) => (
                            <li key={`${index}story`} className="podcastCard" onClick={() => playAudio(item)}>
                                <span className="stryImg" >
                                    <img height="124" width="165" className="lazy" title="" alt="" src={item.img} />
                                    <label>
                                        <span className="subSprite listenIcon"></span>
                                        <span className="separator"></span>
                                        <span >LISTEN</span>
                                    </label>
                                </span>
                                <p className="category">{item?.title?.split(":")?.[0] || ""}</p>
                                <p className="storyTitle">                                
                                {
                                    item?.title?.split(":")?.slice(1)?.join(":") || ""
                                }
                                </p>
                                <div className="timeDuration">
                                    <p className="duration">{item.duration} MIN</p>
                                    <p className="date">{dateFormat(item.insertdate, '%MM %d, %Y, %h:%m %p')}</p>
                                </div>
                            </li>
                        ))}</ul>
                </div>
            </div>
            {selectedAudio && showAudioPlayer &&
                <div className="podcastWrap">
                    <b className="podClose" onClick={() => setShowAudioPlayer(false)}>✖</b>
                    <iframe
                        id='podcast_embed'
                        frameBorder='0'
                        src={`${(APIS_CONFIG as any)["Podcast"][window.APP_ENV]}?video_id=${selectedAudio.slikeId}&ispwa=false&autoplay=1&mute=0&tpname=primeHome&title=${selectedAudio.title}`}
                        className="podcast"
                    />
                </div>}
            <style jsx>
                {`
                    .title {
                        font-size: 24px;
                        font-weight: 900;
                    }
                    .subSprite{
                        background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
                        display: inline-block;
                        background-size: 475px;
                    }
                    .stryImg{
                        position: relative;
                        height: 124px;
                        width: 165px;
                        margin: 0;
                        display: inline-block;
                    }
                    .desc{
                        font-size: 13px;
                        margin: 6px 0 20px;
                    }
                    .stryImg label {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        color: #fff;
                        font-size: 11px;
                        background: #ed193b;
                        width: 69px;
                        height: 20px;
                        line-height: 20px;
                    }
                    .listenIcon{
                        height: 13px;
                        width: 13px;
                        background-position: -346px -7px;
                        float: left;
                        margin: 4px;
                    }
                    .separator {
                        height: 20px;
                        border: .1px solid;
                        display: inline-block;
                        float: left;
                        margin-right: 4px;
                        opacity: .3;
                    }
                    .podcastSection{
                        background: #fff6f2;
                        border-top: 3px solid #9b8680;
                        margin-top: 1px;
                        margin-bottom: -3px;
                    }
                    .podcastHead{
                        background: #fff6f2;
                        width: 228px;
                        float: left;
                        display: inline-block;
                        text-align: center;
                    }
                    .podcastStories{
                        border-left: 3px double #e4d6d0;
                        display: inline-block;
                        margin-left: 2px;
                    }
                    .category{
                        font-size: 10px;
                        text-transform: uppercase;
                        color: #ed193b;
                        margin: 10px 0 8px;
                        font-weight: 500;
                    }
                    .pcIcon{
                        height: 70px;
                        width: 70px;
                        background-position: -379px -5px;
                        margin: 35px auto 18px;
                    }
                    .seeMore{
                        width: 141px;
                        height: 59px;
                        text-align: center;
                        color: #fff;
                        background-position: -11px -220px;
                        font-size: 16px;
                        font-weight: 600;
                        font-style: italic;
                        margin: 0 auto;
                        box-sizing: border-box;
                        line-height: 59px;
                        cursor: pointer;
                    }
                    .podcastCard{
                        min-height: 311px;
                        width: 185px;
                        padding: 10px;
                        box-sizing: border-box;
                        margin: 0 9px;
                        position: relative;
                        cursor: pointer;
                        list-style: none;
                    }
                    .podcastCard:hover {
                        background: #fff;
                        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.14);
                    }
                    ul{
                        overflow: auto;
                        margin-top: 6px;
                        padding-bottom: 20px;
                        display:flex;
                    }
                    .storyTitle{
                        font-size: 14px;
                        line-height: 1;
                        max-width: 166px;
                    }
                    .timeDuration{
                        position: absolute;
                        bottom:0;
                    }
                    .duration{
                        font-size: 12px;
                        line-height: 2;
                        text-transform: uppercase;
                        font-weight: bold;
                        margin: 4px 0 2px;
                    }
                    .date{
                        font-size: 11px;
                        color: #9d9d9d;
                        line-height: 1.83;
                    }
                    .podcastWrap{
                        right: 5px;
                        position: fixed;
                        bottom: 0;
                        top: auto;
                        left: auto;
                        transform: translate(0, 0);
                        border-radius: 0;
                        border-top: 1px solid #ccc;
                        background-color: #f6f8fc;
                        overflow: visible;
                        z-index: 99;
                        margin: 0 auto;
                        height: 74px;
                        width: 335px;
                    }
                    .podClose{
                        display: inline-block;
                        position: absolute;
                        right: 0;
                        background-color: #f6f8fc;
                        padding: 2px 4px;
                        cursor: pointer;
                        z-index: 9;
                        top: -15px;
                    }
                `}
            </style>
        </>
    )
}

export default Podcast;