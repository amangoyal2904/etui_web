import { useState } from 'react';
import styles from './styles.module.scss';
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';

export default function StockReportPlus() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ["High Upside", "Top Score Companies", "Score Upgrade"];

  return (
    <div>
      <HeadingWithRightArrow title="Stock Report Plus" />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={styles.card}>
        <div><span className={styles.cat}>BUY</span> | Call Date: Sep 6, 2022</div>
        <div className={styles.title}>Maruti Suzuki India Limited</div>
        <div className={styles.row}>
          <div className={`${styles.col} ${styles.up}`}>
            Potential Upside
            <span className={styles.number}>12.5%</span>
          </div>
          <div className="col">
            Target
            <span>797</span>

            <br/>

            Price @ Recos
            <span>725.34</span>
          </div>
          <div className="col">
            Current Price
            <span>635.45</span>

            <a href="https://img.etimg.com/photo/113322366.cms" title="Kolte-Patil Dev. View Report" target="_blank">View Report</a>
          </div>  
        </div>
        <div className={styles.footer}>
          Brokerage <a href="#">ICICI Direct</a>
        </div>
      </div>

      <ViewAllCta title="High Upside Stocks" url="/stock-report-plus" />
    </div>
  )
}
