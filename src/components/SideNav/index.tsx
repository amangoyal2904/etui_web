import React, { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import { useStateContext } from "../../store/StateContext";

interface SideNavData {
  nm: string;
  link: string;
  sec?: SideNavData[];
  msid: string;
}

const SideNav = () => {
  const [sideNavData, setSideNav] = useState<SideNavData[] | null>(null);
  const [closeClass, setCloseClass] = useState<boolean>(false);
  const { state, dispatch } = useStateContext();
  const { isPrime } = state.login;

  useEffect(() => {
    const sideNavRef = document.getElementById("sideMenu");
    sideNavRef?.addEventListener('mouseenter', handleSideNavApi);

    // Add event listener for document clicks
    const handleClickOutside = (event: MouseEvent) => {
      if (sideNavRef && !sideNavRef.contains(event.target as Node)) {
        setCloseClass(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);

    return () => {
      sideNavRef?.removeEventListener('mouseenter', handleSideNavApi);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSideNavApi = () => {

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
