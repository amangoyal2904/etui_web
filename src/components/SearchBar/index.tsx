import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss";
import APIS_CONFIG from "network/config.json";
import { APP_ENV } from 'utils';
import SearchList from './SearchList';
import { grxEvent } from '../../utils/ga'

const SearchBar = (props) => {
  const { setSearchBarOff, searchBar, footerSearch = false } = props;
  const [searchKey, setSearchKey] = useState('');
  const [searchData, setSearchData]: any = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [isPrime, setIsPrime] = useState(false);

  const intsCallback = () =>  {
    window?.objInts?.afterPermissionCall(() => {
      window.objInts.permissions.includes("subscribed") && setIsPrime(true);
    });
  }

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(intsCallback);
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  const handleInput = (e) => {
    let searchValue = e.target.value;
    setSearchKey(searchValue);
    setSearchLoading(true);
    if (searchValue == "") {
      setSearchData([]);
      setSearchLoading(false);
    }
  }
  useEffect(() => {
    const callOnTypeDelay = setTimeout(() => {
      searchKey && fetchSearchData();
    }, 1000)
    return () => clearTimeout(callOnTypeDelay);
  }, [searchKey]);

  const defaultRedirect = (keyword: string, specialKeywords: any) => {
    let loc = "/topic/" + encodeURIComponent(keyword).replaceAll("%20", "-");
    if (typeof specialKeywords[keyword] != "undefined") {
      loc = specialKeywords[keyword];
    }
    window.location.href = (APP_ENV !== 'production' ? "https://etdev8243.indiatimes.com" : "https://economictimes.indiatimes.com") + loc;
  };

  const generateRedirectUrl = (keyword: string, specialKeywords: any) => {
    const url = `${APIS_CONFIG["DOMAIN"][APP_ENV]}.com/jcms_search.cms?feedtype=json&keywords=${keyword}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const redirectURL = res.url;
        if (redirectURL) {
          window.location = redirectURL.indexOf("https://") == -1 && redirectURL.indexOf("http://") == -1
            ? APIS_CONFIG["DOMAIN"][APP_ENV] + redirectURL : redirectURL;
        } else {
          defaultRedirect(keyword.toLowerCase(), specialKeywords);
        }
      })
      .catch((err) => {
        console.log("error in redirect Api", err);
        defaultRedirect(keyword.toLowerCase(), specialKeywords);
      });
  };

  const handleSearchClick = () => {
    let keyword = searchKey.trim();
    if (keyword) {
      const niftyLink = "/indices/nifty_50_companies";
      const specialKeywords = {
        sensex: "/indices/sensex_30_companies",
        nifty: niftyLink,
        nifty50: niftyLink,
        "nifty 50": niftyLink
      };
      grxEvent("event", { event_category: "Search Bar", event_action: window.location.href, event_label: keyword.toLowerCase() }, 1);
      generateRedirectUrl(keyword, specialKeywords);
    } else {
      alert("Enter some text to search");
    }
  }

  const fetchSearchData = () => {
    let searchValue = searchKey.trim()
    if (searchValue) {
      const ethomeURL = APIS_CONFIG.SEARCH.ethome[APP_ENV];
      const newsSearchURL = APIS_CONFIG.SEARCH.definition[APP_ENV];
      const defSearchURL = APIS_CONFIG.SEARCH.news[APP_ENV];
      const reptrSearchURL = APIS_CONFIG.SEARCH.reporter[APP_ENV];
      Promise.all([
        fetch(`${ethomeURL}?ticker=${searchValue}&matchCompanyName=true&realstate=true&dvr=true&idr=true&trust=true&mcx=true&mf=true&crypto=true&nps=true&insideet=true&detail=false&forex=false&index=true&mecklai=true&etf=true&nonList=true&pagesize=6&language=&outputtype=json`),
        fetch(`${newsSearchURL}?query=${searchValue}`),
        fetch(`${defSearchURL}?q=${searchValue}`),
        fetch(`${reptrSearchURL}?keyword=${searchValue}`)
      ]).then((responses) => (Promise.all(responses.map((response) => response.json())))
      ).then((data) => {
        setSearchData(data);
        setSearchLoading(false);
      })
        .catch(err => { console.log("Search err: ", err) })
    }
  }

  const checkIfEmptyResults = () => {
    let allEmpty = true
    searchData.forEach(item => {
      if (Array.isArray(item) && item.length !== 0) {
        allEmpty = false;
      } else if (typeof item == "object" && item !== null && !Array.isArray(item)) {
        Object.values(item).forEach(data => {
          if (Array.isArray(data) && data.length !== 0) {
            allEmpty = false;
          }
        })
      }
    })
    return allEmpty;
  }
  return (
    <>
      <div className={`${styles.srch_container} ${isPrime ? styles.pink_theme : ""}`}>
        <div className={`${footerSearch ? styles.btm_srch_div : styles.srch_overlay_div}`}>
          <div className={`${footerSearch ? styles.btm_srch_content : styles.srch_overlay_content}`}>

            {footerSearch ? <div className={isPrime ? styles.footlogo_wrp : 'flt'}>
              <a title="The Economic Times" href="/">
                <img className={styles.logo} loading="lazy"
                  title="The Economic Times"
                  alt="The Economic Times"
                  src={isPrime ? "https://img.etimg.com/photo/msid-74451948,quality-100/et-logo.jpg" : "https://img.etimg.com/photo/msid-74462387,quality-100/et-logo.jpg"}
                  height="28"
                  width="255" />
              </a>
            </div> : ""}
            <div className={styles.searchContainer}>
              <input autoComplete="off" data-search-input="" name="ticker_newsearch" className={`${footerSearch ? styles.btm_inputBox : styles.inputBox}`} placeholder="Search News, Stock Quotes &amp; NAV" value={searchKey} type="text" onChange={(e) => handleInput(e)} />
              {!footerSearch ? <>
                <div className={styles.srch_btn} onClick={handleSearchClick}>Search</div>
                <div className={styles.srch_close} onClick={setSearchBarOff}>+</div>
              </> : <span className={`cSprite_a ${styles.searchIcon} ${searchLoading ? styles.searchLoading : ""}`} />
              }

              {searchData.length > 0 &&
                <div className={styles.searchListAll}>
                  <ul>
                    {
                      searchData.length > 0 && (!checkIfEmptyResults() ?
                        searchData.map((data, index) => {
                          return <SearchList index={index} key={index} searchValue={searchKey.trim()} data={data} />
                        }) : <li className={styles.lastList}>No results found</li>)
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar
