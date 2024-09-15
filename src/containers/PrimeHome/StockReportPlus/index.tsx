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

      <ViewAllCta title="High Upside Stocks" url="/stock-report-plus" />
    </div>
  )
}
