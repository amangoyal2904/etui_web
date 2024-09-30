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

export default function TopSectionLayout({ searchResult, isDev }) {
  const [focusArea, setFocusArea] = React.useState("news");
  const todayNews = searchResult?.find(item => item?.name === "today_news") || {};
  const primeExclusives = searchResult?.find(item => item?.name === "prime_exclusives") || {};
  // console.log("topNews", searchResult);
  return (
    <>
      <section className="topLayout">
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
            <ETEpaper focusArea={focusArea}/>
            <LessonsFromGrandmasters focusArea={focusArea}/>
          </>
          }

          {
            focusArea === "market" && <>
              <MarketsTopNews focusArea={focusArea}/>
              <IndicesWidget isDev={isDev} />
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
        <div className="col3">
          { focusArea === "market" && <>            
            <PrimeExclusives title={primeExclusives?.title || ""} data={primeExclusives?.data || []} focusArea={focusArea}/>
            <Separator />
            <InvestmentIdeas focusArea={focusArea}/>
            <ETEpaper focusArea={focusArea}/>
            <LessonsFromGrandmasters focusArea={focusArea}/>
          </>
          }

          { focusArea === "news" && <>
            <div className="title">MARKETS</div>
            <MarketsTopNews focusArea={focusArea}/>
            <IndicesWidget isDev={isDev} />
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
      <style jsx>{` 
        .topLayout {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

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
