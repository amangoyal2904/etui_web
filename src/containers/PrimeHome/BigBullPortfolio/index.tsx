// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';
import API_CONFIG from '../../../network/config.json';

export default function BigBullPortfolio({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Best Picks", "Recent Deals", "All Investors"];
  const [data, setData]: any = useState([]);

  const sliderRef = useRef(null);
  const innerRef = useRef(null);
  const [x, setX] = useState(0);
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  function onNextPrevButtonClick(type) {  
    let scrollBy = 251  ; 
    if(innerRef.current && sliderRef.current) {       
      const viewportWidth = sliderRef.current.offsetWidth;
      const innerWidth = innerRef.current.offsetWidth;

      console.log("viewportWidth", viewportWidth, "innerWidth", innerWidth);

      const scrollableWidth = innerWidth - viewportWidth;
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

  function fetchData(activeTab) {
    let apiType = "BigBullGetBestPicks";
    if(activeTab === 1) {
      apiType = "BigBullGetRecentTransactions";
    }
    if(activeTab === 2) {
      apiType = "BigBullAllInverstorOverview";
    }
    const api = API_CONFIG[apiType][window.APP_ENV];

    const payload = {
      ssoId: "",
      primeFlag: 1,
      investorType: "INDIVIDUAL",
      position: "All",
      filterType: "index",
      filterValue: [],
      sortBy: "3MReturns",
      orderBy: "DESC",
      pageNo: 1,
      pageSize: 3,
    };

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    // console.log("activeTab", activeTab);
    fetchData(activeTab);
  }, [activeTab]);

  return (
    <>
      <div className={`bigbull ${focusArea}`}>
        <HeadingWithRightArrow title="BigBull Portfolio" />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>

        <div className="slider" ref={sliderRef}>
          <div className="cards" ref={innerRef}>
            {data?.datainfo?.bestPicksDataInfo?.bestPicksListInfo?.map((item, index) => (
              <div key={index} className="card">
                <div>                
                  <span className="companyName">{item?.companyName}</span>
                  <span className={`addToWatchListIcon`}>&#43;</span>
                </div>
                <div className="row2">
                  <div>
                    <span className="title">3M Return</span>
                    <span className="value">{item?.return3M}</span>
                  </div>
                  <div>
                    <span className="title">Bull Holdings%</span>
                    <span className="value">{item?.holdingPercent}</span>
                  </div>
                  <div>
                    <span className="title">Value (Cr.)</span>
                    <span className="value">{item?.holdingValue}</span>
                  </div>
                </div>
                <div className="investorRow">
                  <div className="left">
                    <img src={item?.investorIntro?.imageURL} alt="Investor Logo" width={42} height={42}/>
                  </div>
                  <div className="right">
                    <span className="best">Best pick of</span>
                    <span className="investorName">{item?.investorIntro?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ViewAllCta title="Portfolio" url="/bigbull-portfolio" isNoBorderRightArrow={focusArea === "market"} />
      </div>
      <style jsx>{`  
        .news {
          .arr {
            display: none;
          }
        }      
        .slider {
          overflow: hidden;
        }
        .cards {
          display: flex;
          gap: 10px;
          flex-direction: column;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .card {
          font-family: Montserrat;
          border: 1px solid #C4C4C4;
          box-shadow: 0px 4px 4px 0px #00000017;          
          padding: 12px 10px 12px 10px;          
          border-radius: 7px; 
          position: relative;
          background: #fff;

          .row2 {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .companyName {            
            font-size: 14px;
            font-weight: 600;             
          }

          .title {            
            font-size: 11px;
            font-weight: 400;   
            display: block;         
          }

          .investorRow {
            display: flex;
            gap: 12px;

            img {
              border-radius: 50%;
            }  

            .best {          
              font-size: 10px;
              font-weight: 500;
              display: block;
              color: #D17D00;
              margin-bottom: 3px;
              margin-top: 2px;
            }

            .investorName {              
              font-size: 12px;
              font-weight: 600;              
            }
          }       
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
            top: 32px;

            &.disabled {
              opacity: 0.4;              
              cursor: no-drop;
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
              right: 25px;              
            }

            &.next {
              right: 0;              
              transform: rotate(180deg);
            }
          }

          .market {
          position: relative;

          .cards {
            display: inline-flex;
            flex-direction: row;
            gap: 20px;

            .card {
              min-width: 320px;
            }
          }
        }
      `}</style>
    </>
  )
}
