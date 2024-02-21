import React, { FC } from 'react';
import styles from "./styles.module.scss";

interface SpotlightNavProps {
  sec: {
    nm: string;
    link: string;
    im: string;
    rel?: string;
    sec?: any[];
  }[];
}

const SpotlightNav: React.FC<SpotlightNavProps> = ({ sec }) => {
  console.log("Spotlight sec", sec);
  return (
    <>
      {
        sec?.map((value, index) => {
          return (
            <>
              <div className={`${value.nm == "Innovative Solution" ? styles.Edition_carouseltwo : styles.Edition_carouselone}`}>
                {value.nm == "Innovative Solution" && <h2>{value.nm}</h2>}
                <ul>
                  {
                    value.sec?.map((value1, index1) => {
                      return (
                        <>
                          <li key={index1}>
                            {
                              value1 && Array.isArray(value1) && value1.map((value2, index2) => {
                                return (
                                  <>
                                    <div className={styles.spotlightContent} key={index2}>
                                      <a href={value2.link}>
                                        <img src={value2.im} width="120" height="70" alt={value2.nm} />
                                      </a>
                                      <a className={styles.txt} href={value2.link}>
                                        {value2.nm}
                                      </a>
                                    </div>
                                  </>
                                )
                              })
                            }
                          </li>
                        </>
                      )
                    })
                  }
                </ul>
              </div>
            </>
          )
        })
      }
    </>
  )
}

export default SpotlightNav;