// @ts-nocheck
import styles from './styles.module.scss';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { useState, useEffect, useRef } from 'react';
import Tabs from '../Tabs';
import ViewAllCta from '../ViewAllCta';
import ViewReportCta from '../ViewReportCta';
import API_CONFIG from '../../../network/config.json';
import { ET_WEB_URL } from 'utils/common';
import { dateFormat } from 'utils/utils';
import { formatNumber } from 'utils/market';
import WatchlistAddition from "components/WatchlistAddition";
import Loading from 'components/Loading';

export default function StockRecos({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData]: any = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const tabs = ["New Recos", "High Upside", "High Downside"];

  const tabLinks = [
    "/markets/stock-recos/newrecos/all",
    "/markets/stock-recos/highupside",
    "/markets/stock-recos/highdownside",
  ]

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
        setData(data?.recoData?.[0]?.data || []);
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
    <div className={`${focusArea}`} data-ga-impression={`Subscriber Homepage#Stock Recos widget impression#`}>
        <HeadingWithRightArrow title="Stock Recos" href="/markets/stock-recos/overview"/>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} focusArea={focusArea} widget="Stock Recos"/>

        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} 
          onClick={() => onNextPrevButtonClick("prev")}
          data-ga-onclick={`Subscriber Homepage#Stock Recos click#prev`}
          ></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} 
        onClick={() => onNextPrevButtonClick("next")}
        data-ga-onclick={`Subscriber Homepage#Stock Recos click#next`}
        ></span>

        <div className="slider" ref={sliderRef}>
          <div className="cardsWrapper" ref={innerRef} style={fetchingData ? {width: "100%"} : {}}>
            {fetchingData && <Loading />}
            {
              !fetchingData &&
              data?.slice(0, howMany)?.map((item, index) => (
                <div className={`${styles.card} card`} key={index}>
                  { activeTab == 0 && <div className={styles.firstRow}><span className={`${styles.cat} ${item?.potentialDirection?.toLowerCase() == 'down' ? 'catdown' : '' }`}>{item?.recoType}</span> | Call Date: {dateFormat(item?.priceAtRecosDate || "", "%MMM %d, %Y")}</div>}
                  <div className={`${styles.title} ${activeTab > 0 ? styles['thisTop'] : ''} ${activeTab > 0 ? 'thisTop' : ''}`}>
                    <a href={`${ET_WEB_URL}/${item?.companySeoName}/stocks/companyid-${item?.companyId}.cms`} target="_blank"  data-ga-onclick={`Subscriber Homepage#Stock Recos click#${item?.companyName}`}>{item?.companyName}</a>
                    <span className={styles.watchlistIcWrp}>
                      <WatchlistAddition
                        companyName={item?.companyName}
                        companyId={item?.companyId}
                        companyType={item.companyType}
                        customStyle={{
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    </span>
                  </div>
                  <div className={styles.row}>
                    <div className={`${styles.col} ${styles.up} ${activeTab == 2 || item?.potentialDirection?.toLowerCase() == 'down' ? 'down' : ''}`}>
                      {item?.potentialText}
                      <span className={`${styles.number} ${activeTab == 2 || item?.potentialDirection?.toLowerCase() == 'down' ? 'red' : ''}`}>{item?.potentialValue}%</span>
                    </div>
                    { activeTab == 0 && <>
                      <div className={styles.col}>
                        <span>
                        Target
                        <span className="bold">{formatNumber(item?.target || 0)}</span>
                        </span>
                        
                        <span>
                          Price @ Recos
                          <span>{formatNumber(item?.priceAtRecos || 0)}</span>
                        </span>
                      </div>
                      <div className={styles.col}>
                        <span className={styles.first}>
                          Current Price
                          <span>{formatNumber(item?.currentPrice || 0)}</span>
                        </span>
                        <ViewReportCta url={item?.pdfUrl} widget="Stock Recos"/>
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
                    Brokerage: <a href={`${ET_WEB_URL}/markets/stock-recos/brokerages/${item?.seoName}-${item?.omId}/all`} target="_blank">{item?.organisation}</a>
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
                </div>
              ))              
            }
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
            min-height: 319px;
          }
        }

        .catdown {
          color: #d51131;
        }
        .market {
          position: relative;
          .cardsWrapper {
            display: inline-flex;
            gap: 20px;       
            min-height: 157px;     

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
