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

function FocuseAreaNotification({ focusArea }) {

  return (
    <>      
      <div className="notification">           
        <span className="close">&times;</span>
        <div className="title">You're experiencing market centric view!</div>
        <div className="desc">Want more news? Switch to '<span className="focus">News Focus</span>' anytime.</div>          
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
          padding: 14px 28px 14px 14px;
          background: #000;
          border-radius: 10px;
          color: #fff;
          font-family: Montserrat;
          line-height: 20px;
          position: absolute;
          right: -90px;
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