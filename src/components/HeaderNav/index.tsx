'use client';

import React, { FC } from "react";
import SearchBar from "components/SearchBar";
import SideNav from "components/SideNav";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import MoreNav from "./MoreNav";
import SubSecNav from "./SubSecNav";
import HandleHoverSecHtml from "./HandleHoverSecHtml";
import TechNav from "./TechNav";

interface HeaderNavProps {
  menuData: {
    sec: any[];
  };
  subsecnames: string[];
}

const HeaderNav: React.FC<HeaderNavProps> = ({ menuData, subsecnames }) => {
  const [searchBar, setSearchBar] = useState<boolean>(false);
  const [hoverSubSec, setHoverSubSec] = useState<any[]>([]); // setHoverSubSec to array of any type
  const sectionList = menuData.sec;

  useEffect(() => {
    document.addEventListener('mousemove', handleHoverSubSec);
    return () => {
      document.removeEventListener('mousemove', handleHoverSubSec);
    };
  }, []);

  const handleHoverSubSec = () => {
    document.removeEventListener('mousemove', handleHoverSubSec);
    const api = APIS_CONFIG.FEED;
    Service.get({
      api,
      params: { type: "menu", feedtype: "etjson", pos: "navhover"}
    })
      .then((res) => {
        res.data && setHoverSubSec(res.data);
      })
      .catch((err) => {
        console.error(`error in handleHoverSubSec catch`, err);
      });
  };

  const subSectionList = sectionList?.filter((sec) => {
    return sec?.sec;
  });

  const handleHoverNav = (elm: any) => { // handleHoverNav can take in any argument
    const { sec, count, msid, nm } = elm;
    switch(nm){
      case "More":
        return <MoreNav sec={sec} />; 
      case "Tech":
        return <TechNav sec={sec} count={count} msid={msid} />  
      default:
        return <HandleHoverSecHtml sec={sec} count={count} msid={msid} />;
    }
  };

  return (
    <>
      {searchBar && <SearchBar />}
      <div id="topnavBlk" className={styles.nav_block}>
        <nav id="topnav" className={`level1 ${styles.topnav}`}>
          <SideNav />
          {sectionList?.map((data, index) => {
            return (
              <div key={`nav-l1-${index}`} className={styles.sec_1} data-l1={data.nm} data-id={data.msid}>
                <a href={data.link} data-ga-onclick={data.link}>{data.nm}
                {data.nm === 'More' && <span className={styles.downArw}></span>}
                </a>
                {
                  data.hovernav && <div className={styles.subsecnav}>
                    {
                      hoverSubSec?.map((elm, index2) => {
                        if (elm.nm === data.nm) { // add error handling for wrong type or undefined value
                          return (
                            <React.Fragment key={`nav-l1-hover-${index}-${index2}`}>
                              {handleHoverNav(elm)}
                            </React.Fragment>
                          );
                        }
                        return null; // handle undefined or wrong type value
                      })
                    }
                  </div>
                }
              </div>
            );
          })}
          <div className={styles.search_bar} onClick={() => setSearchBar(!searchBar)}>
            <span className={`${styles.commonSprite} ${styles.search_icon}`}></span>
          </div>
        </nav>
      </div>
      {subSectionList?.length > 0 && <SubSecNav subSectionList={subSectionList} />}
    </>
  );
};

export default HeaderNav;
