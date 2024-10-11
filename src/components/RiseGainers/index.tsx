
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ET_WEB_URL } from "../../utils/common";

interface gainersDataResponse {
    searchresult: Array<{
      indexName: string;
      dateTime: string;
      currentIndexValue: number;
      perChange: number;
      netChange: number;
      companies: Array<{
        companyShortName: string;
        seoName: string;
        companyId: string;
        current: number;
        percentChange: number;
      }>;
    }>;
  }

const MarketGainers = ({ isDev }) => {
    const [activeSlide, setActiveSlide] = useState('gainer');

    const [compnData, setCompnData]:any = useState([]);
    function setSlide(name){
        //debugger;
        if(name == activeSlide) return
        setActiveSlide(name);
    }

    const fetchData = async (slidename) => {
        try {
        const response = await fetch(`https://etmarketsapis.indiatimes.com/${slidename=='gainer' ? 'ET_Stats/gainersHomePage?exchange=nse' : '/ET_Stats/losersHomePage?sortorder=asc'}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
             }
        const data = await response.json();
        setCompnData(data?.searchresult);
        //console.log("@@@ Data -->", data?.searchresult)
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
  useEffect(() => {
    fetchData(activeSlide);
    const intervalId = setInterval(fetchData, 24000); // 24000 milliseconds = 24 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [activeSlide]);

    return <>
    
      <div className={styles.marketChangeMain}>
        <h3 className={styles.marketChangeTitle}>
            <span className={styles.h_name}>{activeSlide === 'gainer' ? 'Gainers' : 'Losers'}</span>
            <div className={`${styles.btn_wrp}, ${styles.flr}`}>
                <span className={`${styles.ar_btn}, ${styles.gl_prev}`} onClick={()=> {setSlide("gainer")} }></span>
                <span className={`${styles.ar_btn}, ${styles.gl_next}`} onClick={()=> {setSlide("loser")} }></span>
            </div>
        </h3>
        
        <div className={styles.currDataBox}>
            <div className={styles.topcomp}>
                <a title={`${compnData[0]?.companyShortName}`} target="_blank" href={`${ET_WEB_URL}/${compnData[0]?.seoName}/stocks/companyid-${compnData[0]?.companyId}.cms`}><span className={styles.c_name}>{compnData[0]?.companyShortName}</span></a>
            </div>
            <span className={styles.currVal}>{compnData[0]?.current}</span>
            <span className={`${styles.changeval} ${compnData[0]?.percentChange > 0 ? styles.up : styles.down}`}>
                <span className={`${styles.subSprite} ${styles.icon_arrow} ${compnData[0]?.percentChange > 0 ? styles.up : styles.down}`}></span>
                <span>{compnData[0]?.absoluteChange} ({compnData[0]?.percentChange}%)</span>
            </span>
        </div>
        <iframe 
            className={styles.lazyIframe} 
            style={{border: 'none'}} 
            width="246" 
            height="139" 
            src={`https://${isDev ? 'etdev8243' : 'economictimes'}.indiatimes.com/chart.cms?companyId=${compnData[0]?.companyId}&candlestick_insights_show=false&save_layout=false&ga_hit=true&multiple_btn=true&et_logo=false&symbol=${encodeURIComponent(compnData[0]?.ticker || '')}&currencypairname=&exchange=${compnData[0]?.segment}&entity=company&periodicity=&expirydate=&right_align=true&hide_fullscreen=false&chart_type=mountain&tagId=&dsg=&currencypairnameparent=&createdby=&local=&sbl_domain=&layoutchangescheck=true&symbol_search=false&ver=1656060840000&no_menu=1&zoom=false&ohlc_hide=true&background_color=transparent&custom_theme=1&grid_color=false&xaxis_color=%23666`}
            />
        <div className={styles.dataTable}>
          {compnData?.slice(1,4)?.map((data, index) => (
            <div className={styles.dataTableBox} key={`gainersCompany_${index}`}>
              <a className={styles.compName} target="_blank" data-ga-onclick={`gainer - ${data?.companyShortName} - href`} title={`Gainers - ${data?.companyShortName}`}href={`${ET_WEB_URL}/${data?.seoName}/stocks/companyid-${data?.companyId}.cms`}>{data?.companyShortName}</a>
              <span className={styles.curntVal}>{data?.current}</span>
              <span className={`${styles.chngVal}, ${data?.percentChange > 0 ? styles.up : styles.down}`}>({data?.percentChange}%)</span>
            </div>
          ))}
        </div>
        <div className={styles.moreLink}>
            <a target="_blank" href={`https://economictimes.indiatimes.com/stocks/marketstats/${activeSlide === 'gainer' ? 'top-gainers' : 'top-losers'}`}>More {activeSlide === 'gainer' ? 'Gainers' : 'Losers'} &nbsp;»</a>
        </div>
      </div> 
    </>
}
export default MarketGainers;