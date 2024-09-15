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

export default function TopSectionLayout({ searchResult }) {
  const topNews = searchResult?.find(item => item?.name === "top_news") || {};
  const primeExclusives = searchResult?.find(item => item?.name === "prime_exclusives") || {};
  // console.log("topNews", searchResult);
  return (
    <>
      <section className="topLayout">
        <div className="col1">
          <TodayNews topNews={topNews} />
        </div>
        <div className="col2">
          <div className="titleNSwitch">
            <span className="title">ETPRIME</span>
            <span className="switch">
              <span className="active">NEWS FOCUS</span>
              <span className="switchIcon">
                <i></i>
              </span>
              <span className="">MARKET FOCUS</span>
            </span>
          </div>
          <PrimeBenefitsBucket />
          <PrimeExclusives title={primeExclusives?.title || ""} data={primeExclusives?.data || []} />
          <InvestmentIdeas />
          <ETEpaper />
          <LessonsFromGrandmasters />
        </div>
        <div className="col3">
          <div className="title">MARKETS</div>
          <MarketsTopNews />
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
