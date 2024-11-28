import React, { useEffect, useState } from 'react'
import TodayNews from './TodayNews'
import PrimeBenefitsBucket from './PrimeBenefitsBucket';
import PrimeExclusives from './PrimeExclusives';
import InvestmentIdeas from './InvestmentIdeas';
import ETEpaper from './ETEpaper';
import LessonsFromGrandmasters from './LessonsFromGrandmasters';
import MarketsTopNews from './MarketsTopNews';
import IndicesWidget from './IndicesWidget';
import MarketDashboard from './MarketDashboard';
import StockRecos from './StockRecos';
import Separator from 'components/Separator';
import StockReportPlus from './StockReportPlus';
import BigBullPortfolio from './BigBullPortfolio';
import MarketMood from './MarketMood';
import LiveStream from './LiveStream';
import Opinion from "./Opinion";
import NewsByIndustry from "./NewsByIndustry";
import MyWatchListDashboard from './MyWatchListDashboard';
import API_CONFIG from "../../network/config.json";
import jStorageReact from 'jstorage-react';
import { trackingEvent } from 'utils/ga';
import WealthEditionList from './WealthEditionList';
import LiveTvWidget from 'components/LiveTvWidget';

// declare window interface
declare global {
  interface Window {
    APP_ENV: string;
    jstorage: any;
  }
}

export default function TopSectionLayout({ searchResult, isDev, ssoid, objVc }) {
  const [focusArea, setFocusArea] = useState("market");
  const [showNotification, setShowNotification] = useState(false);
  const todayNews = searchResult?.find(item => item?.name === "today_news") || {};
  const primeExclusives = searchResult?.find(item => item?.name === "prime_exclusives") || {};
  const investmentIdeas = searchResult?.find(item => item?.name === "investment_ideas") || {};
  const OpinionData = searchResult?.find(item => item?.name === "opinion") || {};
  const NewsByIndustryData = searchResult?.find(item => item?.name === "news_by_industry") || {};
  const etEpaperData = searchResult?.find(item => item?.name === "epaper")?.data || {};
  const marketsTopNews  = searchResult?.find(item => item?.name === "markets_top_news") || {};

  function saveFocusAreaPreference(focusArea) {   
    setFocusArea(focusArea);
    trackingEvent("et_push_event", {
      event_category:  'HP Clicks', 
      event_action: `Click on Switch Tab`, 
      event_label: `Viewed ${focusArea === "market" ? "Market Focus" : "News Focus "}`,
      experiment_variant_name: focusArea === "market" ? "Variant 1- Markets focus" : "Variant 2- News focus "
    });
    if (window.customDimension) {
      window.customDimension['experiment_variant_name'] = focusArea === "market" ? "Variant 1- Markets focus" : "Variant 2- News focus ";
    } 
      window._gtmEventDimension = window._gtmEventDimension || {};
      window._gtmEventDimension['experiment_variant_name'] = focusArea === "market" ? "Variant 1- Markets focus" : "Variant 2- News focus ";
    const primeHomeFocusArea2024 = jStorageReact.get("primeHomeFocusArea2024") ? JSON.parse(jStorageReact.get("primeHomeFocusArea2024")) : {};
    if(primeHomeFocusArea2024) {
      primeHomeFocusArea2024.focusArea = focusArea;
      primeHomeFocusArea2024.focusAreaChangedAt = Date.now();
    }

    // save for 1 year
    jStorageReact.set("primeHomeFocusArea2024", JSON.stringify(primeHomeFocusArea2024), {TTL: 365*24*60*60*1000});

    const api = API_CONFIG["SUBSCRIBER_HOMEPAGE_FOCUSAREA_SAVE"][window?.APP_ENV];
    const ssoid = window?.objUser?.info?.ssoid || "bo6gekyrgw2kekv61lq1e8m77a";
    const data = {
      enableMarketFocus: focusArea === "market" ? true : false,
      ssoId: ssoid
    };

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"        
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Focus Area Data: ", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  }

  function getFocusAreaPreference() {
    const api = API_CONFIG["SUBSCRIBER_HOMEPAGE_FOCUSAREA_GET"][window?.APP_ENV];
    const ssoid = window?.objUser?.info?.ssoid || "";

    if(!ssoid) return;

    fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${ssoid}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => response.json())
      .then((data) => {        
        if(data?.statusCode === 200) {
          const variant = data?.enableMarketFocus === "market" ? "Variant 2- Direct Landing Market Focus" : "Variant 1- Direct Landing News Focus";
          window.customDimension['experiment_variant_name'] = variant;
            window._gtmEventDimension = {};
            window._gtmEventDimension['experiment_variant_name'] = variant;
          setFocusArea(data?.enableMarketFocus ? "market" : "news");
          setShowNotification(data?.showFocusNotification)
        }        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  useEffect(() => {
    const primeHomeFocusArea2024OnLoad = jStorageReact.get("primeHomeFocusArea2024") ? JSON.parse(jStorageReact.get("primeHomeFocusArea2024")) : {};  
    if(primeHomeFocusArea2024OnLoad) {
      if(primeHomeFocusArea2024OnLoad.focusArea !== focusArea) {
        setFocusArea(primeHomeFocusArea2024OnLoad.focusArea);
      }
    }

    if(window?.objUser?.info?.ssoid) {
      getFocusAreaPreference();
    } else {
      document.addEventListener("getUserDetailsSuccess", getFocusAreaPreference);
    }
  }, []);

  return (
    <>
      <section className={`topLayout ${focusArea}`}>
        <div className="ly_first_wrp">
          <div className='ly_second_wrp'>
            <div className="col1">
              <TodayNews todayNews={todayNews} focusArea={focusArea} />
            </div>
            <div className="col2">
              <div className="titleNSwitch">
                { showNotification && <FocusAreaNotification focusArea={focusArea} /> }
                <span className="title">{focusArea === "market" ? "MARKETS" : "ETPRIME"}</span>
                <span className="switch">
                  <span className={focusArea === "news" ? "active" : ""} onClick={() => saveFocusAreaPreference("news")}>NEWS FOCUS</span>
                  <span className="switchIcon" onClick={() => {
                    focusArea === "news" ? saveFocusAreaPreference("market") : saveFocusAreaPreference("news");
                  }}>
                    <i className={focusArea === "news" ? "left" : "right"}></i>
                  </span>
                  <span className={focusArea === "market" ? "active" : ""} onClick={() => saveFocusAreaPreference("market")}>MARKETS FOCUS</span>
                </span>
              </div>
              <PrimeBenefitsBucket focusArea={focusArea}/>
              { focusArea === "news" && <>            
                <PrimeExclusives title={primeExclusives?.title || ""} data={primeExclusives?.data || []} focusArea={focusArea}/>
                <InvestmentIdeas focusArea={focusArea} data={investmentIdeas?.data || []}/>
                <ETEpaper focusArea={focusArea} etEpaperData={etEpaperData} isDev={isDev}/>
                <LessonsFromGrandmasters focusArea={focusArea} isDev={isDev}/>
                <WealthEditionList />
              </>
              }

              {
                focusArea === "market" && <>
                  <MarketsTopNews focusArea={focusArea} data={marketsTopNews?.data || []}/>
                  <Separator />
                  <IndicesWidget isDev={isDev} focusArea={focusArea}/>
                  <Separator />
                  <MyWatchListDashboard isDev={isDev} ssoid={ssoid} focusArea={focusArea} />
                  <Separator />
                  <MarketDashboard isDev={isDev} ssoid={ssoid} focusArea={focusArea}/>
                  <Separator />
                  <StockRecos focusArea={focusArea}/>
                  <Separator />
                  <StockReportPlus focusArea={focusArea}/>
                  <Separator />
                  <BigBullPortfolio focusArea={focusArea}/>
                  <Separator />
                  <MarketMood focusArea={focusArea} />
                </>
              }
            </div>
          </div>
            {
              focusArea === "news" && <>
                <NewsByIndustry data={NewsByIndustryData?.data || []} title={NewsByIndustryData?.title || ''} isDev={isDev} focusArea={focusArea} />
                <Opinion OpinionData={OpinionData?.data || []} focusArea={focusArea} />
              </>
            }
        </div>
        <div className="col3">
          { objVc?.livetv?.prime_status == 1 && <LiveTvWidget objVc={objVc}/> }
          { focusArea === "market" && <>            
            <PrimeExclusives title={primeExclusives?.title || ""} data={primeExclusives?.data || []} focusArea={focusArea} />
            <Separator />
            <InvestmentIdeas focusArea={focusArea} data={investmentIdeas?.data || []}/>
            <Separator />
            <LessonsFromGrandmasters focusArea={focusArea} isDev={isDev}/>
            <Separator />
            <ETEpaper focusArea={focusArea} etEpaperData={etEpaperData} isDev={isDev}/>            
          </>
          }

          { focusArea === "news" && <>
            <div className="title">MARKETS</div>
            <MarketsTopNews focusArea={focusArea} data={marketsTopNews?.data || []}/>
            <Separator />
            <IndicesWidget isDev={isDev} focusArea={focusArea}/>
            <Separator />
            <MyWatchListDashboard isDev={isDev} ssoid={ssoid} focusArea={focusArea} />
            <Separator />
            <MarketDashboard isDev={isDev} ssoid={ssoid} focusArea={focusArea} />
            <Separator />
            <StockRecos focusArea={focusArea}/>
            <Separator />
            <StockReportPlus focusArea={focusArea}/>
            <Separator />
            <BigBullPortfolio focusArea={focusArea}/>
            <Separator />
            <MarketMood focusArea={focusArea} />
          </>
          }

          <Separator />
          <LiveStream isDev={isDev} />
        </div>
      </section>
      {
        focusArea === "market" && <>
          <NewsByIndustry data={NewsByIndustryData?.data || []} title={NewsByIndustryData?.title || ''} isDev={isDev} focusArea={focusArea}  />
          <Opinion OpinionData={OpinionData?.data || []} focusArea={focusArea} />
        </>
      }
      <style jsx>{` 
        .topLayout {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

          .hide{
            display: none;
          }

          .ly_first_wrp{
            display: flex;            
            width: calc(100% - 350px);
            flex-direction: column;

            &.news {
              justify-content: space-between;
            }

            .ly_second_wrp{
              display: flex;
              justify-content: space-between;
              width: 100%;
            }
          }

          .col1 {
            width: 270px;          
          }

          .col2 {
            width: 605px;       

            .titleNSwitch {
              display: flex;
              justify-content: space-between;
              padding-bottom: 7px;
              border-bottom: 3px solid #9b8680;
              align-items: center;
              position: relative;

              .title {
                font-size: 20px;
                font-weight: 800;
              }

              .switch {
                font-size: 11px;
                cursor: pointer;

                .active {
                  font-weight: 700;
                }
              }

              .switchIcon {
                width: 20px;
                padding: 2px;
                border: 2px solid #1c1b1f;
                display: inline-flex;
                align-items: center;
                border-radius: 10px;    
                margin: 0 5px;                            

                i {
                  background: #ED193B;
                  width: 6px;
                  height: 6px;
                  display: inline-block;
                  border-radius: 50%;  
                  
                  &.right {
                    margin-left: 14px;
                  }
                }
              }
            }
          }

          .col3 {
            width: 320px;

            .title {
              font-size: 20px;
              font-weight: 800;
              padding-bottom: 7px;
              border-bottom: 3px solid #9b8680;
            }
          }
        }
      `}</style>
    </>
  )
}

function FocusAreaNotification({ focusArea }) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    window.jstorage = jStorageReact;
    const primeHomeFocusArea2024 = jStorageReact.get("primeHomeFocusArea2024") ? JSON.parse(jStorageReact.get("primeHomeFocusArea2024")) : {};

    // on first load and if time elapsed is 2 days, show notification
    if(primeHomeFocusArea2024) {
      if(!primeHomeFocusArea2024.focusArea || !primeHomeFocusArea2024.focusAreaChangedAt) {
        setShowNotification(true);
      } else {
        const timeElapsed = Date.now() - primeHomeFocusArea2024.focusAreaChangedAt;
        if(timeElapsed > 2*24*60*60*1000) {
          setShowNotification(true);
        }
      }
    }

    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 10*1000);

    return () => {
      timer && clearTimeout(timer); 
    }
  }, []);

  console.log({showNotification});

  if (!showNotification) return null;

  return (
    <>      
      <div className="notification">           
        <span className="close" onClick={() => setShowNotification(false)}>&times;</span>
        <div className="title">
          {focusArea === "market" ? 
          "You're experiencing market centric view!"
          : "You're in the news view!"}
        </div>
        <div className="desc">Want more {focusArea === "market" ? "news" : "market updates"}? Switch to '<span className="focus">{focusArea === "market" ? "News" : "Market"} Focus</span>' {focusArea === "market" ? "anytime" : "now"}.</div>          
      </div>
    
      <style jsx>{`
        @keyframes moveUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .notification {     
          width: 384px;     
          padding: 14px 28px 14px 14px;
          background: #000;
          border-radius: 10px;
          color: #fff;
          font-family: Montserrat;
          line-height: 20px;
          position: absolute;
          right: -102px;
          top: -75px;
          animation: moveUpDown 2s infinite;          

          &::after {            
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-top-color: #000;
            border-bottom: 0;
            margin-left: -10px;
            margin-top: -1px;
          }

          .focus {
            color: #efc222;
          }
          .close {
            position: absolute;
            right: 4px;
            top: 4px;
            cursor: pointer;
            background: #F00;
            width: 14px;
            height: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 20px;
          }

          .title {            
            font-size: 17px;
            font-weight: 600;
          }  

          .desc {            
            font-size: 13px;
            font-weight: 400;            
          }               
        }
      `}</style>
    </>
  )
}