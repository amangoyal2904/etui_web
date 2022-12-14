import SearchBar from "components/SearchBar";
import SideNav from "components/SideNav";
import { useState } from "react";
import styles from "./styles.module.scss";

const subSecNavHtml = (data, index) => {
  return (
    <>
      <div key={`l2_${index}`} data-ga-action={data.nm} className={data.sec && styles.subLevel}>
        <a href={data.link} data-ga-onclick={data.link}>{data.nm}
          {data.sec && <span className={styles.downArw}></span>}
        </a>
        {
          data.sec && <div className={`${styles.miniMenu}`}>{
            data.sec.map((l3, index) => {
              return (
                <>
                  <div data-ga-action={l3.nm}>
                    <a href={l3.link} data-ga-onclick={l3.link}>{l3.nm}</a>
                  </div>
                </>
              )
            })
          }</div>
        }
      </div>
    </>
  );
};

const moreSubSecNavHtml = (data, index) => {
  return (
    <>
      <a key={`l2_${index}`} href={data.link} className={styles.subsec1}>{data.nm}</a>
      {
        data.sec && data.sec?.map((l3, index) => {
          return (
            <>
              <a href={l3.link} className={styles.subsec2}>{l3.nm}</a>
            </>
          )
        })
      }
    </>
  );
};

const subSecNav = (subSectionList) => {
  const { msid, moreCount, sec } = subSectionList[0];

  return (
    <>
      <div className={styles.sbnv_wrapper}>
        <nav className={styles.subsec_nav}>
          {sec.map((data, index) => {
            return (
              <>
                {(index < moreCount - 1) && subSecNavHtml(data, index)}
              </>
            )
          })}
          {moreCount && <div className={styles.subLevel}><a>More<span className={styles.downArw}></span></a><div className={`${styles.miniMenu}`}>{
            sec.map((data, index) => {
              return (
                <>
                  {(index >= moreCount - 1) && moreSubSecNavHtml(data, index)}
                </>
              )
            })
          }</div></div>}
        </nav>
      </div>
    </>
  )
}

const HeaderNav = (props) => {
  const [searchBar, setSearchBar] = useState(false),
  { menuData, subsecnames } = props,
    sectionList = menuData.sec;
  console.log(subsecnames)
  const subSectionList = sectionList.filter((sec) => {
    return sec?.sec;
  });

  console.log("subSectionList....", subSectionList)
  return (
    <>
      {searchBar && <SearchBar />}
      <div id="topnavBlk" className={styles.nav_block}>
        <nav id="topnav" className={`level1 ${styles.topnav}`}>
          <SideNav />
          {sectionList.map((data, index) => {
            return (
              <>
                <div key={`l1_${index}`} className={styles.sec_1} data-id={data.msid}>
                  <a href={data.link} data-ga-onclick={data.link}>{data.nm}
                  {data.nm == 'More' && <span className={styles.downArw}></span>}
                  </a>
                </div>
              </>
            )
          })}
          <div className={styles.search_bar} onClick={() => setSearchBar(!searchBar)}>
            <span className={`${styles.commonSprite} ${styles.search_icon}`}></span>
          </div>
        </nav>
      </div>
      {subSectionList.length > 0 && subSecNav(subSectionList)}
    </>
  )
}

export default HeaderNav;
