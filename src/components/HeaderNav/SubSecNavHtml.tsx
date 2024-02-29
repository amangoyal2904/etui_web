import React, { FC } from "react";
import CommoditiesNav from "./CommoditiesNav";
import styles from "./styles.module.scss";

interface SubSecNavProps {
  data: {
    nm: string;
    link: string;
    msid: string;
    sec?: {
      nm: string;
      link: string;
      msid: string;
      sec?: {
        nm: string;
        link: string; 
        msid: string;
      }[]
    }[];
  };
  index: number;
  subsecnames: any;
}

const SubSecNavHtml: FC<SubSecNavProps> = ({ subsecnames, data, index }) => {
  // Create a unique key for the current data item
  const keyName = `subSecNavHtml-${data.nm}-${index}`;
  const {subsec1, subsec2, subsec3} = subsecnames;
  
  return (
    <div key={keyName} data-ga-action={data.nm} className={data.sec ? styles.subLevel : ""}>
      {/* Add a unique key for the main link */}
      <a href={data.link} className={subsec2 == data.msid ? styles.current : ''} data-ga-onclick={data.link}>
        {data.nm}
        {/* Add a unique key for the down arrow */}
        {data.sec && <span key={`arrow_${index}`} className={styles.downArw}></span>}
      </a>
      {/* Check if there are any sub-sections */}
      {data.sec && (
        data?.msid == "1808152121" ? <CommoditiesNav sec={data.sec} /> :
        <div className={`${styles.miniMenu}`}>
          {/* Map over the sub-sections */}
          {data?.sec.map((l2, index2) => {
            // Create a unique key for the current sub-section
            const keyName_l2 = `subSecNavHtml-${l2.nm}-${index}-${index2}`;

            return (
              <div key={keyName_l2} data-ga-action={l2.nm}>
                <a href={l2.link} data-ga-onclick={l2.link} className={`${subsec3 == l2.msid ? styles.current : ''} ${styles.subsec2}`}>
                  {l2.nm}
                </a>
                {/* Check if there are any sub-sections */}
                {l2.sec && l2.sec.map((l3, index3) => {
                      // Create a unique key for the current sub-section
                      const keyName_l3 = `subSecNavHtml-${l3.nm}-${index}-${index2}-${index3}`;

                      return (
                        <React.Fragment key={keyName_l3}>
                          <a href={l3.link} data-ga-onclick={l3.link} className={styles.subsec3}>
                            {l3.nm}
                          </a>
                        </React.Fragment>
                      );
                    })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubSecNavHtml;

