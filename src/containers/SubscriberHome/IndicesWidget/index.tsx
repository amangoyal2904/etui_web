import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { formatNumber, chartIntervals, durationOptions } from 'utils/market';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { dateFormat } from 'utils/utils';
import { ET_WEB_URL } from 'utils/common';
import { fireTracking, trackingEvent } from 'utils/ga';
import useIntervalApiCall from 'utils/useIntervalApiCall';

export default function IndicesWidget({ isDev, focusArea }) {
  const [indicesData, setIndicesData]: any = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [period, setPeriod] = useState("1d");
  const [changePeriod, setChangePeriod] = useState("netChange");
  const [percentChange, setPercentChange] = useState("percentChange");
  const [chartURL, setChartURL] = useState("");  

  const indicesDivRef = useRef(null);
  const howMany = focusArea == "news" ? 3 : 6;

  function getIndicesData() {
    fetch('https://etapi.indiatimes.com/et-screener/index-byid?indexids=2369,2365,2371,1913,186,13602')
    .then(response => response.json())
    .then(data => {
      setIndicesData(data);      
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      console.log('finally');
    });
  }

  useEffect(() => {
    getIndicesData();
  }, []);

  useIntervalApiCall(() => {
    getIndicesData();
  }, 7000, [], indicesDivRef);

  useEffect(() => {

    let chartURL = indicesData?.indicesList?.[activeIndex]?.graphURL || "";
    if(chartURL){
      chartURL = isDev ? chartURL.replace("https://economictimes.indiatimes.com", "https://etdev8243.indiatimes.com") : chartURL;    
      chartURL += `${chartURL.includes('?') ? '&' : '?'}period=${period}`;    
      chartURL += `${chartURL.includes('?') ? '&' : '?'}height=150`;
      setChartURL(chartURL);
    }
  }, [activeIndex, period, indicesData]);
  const onClickTracking = (label) => {
    fireTracking("et_push_event", {category:"Subscriber Homepage", action:"Indices click",label:label})
  }
  return (
    <>
      <div ref={indicesDivRef} className={`indices ${focusArea}`} data-ga-impression={`Subscriber Homepage#Market Indices widget impression#`}>
        <div className={styles.top}>
          <HeadingWithRightArrow title="Indices" href="/markets/indices"/>
          <span className="statusNDate">
            <span className={styles.status}>{indicesData?.marketStatusDto?.currentMarketStatus}</span>
            <span className={styles.date}>| As on {dateFormat(new Date(indicesData?.indicesList?.[activeIndex]?.dateTimeLong || ""), "%d %MMM, %Y %H:%m IST")}</span>
          </span>
        </div>
        <div className={styles.durations}>
          {chartIntervals.map((item: any, index: number) => (
            <span
              key={index}
              className={`${styles.duration} ${period === item.value ? styles.active : ""}`}
              onClick={() => {
                setPeriod(item.value);
                setChangePeriod(item.change);
                setPercentChange(item.percentChange);
                onClickTracking(item.value)
              }}
            >
              {item.value}
            </span>
          ))}
        </div>
        <div className={`${styles.indiceTabs} indiceTabs`}>
          {
            indicesData?.indicesList?.slice(0, howMany)?.map((item: any, index: number) => (
              <div key={index} 
                className={`${styles.indiceTab} indiceTab1 ${activeIndex == index ? styles.active : ""}`} 
                onClick={() => {setActiveIndex(index); onClickTracking(item.indexName)}}
                >
                <div className="indexName">{item.indexName}</div>
                <div className="indexPrice">{formatNumber(item.lastTradedPrice || 0)}</div>
                <div className={`numberFonts ${item[changePeriod] > 0 ? styles.up : item[changePeriod] < 0 ? styles.down : ""} ${styles.indexChange}`}>
                  <span
                    className={`${styles.arrowIcons} ${
                      item[changePeriod] > 0
                        ? `${styles.up} ${styles.eticon_up_arrow}`
                        : item[changePeriod] < 0
                          ? `${styles.down} ${styles.eticon_down_arrow}`
                          : ""
                    }`}
                  />
                  {`${item[changePeriod].toFixed(2)} (${item[percentChange].toFixed(2)}%)`}                  
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.chartContainer}>          
          {chartURL && <iframe className={styles.chart} src={chartURL} /> }          
          <div className={styles.chartFooter}>
            <a href={`${ET_WEB_URL}/markets/indices/${indicesData?.indicesList?.[activeIndex]?.seoName}`} 
              target="_blank"
              onClick={() => onClickTracking(`View${indicesData?.indicesList?.[activeIndex]?.indexName}`)}
              >View {indicesData?.indicesList?.[activeIndex]?.indexName}</a>
          </div>
        </div>

        <div className="advanceFiiDii">
          <a className="advance card" href={`${ET_WEB_URL}/markets/stock-market-mood`} target="_blank" 
            onClick={() => onClickTracking("Advance/Decline (NSE)")}
         
          >
            <div className="heading">Advance/Decline (NSE)</div>
            <div className="value">
              <span>{indicesData?.indicesList?.[activeIndex]?.advances}</span>
              <span>{indicesData?.indicesList?.[activeIndex]?.declines}</span>
            </div>
            <div className="graph">
              <span style={{ width: `${(indicesData?.indicesList?.[activeIndex]?.advancesPerChange || 0)}%` }} />
              <span style={{ width: `${(indicesData?.indicesList?.[activeIndex]?.declinesPerChange || 0)}%` }} />
            </div>
            <div className="date">{dateFormat(new Date(indicesData?.indicesList?.[activeIndex]?.dateTimeLong), "%MMM %d, %Y")}</div>
          </a>
          <a className="fii card" href={`${ET_WEB_URL}/markets/fii-dii-activity`} target="_blank" 
          onClick={() => onClickTracking("FII Cash")}
          >
            <div className="heading">FII Cash (Cr.)</div>
            <div className={`value ${indicesData?.fiiData?.netInvestment > 0 ? 'up' : 'down'}`}>₹ <span>{indicesData?.fiiData?.netInvestment}</span></div>
            <div className="date">{dateFormat(new Date(indicesData?.fiiData?.date), "%MMM %d, %Y")}</div>
          </a>
          { focusArea == "market" &&
          <a className="dii card" href={`${ET_WEB_URL}/markets/fii-dii-activity`} target="_blank" 
          onClick={() => onClickTracking("DII Cash")}
          >
            <div className="heading">DII Cash (Cr.)</div>
            <div className={`value ${indicesData?.diiData?.netInvestment > 0 ? 'up' : 'down'}`}>₹ <span>{indicesData?.diiData?.netInvestment}</span></div>
            <div className="date">{dateFormat(new Date(indicesData?.diiData?.date), "%MMM %d, %Y")}</div>
          </a>
          }
        </div>
      </div>    
      <style jsx>{`
        .indices {
          min-height: 385px;
        }
        .numberFonts {
          font-size: 10.5px;
          font-weight: 500;
        }

        .advanceFiiDii {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 1rem;

          .card {
            flex: 1;
            border: 1px solid #C0ABA5;
            background: #fff;
            padding: 7px;
            border-radius: 5px;
            font-family: Montserrat;
            font-size: 10px;

            .heading {              
              font-weight: 600;
              position: relative;

              &::after {
                content: "";
                display: inline-block;
                width: 5px;
                height: 5px;
                top: 2px;
                right: 0;
                border-top: 1.4px solid #000;
                border-left: 1.4px solid #000;
                position: absolute;
                cursor: pointer;
                transform: rotate(135deg);
              }
            }

            .value {
              font-weight: 600;

              &.up {
                span {
                  color: #009060;
                }
              }

              &.down {
                span {
                  color: #EA2227;
                }
              }
            }

            &:not(:first-child) {   
              .value {          
                font-size: 12px;
                font-weight: 600; 
                margin-top: 8px;   
                margin-bottom: 5px;
              }                        
            }

            .graph {
              span{
                height: 5px;
                display: inline-block;

                &:first-child {
                  background: #009060; 
                  border-radius: 5px 0 0 5px;               
                }

                &:last-child {
                  background: #EA2227;
                  border-radius: 0 5px 5px 0;
                }
              }

            }

            &.advance {
              .value {
                display: flex;
                justify-content: space-between;
                gap: 8px;
                margin-top: 8px;
              }
            }
          }
        }

        .market {
          .indiceTab1 {
            border-radius: 8px 8px 0 0;            
            border: 1px solid #ccc;
            border-bottom: none;
          }

          .indiceTabs {
            gap: 8px;
          }
        }
      `}</style>
    </>
  )
}
