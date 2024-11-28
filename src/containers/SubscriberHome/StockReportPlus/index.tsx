// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';
import ViewReportCta from '../ViewReportCta';
import API_CONFIG from '../../../network/config.json';
import { ET_WEB_URL } from 'utils/common';
import PrimeIcon from 'components/Icons/PrimeIcon';
import Loading from 'components/Loading';

export default function StockReportPlus({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData]: any = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  const tabs = ["High Upside", "Top Score Companies", "Score Upgrade"];
  const tabLinks = [
    "/markets/stockreportsplus/high-upside/stockreportscategory/screenerid-2554.cms",
    "/markets/stockreportsplus/top-score-companies/stockreportscategory/screenerid-4205.cms",
    "/markets/stockreportsplus/score-upgrade/stockreportscategory/screenerid-2518.cms"
  ];

  const sliderRef = useRef(null);
  const innerRef = useRef(null);
  const [x, setX] = useState(0);
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  function onNextPrevButtonClick(type) {  
    let scrollBy = 251  ; 
    if(innerRef.current && sliderRef.current) {       
      const viewportWidth = sliderRef.current.offsetWidth;
      const innerWidth = innerRef.current.offsetWidth;

      console.log("viewportWidth", viewportWidth, "innerWidth", innerWidth);

      const scrollableWidth = innerWidth - viewportWidth;
      let scrollAmount = 0;

      if(type == "next"){
        let remaingScrollableWidth = scrollableWidth + x;

        if(remaingScrollableWidth < scrollBy) {
          scrollBy = remaingScrollableWidth;
        }
      }

      if(type == "prev") {
        if(-x < scrollBy) {
          scrollBy = -x;
        }
      }
      
      // debugger
      if(type === "prev") {
        scrollAmount = x + scrollBy;
        setX(scrollAmount);
      } else {
        scrollAmount = x - scrollBy;
        setX(scrollAmount);
      }

      if(scrollAmount < 0) {
        setPrevDisabled(false);
      } else {
        setPrevDisabled(true);
      }

      // debugger;
      if(-scrollAmount + viewportWidth == innerWidth) {
        setNextDisabled(true);
      } else {
        setNextDisabled(false);
      }

    }
  }

  useEffect(() => {
    if(innerRef.current) {
      innerRef.current.style.transform = `translate3d(${x}px, 0px, 0px)`;
      // translate with transition
      innerRef.current.style.transition = `transform 0.5s ease 0s`;
    }
  }, [x]);

  useEffect(() => {
    const api = API_CONFIG["SCREENER_BY_SCREENERID"][window.APP_ENV];    

    let screenerId = 2554; // High Upside
    if (activeTab === 1) {
      screenerId = 4205; // Top Score Companies
    } else if (activeTab === 2) {
      screenerId = 2518; // Score Upgrade
    }

    const payload = {
      deviceId: "web",
      pageno: 1,
      pagesize: 5,
      screenerId: screenerId,
      viewId: 5246,
      filterType: "index",
      filterValue: [],
    };

    setFetchingData(true);
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {    
        // debugger;    
        setData(data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      }).finally(() => {
        setFetchingData(false);
      });

    setX(0);
    setPrevDisabled(true);
    setNextDisabled(false);
  }, [activeTab]);

  const howMany = focusArea === "news" ? 2 : 5;

  return (
    <>
      <div className={`${focusArea}`} data-ga-impression={`Subscriber Homepage#Stock reports plus widget impression#`}>
      { <PrimeIcon style={{zoom: 0.7, marginRight: '7px', top: '4px'}}/> }
        <HeadingWithRightArrow title="Stock Report Plus" href="/markets/benefits/stockreportsplus"/>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} focusArea={focusArea} widget="Stock Report Plus"/>     

        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}
          data-ga-onclick="Subscriber Homepage#Stock Report Plus click#prev"
        ></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} 
        onClick={() => onNextPrevButtonClick("next")}
        data-ga-onclick="Subscriber Homepage#Stock Report Plus click#next"
        ></span>

        <div className="slider" ref={sliderRef}>
          <div className="cardsWrapper" ref={innerRef} style={fetchingData ? {width: "100%"} : {}}>
          {fetchingData && <Loading />}
          {!fetchingData && data?.dataList?.slice(0, howMany)?.map((item, index) => {

            if(activeTab > 0) {
              return <TopScoreCompaniesScoreUpgradeCard item={item}/>;
            }

            const expectedReturn = item?.data?.find((d: any) => d?.keyId === "sr_targetVsCurrent") || {};
            const target = item?.data?.find((d: any) => d?.keyId === "sr_priceTargetMean") || {};
            const currentPrice = item?.data?.find((d: any) => d?.keyId === "lastTradedPrice") || {};
            const recText = item?.data?.find((d: any) => d?.keyId === "sr_recText") || {};
            const recCnt = item?.data?.find((d: any) => d?.keyId === "sr_recCnt") || {};

            const sr_recSellCnt = Number(item?.data?.find((d: any) => d?.keyId === "sr_recSellCnt")?.value) || 0;
            const sr_recStrongSellCnt = Number(item?.data?.find((d: any) => d?.keyId === "sr_recStrongSellCnt")?.value) || 0;
            const sr_recHoldCnt = Number(item?.data?.find((d: any) => d?.keyId === "sr_recHoldCnt")?.value) || 0;
            const sr_recBuyCnt = Number(item?.data?.find((d: any) => d?.keyId === "sr_recBuyCnt")?.value) || 0;
            const sr_recStrongBuyCnt = Number(item?.data?.find((d: any) => d?.keyId === "sr_recStrongBuyCnt")?.value) || 0;

            const srCntTotal = sr_recSellCnt + sr_recStrongSellCnt + sr_recHoldCnt + sr_recBuyCnt + sr_recStrongBuyCnt;
            const sr_recSellPct = (sr_recSellCnt / srCntTotal) * 100;
            const sr_recStrongSellPct = (sr_recStrongSellCnt / srCntTotal) * 100;
            const sr_recHoldPct = (sr_recHoldCnt / srCntTotal) * 100;
            const sr_recBuyPct = (sr_recBuyCnt / srCntTotal) * 100;
            const sr_recStrongBuyPct = (sr_recStrongBuyCnt / srCntTotal) * 100;          

            return (
              <div className="card" key={index}>
                <div className="left">
                  <a href={`${ET_WEB_URL}/${item?.seoName}/stocks/companyid-${item?.companyID}.cms`} className="name" target="_blank">{item?.name || ""}</a>
                  <div className="title">{recText?.value}</div>
                  <div className="description">Mean Recos by {parseInt(recCnt?.value || 0)} Analysts</div>
                  <div className="graph">
                    <span className="strongSell" style={{ height: `calc(${sr_recStrongSellPct}% + 2px)` }}></span>
                    <span className="sell" style={{ height: `calc(${sr_recSellPct}% + 2px)` }}></span>
                    <span className="hold" style={{ height: `calc(${sr_recHoldPct}% + 2px)` }}></span>
                    <span className="buy" style={{ height: `calc(${sr_recBuyPct}% + 2px)` }}></span>
                    <span className="strongBuy" style={{ height: `calc(${sr_recStrongBuyPct}% + 2px)` }}></span>
                  </div>
                  <div className="graphLabel">
                    <span>
                      <span className="strongSell">{sr_recStrongSellCnt}</span>
                      Strong Sell
                    </span>
                    <span>
                      <span className="sell">{sr_recSellCnt}</span>
                      Sell
                    </span>
                    <span>
                      <span className="hold">{sr_recHoldCnt}</span>
                      Hold
                    </span>
                    <span>
                      <span className="buy">{sr_recBuyCnt}</span>
                      Buy
                    </span>
                    <span>
                      <span className="strongBuy">{sr_recStrongBuyCnt}</span>
                      Strong Buy
                    </span>
                  </div>
                  <ViewReportCta url={`${ET_WEB_URL}/${item?.seoName}/stockreports/reportid-${item?.companyID}.cms`} widget="Stock Report Plus"/>
                </div>
                <div className="right up">
                  <div>
                    Expected <br/>Returns
                    <span className="bold">{expectedReturn?.value}</span>
                  </div>
                  <div>
                    1Y Target
                    <span className="bold">₹{target?.value}</span>
                  </div>
                  <div>
                    Current Price
                    <span>₹{currentPrice?.value}</span>
                  </div>
                </div>
              </div> 
            )
          })}    
          </div>            
        </div>
        <ViewAllCta title={tabs[activeTab]} url={`${ET_WEB_URL}${tabLinks[activeTab]}`} isNoBorderRightArrow={focusArea === "market"} />
      </div>
      <style jsx>{` 
        .news {
          .arr {
            display: none;
          }
          .cardsWrapper {
            min-height: 422px;
          }
        }       
        .slider {
          overflow: hidden;
        }
        .cardsWrapper {
          display: inline-flex;
          flex-direction: column;  
          min-height: 186px;              
        }
        .card {          
          position: relative;          
          border: 1px solid #d5d5d5;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          margin: 10px 0;
          display: flex;
          gap: 10px;
          box-sizing: border-box;
          width: 320px;          

          .left {
            flex: 1;

            .graph {
              height: 30px;
              display: flex;
              align-items: flex-end;

              span {
                display: inline-block;
                flex: 1;
              } 

              .strongSell {
                background: #ec4843;              
              }
              .sell {
                background: #f3a655;              
              }
              .hold {
                background: #b9b9b9;              
              }
              .buy {
                background: #56bc7c;              
              }
              .strongBuy {
                background: #3d8b87;              
              }             
            }

            .graphLabel {
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #000;
              margin-top: 5px;
              margin-bottom: 10px;

              > span {
                text-align: center;
                flex: 1;

                span {
                  display: block;
                }
              }

              .strongSell {
                color: #ec4843;              
              }
              .sell {
                color: #f3a655;              
              }
              .hold {
                color: #b9b9b9;              
              }
              .buy {
                color: #56bc7c;              
              }
              .strongBuy {
                color: #3d8b87;              
              }
            }            

            .name {
              font-size: 18px;
              font-weight: 600;
              line-height: 1.25;              
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin-bottom: 8px;
              display: block;
            }

            .title {
              font-size: 14px;
              font-weight: 500;
              line-height: 17px;
              margin-top: 10px;              
            }

            .description {
              margin-bottom: 5px;
            }
          }

          .right {
            width: 80px;
            padding: 8px;

            > div:not(:first-child) {
              border-top: 1px dashed #a5c9bd;
              padding-top: 10px;
              margin-top: 10px;
            }

            &.up {
              background: #edfff9;
            }

            span {
              display: block;

              
            }
          }

          .bold {
            font-weight: 700;
          }
        }
        .arr {
          width: 18px;
          height: 18px;
          display: inline-block;
          background: #DA4617CC;
          border-radius: 50%;
          position: absolute;            
          cursor: pointer;
          pointer-events: all;
          top: 32px;

          &.disabled {
            opacity: 0.4;              
            cursor: no-drop;
          }

          &:after {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            border-top: 1px solid #fff;
            border-left: 1px solid #fff;
            transform: rotate(-45deg);
            position: absolute;
            top: 5px;
            left: 6px;
          }

          &.prev {
            right: 25px;              
          }

          &.next {
            right: 0;              
            transform: rotate(180deg);
          }
        }

        .market {
          position: relative;

          .cardsWrapper {
            flex-direction: row;
            gap: 20px;            
          }          
        }      
      `}</style>
    </>
  )
}

function TopScoreCompaniesScoreUpgradeCard({item}) {  
  const prevScore = item?.data?.find((d: any) => d?.keyId === "sr_avgScore3m")?.value?.split(".")[0];
  const avgScore = item?.data?.find((d: any) => d?.keyId === "sr_avgScore")?.value?.split(".")[0];

  const earnings = item?.data?.find((d: any) => d?.keyId === "sr_analystScore")?.value?.split(".")[0];  
  const fundamentals = item?.data?.find((d: any) => d?.keyId === "sr_fundScore")?.value?.split(".")[0];
  const relativeValuation = item?.data?.find((d: any) => d?.keyId === "sr_rvScore")?.value?.split(".")[0];
  const risk = item?.data?.find((d: any) => d?.keyId === "sr_riskScore")?.value?.split(".")[0];
  const priceMomentum = item?.data?.find((d: any) => d?.keyId === "sr_techScore")?.value?.split(".")[0];

  const metrics = [
    {
      title: "Earnings",
      value: earnings
    },
    {
      title: "Fundamentals",
      value: fundamentals
    },
    {
      title: "Relative Valuation",
      value: relativeValuation
    },
    {
      title: "Risk",
      value: risk
    },
    {
      title: "Price Momentum",
      value: priceMomentum
    }
  ];

  return (
    <>
      <div className="card">
        <div className="companyName">
          <a href={`${ET_WEB_URL}/${item?.seoName}/stocks/companyid-${item?.companyID}.cms`} target="_blank">
            {item?.name || ""}
          </a>
        </div>
        <div className="middle">
          <div className="left">
            <a className="scorebox" title="Stock Score" href={`${ET_WEB_URL}/${item?.seoName}/stockreports/reportid-${item?.companyID}.cms`} target="_blank">
              <div className="score">
                <span className="big">{avgScore}</span>
                <span className="slash">/</span>
                10
              </div>
              <div className="label">Stock Score</div>
              <div className="pdf"><span className="icon"></span> View Report</div>
            </a>
            <div className="colorIndicators">
              <div>
                <span className="color nr"></span>
                <span>No Rating (NR)</span>
              </div>
              <div>
                <span className="color negative"></span>
                <span>Negative</span>
              </div>
              <div>
                <span className="color neutral"></span>
                <span>Neutral</span>
              </div>
              <div>
                <span className="color positive"></span>
                <span>Positive</span>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="metricWrap">
              {/* <div className="label">Earnings</div>
              <div className="metric">
                <span className="value">8</span>
              </div> */}
              {
                metrics.map((metric, index) => (
                  <div className="metricWrap" key={index}>
                    <div className="label">{metric.title}</div>
                    <div className="metric">
                      <span className="value" style={{left: `${(metric.value / 10) * 100}%`}}>{metric.value}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="prevScore">Previous Score: <strong>{prevScore}/10</strong></div>
      </div>
      <style jsx>{`
        .card {
          position: relative;
          border: 1px solid #d5d5d5;          
          border-radius: 8px;
          padding: 10px;
          padding-bottom: 30px;
          background: #fff;
          margin: 10px 0;                                      
          box-sizing: border-box;
          width: 320px;

          .companyName {
            font-size: 18px;
            font-weight: 600;
            line-height: 1.25;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .middle {
            display: flex;
            gap: 20px;

            .right {
              flex: 1;
            }

            .metricWrap {
              margin-top: 10px;

              .label {
                font-size: 12px;
                font-weight: 500;
                display: inline-block;
                padding-bottom: 4px;
              }

              .metric {
                background-image: linear-gradient(90deg,#9a9cc3,#ec4843 15%,#f3a655 35%,#b7b7b7 50%,#ccc 65%,#56bc7c 95%,#3d8b87);
                height: 6px;
                width: 100%;
                position: relative;

                .value {
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  font-weight: 600;
                  line-height: 16px;
                  background: #b2b2b2;
                  border: 1px solid #fff;
                  border-radius: 2px;
                  color: #fff;                  
                  top: -7px;
                  text-align: center;
                  margin-left: -14px;
                }
              }
            }
          }

          .scorebox {
            display: inline-block;            
            position: relative;
            background: url('https://img.etimg.com/photo/msid-106122142/score-box.jpg');
            background-size: cover;
            background-repeat: no-repeat;
            text-align: center;
            padding: 0;
            margin-top: 10px;
            text-decoration: none;
            cursor: pointer;
            width: 99px;
            height: 74px;

            .score {
              font-size: 12px;
              font-weight: 500;

              .big {
                font-size: 30px;
                font-weight: 400;
              }

              .slash {
                font-size: 20px;
              }              
            }

            .label {
              font-size: 8px;
              font-weight: 400;
              line-height: 1.5;
              text-transform: uppercase;
            }

            .pdf {
              font-size: 10px;
              background: #183651;
              color: #fff;
              padding: 3px 0 3px 18px;           
              border-bottom-right-radius: 8px;
              border-bottom-left-radius: 8px;
              margin-top: 10px; 
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;

              .icon {
                left: 4px;
                top: -4px;
                position: absolute;
                width: 11px;
                height: 12px;
                background: url("https://img.etimg.com/photo/109967743.cms");
                -webkit-background-size: 500px;
                -moz-background-size: 500px;
                -o-background-size: 500px;
                background-size: 500px;
                background-position: -107px -374px;
                zoom: 1.5;
              }
            }
          }

          .colorIndicators {
            font-size: 10px;
            margin-top: 20px;

            > div {
              margin: 8px 0;
            }

            .color {
              width: 6px;
              height: 6px;
              display: inline-block;
              border-radius: 50%;
              margin-right: 2px;              
            }
            .nr {
              background: #53568f;
            }
            .negative {
              background: #ed193b;
            }
            .neutral {
              background: #b2b2b2;
            }
            .positive {
              background: #009060;
            }            
          }

          .prevScore {
            background: #f8f8f8;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 5px 15px;
            border-bottom-right-radius: 8px;
            border-bottom-left-radius: 8px;
            font-size: 10px;
            font-weight: 400;
            line-height: 12px;
          }
        }
      `}</style>
    </>
  )
}
