import React, { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";

interface SideNavData {
  nm: string;
  link: string;
  sec?: SideNavData[];
  msid: string;
}

const SideNav = () => {
  const [sideNavData, setSideNav] = useState<SideNavData[] | null>(null);
  const [closeClass, setCloseClass] = useState<boolean>(false);
  const [isPrime, setIsPrime] = useState<boolean>(false);

  const intsCallback = () =>  {
    window?.objInts?.afterPermissionCall(() => {
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrime(true);
    });
  }

  useEffect(() => {
    const sideNavRef = document.getElementById("sideMenu");
    sideNavRef?.addEventListener('mouseenter', handleSideNavApi);

    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(intsCallback);
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }

    return () => {
      sideNavRef?.removeEventListener('mouseenter', handleSideNavApi);
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  const handleSideNavApi = () => {
    // const api = APIS_CONFIG.FEED;

    // Service.get({
    //   api,
    //   params: { type: "menu", feedtype: "etjson", pos: "lhsmenu" }
    // }).then(res => {
    //   res.data && setSideNav(res.data);
    // }).catch(err => {
    //   console.error(`error in sideMenuApi catch`, err);
    // });

    const navbarData =  sessionStorage.getItem("navbar_data") || "";
    if(navbarData){
      setSideNav(JSON.parse(navbarData));  
    }
  }

  const sideNavApiHtml = () => {
    return (
      <>
        <ul className={styles.l1}>
          {
            sideNavData?.map((l1, index) => { // Use nullish coalescing operator here
              return (
                <>
                  {
                    l1.nm != "More" && l1.nm != "Spotlight"  && <li key={`${l1.nm}_${index}`}>
                      {l1.sec && <span className={`${styles.commonSprite} ${styles.menuRtArrow}`}></span>}
                      <a href={l1.link}>{l1.nm}</a>
                      {l1.sec && <ul className={styles.l2} data-msid={l1.msid}>
                        <li key="5rt" className={styles.subMenuTitle}>{l1.nm}</li>
                        {l1.sec.map((l2, index) => (
                          <li key={`${l2.nm}_${index}`}>
                            {l2.sec && <span className={`${styles.commonSprite} ${styles.menuRtArrow}`}></span>}
                            <a href={l2.link}>{l2.nm}</a>
                            {l2.sec && <ul className={styles.l3} data-msid={l2.msid}>
                              <li key="76ty" className={styles.subMenuTitle}>{l2.nm}</li>
                              {l2.sec.map((l3, index) => (
                                <li key={`${l3.nm}_${index}`}>
                                  <a href={l3.link}>{l3.nm}</a>
                                </li>
                              ))}
                            </ul>}
                          </li>
                        ))}
                      </ul>}
                    </li>
                  }
                </>
              )
            })
          }
        </ul>
      </>
    )
  }

  return (
    <>
      <div className={`${styles.sections} ${styles.hamberMenu} ${closeClass && styles.closeMenu} ${isPrime ? styles.pink_theme : ""}`} onClick={() => setCloseClass(!closeClass)} id="sideMenu">
        <span className={`${styles.hamberIcon} ${styles.commonSprite}`} />
        <nav id="sideBarNav" className={styles.ddNav} >
          {sideNavData ? sideNavApiHtml() : <div>Loading...</div>} {/* Conditional rendering */}
        </nav>
      </div>
    </>
  )
}

export default SideNav;
