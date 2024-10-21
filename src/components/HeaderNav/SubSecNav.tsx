import React, { FC } from "react";
import styles from "./styles.module.scss";
import MoreSubSecNavHtml from "./MoreSubSecNavHtml";
import SubSecNavHtml from "./SubSecNavHtml";
import { useStateContext } from "../../store/StateContext";

interface SubSection {
  msid: number;
  moreCount: number;
  sec: any[];
  link: any;
  nm: any;
}

interface Props {
  subSectionList: SubSection[];
  subsecnames: any;
}

const SubSecNav: FC<Props> = ({ subSectionList, subsecnames }) => {
  const { msid, moreCount, sec, link, nm } = subSectionList[0];
  const { state } = useStateContext();
  const {  isPrime, isPink} = state.login;

  // Check if any item in the "More" section matches the current msid
  const isCurrentInMoreSection = Array.isArray(sec)
    ? sec.slice((moreCount || 0) - 1).some(data =>
        data.msid === subsecnames.subsec2 ||
        (Array.isArray(data.sec) && data.sec.some(sub => sub.msid === subsecnames.subsec3))
      )
    : false;

  return (
    <div id="sbnv_wrapper" className={`${styles.sbnv_wrapper} ${isPink ? styles.pink_theme : ""}`}>
      <nav className={styles.subsec_nav} itemType="https://www.schema.org/SiteNavigationElement" itemScope>
        <meta content="/" itemProp="url" />
        <meta content="Home" itemProp="name" />
        <meta itemProp="url" content={link} />
        <meta content={nm} itemProp="name" />
        {Array.isArray(sec) && sec.slice(0, (moreCount || 0) - 1).map((data, index) => (
          <SubSecNavHtml
            subsecnames={subsecnames}
            key={`subsec_nav_${index}`}
            data={data}
            index={index}
          />
        ))}

        {Array.isArray(sec) && sec.length > (moreCount || 0) && (
          <div className={`${styles.subLevel} ${isCurrentInMoreSection ? styles.current : ''}`}>
            <a href="#;">
              More
              <span className={styles.downArw}></span>
            </a>
            <div style={{ left: "auto", right: 0 }} className={styles.miniMenu}>
              {sec.slice((moreCount || 0) - 1).map((data, index) => (
                <MoreSubSecNavHtml
                  subsecnames={subsecnames}
                  key={`subsec_nav_more_${index}`}
                  data={data}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SubSecNav;
