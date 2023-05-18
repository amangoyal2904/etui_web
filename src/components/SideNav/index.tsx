import React, {useEffect, useState} from 'react'
import styles from "./styles.module.scss";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";



const SideNav = () => {
  const [sideNavData, setSideNav] = useState(null);
  const [closeClass, setCloseClass] = useState(false);

  useEffect(() => {
    const sideNavRef = document.getElementById("sideMenu");
    sideNavRef.addEventListener('mouseenter', handleSideNavApi);
  }, []);

  const handleSideNavApi = () => {
    const api = APIS_CONFIG.FEED;

    const sideNavRef = document.getElementById("sideMenu");
    sideNavRef.removeEventListener('mouseenter', handleSideNavApi);

    Service.get({
      api,
      params: { type: "menu", feedtype: "etjson", pos: "lhsmenu"}
    }).then(res => {
      res.data && setSideNav(res.data);
    }).catch(err => {
      console.error(`error in sideMenuApi catch`, err);
    });
  }

  const sideNavApiHtml = () => { 
    return (
      <>
        <ul className={styles.l1}>
          {
            sideNavData && sideNavData?.map((l1, index) => {
              return (
                <>
                  <li key={`${l1.nm}_${index}`}>
                    {l1.sec && <span className={`${styles.commonSprite} ${styles.menuRtArrow}`}></span>}
                    <a href={l1.link}>{l1.nm}</a>
                    {l1.sec && <ul className={styles.l2} data-msid={l1.msid}>
                      <li key="5rt" className={styles.subMenuTitle}>{l1.nm}</li>  
                      {l1.sec?.map((l2, index) => {
                        return (
                          <>
                            <li key={`${l2.nm}_${index}`}>
                              {l2.sec && <span className={`${styles.commonSprite} ${styles.menuRtArrow}`}></span>}
                              <a href={l2.link}>{l2.nm}</a>
                              {l2.sec && <ul className={styles.l3} data-msid={l2.msid}>
                                <li key="76ty" className={styles.subMenuTitle}>{l2.nm}</li>
                                {l2.sec?.map((l3, index) => {
                                  return (
                                    <>
                                      <li key={`${l3.nm}_${index}`}>
                                        <a href={l3.link}>{l3.nm}</a>
                                      </li>
                                    </>
                                  )
                                })}
                              </ul>}
                            </li>
                          </>
                        )
                      })}
                    </ul>}
                  </li>
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
      <div className={`${styles.sections} ${styles.hamberMenu} ${closeClass && styles.closeMenu}`} onClick={() => setCloseClass(!closeClass)} id="sideMenu">
        <span className={`${styles.hamberIcon} ${styles.commonSprite}`} />
        <nav id="sideBarNav" className={styles.ddNav} >
          {sideNavData && sideNavApiHtml()}
        </nav>
      </div>
    </>
  )
}

export default SideNav;


