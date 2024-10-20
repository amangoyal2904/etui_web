import React, { useEffect } from 'react'
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

export default function TopSectionLayout({ searchResult, isDev, ssoid }) {
  const [focusArea, setFocusArea] = React.useState("market");
  const todayNews = searchResult?.find(item => item?.name === "today_news") || {};
  const primeExclusives = searchResult?.find(item => item?.name === "prime_exclusives") || {};
  const investmentIdeas = searchResult?.find(item => item?.name === "investment_ideas") || {};
  const OpinionData = searchResult?.find(item => item?.name === "opinion") || {};
  const NewsByIndustryData = searchResult?.find(item => item?.name === "news_by_industry") || {};
  const etEpaperData = searchResult?.find(item => item?.name === "epaper").data || {};
  const marketsTopNews  = searchResult?.find(item => item?.name === "markets_top_news") || {};
  
  useEffect(() => {
    const api = API_CONFIG["SUBSCRIBER_HOMEPAGE_FOCUSAREA_GET"][window?.APP_ENV];
    const ssoid = window?.objUser?.info?.ssoid || "bo6gekyrgw2kekv61lq1e8m77a";

    fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${ssoid}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // if (data?.focusArea) {
        //   setFocusArea(data?.focusArea);
        // }
        console.log("Focus Area Data: ", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <section className="topLayout">
        <div className="ly_first_wrp">
          <div className='ly_second_wrp'>
            <div className="col1">
              <TodayNews todayNews={todayNews} />
            </div>
            <div className="col2">
              <div className="titleNSwitch">
                <FocuseAreaNotification focusArea={focusArea} />
                <span className="title">ETPRIME</span>
                <span className="switch">
                  <span className={focusArea === "news" ? "active" : ""} onClick={() => setFocusArea("news")}>NEWS FOCUS</span>
                  <span className="switchIcon" onClick={() => {
                    focusArea === "news" ? setFocusArea("market") : setFocusArea("news")
                  }}>
                    <i className={focusArea === "news" ? "left" : "right"}></i>
                  </span>
                  <span className={focusArea === "market" ? "active" : ""} onClick={() => setFocusArea("market")}>MARKET FOCUS</span>
                </span>
              </div>
              <PrimeBenefitsBucket focusArea={focusArea}/>
              { focusArea === "news" && <>            
                <PrimeExclusives title={primeExclusives?.title || ""} data={primeExclusives?.data || []} focusArea={focusArea}/>
                <InvestmentIdeas focusArea={focusArea} data={investmentIdeas?.data || []}/>
                <ETEpaper focusArea={focusArea} etEpaperData={etEpaperData} isDev={isDev}/>
                <LessonsFromGrandmasters focusArea={focusArea} isDev={isDev}/>
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
                <NewsByIndustry data={NewsByIndustryData?.data || []} title={NewsByIndustryData?.title || ''} />
                <Opinion OpinionData={OpinionData?.data || []} focusArea={focusArea} />
              </>
            }
        </div>
        <div className="col3">
          { focusArea === "market" && <>            
            <PrimeExclusives title={primeExclusives?.title || ""} data={primeExclusives?.data || []} focusArea={focusArea}/>
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
          <NewsByIndustry data={NewsByIndustryData?.data || []} title={NewsByIndustryData?.title || ''} />
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
            justify-content: space-between;
            width: calc(100% - 350px);
            flex-direction: column;

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

function FocuseAreaNotification({ focusArea }) {

  return (
    <>
      <div>
        <div className="notification">
          <div className="icon">
            <img src="/images/primeHome/notification.svg" alt="" />
          </div>
          <div className="text">
            <div className="title">Focus Area</div>
            <div className="desc">You are currently viewing Market Focus. Click here to switch to News Focus</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .notification {
          display: flex;
          align-items: center;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 5px;
          margin-top: 10px;

          .icon {
            margin-right: 10px;
          }

          .text {
            .title {
              font-size: 14px;
              font-weight: 600;
            }

            .desc {
              font-size: 12px;
              color: #666;
            }
          }
        }
      `}</style>
    </>
  )
}