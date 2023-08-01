import React, { useEffect, useState, MouseEvent } from 'react';
import styles from "./styles.module.scss";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from '../../utils';

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
}

const TechNav: React.FC<TechNavProps> = ({ sec, count, msid }) => {
  // Use the useState hook to manage the component state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [techNavListBlock, setTechNavListBlock] = useState<TechNavListBlock[]>([]);

  useEffect(() => {
    getTechArticleList(78404305);
  }, []);

  const getTechArticleList = async (msid: number) => {
    const url = APIS_CONFIG.techNavArticleList[APP_ENV];
    try {
      const res = await Service.get({
        url,
        params: { feedtype: "etjson", msid },
      });
      const resData = res?.data || {};
      let articleListObj: TechNavListBlock[] = [...techNavListBlock, { msid, data: resData }];
      setTechNavListBlock(articleListObj);
    } catch (error) {
      console.error(error);
    }
  };

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
      if (targetElement_articleBlock) {
        targetElement_articleBlock.classList.add(showClass);
      } else {
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
          href="/tech"
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
        {techNavListBlock.map((obj, index) => {
          return (
            <React.Fragment key={`tech_nav_${obj.msid}_${index}`}>
              <div data-rel-id={obj.msid} className={styles.show_block}>
                {obj?.data?.slice(0, 1).map((data, index1) => {
                  return (
                    <React.Fragment key={`tech_nav_first_${obj.msid}_${index}_${index1}`}>
                      <div className={styles.first}>
                        <h3>
                          <a href={data.link}>{data.stname}</a>
                        </h3>
                        <a href={data.link}>
                          <img src={data.im} width="120" height={90} className={styles.tech_im} alt={data.stname} />
                        </a>
                        <p className={`${styles.wrapLines} ${styles.l5}`}>{data.strsyn}</p>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div className={`${styles.other} ${obj.msid == 94299203 && styles.eventsBlockTech}`}>
                  {obj?.data?.slice(1).map((data, index1) => {
                    return (
                      <React.Fragment key={`tech_nav_other_${obj.msid}_${index}_${index1}`}>
                        {obj.msid == 94299203 ? (
                          <div className={styles.navBlock}>
                            <a target="_blank" rel="noreferrer" href={data.link}>
                              <img src={data.im} width="120" height={90} className={styles.tech_im} alt={data.stname} />
                            </a>
                            <a target="_blank" rel="noreferrer" className={styles.eventsBlockTechLinks} href={data.link}>
                              {data.stname}
                            </a>
                          </div>
                        ) : (
                          <a className={styles.subsec3} href={data.link}>
                            {data.stname}
                          </a>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default TechNav;
