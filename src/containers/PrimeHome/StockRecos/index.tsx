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

      <ViewAllCta title="Stock Recos" url="/stock-recos" />
    </div>
  )
}
