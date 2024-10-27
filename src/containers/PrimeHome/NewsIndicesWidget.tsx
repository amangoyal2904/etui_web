import React, { useEffect, useState, useRef } from 'react';
import APP_CONFIG from "../../network/config.json";
import { dateFormat } from 'utils/utils';
import GLOBAL_CONFIG from "../../network/global_config.json";
import Loading from "../../components/Loading";
import { useStateContext } from "../../store/StateContext";
import useIntervalApiCall from 'utils/useIntervalApiCall';

const NewsIndicesWidget = ({isDev, handleExchangeType, exchangeType, indicesObj}) => {
    const NewsIndicesRef = useRef<HTMLDivElement>(null);
    const { state } = useStateContext();
    const { currentMarketStatus } = state.marketStatus;
    const [compData, setCompData] = useState<any>(null);
    const [indexName, setIndexName] = useState<any>("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateTime, setDateTime] = useState("");
    const APP_ENV = isDev ? "development" : "production";
    const etDomain = GLOBAL_CONFIG[isDev ? "development" : "production"]["ET_WEB_URL"];

    const fixedVal = (val) => {
        if(val) val = parseFloat(val).toFixed(2);
        return val;
    }

    const fetchData = async () => {
        let ajaxUrl;

        if(indicesObj.secName == 'Indices'){
            ajaxUrl = `${APP_CONFIG["getAllIndices"][APP_ENV]}?pagesize=20&exchange=${indicesObj.exchange}&sortorder=desc&sortby=value&marketcap=`;
        }else if(indicesObj.sectorid){
            ajaxUrl = `${APP_CONFIG["sectorcompanylisting"][APP_ENV]}?sectorid=${indicesObj.sectorid}&sectorname=${indicesObj.secName}&exchange=${indicesObj.exchange}&pagesize=23&sortorder=desc&sortby=percentChange&marketcap=`;
        }else{
            ajaxUrl = `${APP_CONFIG["getIndexByIds"][APP_ENV]}?indexid=${indicesObj.indexId}&indexname=${indicesObj.secName}&exchange=${indicesObj.exchange}&pagesize=10&sortorder=desc&sortby=percentChange&company=true`;
        }
        console.log("indicesObj -indexObj- result2", ajaxUrl, indicesObj)
        try {
            setLoading(true);
            const response = await fetch(`${ajaxUrl}`);
            const data = await response.json();
            let result = data && data.searchresult.length && data.searchresult;
            setDateTime(result[0]?.dateTime ? result[0]?.dateTime : result[0]?.updatedDate);
            setIndexName((indicesObj.secName === 'Indices') ? indicesObj.secName : (result[0]?.indexName) ? result[0]?.indexName : indicesObj.secName)
            //result = indicesObj.secName != 'Indices' && !indicesObj.sectorid ? result[0].companies : result;
            if (result) {
                setCompData(result);
                // Additional logic to handle the data can be added here
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err);
            setLoading(false);
        }
    };

    const postAjax = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://etmarketsapis.indiatimes.com/ET_Screeners/getFilteredData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(indicesObj)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const dataLength = data && data.page.length;

            if (dataLength) {
                setIndexName(indicesObj.secName);
                setDateTime(data.page[0].updatedDate);

                // Update the component state
                setCompData(data.page);
                // You can also handle the date formatting here if needed
                // e.g., formatDate(new Date(dateTime));
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("indicesObj -indexObj- result1")
        if (indicesObj.customFilterDtoList) {
            postAjax();
        } else {
            fetchData();    // Handle the case for getAjax if needed
        }
    }, [indicesObj]);

    useIntervalApiCall(
        () => {
          if (currentMarketStatus === "LIVE"){
            if (indicesObj.customFilterDtoList) {
                postAjax();
            } else {
                fetchData();    // Handle the case for getAjax if needed
            }  
          }
        },
        26000,
        [indicesObj, currentMarketStatus],
        NewsIndicesRef,
      );

    // if (error) {
    //     return <div>Error: {error?.message}</div>;
    // }

    

    // console.log("indicesObj -indexObj- result2 currentIndexValue", dateTime, compData[0]?.currentIndexValue)

    // Logic to determine visibility of elements
    const isSectorIdPresent = indicesObj?.sectorid || indicesObj.secName === 'Indices';

    return (
        <>
            {
                !compData || loading ? <div id="newsInds" className="bse_widget"><Loading /></div> :
                <div id="newsInds" className="bse_widget" ref={NewsIndicesRef}>
                    <div className={`curr_data ${isSectorIdPresent ? 'hide' : ''}`}>
                        <div className="exchange_type">
                            <div className="curr">{indexName}</div>
                            <div className="exchange_switch">
                                <span className={exchangeType == "NSE" ? "active" : ""} onClick={() => handleExchangeType("NSE")}>NSE</span>
                                <span className={exchangeType == "BSE" ? "active" : ""} onClick={() => handleExchangeType("BSE")}>BSE</span>
                            </div>
                        </div>
                        <div className="curr_time">{dateFormat(new Date(dateTime), "%h:%m | %d %MM %Y")}</div>
                        {!indicesObj.customFilterDtoList && !indicesObj?.sectorid && indicesObj.secName != 'Indices' && 
                            <>
                                <div className={`change_per ${compData[0].netChange > 0 ? 'up' : 'down'}`}>
                                    <span className="curr_val">{compData[0].currentIndexValue}</span>
                                    <span className={`arrow_sprite eticon_arrow_${compData[0].netChange > 0 ? 'up' : 'down'}`} />
                                    <span className="curr_no">{fixedVal(compData[0].netChange)} ({fixedVal(compData[0].perChange)}%)</span>
                                </div>

                                <iframe className="lazyIframe" width="246" height="139" loading="lazy" src={`${etDomain}/renderchart.cms?no_menu=1&dont_save=true&right_align=true&chart_type=mountain&et_logo=false&symbol=${indicesObj?.symbol}&exchange=${indicesObj?.exchange}&entity=index&symbol_label=false&current_hr=false&default_period=1D&zoom=false&yaxis_decimal=0&ohlc_hide=true&background_color=transparent&custom_theme=1&grid_color=false&xaxis_color=%23666&iswebpre=true&height=155&transparentBg=1`}></iframe>
                            </>
                        }
                    </div>
                    <div className="data_table">
                        {indicesObj.secName === 'Indices' ? (
                            compData?.map(comp => {
                                let indicePid: any = '';
                                let indiceHref: any = '';
                                switch (comp.indexId) {
                                    case "2369":
                                        indicePid = 36;
                                        break;
                                    case "2365": 
                                        indicePid = 37;
                                        break;
                                    case "1913": 
                                        indicePid = 38;
                                        break;
                                    case "186":
                                        indicePid = 39;
                                        break;
                                }
                                if (comp.indexId == 2369 || comp.indexId == 2365 || comp.indexId == 1913 || comp.indexId == 186) {
                                    indiceHref = '/marketstats/pid-' + indicePid + ',indexid-' + comp.indexId + ',exchange-' + comp.exchange + ',sortorder-desc,sortby-currentprice,company-true.cms';
                                } else {
                                    indiceHref = '/marketstats/pid-1004,exchange-' + comp.exchange + ',sortby-percentChange,sortorder-desc,indexid-' + comp.indexId + ',indexname-' + comp.indexName + ',company-true.cms';
                                }
                                const mercuryUrl = isDev ? 
                                    `https://etmarketswebpre.indiatimes.com/markets/indices/${comp.seoName}` : 
                                    `/markets/indices/${comp.seoName}`;

                                return (
                                    <p className="comp_data" key={comp.indexId}>
                                        <a target="_blank" rel="noopener noreferrer" data-oldhref={indiceHref} href={mercuryUrl} className="comp_name">
                                            {comp.indexName}
                                        </a>
                                        <span className="val">{fixedVal(comp.currentIndexValue)}</span>
                                        <span className={`change ${comp.perChange > 0 ? 'up' : 'down'}`}>
                                            ({fixedVal(comp.perChange)}%)
                                        </span>
                                    </p>
                                );
                            })
                        ) : indicesObj.sectorid ? ( // Removed extra curly braces
                            compData?.map(comp => {
                                return (
                                    <p className="comp_data" key={comp.indexId}>
                                        <a target="_blank" rel="noopener noreferrer" href={`/${comp.seoName}/stocks/companyid-${comp.companyId}.cms`} className="comp_name">
                                            {comp.companyName}
                                        </a>
                                        <span className="val">{fixedVal(comp.current)}</span>
                                        <span className={`change ${comp.percentChange > 0 ? 'up' : 'down'}`}>
                                            ({fixedVal(comp.percentChange)}%)
                                        </span>
                                    </p>
                                );
                            })
                        ) : indicesObj.customFilterDtoList ? (
                            compData?.map(comp => {
                                return (
                                    <p className="comp_data" key={comp.indexId}>
                                        <a target="_blank" rel="noopener noreferrer" href={`/${comp.seoName}/stocks/companyid-${comp.companyId}.cms`} className="comp_name">
                                            {comp.companyName}
                                        </a>
                                        <span className="val">{fixedVal(comp.ltp)}</span>
                                        <span className={`change ${comp.performanceD1 > 0 ? 'up' : 'down'}`}>
                                            ({fixedVal(comp.performanceD1)}%)
                                        </span>
                                    </p>
                                );
                            })    
                        ) : (
                            compData[0]?.companies?.map(comp => {
                                return (
                                    <p className="comp_data" key={comp.indexId}>
                                        <a target="_blank" rel="noopener noreferrer" href={`/${comp.seoName}/stocks/companyid-${comp.companyId}.cms`} className="comp_name">
                                            {comp.companyShortName}
                                        </a>
                                        <span className="val">{fixedVal(comp.current)}</span>
                                        <span className={`change ${comp.percentChange > 0 ? 'up' : 'down'}`}>
                                            ({fixedVal(comp.percentChange)}%)
                                        </span>
                                    </p>
                                );
                            })
                        )}
                    </div>
                </div>
            }
            <style jsx>{`

                .arrow_sprite {
                    background-image: url('https://img.etimg.com/photo/109967743.cms');
                    -webkit-background-size: 500px 429px;
                    -moz-background-size: 500px 429px;
                    -o-background-size: 500px 429px;
                    background-size: 500px 429px;
                    display: inline-block;
                }

                .eticon_arrow_down{
                    background-position: -317px -9px;
                    width: 6px;
                    height: 11px;
                    margin: 0 2px;
                }

                .eticon_arrow_up{
                    background-position: -327px -9px;
                    width: 6px;
                    height: 11px;
                    margin: 0 2px;
                }

                .lazyIframe{
                    border: 0px solid;
                }
                .bse_widget {
                    width: 269px;
                    height: auto;
                    margin: 0 0 0 16px;
                    padding: 17px 11px 10px 12px;
                    background-color: #ffded4;
                    box-sizing: border-box;
                    min-height: 500px;
                    position: relative;

                    .curr_val{
                        color: #000;
                        font-weight: 600;
                        margin-right: 12px;
                        font-size: 20px;
                    }

                    .change_per {
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                    }

                    .exchange_type {
                        margin-bottom: 15px;

                        .curr {
                            font-size: 16px;
                            font-weight: 600;
                            width: 160px;
                            display: inline-block;
                        }

                        .exchange_switch {
                            display: inline-block;
                            height: 19px;
                            border-radius: 3px;
                            margin-left: 15px;
                            border: solid 1px #979797;
                            background-color: #fff;
                            float: right;

                            span {
                                display: inline-block;
                                font-size: 11px;
                                line-height: 19px;
                                width: 33px;
                                font-weight: 400;
                                color: #000;
                                text-align: center;
                                vertical-align: top;
                                cursor: pointer;

                                &.active {
                                    color: #fff;
                                    background: #000;
                                    border-radius: 0;
                                    font-weight: 800;
                                }
                            }
                        }
                    }

                    .curr_time {
                        font-size: 12px;
                        color: #4a4a4a;
                        margin-bottom: 6px;
                    }

                    .curr_data {
                        font-size: 20px;
                        margin-bottom: 10px;
                    }

                    .data_table {
                        font-size: 11px;
                        margin-top: 15px;
                    }

                    .comp_data {
                        border-top: 1px solid #ddc2bb;
                        padding: 6px 0;
                        display: flex;
                    }

                    .comp_name {
                        width: 60%;
                        // display: inline-block;
                    }

                    .val {
                        width: 20%;
                        // display: inline-block;
                        text-align: right;
                        font-weight: 600;
                    }

                    .change {
                        width: 20%;
                        // display: inline-block;
                        text-align: right;
                    }

                    .up{
                        color: #009060;
                    }

                    .down{
                        color: #da2337;
                    }
                }
                `}</style>
        </>
    )
}

export default NewsIndicesWidget