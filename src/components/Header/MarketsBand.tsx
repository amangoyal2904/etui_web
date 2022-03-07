import { useState, useEffect } from 'react';
import Link from 'next/link';

import useRequest from 'network/service';
import DfpAds from "components/Ad/DfpAds"
import styles from "./Header.module.scss";

const MarketsBand = () => {
    const marketArr = [1,2,3];

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
                            {marketArr.map(item => { return (
                                <div className="band-items band-item-sm" id={`S${item}_box`}>
                                    <div className="band-item clearfix">
                                        <div className="band-content">
                                            <div className="head">
                                                <Link href="abc.com">
                                                    <a target="_blank">
                                                        Benchmark
                                                    </a>
                                                </Link>
                                            </div>
                                            <div className="values">
                                                <Link href="acc.cmom">
                                                    <a target="_blank" className="wname">
                                                        Sensex
                                                    </a>
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
                            <Link href="/marketstats/pid-0,pageno-1,sortby-percentchange,sortorder-desc,sort-intraday.cms?marketcap=largecap%252Cmidcap">
                                <a className="mktWatch" target="_blank">Market Watch</a>
                            </Link>
                            <div className="stats_list"></div>
                        </div>
        	        </div>
                </div>
            </div>
        </div>
    )
}

export default MarketsBand