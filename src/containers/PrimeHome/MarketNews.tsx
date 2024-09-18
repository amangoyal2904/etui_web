import React from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'

export default function MarketNews({ title, data }) {  
  return (
    <>
    <section className="marketNews">
      <h2><a href="">{title}</a></h2>
      <OneImgTwoColsNewsLayout data={data} more={{text: "Market News"}}/>
      <div className="second">
        <div className="liveIcon">
          <span className="text">Live</span>
          <span className="ripple"><i></i></span>
        </div>
      </div>
      <div className="third">
        <Podcast />
        <StockScreeners />
        <MyWatchlist />
      </div>
    </section>
    <style jsx>{`
      .marketNews {
        padding-bottom: 50px;
        border-top: 1px solid #9b8680;
        margin-bottom: 1px;
        border-bottom: 1px solid #9b8680;

        h2 {
          font-size: 36px;
          padding-top: 35px;
          border-top: 3px solid #9b8680;
          text-transform: uppercase;
          margin-bottom: 20px;

          a {
            &::after {
              content: '';
              display: inline-block;
              width: 15px;
              height: 15px;
              top: -4px;
              left: 3px;
              border-top: 2px solid #000;
              border-left: 2px solid #000;
              position: relative;
              cursor: pointer;
              transform: rotate(135deg);
            }
          }
        }

        .second {
          width: 250px;
          display: inline-block;
          vertical-align: top;
        }

        .third {
          width: 275px;
          display: inline-block;
          vertical-align: top;
        }
      }
    `}</style>
    </>
  )
}

function Podcast() {

  return <>
    <div className="podcast">
      <div className="title">Podcast</div>
      <div className="button">ET Market Watch <i className="crownIcon"></i></div>
      <div className="datetime">15 Hours ago  | Sep 17, 2024</div>
      <a className="description" target="_blank" href="/markets/stocks/etmarkets-podcast/et-market-watch-nifty-sensex-at-new-peaks-ahead-of-fed-rate-cuts/podcast/113431436.cms">Nifty, Sensex at new peaks ahead of Fed rate cuts</a>
      <a className="cta" title="ET Market Watch: Nifty, Sensex at new peaks ahead of Fed rate cuts" target="_blank" href="/markets/stocks/etmarkets-podcast/et-market-watch-nifty-sensex-at-new-peaks-ahead-of-fed-rate-cuts/podcast/113431436.cms"><i className="iconListen"></i>Listen <span className="dot"></span><span className="duration">02:15</span></a>
    </div>
    <style jsx>{`
      .podcast {
        background-color: #fff6f2;        
        padding: 15px;
        width: 245px;

        .title {
          font-family: Montserrat;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 10px;
          text-transform: uppercase; 
        }

        .button {
          font-family: Montserrat;
          text-transform: uppercase;
          display: inline-block;
          box-shadow: 1px 1px 0 0 rgba(0,0,0,0.18);
          background-color: #fff;
          font-size: 11px;
          font-weight: 600;
          color: #000;
          padding: 5px;

          .crownIcon {
            background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
            display: inline-block;
            background-size: 475px;
            width: 14px;
            height: 11px;
            background-position: -180px -7px;
            top: -1px;
            margin-left: 5px;
          }
        }

        .datetime {
          font-family: Montserrat;
          font-size: 10px;
          font-weight: 400;
          color: #000;
          padding: 10px 0;
        }

        .description {
          font-family: Faustina;
          font-size: 20px;
          font-weight: 600;
          display: block;
        }

        .cta {
          background: #ed193b;
          color: #fff;
          margin-top: 20px;
          padding: 6px 8px 5px;
          border-radius: 2px;
          display: inline-block;
          font-size: 11px;
          cursor: pointer;

          .iconListen {
            background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
            width: 13px;
            height: 12px;
            margin-right: 5px;
            top: 2px;
            background-position: -346px -8px;
            position: relative;            
            display: inline-block;
            background-size: 475px;
          }

          .dot {
            display: inline-block;
            width: 4px;
            height: 4px;
            background-color: #fff;
            border-radius: 50%;
            margin: 2px 3px;
          }
        }
      }
    `}</style>
  </>
}

function StockScreeners() {

  return <>
    <div className="stockScreeners">
      <h3>
        <a href="/markets/stocks/stock-screener" target="_blank">Stock Screeners</a>
        <i className="iconScreener"></i>
      </h3>
      <ul className="screener">
        <li>
          <a
            target="_blank"
            data-ga-onclick="Top Score Companies - href"
            href="/stock_screener/predefKey-top_score_companies.cms"
          >
            <div className="figure">
              <img
                src="https://img.etimg.com/photo/msid-87480690,quality-100/top-score-companies.jpg"
                width={20}
                alt="Top Score Companies"
              />
            </div>
            <div className="content">
              <span className="name wrapLines l2">Top Score Companies</span>
              <span className="count">596 Stocks</span>
            </div>
          </a>
        </li>
        <li>
          <a
            target="_blank"
            data-ga-onclick="Growth at Reasonable Price - href"
            href="/stock_screener/predefKey-GARP.cms"
          >
            <div className="figure">
              <img
                src="https://img.etimg.com/photo/msid-75423733,quality-100/top-growth-stocks.jpg"
                width={20}
                alt="Growth at Reasonable Price"
              />
            </div>
            <div className="content">
              <span className="name wrapLines l2">Growth at Reasonable Price</span>
              <span className="count">79 Stocks</span>
            </div>
          </a>
        </li>
        <li>
          <a
            target="_blank"
            data-ga-onclick="Mid-cap Growth Stocks - href"
            href="/stock_screener/predefKey-MID_CAP_GROWTH_STOCKS.cms"
          >
            <div className="figure">
              <img
                src="https://img.etimg.com/photo/msid-75423730,quality-100/midcap-growth-stocks.jpg"
                width={20}
                alt="Mid-cap Growth Stocks"
              />
            </div>
            <div className="content">
              <span className="name wrapLines l2">Mid-cap Growth Stocks</span>
              <span className="count">25 Stocks</span>
            </div>
          </a>
        </li>
        <li>
          <a
            href="/markets/stocks/stock-screener"
            target="_blank"
            data-ga-onclick="Stock Screener Count - href"
          >
            <div className="midcontent">
              <span className="count">+10</span>
              <span className="name">Stock Screener</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <style jsx>{`
    .stockScreeners {
        border-top: 2px solid #000;        
        padding-top: 10px;
        margin-top: 20px;        

        h3 {
          font-family: Montserrat;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 10px;

          .iconScreener {
            background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
            width: 42px;
            height: 14px;
            background-position: -219px -7px;
            margin-left: 5px;
            vertical-align: baseline;                
            display: inline-block;
            background-size: 475px;
          }
        }

        .screener {
          display: grid;    
          grid-template-columns: 1fr 1fr;

          li {
            display: inline-block;
            width: 132px;
            height: 50px;
            box-shadow: 1px 1px 0 0 rgba(0,0,0,0.18);
            background: #fff6f2;
            vertical-align: middle;
            margin: 0 10px 10px 0;

            a {            
              display: flex;            
              align-items: flex-start;            
              justify-content: center;
              height: 40px;
              padding: 5px 7px;

              .figure {
                display: inline-block;
                width: 28px;
                padding: 0 3px 0 0;
                text-align: center;
              }

              .content {
                display: inline-block;
                width: calc(100% - 35px);

                .name {
                  font-size: 11px;
                  font-weight: 500;
                  line-height: 1.09;
                }

                .l2 {
                  -webkit-line-clamp: 2;
                }

                .wrapLines {
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                }

                .count {
                  font-size: 11px;
                  font-weight: 400;
                  line-height: 1.36;
                  color: #7d7d7d;
                  text-align: left;
                  margin-top: 3px;
                  text-transform: uppercase;
                }
              }

              .midcontent {
                text-align: center;
                .count{
                  display: block;
                  font-size: 24px;
                  font-weight: 800;
                  color: #444;
                }

                .name {
                  display: block;
                  font-size: 9px;
                  font-weight: 500;
                  line-height: 1.33;
                }
              }
            }
          }
        }
      }
    `}</style>  
  </>
}

function MyWatchlist() {

  return <>
    <div className="myWatchlist">
      <div className="heading">
        <h3>
          <a target="_blank" title="My Watchlist" href="https://economictimes.indiatimes.com/watchlist">My Watchlist</a>
        </h3>
        <span className="stockCount">1 Stocks</span>
      </div>
      <table className="stocks">
        <tr>
          <td>
            <a title="Jindal Stainless Ltd." className="companyName" target="_blank" href="jindal-stainless-ltd/stocks/companyid-750.cms">Jindal Stainless</a>
          </td>
          <td className="valChange">
            <strong className="val">751.45 </strong>
            <span className="change red">(-0.66%)</span>
          </td>
        </tr>
      </table>  
    </div>
    <style jsx>{`
      .myWatchlist {
        border-top: 2px solid #000;        
        padding-top: 10px;
        margin-top: 20px;

        .heading {
          font-family: Montserrat;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 10px;
          display: flex;
          justify-content: space-between;
        }   

        .stocks {
          width: 100%;
          border-collapse: collapse;

          tr {
            &:not(:first-child) {
              border-top: 1px solid #000;
            }

            td {
              padding: 5px 0;   
              font-size: 11px;           
            }
            
            .valChange {
              text-align: right;
            }

            .red {
              color: #da2337;
            }
          }
        }     
      }
    `}</style>
  </>;
}