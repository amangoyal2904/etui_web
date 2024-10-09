import React, { FC, useEffect, useState, useRef } from "react";
import SearchBar from "../SearchBar";
import SideNav from "../SideNav";
import styles from "./styles.module.scss";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import MoreNav from "./MoreNav";
import SubSecNav from "./SubSecNav";
import HandleHoverSecHtml from "./HandleHoverSecHtml";
import TechNav from "./TechNav";
import SpotlightNav from "./SpotlightNav";
import { useStateContext } from "../../store/StateContext";
import SponserBanner from "../SponserBanner";
import { getCookie } from "utils/utils";
import jStorageReact from "utils/jStorage";

interface HeaderNavProps {
  menuData: {
    sec: any[];
  };
  subsecnames: any;
  page: any
}

const HeaderNav: React.FC<HeaderNavProps> = ({ menuData, subsecnames, page }) => {
  const [showSponserBanner, setShowSponserBanner] = useState(false);
  const [searchBar, setSearchBar] = useState<boolean>(false);
  const [hoverSubSec, setHoverSubSec] = useState<any[]>([]); // setHoverSubSec to array of any type
  const sectionList = menuData.sec;
  const {subsec1, subsec2, subsec3} = subsecnames;
  // State to track whether the element should be sticky or not
  const [isSticky, setIsSticky] = useState<boolean>(false);
  // State to track whether the user has scrolled back to the top
  const [isScrolledToTop, setIsScrolledToTop] = useState<boolean>(false);
  const [stickyOffsetTop, setStickyOffsetTop] = useState<number>(0);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { state, dispatch } = useStateContext();
  const { isPrime, isPink } = state.login;

  useEffect(() => {
    document.addEventListener('mousemove', handleHoverSubSec);
    
    /* Logic to Toggle Sponser banner for Prime Group Users only */
    const ticketId = getCookie("TicketId");
    const userAccountDetails = ticketId && jStorageReact.get(`prime_${ticketId}`);
    const sponsorPartnerCode = userAccountDetails?.subscriptionDetails?.[0]?.sponsorPartnerCode || '';
    setShowSponserBanner(sponsorPartnerCode ? true : false);

    return () => {
      document.removeEventListener('mousemove', handleHoverSubSec);
    };
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setStickyOffsetTop(headerRef.current.offsetTop);
    }

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolledToTop(scrollY <= stickyOffsetTop);
      setIsSticky(scrollY >= stickyOffsetTop);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [stickyOffsetTop]);

  const handleHoverSubSec = async () => {
    document.removeEventListener('mousemove', handleHoverSubSec);
    const api = APIS_CONFIG.FEED;
    try {
      const res = await Service.get({
        api,
        params: { type: "menu", feedtype: "etjson", pos: "navhover" },
      });
      const resData = res?.data || {};
      setHoverSubSec(resData);
      sessionStorage.setItem("navbar_data", JSON.stringify(resData));
    } catch (error) {
      console.error("error in handleHoverSubSec catch");
    }
  };

  const subSectionList = sectionList?.filter((sec) => {
    return sec?.sec;
  });

  const handleHoverNav = (elm: any, index) => { // handleHoverNav can take in any argument
    const { sec, count, msid, nm } = elm;
    switch(nm){
      case "More":
        return <MoreNav sec={sec} />; 
      case "Tech":
        return <TechNav sec={sec} count={count} msid={msid} /> 
      case "Spotlight":
        return <SpotlightNav sec={sec} />    
      default:
        return <HandleHoverSecHtml key={`HandleHoverSecHtml_${index}`} sec={sec} count={count} msid={msid} />;
    }
  };

  return (
    <>

      {searchBar && <SearchBar searchBar={searchBar} setSearchBarOff={() => setSearchBar(!searchBar)}/>}
      {/* Empty div as a placeholder to maintain the layout when the element becomes sticky */}
      {isSticky && !isScrolledToTop && <div style={{ height: '35px' }}></div>}
      <div id="topnavBlk" ref={headerRef} data-pink={isPink} className={`${styles.sticky} ${isSticky && !isScrolledToTop ? styles.stickyActive : ''} ${styles.nav_block} ${isPink ? styles.pink_theme : ""}`} >
        <nav id="topnav" className={`level1 ${styles.topnav}`} >
          <SideNav />
          {sectionList?.map((data, index) => {
            return (
              <div key={`nav-l1-${index}`} className={`sec_1 hasSubSecnav ${styles.sec_1} ${data.hovernav ? styles.hasSubSecnav : ""}`} data-l1={data.nm} data-id={data.msid}>
                <a className={`${((typeof data.msid != "undefined" && subsec1 == data.msid)  || (typeof data.msid == "undefined" && page == "primehome" && data.nm == "Home")) ? styles.current : ''} ${data.msid === '74912912' ? `${styles.navP} ${styles.cSprite_b}` : ''} ${data.msid === '110737294' ? `${styles.marketData_i}` : ''}`} href={data.link ? data.link  : ''} data-ga-onclick={data.link}>
                {/* {data.nm != 'More' && <meta content={data.nm} itemProp="name" />} */}
                {data.nm != 'More' && data.nm}
                {data.nm === 'More' && <img src="https://img.etimg.com/photo/msid-100067830/et-logo.jpg" width="4" height="16" alt="More" />}
                </a>
                {
                  data.hovernav && <div className={styles.subsecnav}>
                    {
                      hoverSubSec?.map((elm, index2) => {
                        if (elm.nm === data.nm) { // add error handling for wrong type or undefined value
                          return (
                            <React.Fragment key={`nav-l1-hover-${index}-${index2}`}>
                              {handleHoverNav(elm, index2)}
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
      {subSectionList?.length > 0 && <SubSecNav subsecnames={subsecnames} subSectionList={subSectionList} />}
      {showSponserBanner && <SponserBanner />}
    </>
  );
};

export default HeaderNav;
