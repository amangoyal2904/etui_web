import SearchBar from "components/SearchBar";
import SideNav from "components/SideNav";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import MoreNav from "./MoreNav";

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
  const colArr_4 = ["13352306", "2147477890"],
  colArr_3 = ["1715249553"],
  subSecArr = [],
  L1 = [],
  L2 = [],
  L3 = [],
  L4 = [];

  let {sec, count, msid} = elm,
  isL1 = 0,
  isL2 = 0,
  isL3 = 0,
  perCol = colArr_4.indexOf(msid) != -1 ? Math.ceil(count / 4) : colArr_3.indexOf(msid) != -1 ? Math.ceil(count / 3) : msid == 837555174 ? 16 : msid == 359241701 ? 9 : msid == 94909228 ? 6 : Math.ceil(count / 2);
  // console.log("elm ", elm);
   console.log("elm length", perCol);

  console.log("count----", count)

  sec.forEach((l1, index) => {
    subSecArr.push({
      secType: "subsec1",
      elm : <div key={`subsec1_${l1.msid}_${index}`}><a href={l1.link} className={styles.subsec1}>{l1.nm}</a></div>
    });
    l1.sec && l1.sec.forEach((l2, index) => {
      subSecArr.push({
        secType: "subsec2",
        elm: <div key={`subsec2_${l2.msid}_${index}`}><a href={l2.link} className={styles.subsec2}>{l2.nm}</a></div>
      });
      l2.sec && l2.sec.forEach((l3, index) => {
        subSecArr.push({
          secType: "subsec3",
          elm: <div key={`subsec3_${l3.msid}_${index}`}><a href={l3.link} className={styles.subsec3}>{l3.nm}</a></div>
        });
      });
    });
  });
  subSecArr.forEach((sec, index) => {

    if (index < perCol) {
      L1.push(sec.elm);
    } else if ((index >= perCol) && index < (perCol * 2)) {
      if (sec.secType == "subsec1") {
        isL1 = 1;
      }
      if (isL1 == 0) {
        L1.push(sec.elm);
      } else {
        L2.push(sec.elm);
      }
    } else if ((index >= (perCol * 2)) && index < (perCol * 3)) {
      if (sec.secType == "subsec1") {
        isL2 = 1;
      }
      if (isL2 == 0) {
        L2.push(sec.elm);
      } else {
        L3.push(sec.elm);
      }
    } else {
      if (sec.secType == "subsec1") {
        isL3 = 1;
      }
      if (isL3 == 0) {
        L3.push(sec.elm);
      } else {
        L4.push(sec.elm);
      }
    }
  });

  return (
    <>
      <div className={styles.flt}>{L1}</div>
      {msid != 107115 && <div className={styles.flt}>{L2}</div>}
      {((msid == 359241701) || (msid == 13352306) || (msid == 2147477890) || (msid == 837555174) || (msid == 1715249553)) && <div className={styles.flt}>{L3}</div>}
      {((msid == 13352306) || (msid == 2147477890) || (msid == 837555174) || (msid == 1715249553)) && <div className={styles.flt}>{L4}</div>}
      <div className="clr"></div>
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
    console.log("secName----", secName)
    switch(secName){
      case "More":
        return <MoreNav sec={elm} />
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
