import React from 'react'
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';

export default function BigBullPortfolio() {
  const [activeTab, setActiveTab] = React.useState(0)
  const tabs = ["Best Picks", "Recent Deals", "All Investors"];

  return (
    <div>
      <HeadingWithRightArrow title="BigBull Portfolio" />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <ViewAllCta title="Portfolio" url="/bigbull-portfolio" />
    </div>
  )
}
