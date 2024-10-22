import React, { useState, useEffect } from 'react'
import styles from "./styles.module.scss";
import Loading from "../../components/Loading";

const NriWidget = ({title, tabsData}) => {
  const tabs = tabsData
  const [activeTab, setActiveTab]:any = useState(tabsData[0] || {});
  const [plistContent, setPlistContent] = useState([]);
  const [loading, setLoading] = useState(false);

  

  const fetchContent = async (plistId: any) => {
    
    // Replace with your actual API endpoint\
    setLoading(true)
    const APIURL = `https://etpwaapi.economictimes.com/request?type=plist&msid=${plistId}&top=1`
     const response = await fetch(APIURL);
     const data = await response.json();
     setLoading(false);
     if(data && data?.searchResult[0]?.data){
      setPlistContent(data?.searchResult[0]?.data);
     }
     
     console.log("___data",data)
    // setContent(data);
  };

  

  useEffect(() => {
    fetchContent(activeTab.plistId);
  }, [activeTab.tabId]);

  return (
    <div className={styles.tabwidget}>
      <div className={`${styles.cbanner} ${title === "USA" ? styles.twoBanner : ""}`}>
        <h2>{title}</h2>
      </div>
      <div className={styles.content}>
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.tabId}
              className={activeTab.tabId === tab.tabId ? styles.active : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab.tabId}
            </li>
          ))}
        </ul>

        <div className={styles.mainContent}>
          {
            loading ? <Loading /> :
            plistContent && plistContent.length > 0 && plistContent.map((item:any, index:number)=>{
              return(
                <div key={`tabcontent-${index}`} className=''>
                    <div className={styles.loadContent}>
                        <div className={styles.content}>
                            <a target="_blank" href='#'>{item?.title}</a>
                            <p>{item?.synopsis}</p>
                    
                        </div>
                        <a target="_blank" href={item?.url} className={styles.imglink}>
                            <img width="130" height="160" alt={item?.title} loading="lazy" src={item?.img} />
                            {/* {item.type === "slideshow" && <span className={`${styles.subSprite} ${styles.slideIcon}`}></span> } */}
                        </a>
                      </div>
                      <div className={styles.moreLink}>More from <a  className={styles.bdr_btm} target="_blank" href={activeTab.plistId}>{title}<span className={styles.dbl_arw}></span></a></div>
                    </div>
              )
            })
          }
        </div>
        
        {/* {plistContent && (
          <div className={styles.loadContent}>
            <div className={styles.content}>
              <a target="_blank" href={plistContent.url}>{plistContent.title}</a>
              <p>{plistContent.description}</p>
            </div>
            <a target="_blank" href={content.url} className={styles.imglink}>
              <img width="130" height="160" alt={content.title} loading="lazy" src={content.imageUrl} />
            </a>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default NriWidget