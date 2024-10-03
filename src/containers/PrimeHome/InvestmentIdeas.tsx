import ArrowRnd from 'components/Icons/ArrowRnd'
import React from 'react'
import HeadingWithRightArrow from './HeadingWithRightArrow'
import PrimeIcon from 'components/Icons/PrimeIcon'
import Separator from 'components/Separator'

export default function InvestmentIdeas({ focusArea }) {
  return (
    <>
      <div className={`investmentIdeas ${focusArea}`}>
        {
          focusArea == 'market' && <>
            <PrimeIcon style={{zoom: 0.7, marginRight: '7px', top: '4px'}}/>
            <HeadingWithRightArrow title="Investment Ideas" /> 
          </>
        }
        {
          focusArea == 'news' && <>
            <Separator />
            <HeadingWithRightArrow title="Investment Ideas" />
            <span className="title"></span>            
          </> 
        }

        <a href="#" className="first">
          <img width="248" height="186" title="As valuations stay elevated, be selective and choose right business: 5 large cap stocks from different sectors with upside potential of up to 34%" alt="As valuations stay elevated, be selective and choose right business: 5 large cap stocks from different sectors with upside potential of up to 34%" src="https://img.etimg.com/thumb/msid-113351575,imgsize-39678,width-248,height-186,quality-100/as-valuations-stay-elevated-be-selective-and-choose-right-business-5-large-cap-stocks-from-different-sectors-with-upside-potential-of-up-to-34.jpg" />
          As valuations stay elevated, be selective and choose right business: 5 large cap stocks from different sectors with upside potential of up to 34%
        </a>
        <div className="row">
          <div className="col">
            <span className="counter">2.</span>
            <a target="_blank" className="hl" href="https://economictimes.indiatimes.com/markets/stocks/news/stock-picks-of-the-week-6-stocks-with-consistent-score-improvement-and-upside-potential-of-up-to-44/articleshow/113346694.cms" data-conttype="100">Stock picks of the week: 6 stocks with consistent score improvement and upside potential of up to 44%</a>
          </div> 
          <div className="col">
            <span className="counter">3.</span>
            <a target="_blank" className="hl" href="https://economictimes.indiatimes.com/markets/stocks/news/stock-picks-of-the-week-6-stocks-with-consistent-score-improvement-and-upside-potential-of-up-to-44/articleshow/113346694.cms" data-conttype="100">Stock picks of the week: 6 stocks with consistent score improvement and upside potential of up to 44%</a>
          </div>  
        </div>
        <div className="row">
          <div className="col">
            <span className="counter">4.</span>
            <a target="_blank" className="hl" href="https://economictimes.indiatimes.com/markets/stocks/news/stock-picks-of-the-week-6-stocks-with-consistent-score-improvement-and-upside-potential-of-up-to-44/articleshow/113346694.cms" data-conttype="100">Daily Trading Desk: An engineering stock for 7% gain & an FMCG stock poised for 5% rise</a>
          </div> 
          <div className="col">
            <span className="counter">5.</span>
            <a target="_blank" className="hl" href="https://economictimes.indiatimes.com/markets/stocks/news/stock-picks-of-the-week-6-stocks-with-consistent-score-improvement-and-upside-potential-of-up-to-44/articleshow/113346694.cms" data-conttype="100">Stock Radar: 100% rally in 1 year! Dixon Technologies takes support above 50-DMA and bounces back; time to buy?</a>
          </div>  
        </div>
        <a className="seeAllLink" href="/prime" target="_blank" data-ga-onclick="Exclusives - See All - href">See All Investment Ideas Stories <ArrowRnd /></a>
      </div>
      <style jsx>{`
        .investmentIdeas {          
          margin-top: 1px;
          position: relative;

          &.news {
            padding-left: 20px;
            border-left: 1px dotted #9b8680;
            margin-top: -13px;
          }

          &.market {
            .first {
              flex-direction: column;
              font-size: 20px;
              gap: 5px;
              line-height: 24px;

              img {
                width: 100%;
                height: auto;
              }
            }
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

          .first {
            display: flex;
            align-items: flex-start;
            padding-top: 10px;
            gap: 15px;
            font: 30px Faustina;
            border-bottom: 1px solid #e8d2cb;
            padding-bottom: 20px;
          }

          .row {
            display: flex;
            gap: 20px;
            font: 18px Faustina;
            .col {
              flex: 1;
              display: inline-flex;
              border-bottom: 1px solid #e8d2cb;
              padding: 15px 0;
              gap: 20px;

              .counter {
                font-weight: 700;
                font-style: italic;
                font-size: 40px;
                font-family: 'Faustina';
                color: #ffc3b0;
                position: relative;
                top: -9px;
              }
            }
          }

          .seeAllLink {
            font-size: 14px;
            line-height: 18px;
            font-weight: 700;
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
            padding-bottom: 1.5rem;
          }
        }
      `}</style>
    </>    
  )
}
