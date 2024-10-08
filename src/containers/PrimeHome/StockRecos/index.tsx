// @ts-nocheck
import RightArrow from 'components/Icons/RightArrow';
import styles from './styles.module.scss';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { useState, useEffect, useRef, act } from 'react';
import Tabs from '../Tabs';
import ViewAllCta from '../ViewAllCta';
import ViewReportCta from '../ViewReportCta';
import API_CONFIG from '../../../network/config.json';
import { ET_WEB_URL } from 'utils/common';
import { dateFormat } from 'utils/utils';

export default function StockRecos({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData]: any = useState([]);
  const tabs = ["New Recos", "High Upside", "High Downside"];

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
    const api = API_CONFIG["GET_RECOS_DETAILS"][window.APP_ENV];

    let type = "newRecos";
    type = activeTab === 1 ? "mostBuy" : type;
    type = activeTab === 2 ? "mostSell" : type;

    const payload = {
      apiType: type,
      filterType: "",
      filterValue: [],
      recoType: "all",
      pageSize: 5,
      pageNumber: 1,
      deviceId: "web",
      apiVersion: 2
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
        setData(data?.recoData?.[0]?.data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [activeTab]);

  const howMany = focusArea === "news" ? 2 : 5;

  return (
    <>
      <div className={`${focusArea}`}>
        <HeadingWithRightArrow title="Stock Recos" />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>

        <div className="slider" ref={sliderRef}>
          <div className="cardsWrapper" ref={innerRef}>
            {
              data?.slice(0, howMany)?.map((item, index) => (
                <div className={`${styles.card} card`} key={index}>
                  { activeTab == 0 && <div className={styles.firstRow}><span className={styles.cat}>{item?.recoType}</span> | Call Date: {dateFormat(item?.priceAtRecosDate || "", "%MMM %d, %Y")}</div>}
                  <div className={`${styles.title} ${activeTab > 0 ? 'thisTop' : ''}`}><a href={`${ET_WEB_URL}${item?.companySeoName}/stocks/companyid-${item?.companyId}.cms`} target="_blank">{item?.companyName}</a></div>
                  <div className={styles.row}>
                    <div className={`${styles.col} ${styles.up} ${activeTab == 2 ? 'down' : ''}`}>
                      {item?.potentialText}
                      <span className={`${styles.number} ${activeTab == 2 ? 'red' : ''}`}>{item?.potentialValue}%</span>
                    </div>
                    { activeTab == 0 && <>
                      <div className={styles.col}>
                        <span>
                        Target
                        <span className="bold">{item?.target}</span>
                        </span>
                        
                        <span>
                          Price @ Recos
                          <span>{item?.priceAtRecos}</span>
                        </span>
                      </div>
                      <div className={styles.col}>
                        <span className={styles.first}>
                          Current Price
                          <span>{item?.currentPrice}</span>
                        </span>
                        <ViewReportCta url={item?.pdfUrl} />
                      </div>  
                    </>
                    }

                    {
                      activeTab > 0 && <div className={`${styles.col} innerRow`}>
                        <span>
                          Avg. Target
                          <span className="bold">{item?.target}</span>
                        </span>
                        <span>
                          Current Price
                          <span>{item?.currentPrice}</span>
                        </span>
                      </div>
                    }
                  </div>
                  { activeTab == 0 ? 
                  <div className={styles.footer}>
                    Brokerage: <a href={`${ET_WEB_URL}markets/stock-recos/brokerages/${item?.seoName}/all`} target="_blank">{item?.organisation}</a>
                  </div>
                  : <div className="footer">
                      <div className="left">
                        <span className="buy">Buy:</span> <span className="value">{item?.buyCount || 0}</span>
                        <span className="sell">Sell:</span> <span className="value">{item?.sellCount || 0}</span>
                        <span className="hold">Hold:</span> <span className="value">{item?.holdCount || 0}</span>
                      </div>
                      <div className="right">
                        <span className="total">Total:</span> <span className="value">{item?.totalCount || 0}</span>
                      </div>
                    </div>
                  }
                  <span className={`addToWatchListIcon`}>&#43;</span>
                </div>
              ))
              
            }
          </div>
        </div>
        
        <ViewAllCta title="Stock Recos" url="/markets/stock-recos/overview" isNoBorderRightArrow={focusArea === "market"} />
      </div>
      <style jsx>{`
        .news {
          .arr {
            display: none;
          }
        }
        .market {
          position: relative;
          .cardsWrapper {
            display: inline-flex;
            gap: 20px;            

            .card {
              min-width: 320px;
            }
          }

          .slider {
            overflow: hidden;
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
        }
        .bold {
          font-weight: bold;
        }
        .down {
          background: #fef1f3 !important;
        }
        .red {
          color: #d51131 !important;
        }
        .thisTop {
          margin-top: 10px;
        }
        .innerRow {
          width: 100%;
          & > span {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dotted #b3b3b3;
            padding-bottom: 8px;
          }
        }

        .footer {
          display: flex;
          justify-content: space-between;

          .left {
            .value {
              font-weight: 600;
              margin-right: 10px; 
            }
            .buy {
              color: #147014;
            }
            .sell {
              color: #ed193b;
            }
          }

          .right {
            font-weight: 600;
          }
        }
      `}</style>
    </>
  )
}
