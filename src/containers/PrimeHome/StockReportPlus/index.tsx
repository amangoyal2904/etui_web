// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';
import ViewReportCta from '../ViewReportCta';
import API_CONFIG from '../../../network/config.json';
import { ET_WEB_URL } from 'utils/common';
import PrimeIcon from 'components/Icons/PrimeIcon';

export default function StockReportPlus({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData]: any = useState([]);
  const tabs = ["High Upside", "Top Score Companies", "Score Upgrade"];
  const tabLinks = ["/markets/benefits/stockreportsplus", "/markets/benefits/stockreportsplus", "/markets/benefits/stockreportsplus"];

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
      });
  }, [activeTab]);

  const howMany = focusArea === "news" ? 2 : 5;

  return (
    <>
      <div className={`${focusArea}`}>
      { <PrimeIcon style={{zoom: 0.7, marginRight: '7px', top: '4px'}}/> }
        <HeadingWithRightArrow title="Stock Report Plus" />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} focusArea={focusArea} />     

        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>

        <div className="slider" ref={sliderRef}>
          <div className="cardsWrapper" ref={innerRef}>
          {data?.dataList?.slice(0, howMany)?.map((item, index) => {
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
                  <ViewReportCta url={`${ET_WEB_URL}/${item?.seoName}/stockreports/reportid-${item?.companyID}.cms`} />
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
        }       
        .slider {
          overflow: hidden;
        }
        .cardsWrapper {
          display: inline-flex;
          flex-direction: column;                
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
