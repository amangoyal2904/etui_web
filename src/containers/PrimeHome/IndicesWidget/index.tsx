import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { formatNumber, chartIntervals, durationOptions } from 'utils/market';
import HeadingWithRightArrow from '../HeadingWithRightArrow';

export default function IndicesWidget({ isDev }) {
  const [indicesData, setIndicesData]: any = useState([]);
  const [activeIndex, setActiveIndex] = useState("2369");
  const [period, setPeriod] = useState("1w");
  const [changePeriod, setChangePeriod] = useState("netChange");
  const [percentChange, setPercentChange] = useState("percentChange");

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

  return (
    <>
      <div>
        <div className={styles.top}>
          <HeadingWithRightArrow title="Indices" />
          <span className="statusNDate">
            <span className={styles.status}>{indicesData?.marketStatusDto?.currentMarketStatus}</span>
            <span className={styles.date}>| As on {}</span>
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
              <div key={index} className={`${styles.indiceTab} ${activeIndex == item?.indexId ? styles.active : ""}`} onClick={() => setActiveIndex(item?.indexId)}>
                <div className="indexName">{item.indexName}</div>
                <div className="indexPrice">{formatNumber(item.lastTradedPrice || 0)}</div>
                <div className={`numberFonts ${item[changePeriod] > 0 ? styles.up : item[changePeriod] < 0 ? styles.down : ""} ${styles.indexChange}`}>
                  {`${item[changePeriod].toFixed(2)} (${item[percentChange].toFixed(2)}%)`}
                  <span
                    className={`${styles.arrowIcons} ${
                      item[changePeriod] > 0
                        ? `${styles.up} ${styles.eticon_up_arrow}`
                        : item[changePeriod] < 0
                          ? `${styles.down} ${styles.eticon_down_arrow}`
                          : ""
                    }`}
                  />
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.chartContainer}>
          <iframe className={styles.chart} src={`https://${isDev ? 'etdev8243' : 'economictimes'}.indiatimes.com/renderchart.cms?type=index&symbol=NSE Index&exchange=NSE&period=1d&height=220&transparentBg=1`} />
          <div className={styles.chartFooter}>
            <a href="#">View Nifty 50</a>
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
