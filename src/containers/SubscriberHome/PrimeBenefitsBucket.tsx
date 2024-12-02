// @ts-nocheck

import React, { useRef, useEffect, useState } from 'react'

export default function PrimeBenefitsBucket({focusArea}) {
  const sliderRef = useRef(null);
  const innerRef = useRef(null);
  const [x, setX] = useState(0);
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  const primeItems = [
    {
      title: "Prime Exclusives",
      iconPosition: "-22px -20px",
      url: "https://economictimes.indiatimes.com/prime?source=homepage&medium=prime_exclusives&campaign=prime_discovery",
      key:"prime_exclusive"
    }, 
    {
      title: "Wealth Edition",
      iconPosition: "-64px -22px",
      width: "15px",
      height: "20px",
      url: "https://epaper.indiatimes.com/wealth_edition.cms?source=homepage&medium=wealth_edition&campaign=prime_discovery",
      key:"wealth_magazine"      
    },
    {
      title: "ET Grandmasters",
      iconPosition: "-99px -20px",      
      url: "https://masterclass.economictimes.indiatimes.com/discover?source=homepage&medium=ET_Grandmasters&campaign=prime_discovery",
      key:"et_grandmasters"       
    },   
    {
      title: "News",
      iconPosition: "-144px -20px",
      width: "12px",
      height: "26px",
      url: "https://economictimes.indiatimes.com/news",
      key:"news",      
    },     
    {
      title: "Today's ePaper",
      iconPosition: "-181px -24px",
      width: "20px",
      height: "16px",
      url: "https://epaper.indiatimes.com/timesepaper/publication-the-economic-times,city-delhi.cms?source=homepage&medium=todays_paper&campaign=prime_discovery",
      key:"todays_ePaper",
      isNew: true     
    },
    {
      title: "Redeem Benefits",
      iconPosition: "-222px -20px",
      width: "18px",
      url: "https://economictimes.indiatimes.com/et_benefits.cms?source=homepage&medium=addOn_benefits&campaign=prime_discovery",
      key:"redeem_benefits",
      forMarket: true
    }
  ];

  const marketItems = [
    {
      title: "Investment Ideas",
      iconPosition: "-20px -70px",
      url: "https://economictimes.indiatimes.com/prime/investment-ideas?source=homepage&medium=investment_ideas&campaign=prime_discovery",
      key:"investment_ideas"      
    },
    {
      title: "Stock Reports",
      iconPosition: "-62px -72px",
      url: "https://economictimes.indiatimes.com/markets/benefits/stockreportsplus?source=homepage&medium=sr_plus&campaign=prime_discovery",
      key:"stock_reports"      
    },
    {
      title: "BigBull Portfolio",
      iconPosition: "-99px -72px",      
      url: "https://economictimes.indiatimes.com/markets/top-india-investors-portfolio/individual?source=homepage&medium=big_bull&campaign=prime_discovery",
      key:"bigbull_portfolio",
      isNew: true      
    },
    {
      title: "Market Mood",
      iconPosition: "-139px -71px",  
      width: "25px",    
      url: "https://economictimes.indiatimes.com/markets/stock-market-mood?source=homepage&medium=market_moods&campaign=prime_discovery",
      key:"markets_mood",
      isNew: true    
    },
    {
      title: "Stocks",
      iconPosition: "-179px -75px",
      url: "https://economictimes.indiatimes.com/stocks/marketstats/top-gainers",
      key:"stocks"
    },
    {
      title: "Recos",
      iconPosition: "-218px -71px",
      url: "https://economictimes.indiatimes.com/markets/stock-recos/overview",
      key:"recos",
      isNew: true
    },
    {
      title: "Screener",
      iconPosition: "-260px -73px",
      url: "https://economictimes.indiatimes.com/markets/stock-screener",
      key:"screener"
    },
    {
      title: "Data Downloader",
      iconPosition: "-298px -72px",
      url: "https://economictimes.indiatimes.com/markets/live-coverage",
      key:"data_downloader"
    },
    // {
    //   title: "Market Scans",
    //   iconPosition: "-21px -115px",
    //   url: "https://economictimes.indiatimes.com/markets/stocks/market-scan",
    //   key:"market_scans"
    // },
    {
      title: "StockTalk",
      iconPosition: "-60px -116px",
      url: "https://economictimes.indiatimes.com/markets/etmarkets-live/stocktalk:-get-your-query-answered-by-experts/streamsrecorded/streamid-npnfmmmg66,expertid-133.cms",
      key:"stock_talk"
    },
    {
      title: "AI Chart Patterns",
      iconPosition: "-99px -114px",
      url: "https://economictimes.indiatimes.com/stocks/chart-patterns",
      key:"ai_chart_patterns"
    }
  ];

  // const scrollBy = 100;

  function onNextPrevButtonClick(type) {  
    let scrollBy = 251  ; 
    if(innerRef.current && sliderRef.current) {       
      const viewportWidth = sliderRef.current.offsetWidth;
      const innerWidth = innerRef.current.offsetWidth;

      const scrollableWidth = innerWidth - viewportWidth;

      // innerRef.current.style.transform = `translate3d(${x}px, 0px, 0px)`;

      // scroll by scrollBy amount on each click
      let scrollAmount = 0;

      if(type == "next"){
        let remaingScrollableWidth = scrollableWidth + x;

        if(remaingScrollableWidth < scrollBy) {
          scrollBy = remaingScrollableWidth;
        }
      }

      if(type == "prev") {
        if(-x < scrollBy) {
          scrollBy = -x;
        }
      }
      
      // debugger
      if(type === "prev") {
        scrollAmount = x + scrollBy;
        setX(scrollAmount);
      } else {
        scrollAmount = x - scrollBy;
        setX(scrollAmount);
      }

      if(scrollAmount < 0) {
        setPrevDisabled(false);
      } else {
        setPrevDisabled(true);
      }

      // debugger;
      if(-scrollAmount + viewportWidth == innerWidth) {
        setNextDisabled(true);
      } else {
        setNextDisabled(false);
      }

    }
  }

  useEffect(() => {
    if(innerRef.current) {
      innerRef.current.style.transform = `translate3d(${x}px, 0px, 0px)`;      
      innerRef.current.style.transition = `transform 0.5s ease 0s`;
    }
  }, [x]);

  useEffect(() => {
    setX(0);
    setPrevDisabled(true);
    // if innerWidth is less than viewportWidth, then disable next button
    if(innerRef.current && sliderRef.current) {      
      const viewportWidth = sliderRef.current.offsetWidth;
      const innerWidth = innerRef.current.offsetWidth;
      if(innerWidth <= viewportWidth) {
        setNextDisabled(true);
        sliderRef.current.style.display = "flex";
        sliderRef.current.style.justifyContent = "center";
      } else {
        setNextDisabled(false);
        // remove inline styles
        sliderRef.current.style.display = "";
        sliderRef.current.style.justifyContent = "";
      }
    } 
  }, [focusArea]);

  const benefits = focusArea === "market" ? marketItems : primeItems;  

  return (
    <>      
      <div className={`primeBenefitsBucket ${focusArea}`}> 
        <div className="slider" ref={sliderRef}>
            <div className="itemWrap" ref={innerRef}>
            {
              benefits.map((item, index) => {
                const style: any = {backgroundPosition: item.iconPosition};                
                item.width ? style.width = item.width : null;
                item.height ? style.height = item.height : null;
                return (
                  <a key={item.key} className="item" href={item?.url} target="_blank" data-ga-onclick={`Subscriber Homepage#ET prime widget click#${item.key}`}>
                    <span className="icon" style={style}></span>
                    <span className="title">{item.title}</span>
                    {item.isNew && <span className="newIcon"></span>}
                  </a>
                )})
            }
            </div>   
        </div>                  
        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>               
      </div>      
      <style jsx>{`
        .primeBenefitsBucket {          
          padding: 15px 0 5px 10px;
          position: relative;

          .slider {
            overflow: hidden;            
          }

          &.news {
            border-left: 1px dotted #9b8680;
          }         

          .arr {
            width: 18px;
            height: 18px;
            display: inline-block;
            background: #DA4617CC;
            border-radius: 50%;
            position: absolute;            
            cursor: pointer;
            pointer-events: all;

            &.disabled {
              opacity: 0.4;              
              cursor: no-drop;
              pointer-events: none;
            }

            &:after {
              content: '';
              display: inline-block;
              width: 6px;
              height: 6px;
              border-top: 1px solid #fff;
              border-left: 1px solid #fff;
              transform: rotate(-45deg);
              position: absolute;
              top: 5px;
              left: 6px;
            }

            &.prev {
              left: 3px;
              top: 46px;
            }

            &.next {
              right: -7px;
              top: 46px;
              transform: rotate(180deg);
            }
          }

          .itemWrap {
            display: inline-flex;
            gap: 10px;
            
            .item {
              flex: 0 0 85px;
              background: #fff7f3;
              box-shadow: 0 4px 4px 0 rgba(231,206,206,0.25);
              border: solid 1.5px #f9d8cb;
              border-radius: 5px;
              font-size: 10px;
              font-weight: 700;
              transition: .5s all ease 0;
              position: relative;
              height: 74px;
              width: 85px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              text-align: center;
              padding: 0 7px;

              &:hover {
                text-decoration: none;
                box-shadow: 0 4px 7px 0 rgba(198,138,138,0.25);
                border: solid 1.5px #e99479;
              }

              .icon {
                margin-bottom: 7px;
                background: url("https://img.etimg.com/photo/msid-115899559,quality-100/benefits-icon-sprite.jpg") no-repeat;
                display: inline-block;
                background-size: 402px 308px;
                width: 24px;
                height: 24px;
              }
            }
          }

          .newIcon {
            margin-bottom: 7px;
            background: url("https://img.etimg.com/photo/msid-112277608,quality-100/benefits-icon-sprite.jpg") no-repeat;
            display: inline-block;
            background-size: 210px;            
            position: absolute;
            top: 0;
            width: 25px;
            height: 13px;
            right: 0;
            background-position: -47px -104px;
          }

          &.market {
            padding-left: 0;
            margin-bottom: 25px;

            .prev {
              left: -7px;
            }
          }
        }
      `}</style>
    </>
  )
}