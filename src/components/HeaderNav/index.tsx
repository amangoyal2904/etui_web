import SearchBar from "components/SearchBar";
import SideNav from "components/SideNav";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";

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

const handleHoverSecHtml = (elm) => {
  return (
    <>
      {
        elm.sec && elm.sec.map((l1, index) => {
          return (
            <>
              <div>
                <a href={l1.link} className={styles.subsec1}>{l1.nm}</a>
              </div>
              {l1.sec && l1.sec.map((l2, index) => {
                return (
                  <>
                    <div>
                      <a href={l1.link} className={styles.subsec2}>{l2.nm}</a>
                    </div>  
                  </>
                )
              })}
            </>
          )
        })
      }
    </>
  )
}

const HeaderNav = (props) => {
  const [searchBar, setSearchBar] = useState(false),
  [hoverSubSec, setHoverSubSec] = useState([]),
  { menuData, subsecnames } = props,
    sectionList = menuData.sec; 

  
  useEffect(() => {
    document.addEventListener('mousemove', handleHoverSubSec);
  }, []);

  const handleHoverSubSec = () => {
    document.removeEventListener('mousemove', handleHoverSubSec);  

    const api = APIS_CONFIG.FEED;
    Service.get({
      api,
      params: { type: "menu", feedtype: "etjson", pos: "navhover"}
    }).then(res => {
      res.data && setHoverSubSec(res.data);
    }).catch(err => {
      console.error(`error in handleHoverSubSec catch`, err);
    });
  }

  console.log(subsecnames)
  const subSectionList = sectionList.filter((sec) => {
    return sec?.sec;
  });

  const handleHoverNav = (elm) => {
    let secName = elm.nm;
    switch(secName){
      case "More":
        break;
      case "Jobs":
        break;  
      default:
        return handleHoverSecHtml(elm);
    }
  }

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
                <div key={`l1_${index}`} className={styles.sec_1} data-l1={data.nm} data-id={data.msid}>
                  <a href={data.link} data-ga-onclick={data.link}>{data.nm}
                  {data.nm == 'More' && <span className={styles.downArw}></span>}
                  </a>
                  {
                    data.hovernav && <div className={styles.subsecnav}>
                      {
                        hoverSubSec?.map((elm, index) => {
                          return (
                            <>
                              {elm.nm == data.nm && handleHoverNav(elm)}
                            </>
                          )
                        })
                      }
                    </div>
                  }
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
