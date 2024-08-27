"use client"
import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss';
import { fetchAllMetaInfo } from 'utils/articleUtility';

const StickyFooter = (props:any) => {
  const {contentArray, bandObj} = props;
  const [allMetaData, setAllMeta] = useState<any>({});
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(()=>{
    const fetchMetaInfo = async() => {
    const allMetaData = await fetchAllMetaInfo(bandObj?.contentCmsId) || {};
    setAllMeta(allMetaData);
    }
    fetchMetaInfo();
  },[])

  const handleClose = () =>{
    setIsVisible(false);
  }
  // console.log("@@@ bandObj --->???????????? ", allMetaData);
  return(
    <>
    {isVisible && bandObj?.bannerType === "type1" && (
      <div className={`${styles.stickyBand} ${bandObj?.bannerWidth === 'short' ? styles.short : ''}`}>
          <div className={styles.bandContainer}>
            <div className={styles.logoBox}></div>
            <div className={styles.contentBox}>
              <div className={styles.contentLeft}>
               {allMetaData?.productUserRating && <h2>{allMetaData?.productUserRating}</h2>}
               {allMetaData?.ContentRulesInfoGraphicId && <p>{allMetaData?.ContentRulesInfoGraphicId}</p>}
              </div>
              <div className={styles.contentRight}>
                {allMetaData?.BlogPost && <p>{allMetaData?.BlogPost}</p>}
                {allMetaData.ColumnLabel && <a href={allMetaData?.ColumnLabel}>{allMetaData?.BlogsName}</a>}
                
              </div>
            </div>
          </div>
          {!bandObj.hideCloseBtn &&(
            <div onClick={handleClose} className={`${styles.closeBtn}`}></div>
          )}
        </div>
      )
          }
    </>
  )
}

export default StickyFooter
