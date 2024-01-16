import React, { FC } from "react";
import styles from "./styles.module.scss";

interface SubSecNavProps {
  data: {
    nm: string | string[];
    link: string;
    msid: string;
    sec?: {
      nm: string | string[];
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

const MoreSubSecNavHtml: FC<SubSecNavProps> = ({ subsecnames, data, index }) => {
  // Create a unique key for the current data item
  const keyName = `moreSubSecNavHtml-${index}`;
  const {subsec1, subsec2, subsec3} = subsecnames;

  // Check if the required data properties exist, otherwise handle the error
  if (!data.nm || !data.link) {
    return <div>Error: Invalid data object</div>;
  }

  return (
    <React.Fragment key={keyName}>
      {/* Add a unique key for the main link */}
      <a key={`l2_${index}`} href={data.link}  className={`${subsec2 == data.msid && styles.current} ${styles.subsec1}`}>
        {data.nm}
      </a>
      {/* Check if there are any sub-sections */}
      {data.sec &&
        data.sec?.map((l2, index2) => {
          // Create a unique key for the current sub-section
          const keyName_l2 = `moreSubSecNavHtml-${index}-${index2}`;

          // Check if the required sub-section properties exist, otherwise handle the error
          if (!l2.nm || !l2.link) {
            return <div key={keyName_l2}>Error: Invalid sub-section object</div>;
          }

          return (
            <React.Fragment key={keyName_l2}>
              <a href={l2.link} className={styles.subsec2}>
                {l2.nm}
              </a>
              {/* Check if there are any sub-sections */}
              {l2.sec 
                && l2.sec.map((l3, index3) => {
                  // Create a unique key for the current sub-section
                  const keyName_l3 = `subSecNavHtml-${l3.nm}-${index}-${index2}-${index3}`;

                  return (
                    <React.Fragment key={keyName_l3}>
                      <a href={l3.link} className={styles.subsec3} data-ga-onclick={l3.link}>
                        {l3.nm}
                      </a>
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
};

export default MoreSubSecNavHtml;
