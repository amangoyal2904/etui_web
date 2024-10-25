import React from 'react'
import styles from "./styles.module.scss";

const NriSecWidget = ({title, titleurl ='', widgetId, data}:any) => {
  const first = data?.[0];
  const secondThird = data?.slice(0, 5);
  const rest = data?.slice(5, 7);
  const rhsStories = data.slice(7, 12);

  return (
    <>
      <section className={styles.nriListbot}>
          <div className={styles.contentwrapper}>
              <div className={styles.subsec}>
                {/* <div className={styles.HeadDiv}>
                    <h2 className={styles.secHead}>
                      {
                        titleurl !== "" ? <a target="_blank" className={styles.bold} href={titleurl}>{title}</a> : title
                      }
                      
                    </h2>
                    <div className={styles.more_wrapper}>
                      <span className={styles.more_label}><span>More From </span><a target="_blank" className={styles.bold} href={titleurl}>{title}<span className={styles.dbl_arw}></span></a></span>
                    </div>
                </div> */}
              <div className={styles.subsecArticles}>
                <div className={styles.mainStory}>
                  <div className={styles.flt}>
                      <a target="_blank" title={first?.title} href={first?.url}>
                        <img alt={first?.title} src={first?.img} height="225" width="300" />
                      </a>
                  </div>
                  <div className={styles.content}>
                      <h2><a target="_blank" className={styles.wrapLines} title={first?.title} href={first?.url}>{first?.title}</a></h2>
                      <p className={styles.desc}>{first?.synopsis}</p>
                  </div>
                    </div>
                    <div className={styles.clearfix}>
                      <div className={styles.lhsStories}>
                        {secondThird?.map((item, index) => {
                          return (
                            <div className={index === secondThird.length - 1 ? styles.lhsBlwStories_nob : styles.lhsBlwStories}>
                              <h3><a target="_blank" className={styles.wrapLines} title={item?.title} href={item?.url}>{item?.title}</a></h3>
                            </div>
                          );
                        })}
                        
                      </div>
                      <div className={styles.rhsStories}>
                        {rest?.map((item, index) => {
                          return (
                            <div className={index === rest.length - 1 ? styles.lhsBlwStories_nob : styles.lhsBlwStories}>
                                {
                                  index === 0 && item?.img && <a target="_blank" title={item?.title} href={item?.url}><img className={styles.flr} alt={item?.title} src={item?.img} height="75" width="100" /></a>
                                }
                              <h3><a target="_blank" className={styles.wrapLines} title={item?.title} href={item?.url}>{item.title}</a></h3>
                                {
                                  index === 0 && <p className={styles.desc}>{item?.synopsis}</p>
                                }
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={styles.rightStories}>
                      {rhsStories?.map((item, index) => {
                          return (
                            <div className={index === rhsStories.length - 1 ? styles.lhsBlwStories_nob : styles.lhsBlwStories}>
                              {
                              index === 0 && item?.img &&  <a target="_blank" title={item?.title} href={item?.url}><img alt={item?.title} src={item?.img} height="240" width="320" /></a>
                              }
                              <h3><a target="_blank" className={styles.wrapLines} title={item?.title} href={item?.url}>{item?.title}</a></h3>
                            </div>
                          );
                        })}
                  </div>
              </div>
          </div>
      </section>
    </>
  )
}

export default NriSecWidget
