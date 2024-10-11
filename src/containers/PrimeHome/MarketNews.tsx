import React, { useEffect, useState } from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'
import LiveIcon from 'components/Icons/LiveIcon'
import MoreFromLink from './MoreFromLink'
import { ET_WEB_URL } from 'utils/common'
import { dateFormat } from 'utils/utils'

export default function MarketNews({ title, data, podcastData }) {  
  return (
    <>
    <section className="marketNews">
      <h2><a href={`${ET_WEB_URL}/markets`}>{title}</a></h2>
      <OneImgTwoColsNewsLayout data={data} more={{text: "Market News", link:"/markets"}}/>
      <div className="second">
        <LiveBlog />
        <ExpertViews />
        <MarketMoguls />
      </div>
      <div className="third">
        <Podcast podcastData={podcastData}/>
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
        padding-top: 1px;

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
          margin: 0 20px;
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

function Podcast({ podcastData }) {
  const data = podcastData[0] || {};
  const titles = data?.title?.split(':') || [];

  return <>
    <div className="podcast">
      <div className="title">Podcast</div>
      <div className="button">{titles?.[0] || ""} <i className="crownIcon"></i></div>
      <div className="datetime">{data?.timeAgo} ago  | {dateFormat(data?.date, "%MMM %d, %Y")}</div>
      <a className="description" target="_blank" href={data?.url}>{titles?.[1]?.trim() || ""}</a>
      <a className="cta" target="_blank" href={data?.url}><i className="iconListen"></i>Listen <span className="dot"></span><span className="duration">{data?.duration || ""}</span></a>
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
            background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
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
            background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
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

        a{
          &:hover {
            text-decoration: underline;
          }
        }
      }
    `}</style>
  </>
}

function StockScreeners() {
  const [data, setData]: any = useState([])
  
  useEffect(() => {
    const apiUrl = "https://etmarketsapis.indiatimes.com/ET_TechnicalScreeners/screenerstats?device=web";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {        
        setData(data)
      })
      .catch((error) => console.log(error));
  }, []);

  return <>
    <div className="stockScreeners">
      <h3>
        <a href={`${ET_WEB_URL}/markets/stocks/stock-screener`} target="_blank">Stock Screeners</a>
        <i className="iconScreener"></i>
      </h3>
      <ul className="screener">
        {
          data?.stockScreeners?.map((stockScreener, index) => {
            return <li key={`screener_stockScreener_key_${index}`}>
            <a
              target="_blank"
              data-ga-onclick="Top Score Companies - href"
              href={`${ET_WEB_URL}/stock_screener/predefKey-${stockScreener?.id}.cms`}
            >
              <div className="figure">
                <img
                  src={stockScreener?.screenerHighlightImageUrl}
                  width={20}
                  alt={stockScreener?.screenerName}
                />
              </div>
              <div className="content">
                <span className="name wrapLines l2">{stockScreener?.screenerName || ""}</span>
                <span className="count">{stockScreener?.nseCount} Stocks</span>
              </div>
            </a>
          </li>
          })
        }        
        <li>
          <a
            href={`${ET_WEB_URL}/markets/stocks/stock-screener`}
            target="_blank"
            data-ga-onclick="Stock Screener Count - href"
          >
            <div className="midcontent">
              <span className="count">+{data?.stockScreenersCount || ""}</span>
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
            background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
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
        <tbody>
          <tr>
            <td>
              <a title="Jindal Stainless Ltd." className="companyName" target="_blank" href={`${ET_WEB_URL}/jindal-stainless-ltd/stocks/companyid-750.cms`}>Jindal Stainless</a>
            </td>
            <td className="valChange">
              <strong className="val">751.45 </strong>
              <span className="change red">(-0.66%)</span>
            </td>
          </tr>
        </tbody>
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

function LiveBlog() {

  return <>
    <div className="liveblog">
      <div className="liveIcon">
        <span className="text">LIVE </span>
        <LiveIcon />
      </div>
      <div className="lhead"><a target="_blank" href={`${ET_WEB_URL}/markets/stocks/live-blog/bse-sensex-today-live-nifty-stock-market-updates-23-august-2024/liveblog/112724849.cms`}>Sensex Today | Stock Market LIVE Updates | Sensex flat, Nifty tests 24,800; banks &amp; financials under pressure</a></div>
      <div className="content"><span>08:21 PM</span>Powell has set the stage for rate cuts: David Doyle of Macquarie Group</div>
      <div className="content"><span>08:19 PM</span>Inflation, labor data opens the door to 50s (rate cut) at some point: ...</div>
      <div className="content"><span>08:17 PM</span>Powell validates market expectations for a September rate cut: Uto Shi...</div>
    </div>      
    <style jsx>{`
      .liveblog {
        .liveIcon {
          .text {
            background-color: #ed193b;
            color: #FFF;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            border-radius: 1px;
            padding: 2px 5px;
            margin-right: 5px;
          }
        }

        .lhead {
          font-family: Faustina;
          font-size: 18px;
          font-weight: 600;
          padding-bottom: 10px;
        }

        .content {
          font-family: Faustina;
          font-size: 14px;
          font-weight: 400;
          border-left: 2px solid #979797;
          padding: 0 0 10px 15px;
          position: relative;

          span {
            font-family: Montserrat;
            font-size: 11px;
            font-weight: 400;
            color: #727272;
            display: block;
            padding-top: 2px;
          }

          &:before {
            content: '';
            height: 7px;
            width: 7px;
            background: red;
            display: inline-block;
            position: absolute;
            left: -6px;
            border-radius: 50%;
            top: 0;
            margin: 3px 0;
            border: 2px solid #ffe9e2;
          }
        }
      }
    `}</style>
  </>;
}

function ExpertViews() {

  return <>
    <div className="expertViews">
      <div className="title">
        <a className="title" href={`${ET_WEB_URL}/markets/expert-views/articlelist/50649960.cms`} data-ga-onclick="Title - Expert Views - href" target="_blank">Expert Views</a>
      </div>
      <div className="content">
        <img width="56" height="56" alt="Will NBFCs &amp; banks lead the next rally?" className="" src="https://img.etimg.com/thumb/msid-113479290,width-155,height-116,imglength-119804,quality-100/will-nbfcs-amp-banks-lead-the-next-rally.jpg" data-original="https://img.etimg.com/thumb/msid-113479290,width-155,height-116,imglength-119804,quality-100/will-nbfcs-amp-banks-lead-the-next-rally.jpg"  />
        
        <span className="right">
          <a data-ga-onclick="Expert Views - 1 - href" target="_blank" href={`${ET_WEB_URL}/markets/expert-view/will-nbfcs-and-banks-lead-indian-markets-next-rally-hemang-jani-answers/articleshow/113479290.cms`}>Will NBFCs &amp; banks lead the next rally?</a>
          <span className="author">Hemang Jani</span>
        </span>
      </div>
      <MoreFromLink href="/markets/expert-views/articlelist/50649960.cms" appendText="Expert Views" moreText="More" />
    </div>
    <style jsx>{`
      .expertViews {
        border-top: 2px solid #000;
        padding-top: 10px;
        margin-top: 16px;

        .content {
          display: inline-flex;
          gap: 10px;          
          border-bottom: 1px solid #ddc2bb;
          padding-bottom: 10px;
          margin-bottom: 10px;
          
          .author {
            font-family: Montserrat;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.67;
            display: block;            
          }
        }
      }

      .title {
        margin-bottom: 10px;
        a {
          font-family: Montserrat;
          font-size: 18px;
          font-weight: 700;          
          margin-bottom: 5px;

          &:after {
            content: '';
            display: inline-block;
            width: 7px;
            height: 7px;
            top: -1px;
            left: 2px;
            border-top: 2px solid #ed193b;
            border-left: 2px solid #ed193b;
            position: relative;
            cursor: pointer;
            transform: rotate(135deg);
          }
        }
      }
    `}</style>
  </>;
}

function MarketMoguls() {
  
    return <>
      <div className="marketMoguls">
        <div className="title">
          <a className="title" href={`${ET_WEB_URL}/markets/market-moguls/articlelist/50649959.cms`} data-ga-onclick="Title - Market Moguls - href" target="_blank">Market Moguls</a>
        </div>
        <div className="content">
          <img width="56" height="56" alt="Will NBFCs &amp; banks lead the next rally?" className="" src="https://img.etimg.com/thumb/msid-113479290,width-155,height-116,imglength-119804,quality-100/will-nbfcs-amp-banks-lead-the-next-rally.jpg" data-original="https://img.etimg.com/thumb/msid-113479290,width-155,height-116,imglength-119804,quality-100/will-nbfcs-amp-banks-lead-the-next-rally.jpg" />
          
          <span className="right">
            <span className="author">Ajit Menon</span>
            <span className="dib">CEO, PGIM India Asset Management</span>
            <a data-ga-onclick="Market Moguls - 1 - href" target="_blank" title="The gravity of equity markets: Rationality, boom, and defiance" href={`${ET_WEB_URL}/markets/stocks/news/the-gravity-of-equity-markets-rationality-boom-and-defiance/articleshow/113390420.cms`}>The gravity of equity markets: Rationality, boom, and defiance</a>
          </span>
        </div>
        <MoreFromLink href="/markets/market-moguls/articlelist/50649959.cms" appendText="Market Moguls" moreText="More" />
      </div>
      <style jsx>{`
        .marketMoguls {
          border-top: 2px solid #000;
          padding-top: 10px;
          margin-top: 16px;
  
          .content {
            display: inline-flex;
            gap: 10px;          
            border-bottom: 1px solid #ddc2bb;
            padding-bottom: 10px;
            margin-bottom: 10px;
            
            .author {
              font-family: Montserrat;
              font-size: 12px;
              font-weight: 700;
              line-height: 1.67;
              display: block;            
            }

            .dib {
              font-family: Montserrat;
              font-size: 11px;
              font-weight: 300;
              font-style: italic;
              display: block;
              margin-bottom: 5px;
            }
          }
        }
  
        .title {
          margin-bottom: 10px;
          a {
            font-family: Montserrat;
            font-size: 18px;
            font-weight: 700;          
            margin-bottom: 5px;
  
            &:after {
              content: '';
              display: inline-block;
              width: 7px;
              height: 7px;
              top: -1px;
              left: 2px;
              border-top: 2px solid #ed193b;
              border-left: 2px solid #ed193b;
              position: relative;
              cursor: pointer;
              transform: rotate(135deg);
            }
          }
        }
      `}</style>
    </>;
}