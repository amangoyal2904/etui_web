import RightArrow from 'components/Icons/RightArrow';
import styles from './styles.module.scss';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { useState } from 'react';
import Tabs from '../Tabs';
import ViewAllCta from '../ViewAllCta';

export default function StockRecos() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["New Recos", "Most Buys", "Most Sells"];

  return (
    <div>
      <HeadingWithRightArrow title="Stock Recos" />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={styles.card}>
        <div className={styles.firstRow}><span className={styles.cat}>BUY</span> | Call Date: Sep 6, 2022</div>
        <div className={styles.title}>Maruti Suzuki India Limited</div>
        <div className={styles.row}>
          <div className={`${styles.col} ${styles.up}`}>
            Potential Upside
            <span className={styles.number}>12.5%</span>
          </div>
          <div className={styles.col}>
            <span>
            Target
            <span className="bold">797</span>
            </span>
            
            <span>
              Price @ Recos
              <span>725.34</span>
            </span>
          </div>
          <div className={styles.col}>
            <span className={styles.first}>
              Current Price
              <span>635.45</span>
            </span>
            <a href="https://img.etimg.com/photo/113322366.cms" title="Kolte-Patil Dev. View Report" target="_blank" className={styles.viewReport}><span className={styles.pdfIcon}></span> View Report</a>
          </div>  
        </div>
        <div className={styles.footer}>
          Brokerage <a href="#">ICICI Direct</a>
        </div>
        <span className={styles.addToWatchListIcon}>&#43;</span>
      </div>
      <div className={styles.card}>
        <div className={styles.firstRow}><span className={styles.cat}>BUY</span> | Call Date: Sep 6, 2022</div>
        <div className={styles.title}>Maruti Suzuki India Limited</div>
        <div className={styles.row}>
          <div className={`${styles.col} ${styles.up}`}>
            Potential Upside
            <span className={styles.number}>12.5%</span>
          </div>
          <div className={styles.col}>
            <span>
            Target
            <span className="bold">797</span>
            </span>
            
            <span>
              Price @ Recos
              <span>725.34</span>
            </span>
          </div>
          <div className={styles.col}>
            <span className={styles.first}>
              Current Price
              <span>635.45</span>
            </span>
            <a href="https://img.etimg.com/photo/113322366.cms" title="Kolte-Patil Dev. View Report" target="_blank" className={styles.viewReport}><span className={styles.pdfIcon}></span> View Report</a>
          </div>  
        </div>
        <div className={styles.footer}>
          Brokerage <a href="#">ICICI Direct</a>
        </div>
        <span className={styles.addToWatchListIcon}>&#43;</span>
      </div>
      
      <ViewAllCta title="Stock Recos" url="/stock-recos" />
    </div>
  )
}
