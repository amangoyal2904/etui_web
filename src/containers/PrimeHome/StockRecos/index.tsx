import RightArrow from 'components/Icons/RightArrow';
import styles from './styles.module.scss';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { useState, useEffect } from 'react';
import Tabs from '../Tabs';
import ViewAllCta from '../ViewAllCta';
import ViewReportCta from '../ViewReportCta';
import API_CONFIG from '../../../network/config.json';

export default function StockRecos({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData]: any = useState([]);
  const tabs = ["New Recos", "Most Buys", "Most Sells"];

  useEffect(() => {
    const api = API_CONFIG["GET_RECOS_DETAILS"][window.APP_ENV];

    const type = "newRecos";

    const payload = {
      apiType: type,
      filterType: "",
      filterValue: [],
      recoType: "all",
      pageSize: 5,
      pageNumber: 1,
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
      <div>
        <HeadingWithRightArrow title="Stock Recos" />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="cardsWrapper">
          {
            data?.slice(0, howMany)?.map((item, index) => (
              <div className={styles.card} key={index}>
                <div className={styles.firstRow}><span className={styles.cat}>{item?.recoType}</span> | Call Date: Sep 6, 2022</div>
                <div className={styles.title}><a href={`/${item?.companySeoName}/stocks/companyid-${item?.companyId}.cms`}>{item?.companyName}</a></div>
                <div className={styles.row}>
                  <div className={`${styles.col} ${styles.up}`}>
                    {item?.potentialText}
                    <span className={styles.number}>{item?.potentialValue}</span>
                  </div>
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
                </div>
                <div className={styles.footer}>
                  Brokerage <a href="#">{item?.organisation}</a>
                </div>
                <span className={`addToWatchListIcon`}>&#43;</span>
              </div>
            ))
            
          }
        </div>
        
        <ViewAllCta title="Stock Recos" url="/markets/stock-recos/overview" />
      </div>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }
      `}</style>
    </>
  )
}
