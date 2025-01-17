import React, { useEffect, useState, MouseEvent } from 'react';
import styles from "./styles.module.scss";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import { ET_WEB_URL } from "utils/common";

// Define the type for the props passed to TechNav component
interface TechNavProps {
  sec: {
    nm: string;
    msid: number;
    link: string;
  }[];
  count: number;
  msid: number;
}

interface TechNavListBlock {
  msid: number;
  data: any[];
  status: string
}

const TechNav: React.FC<TechNavProps> = ({ sec, count, msid }) => {
  // Use the useState hook to manage the component state
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  const [techNavListBlock, setTechNavListBlock] = useState<TechNavListBlock[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getTechArticleList = async (msid: number) => {
    const url = APIS_CONFIG.techNavArticleList[window.APP_ENV];
    
    try {
      const res = await Service.get({
        url,
        params: { feedtype: "etjson", msid },
      });
      const resData = res?.data || [];
      // Remove the loading status entry
      setTechNavListBlock(prev => prev.filter(block => block.msid !== msid));
      
      //let articleListObj: TechNavListBlock[] = [...techNavListBlock, { msid, data: resData, status: "success" }];
      setTechNavListBlock(prev => [...prev, { msid, data: resData, status: "success" }]);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data");

      // Remove the loading status entry in case of error
      setTechNavListBlock(prev => prev.filter(block => block.msid !== msid));
    }
  };

  useEffect(() => {
    getTechArticleList(78404305);
  }, []);

  useEffect(() => {
    const activeClass = styles["active"];
    const showClass = styles["show_block"];
    const activeElement = document.querySelector(`.${activeClass}`);
    const targetElementId = activeElement?.getAttribute("data-rel-id") || "";

    // Get the techNavArticleBlock element and its child element with matching data-rel-id attribute
    const techNavArticleBlock = document.getElementById("technav_art");
    const targetElement_articleBlock = techNavArticleBlock?.querySelector(`[data-rel-id="${targetElementId}"]`);

    if (targetElement_articleBlock && !targetElement_articleBlock?.hasAttribute('data-loading-id')) {
      // console.log("techNavListBlock hook if", targetElementId)
      targetElement_articleBlock.classList.add(showClass);
    }

    const siblings_articleBlock = techNavArticleBlock?.querySelectorAll(`.${showClass}`);

    siblings_articleBlock?.forEach((sibling) => {
      if (sibling !== targetElement_articleBlock) {
        sibling.classList.remove(showClass);
      }
    });

  }, [techNavListBlock])

  // Define the handleMouseOver function to handle mouseover event on the links
  const handleMouseOver = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      const targetElement = event.currentTarget;
      const activeClass = styles["active"];
      const showClass = styles["show_block"];
      const targetElementId = targetElement.getAttribute("data-rel-id");

      // Get the techNavArticleBlock element and its child element with matching data-rel-id attribute
      const techNavArticleBlock = document.getElementById("technav_art");
      const targetElement_articleBlock = techNavArticleBlock?.querySelector(`[data-rel-id="${targetElementId}"]`);

      // Add showClass to the targetElement_articleBlock element
      if (targetElement_articleBlock && !targetElement_articleBlock?.hasAttribute('data-loading-id')) {
        targetElement_articleBlock.classList.add(showClass);
      } else {
        // Check if the msid already exists
        const exists = techNavListBlock.some(block => block.msid === parseInt(targetElementId || "0", 10));

        // Add a loading status entry if it doesn't already exist
        if (!exists) {
          setTechNavListBlock(prev => [...prev, { msid: parseInt(targetElementId || "0", 10), data: [], status: "loading" }]);
        }

        getTechArticleList(parseInt(targetElementId || "0", 10));
      }

      // Add activeClass to the hovered element
      targetElement.classList.add(activeClass);

      // Remove activeClass from all the siblings of the hovered element
      const siblings = targetElement.parentNode?.querySelectorAll(`.${activeClass}`);
      const siblings_articleBlock = techNavArticleBlock?.querySelectorAll(`.${showClass}`);

      siblings?.forEach((sibling) => {
        if (sibling !== targetElement) {
          sibling.classList.remove(activeClass);
        }
      });

      siblings_articleBlock?.forEach((sibling) => {
        if (sibling !== targetElement_articleBlock) {
          sibling.classList.remove(showClass);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Render the component
  return (
    <>
      <div className={styles.techNav1st}>
        <a
          title="Tech"
          data-ga-onclick="/tech"
          onMouseOver={(event) => handleMouseOver(event)}
          href={`${ET_WEB_URL}/tech`}
          className={styles.active}
          data-rel-id="78404305"
        >
          TECH
        </a>
        {/* Render the sub-section links */}
        {sec?.map((seclist, index) => {
          return (
            <React.Fragment key={`tech_nav_${seclist.msid}_${index}`}>
              <a
                href={seclist.link}
                data-rel-id={seclist.msid == 94028772 ? 94299203 : seclist.msid == 60529947 ? 33112763 : seclist.msid}
                onMouseOver={(event) => handleMouseOver(event)}
                className={styles.subsec1}
              >
                {seclist.nm}
              </a>
            </React.Fragment>
          );
        })}
      </div>
      {/* Render the data elements */}
      <div id="technav_art" className={styles.mLast}>
        { techNavListBlock.map((obj, index) => {
          return (
            <React.Fragment key={`tech_nav_${obj.msid}_${index}`}>
              {
                obj.status == "loading" ? <div data-rel-id={obj.msid} data-loading-id="loading"><p>Loading...</p></div> : (<div data-rel-id={obj.msid} >
                  {obj?.data?.slice(0, 1)?.map((data, index1) => {
                    return (
                      <React.Fragment key={`tech_nav_first_${obj.msid}_${index}_${index1}`}>
                        <div className={styles.first}>
                          <h3>
                            <a href={data.link['@href']}>{data.stname}</a>
                          </h3>
                          <a href={data.link['@href']}>
                            <img src={data.im} width="120" height={90} className={styles.tech_im} alt={data.stname} loading="lazy"  />
                          </a>
                          <p className={`${styles.wrapLines} ${styles.l5}`}>{data.strsyn}</p>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div className={`${styles.other} ${obj.msid == 94299203 && styles.eventsBlockTech}`}>
                    {obj?.data?.slice(1)?.map((data, index1) => {
                      return (
                        <React.Fragment key={`tech_nav_other_${obj.msid}_${index}_${index1}`}>
                          {(obj.msid == 94299203 ? (
                            <div className={styles.navBlock}>
                              <a target="_blank" rel="noreferrer" href={data.link['@href']}>
                                <img src={data.im} width="120" height={90} className={styles.tech_im} alt={data.stname} loading="lazy"  />
                              </a>
                              <a target="_blank" rel="noreferrer" className={styles.eventsBlockTechLinks} href={data.link['@href']}>
                                {data.stname}
                              </a>
                            </div>
                          ) : (
                            <a className={styles.subsec3} href={data.link['@href']}>
                              {data.stname}
                            </a>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>)
              }
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default TechNav;
