import React, { useState, useEffect } from 'react'
import styles from "./styles.module.scss";

const NriWidget = () => {
  const [activeTab, setActiveTab]:any = useState({ tabId: 'Study', plistId: 110522920 });
  const [plistContent, setPlistContent] = useState([]);
  const [loading, setLoading] =useState(false);

  

  const fetchContent = async (plistId: any) => {
    // Replace with your actual API endpoint\
    setLoading(true)
    const APIURL = `https://etpwaapi.economictimes.com/request?type=plist&msid=${plistId}&top=1`
     const response = await fetch(APIURL);
     const data = await response.json();
     setLoading(false)
     if(data && data?.searchResult[0]?.data){
      setPlistContent(data?.searchResult[0]?.data);
     }
     
     console.log("___data",data)
    // setContent(data);
  };

  const tabs = [
    { tabId: 'Study', plistId: 110522920 },
    { tabId: 'Work', plistId: 110526445 },
    { tabId: 'Green Card', plistId: 110528760 },
    { tabId: 'Citizenship', plistId: 110528937 },
    { tabId: 'Travel', plistId: 110895928 }
  ];

  useEffect(() => {
    fetchContent(activeTab.plistId);
  }, [activeTab.tabId]);

  return (
    <div className={styles.tabwidget}>
      <div className={styles.cbanner}>
        <h2>U.S.A</h2>
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

        <div className=''>
          {
            loading ? <div className=''>Loadding please wait</div> :
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