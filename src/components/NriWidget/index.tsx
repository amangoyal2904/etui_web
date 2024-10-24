import React, { useState, useEffect } from 'react';
import styles from "./styles.module.scss";
import Loading from "../../components/Loading";

interface TabData {
  tabId: string;
  plistId: string;
}

interface NriWidgetProps {
  title: string;
  tabsData: TabData[];
  data?: any[];
}

const NriWidget: React.FC<NriWidgetProps> = ({ title, tabsData, data }) => {
  const [activeTab, setActiveTab] = useState<TabData | null>(tabsData[0] || {});
  const [moreTitle, setMoreTitle] = useState('');
  const [plistContent, setPlistContent] = useState(data);
  const [loading, setLoading] = useState(false);

  const fetchContent = async (plistId: string) => {
    //console.log('@@@___Plist data', plistId);
    setLoading(true);
    const APIURL = `https://etpwaapi.economictimes.com/request?type=plist&msid=${plistId}&top=1`;
    try {
      const response = await fetch(APIURL);
      const data = await response.json();
      setLoading(false);
      if (data && data?.searchResult[0]?.data) {
        setPlistContent(data?.searchResult[0]?.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const handleTabClick = (tab: TabData) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (activeTab && activeTab.plistId) {
      fetchContent(activeTab.plistId);
    }
    if(title === 'USA'){
      setMoreTitle('us')
    }else{
      setMoreTitle(title);
    }
  }, [activeTab]);

  return (
    <div className={styles.tabwidget}>
      <div className={`${styles.cbanner} ${title === "USA" ? styles.twoBanner : ""}`}>
        <h2>{title}</h2>
      </div>
      <div className={styles.content}>
        <ul>
          {tabsData.map(tab => (
            <li
              key={tab.tabId}
              className={activeTab?.tabId === tab.tabId ? styles.active : ''}
              onClick={() => handleTabClick(tab)}
            >
              {tab.tabId}
            </li>
          ))}
        </ul>

        <div className={styles.mainContent}>
          {loading ? (
            <Loading />
          ) : (
            plistContent &&
            plistContent.length > 0 &&
            plistContent.map((item: any, index: number) => (
              <div key={`tabcontent-${index}`} className="">
                <div className={styles.loadContent}>
                  <div className={styles.content}>
                    <a target="_blank" href="#">
                      {item?.title}
                    </a>
                    <p>{item?.synopsis}</p>
                  </div>
                  <a target="_blank" href={item?.url} className={styles.imglink}>
                    <img
                      width="130"
                      height="160"
                      alt={item?.title}
                      loading="lazy"
                      src={item?.img}
                    />
                  </a>
                </div>
                <div className={styles.moreLink}>
                  More from{' '}
                  <a
                    className={styles.bdr_btm}
                    target="_blank"
                    href={`https://economictimes.indiatimes.com/nri/${title}#id_${activeTab?.plistId}`}
                  >
                    {activeTab?.tabId}
                    <span className={styles.dbl_arw}></span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NriWidget;
