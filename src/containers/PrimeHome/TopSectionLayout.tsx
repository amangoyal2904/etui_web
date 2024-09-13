import React from 'react'
import TodayNews from './TodayNews'

export default function TopSectionLayout({ searchResult }) {
  const topNews = searchResult?.find(item => item?.name === "top_news") || {};
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
        </div>
        <div className="col3">
          <div className="title">MARKETS</div>
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
            width: 655px;       

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
            width: 270px;

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
