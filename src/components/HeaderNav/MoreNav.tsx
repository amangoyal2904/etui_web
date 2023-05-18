import React from 'react';
import styles from "./styles.module.scss";

// define the props interface
interface MoreNavProps {
  sec: {
    nm: string;
    link: string;
    rel?: string;
    sec?: {
      nm: string;
      link: string;
      rel?: string;
      im?: string;
    }[];
  }[];
}

// define the MoreNav functional component
const MoreNav: React.FC<MoreNavProps> = ({ sec }) => {
  // use destructuring to extract the "sec" prop
  // and rename it to "nm" for readability
  return (
    <>
      <div className={styles.flt}>
        {sec?.map((nmSection, index) => {
          // use destructuring to extract "nm" and "sec" properties
          const { nm, sec: subSec } = nmSection;

          // check if "nm" is not "Brand Solutions"
          if (nm !== "Brand Solutions") {
            return (
              <React.Fragment key={`more-nav-${index}`}>
                <a href={nmSection.link} className={styles.subsec1} rel={nmSection.rel}>{nmSection.nm}</a>
                {/* only render sub-sections if they exist */}
                {subSec && subSec?.map((subSection, index2) => {
                  return (
                    <React.Fragment key={`more-nav-${index}-${index2}`}>
                      <a href={subSection.link} className={styles.subsec2} rel={subSection.rel}>{subSection.nm}</a> 
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          }
        })}
      </div> 

      <div className={`${styles.flt} ${styles.brandSolution}`}>
        {sec?.map((nmSection, index) => {
          const { nm, sec: subSec } = nmSection;

          // check if "nm" is "Brand Solutions"
          if (nm === "Brand Solutions") {
            return (
              <React.Fragment key={`brand-solution-${index}`}>
                <div className={`${styles.subsec1} ${styles.brand_heading}`}>{nmSection.nm}</div>
                {subSec && subSec.map((subSection, index2) => {
                  return (
                    <div key={`brand-solution-${index}-${index2}`} className={`${styles.BSChild}`}>
                      {/* only render the image if the "im" property exists */}
                      {subSection.im && <a href={subSection.link} className={styles.subsec2} target="_blank" rel={`noreferrer ${subSection.rel && subSection.rel}`}>
                        <img src={subSection.im} width="77" height="63" alt={subSection.nm} />
                      </a>}
                      <h5>
                        <a href={subSection.link} className={styles.subsec2} target="_blank" rel={`noreferrer ${subSection.rel && subSection.rel}`}>{subSection.nm}</a>
                      </h5>
                    </div>
                  )
                })}
              </React.Fragment>
            )
          }
        })}
      </div>
    </>
  )
}

export default MoreNav;
