import React from 'react'
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

export default function TopSectionLayout({ searchResult }) {
  const [focusArea, setFocusArea] = React.useState("news");
  const todayNews = searchResult?.find(item => item?.name === "today_news") || {};
  const primeExclusives = searchResult?.find(item => item?.name === "prime_exclusives") || {};
  const OpinionData = searchResult?.find(item => item?.name === "opinion") || {};
  const NewsByIndustryData = searchResult?.find(item => item?.name === "news_by_industry") || {};
  const etEpaperData = searchResult?.find(item => item?.name === "epaper").data || {};
  // console.log("topNews", searchResult);
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
                <InvestmentIdeas focusArea={focusArea}/>
                <ETEpaper focusArea={focusArea} etEpaperData={etEpaperData}/>
                <LessonsFromGrandmasters focusArea={focusArea}/>
              </>
              }

              {
                focusArea === "market" && <>
                  <MarketsTopNews focusArea={focusArea}/>
                  <IndicesWidget />
                  <MarketDashboard />
                  <Separator />
                  <StockRecos />
                  <Separator />
                  <StockReportPlus />
                  <Separator />
                  <BigBullPortfolio />
                  <Separator />
                  <MarketMood />
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
            <InvestmentIdeas focusArea={focusArea}/>
            <ETEpaper focusArea={focusArea} etEpaperData={etEpaperData} />
            <LessonsFromGrandmasters focusArea={focusArea}/>
          </>
          }

          { focusArea === "news" && <>
            <div className="title">MARKETS</div>
            <MarketsTopNews focusArea={focusArea}/>
            <IndicesWidget />
            <MarketDashboard />
            <Separator />
            <StockRecos />
            <Separator />
            <StockReportPlus />
            <Separator />
            <BigBullPortfolio />
            <Separator />
            <MarketMood />
          </>
          }

          <LiveStream />
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
