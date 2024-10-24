// @ts-nocheck

import { Fragment, useEffect, useRef, useState } from "react";
import API_CONFIG from "../../network/config.json"
import { ET_WEB_URL, SITE_APP_CODE, X_CLIENT_ID } from "utils/common";
import { fetchAdaptiveData } from "utils/ga";
import { getCookie } from "utils";
import HeadingWithRightArrow from "./HeadingWithRightArrow";
import Separator from "components/Separator";
import PrimeIcon from 'components/Icons/PrimeIcon';

export default function LessonsFromGrandmasters({ focusArea, isDev }) {
  const APP_ENV = isDev ? "development" : "production";
  const [series, setSeries]: any = useState([]);
  const [leaders, setLeaders]: any = useState([]);
  const [ticketID, setTicketId] = useState("");
  const [token, setToken] = useState("");
  const [isPrimeUser, setIsPrimeUser] = useState(false);
  const formRefs: any = useRef([]);

  const sliderRef = useRef(null);
  const innerRef = useRef(null);
  const [x, setX] = useState(0);
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  const grandMasterActionURL = {
      development: "https://masterclass.economictimes.indiatimes.com/p/r",
      production: "https://masterclass.economictimes.indiatimes.com/p/r"
    };

  function fetchData(endPoint) {
    try {
    const url = `${API_CONFIG.grandMasters[APP_ENV]}/${endPoint}`;

    fetch(url, {
      headers: {
        "portal": "masterclass"
      }
    })
      .then((response) => response.json())
      .then((data) => {                
        if (endPoint === "series") {
          setSeries(data);
        } else {
          setLeaders(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function isFirstSlot() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return true;
    } else {
      return false;
    }
  }

  const formData = (id, url) => {
    return(
      <form ref={(el: any) => (formRefs.current[id] = el)} action={grandMasterActionURL[APP_ENV]} method="POST" style={{ display: "none" }}>
        <input type="hidden" name="token-id" value={token} />
        <input type="hidden" name="ticket-id" value={ticketID} />
        <input type="hidden" name="ru" value={url} />
        <input
          type="hidden"
          name="client-id"
          value={X_CLIENT_ID[APP_ENV]}
        />
        <input
          type="hidden"
          name="site-app-code"
          value={SITE_APP_CODE[APP_ENV]}
        />
      </form>
    )
  }

  const handleLinkClick = (e, id, name) => {
    e.preventDefault();
    let { lastClick } = fetchAdaptiveData();
    window.customDimension = { url: window.location.href, title: document.title, referral_url: document.referrer, platform: 'pwa' };
    window.customDimension["last_click_source"] = lastClick || "";
    window.customDimension["method"] = getCookie("LoginType") || '',
    window.customDimension["login_status"] = window.objUser && window.objUser.info && window.objUser.info.isLogged ? 'y' : 'n',
    window.customDimension["subscription_status"] = 'paid'; 
    // grxEvent('event', {
    //   'event_category': 'HP Clicks', 
    //   'event_action': `Prime Widget - Grandmaster - ${name}`, 
    //   'event_label': `https://${__APP.isLive ? 'm' : 'etnext'}.economictimes.com/etgrandmasters/${id}`,
    //   "et_product":"Grandmaster"
    // },
    //    1);
   const formRef = formRefs.current[id];
    if (isPrimeUser && ticketID && token && formRef) {
      formRef?.submit();
    } else {
      window.location.href = `${ET_WEB_URL}/etgrandmasters/${id}`;
    }
  };

  function onNextPrevButtonClick(type) {  
    let scrollBy = 224; 
    if(innerRef.current && sliderRef.current) {       
      const viewportWidth = sliderRef.current.offsetWidth;
      const innerWidth = innerRef.current.offsetWidth;

      const scrollableWidth = innerWidth - viewportWidth;

      // innerRef.current.style.transform = `translate3d(${x}px, 0px, 0px)`;

      // scroll by scrollBy amount on each click
      let scrollAmount = 0;

      if(type == "next"){
        let remaingScrollableWidth = scrollableWidth + x;

        if(remaingScrollableWidth < scrollBy) {
          scrollBy = remaingScrollableWidth;
        }
      }

      if(type == "prev") {
        if(-x < scrollBy) {
          scrollBy = -x;
        }
      }
      
      // debugger
      if(type === "prev") {
        scrollAmount = x + scrollBy;
        setX(scrollAmount);
      } else {
        scrollAmount = x - scrollBy;
        setX(scrollAmount);
      }

      if(scrollAmount < 0) {
        setPrevDisabled(false);
      } else {
        setPrevDisabled(true);
      }

      // debugger;
      if(-scrollAmount + viewportWidth == innerWidth) {
        setNextDisabled(true);
      } else {
        setNextDisabled(false);
      }

    }
  }

  useEffect(() => {
    if(innerRef.current) {
      innerRef.current.style.transform = `translate3d(${x}px, 0px, 0px)`;
      // translate with transition
      innerRef.current.style.transition = `transform 0.9s ease 0s`;
    }
  }, [x]);


  useEffect(() => {
    const endPoint = isFirstSlot() ? "series" : "leaders?slug=all";
    fetchData(endPoint);
  }, [])

  return (
    <>
      <div className={`grandmaster ${focusArea}`}>
        { focusArea === "news" && <Separator /> }
        { focusArea === "news" ? <span className='title'></span> : <PrimeIcon style={{zoom: 0.7, marginRight: '7px', top: '4px'}}/> }
        <HeadingWithRightArrow title={focusArea == "news" ? "Lessons from The Grandmasters" : "ET GrandMasters"} href="/etgrandmasters" />
        <div className="slider" ref={sliderRef}>
          <div className="seriesWrapper" ref={innerRef}>
          {isFirstSlot()
            ? series?.data?.length && series?.data?.map((series, index) => (
                <div key={`seriesCard${index}`}>
                  {formData(series.id, series.slug_url)}
                  <div className="seriesCard" onClick={(e) => handleLinkClick(e, series.id, series.name)}>
                    <img src={series.feature_image_url} width={195} height="auto" loading="lazy" decoding="async" />
                  </div>
                </div>
              ))
            : leaders?.data?.speakers?.length &&
              leaders?.data?.speakers?.map((leader, index) => (
                <Fragment key={`leadersData_${index}`}>
                {formData(leader.leader_id,leader.slug)}
                  <div className="leaderCard" key={`leaderCard${index}`}>
                    <img src={leader.picture_url} width={195} height="auto" loading="lazy" decoding="async" />
                    <div className="leaderContent">
                      <p className="leaderName">
                        {leader.user_name}
                        <span className="nameBorder" />
                      </p>
                      <p className="leaderInfo">
                        {leader.designation}, {leader.company}
                      </p>
                      <a href={leader.slug} className="btnPreview" style={{color:"#fff !important"}} onClick={(e) => handleLinkClick(e, leader.leader_id, leader.user_name)}>Watch Now </a>
                    </div>
                  </div>
                </Fragment>
              ))}
          </div>
        </div>
        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>
      </div>
      <style jsx>{`
        .grandmaster{
          padding-left: 20px;          
          margin-top: 1px;
          position: relative;          

          &.news {
            border-left: 1px dotted #9b8680;
            margin-top: -13px;
          }

          .title {
            border-bottom: 1px solid#9b8680;
            font-size: 20px;
            font-weight: 800;
            padding-bottom: 7px;
            padding-top: 15px;
            text-transform: uppercase;

            &:before {
              content: "";
              left: -7px;
              top: 22px;
              position: absolute;
              width: 16px;
              height: 17px;
              background: url("https://img.etimg.com/photo/109967743.cms");              
              background-size: 500px;
              background-position: -395px -135px;
            }
          }

          .slider {
            overflow: hidden;
            margin-top: 10px;
            min-height: 112px;

            .seriesWrapper {
              display: inline-flex;
              gap: 20px;

              .seriesCard {
                &:hover {
                  cursor: pointer;
                }
              }

              & > div {
                width: 195px;
                position: relative;
                overflow: hidden;
                border-radius: 12px;
                
                &:hover {
                  .leaderContent {
                    bottom: 0;
                  }

                  img {
                    transform: scale(1.1);
                    transition: all 0.7s ease;
                  }
                }

                img {
                  border-radius: 12px;
                  transition: transform 0.5s ease-in-out;
                }

                .leaderContent {                  
                  position: absolute;
                  bottom: 10px;                  
                  transition: all 0.7s ease;
                  border-bottom-right-radius: 12px;
                  border-bottom-left-radius: 12px;
                  position: absolute;
                  bottom: -56px;
                  width: 100%;
                  background: linear-gradient(0deg, #191c21, rgba(25, 28, 33, .8) 70%, rgba(25, 28, 33, 0)) 90% no-repeat;
                  text-align: center;
                  padding: 7px;
                  box-sizing: border-box;
                }

                .leaderName {
                  font-family: Faustina;
                  font-size: 17px;
                  font-weight: 700;
                  line-height: 21px;
                  text-align: center;
                  color: #fff;
                }

                .nameBorder {
                  width: 60px;
                  border-top: 1px solid #ed193b;
                  margin: 6px auto 8px;
                  display: block;
                }

                .leaderInfo {
                  font-family: Montserrat;
                  font-size: 11px;
                  font-weight: 600;
                  line-height: 15px;
                  text-align: center;
                  color: #fff;
                }

                .btnPreview {
                  width: 180px;
                  cursor: pointer;
                  padding: 8px 0;
                  border-radius: 4px;
                  background-color: #ed193b;
                  color: #fff;
                  font-family: Montserrat;
                  font-size: 16px;
                  line-height: 22px;
                  text-align: center;
                  font-weight: 700;
                  display: inline-block;
                  margin-top: 12px;
                  margin-bottom: 10px;
                }
              }
            }
          }

          .arr {
            width: 18px;
            height: 18px;
            display: inline-block;
            background: #DA4617CC;
            border-radius: 50%;
            position: absolute;            
            cursor: pointer;
            pointer-events: all;
            top: calc(50% + 18px);            

            &.disabled {
              opacity: 0.4;
              pointer-events: none;
              cursor: not-drop;
            }

            &:after {
              content: '';
              display: inline-block;
              width: 6px;
              height: 6px;
              border-top: 1px solid #fff;
              border-left: 1px solid #fff;
              transform: rotate(-45deg);
              position: absolute;
              top: 6px;
              left: 7px;
            }

            &.prev {
              left: 3px;              
            }

            &.next {
              right: -7px;              
              transform: rotate(180deg);
            }
          }

          &.market {
            padding-left: 0;
            .title {
              &:before {
                display: none;
              }
            }

            .arr {
              top: 40px;

              &.prev {
                left: -8px;
              }

              &.next {
                right: -8px;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
