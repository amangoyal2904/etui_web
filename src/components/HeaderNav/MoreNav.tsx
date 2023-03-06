import React from 'react'
import styles from "./styles.module.scss";

const MoreNav = (props) => {
  const {nm, sec} = props.sec;
  console.log("sec========", sec)
  return (
    <>
      <div className={styles.flt}>
        {
          sec.map((elm, index) => {
            return (
              <>
                {elm.nm != "Brand Solutions" && <a href={elm.link} className={styles.subsec1} rel={elm.rel && elm.rel}>{elm.nm}</a>}
                {
                  elm.nm != "Brand Solutions" && elm.sec && elm.sec.map((elm2, index) => {
                    return (
                      <>
                        <a href={elm2.link} className={styles.subsec2} rel={elm2.rel && elm2.rel}>{elm2.nm}</a> 
                      </>
                    )
                  })
                }
              </>
            )
          })
        } 
      </div> 
      <div className={styles.flt}>
        {
          sec.map((elm, index) => {
            return (
              <>
                {elm.nm == "Brand Solutions" && <div className={styles.subsec1}>{elm.nm}</div>}
                {
                  elm.nm == "Brand Solutions" && elm.sec && elm.sec.map((elm2, index) => {
                    return (
                      <div key={`${index}`} className={styles.flt}>
                        <a href={elm2.link} className={styles.subsec2} target="_blank" rel={`noreferrer ${elm2.rel && elm2.rel}`}>
                          <img src={elm2.im} width="77" height="63" alt={elm2.nm} />
                        </a>
                        <h5>
                          <a href={elm2.link} className={styles.subsec2} target="_blank" rel={`noreferrer ${elm2.rel && elm2.rel}`}>{elm2.nm}</a>
                        </h5>
                      </div>
                    )
                  })
                }
              </>
            )
          })
        } 
      </div> 
    </>
  )
}

export default MoreNav
