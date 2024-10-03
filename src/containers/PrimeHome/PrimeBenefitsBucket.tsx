// @ts-nocheck

import React, { useRef, useEffect, useState } from 'react'

export default function PrimeBenefitsBucket({focusArea}) {
  const sliderRef = useRef(null);
  const innerRef = useRef(null);
  const [x, setX] = useState(0);
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  const items = [
    {
      title: "Prime Exclusives",
      iconPosition: "-17px -22px",
      url: "https://economictimes.indiatimes.com/prime?source=homepage&medium=prime_exclusives&campaign=prime_discovery"
    }, 
    {
      title: "Investment Ideas",
      iconPosition: "-68px -22px",
      url: "https://economictimes.indiatimes.com/prime/investment-ideas?source=homepage&medium=investment_ideas&campaign=prime_discovery"
    },
    {
      title: "Stock Reports",
      iconPosition: "-118px -22px",
      url: "https://economictimes.indiatimes.com/markets/benefits/stockreportsplus?source=homepage&medium=sr_plus&campaign=prime_discovery"
    },
    {
      title: "BigBull Portfolio",
      iconPosition: "-114px -99px",      
      url: "https://economictimes.indiatimes.com/markets/top-india-investors-portfolio/individual?source=homepage&medium=big_bull&campaign=prime_discovery",
      isNew: true
    },
    {
      title: "ET Grandmasters",
      iconPosition: "-48px -255px",
      backgroundSize: "375px",
      url: "https://masterclass.economictimes.indiatimes.com/discover?source=homepage&medium=ET_Grandmasters&campaign=prime_discovery",
      isNew: true
    },
    {
      title: "Markets Mood",
      iconPosition: "-5px -230px",
      backgroundSize: "340px",
      url: "https://economictimes.indiatimes.com/markets/stock-market-mood?source=homepage&medium=market_moods&campaign=prime_discovery",
      isNew: true
    },
    {
      title: "Wealth Magazine",
      iconPosition: "-169px -22px",
      url: "https://epaper.indiatimes.com/wealth_edition.cms?source=homepage&medium=wealth_edition&campaign=prime_discovery"
    },
    {
      title: "Today's ePaper",
      iconPosition: "-12px -104px",
      url: "https://epaper.indiatimes.com/timesepaper/publication-the-economic-times,city-delhi.cms?source=homepage&medium=todays_paper&campaign=prime_discovery"
    },
    {
      title: "Redeem Benefits",
      iconPosition: "-118px -60px",
      url: "https://economictimes.indiatimes.com/et_benefits.cms?source=homepage&medium=addOn_benefits&campaign=prime_discovery"
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
      // translate with transition
      innerRef.current.style.transition = `transform 0.5s ease 0s`;
    }
  }, [x]);

  return (
    <>      
      <div className={`primeBenefitsBucket ${focusArea}`}> 
        <div className="slider" ref={sliderRef}>
            <div className="itemWrap" ref={innerRef}>
            {
              items.map((item, index) => {
                const style: any = {backgroundPosition: item.iconPosition};
                item.backgroundSize ? style.backgroundSize = item.backgroundSize : null;
                return (
                  <a key={index} className="item" href={item?.url} target="_blank">
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

          &.market {
            padding-left: 0;
            margin-bottom: 25px;
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
              pointer-events: none;
              cursor: not-drop;
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
                background: url(https://img.etimg.com/photo/msid-112277608,quality-100/benefits-icon-sprite.jpg) no-repeat;
                display: inline-block;
                background-size: 210px;
                width: 24px;
                height: 24px;
              }
            }
          }

          .newIcon {
            margin-bottom: 7px;
            background: url(https://img.etimg.com/photo/msid-112277608,quality-100/benefits-icon-sprite.jpg) no-repeat;
            display: inline-block;
            background-size: 210px;            
            position: absolute;
            top: 0;
            width: 25px;
            height: 13px;
            right: 0;
            background-position: -47px -104px;
          }
        }
      `}</style>
    </>
  )
}
