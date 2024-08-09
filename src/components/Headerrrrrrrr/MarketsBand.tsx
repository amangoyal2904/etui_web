import { useState, useEffect } from 'react';
import Link from 'next/link';

import DfpAds from "components/Ad/DfpAds"
import styles from "./Header.module.scss";

const MarketsBand = () => {
    const marketArr = [1,2,3];
    const [marketWatchData, setMarketWatchData] = useState([]);

    const mouseEnter = () => {
        /* const { data, isLoading, error } = useRequest({
            url: "https://economictimes.indiatimes.com/market_ddmenu.cms",
            params: { "arrow_inside": 1, "language": "" }
        })
        console.log("on mouse enter");
        if (isLoading) {console.log('loading going on');}
        if (error) {console.log('error going on', error);}
        console.log(data, 'data from api'); */
        // const [marketData, getMarketData] = useState([]);
        // getMarketData(data);
        // $('.stats_list').html(ddHtml);
    }

    return (
        <div>
            <div id="topAd">
            {/* // <div id="div-gpt-ad-1389610933954-2-ppd" data-adsSlot="ET_Home/ET_Home_Home/ET_HP_ATF_728" data-size="[[1003, 90],[970,90],[728, 90]]" data-loc="{$loc}"/> */}
            <div className="adContainer">
                <DfpAds adInfo={{"key": "atf"}}/>
            </div>
            </div>
            <div className="band">
                <div className="contentwrapper bandCont clearfix">
                    <div className="flipWrapper flt">
                        <div className="mkt_indices_band clearfix">
                            {marketArr?.map(item => { return (
                                <div key={item} className="band-items band-item-sm" id={`S${item}_box`}>
                                    <div className="band-item clearfix">
                                        <div className="band-content">
                                            <div className="head">
                                                <Link href="#" target="_blank">
                                                    Benchmark                                                    
                                                </Link>
                                            </div>
                                            <div className="values">
                                                <Link href="#" target="_blank" className="wname">
                                                    Sensex
                                                </Link>
                                                <span className="num">223,23,23</span>
                                                <span className="per cSprite_b ">loss</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                    <div className="band-items grey">
                        <div className="stats_btn" onMouseEnter={mouseEnter}>
                            <Link href="/marketstats/pid-0,pageno-1,sortby-percentchange,sortorder-desc,sort-intraday.cms?marketcap=largecap%252Cmidcap" className="mktWatch" target="_blank">Market Watch
                            </Link>
                            <div className="stats_list">
                                <ul>
                                    {marketWatchData.length && marketWatchData?.map(item => { return (
                                        <li className='level_0' key={item?.title}>
                                            {item.title}
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        </div>
        	        </div>
                </div>
            </div>
        </div>
    )
}

export default MarketsBand