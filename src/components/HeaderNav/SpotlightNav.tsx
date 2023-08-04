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
              {
                value.sec?.map((value1, index1) => {
                  return (
                    <>
                      {
                        value.nm == "Brand Solution" ?
                        <>
                          <div>
                            <a href={value1.link}>
                              <img src={value1.im} />
                            </a>
                            <a href={value1.link}>
                              {value1.nm}
                            </a>
                          </div>
                        </>
                        : <>
                          <div>
                            <a href={value1.link}>
                              <img src={value1.im} />
                            </a>
                            <a href={value1.link}>
                              {value1.nm}
                            </a>
                          </div>
                        </>
                      }
                    </>
                  )
                })
              }
            </>
          )
        })
      }
    </>
  )
}

export default SpotlightNav;