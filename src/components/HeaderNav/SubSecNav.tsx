import React, { FC, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import MoreSubSecNavHtml from "./MoreSubSecNavHtml";
import SubSecNavHtml from "./SubSecNavHtml";
import { useStateContext } from "../../store/StateContext";

// Define types for the props
interface SubSection {
  msid: number;
  moreCount: number;
  sec: any[];
}

interface Props {
  subSectionList: SubSection[];
  subsecnames: any;
}


// Define the main component
const SubSecNav: FC<Props> = ({ subSectionList, subsecnames }) => {
  // Get the data for the first navigation item
  const { msid, moreCount, sec } = subSectionList[0];
  const { state, dispatch } = useStateContext();
  const { isPrime } = state.login;

  // Render the component
  return (
    <div className={`${styles.sbnv_wrapper} ${isPrime ? styles.pink_theme : ""}`}>
      <nav className={styles.subsec_nav}>
        {/* Render the first level navigation items */}
        {sec.slice(0, (moreCount || 0) - 1).map((data, index) => (
          <SubSecNavHtml subsecnames={subsecnames} key={`subsec_nav_${index}`} data={data} index={index} />
        ))}

        {/* Render the "More" dropdown */}
        {sec.length > (moreCount || 0) && (
          <div className={styles.subLevel}>
            <a>
              More
              <span className={styles.downArw}></span>
            </a>
            <div style={{left:"auto", right:0}} className={styles.miniMenu}>
              {/* Render the second level navigation items */}
              {sec.slice((moreCount || 0) - 1).map((data, index) => (
                <MoreSubSecNavHtml subsecnames={subsecnames} key={`subsec_nav_more_${index}`} data={data} index={index} />
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SubSecNav;
