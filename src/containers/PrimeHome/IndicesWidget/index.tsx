import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { formatNumber, chartIntervals, durationOptions } from 'utils/market';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { dateFormat } from 'utils/utils';

export default function IndicesWidget({ isDev, focusArea }) {
  const [indicesData, setIndicesData]: any = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [period, setPeriod] = useState("1w");
  const [changePeriod, setChangePeriod] = useState("netChange");
  const [percentChange, setPercentChange] = useState("percentChange");
  const [chartURL, setChartURL] = useState("");
  // const [asOnDate, setAsOnDate] = useState("");


  function getIndicesData() {
    fetch('https://etapi.indiatimes.com/et-screener/index-byid?indexids=2369,2365,2371,1913')
    .then(response => response.json())
    .then(data => {
      setIndicesData(data);
      console.log('Success:', data);
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

  useEffect(() => {

    let chartURL = indicesData?.indicesList?.[activeIndex]?.graphURL || "";
    chartURL = isDev ? chartURL.replace("https://economictimes.indiatimes.com", "https://etdev8243.indiatimes.com") : chartURL;
    // append period; if chartURL does not contain query string, append with '?', else append with '&'
    chartURL += `${chartURL.includes('?') ? '&' : '?'}period=${period}`;    
    setChartURL(chartURL);
  }, [activeIndex, period, indicesData]);

  return (
    <>
      <div>
        <div className={styles.top}>
          <HeadingWithRightArrow title="Indices" />
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
              }}
            >
              {item.value}
            </span>
          ))}
        </div>
        <div className={styles.indiceTabs}>
          {
            indicesData?.indicesList?.slice(0, 3)?.map((item: any, index: number) => (
              <div key={index} className={`${styles.indiceTab} ${activeIndex == index ? styles.active : ""}`} onClick={() => setActiveIndex(index)}>
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
            <a href={`/markets/indices/${indicesData?.indicesList?.[activeIndex]?.seoName}`}>View {indicesData?.indicesList?.[activeIndex]?.indexName}</a>
          </div>
        </div>
      </div>    
      <style jsx>{`
        .numberFonts {
          font-size: 10.5px;
          font-weight: 500;
        }
      `}</style>
    </>
  )
}
