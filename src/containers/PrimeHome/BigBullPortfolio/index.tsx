// @ts-nocheck
import React, { useEffect, useState, useRef, act } from 'react'
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';
import API_CONFIG from '../../../network/config.json';
import WatchlistAddition from "components/WatchlistAddition";
import { ET_WEB_URL } from 'utils/common';
import { dateFormat } from 'utils/utils';
import RenderText from 'components/RenderText';
import Loading from 'components/Loading';
import RightArrow from 'components/Icons/RightArrow'

export default function BigBullPortfolio({ focusArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Best Picks", "Recent Deals", "All Investors"];
  const tabLinks = [
    "/markets/top-india-investors-portfolio/individual/best-picks",
    "/markets/top-india-investors-portfolio/individual/recent-transactions",
    "/markets/top-india-investors-portfolio/individual/all-investors"
  ];
  const [data, setData]: any = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

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
      pageSize: 5,
    };

    setFetchingData(true);
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
      }).finally(() => {
        setFetchingData(false);
      }
    );
  }

  useEffect(() => {
    // console.log("activeTab", activeTab);
    fetchData(activeTab);
  }, [activeTab]);

  const howMany = focusArea === "news" ? 2 : 5;
  let portfolios = [];
  if(activeTab === 0) {
    portfolios = data?.datainfo?.bestPicksDataInfo?.bestPicksListInfo?.slice(0, howMany);
  } else if(activeTab === 1) {
    portfolios = data?.datainfo?.recentDealsInfo?.listRecentDeals?.slice(0, howMany);
  } else if(activeTab === 2) {
    portfolios = data?.datainfo?.investorlist?.investorData?.slice(0, howMany);
  }

  return (
    <>
      <div className={`bigbull ${focusArea}`}>
        {/* <HeadingWithRightArrow title="BigBull Portfolio" /> */}
        <a className='dflex align-center' href={`${ET_WEB_URL}/markets/top-india-investors-portfolio/individual`} target='_blank'>
          <img className='mr-6' width={24} src="https://img.etimg.com/photo/114352551.jpg" />
          <img width={138} src="https://img.etimg.com/photo/114352673.jpg" />
          <RightArrow />
        </a>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} focusArea={focusArea} />

        <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
        <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>

        <div className="slider" ref={sliderRef}>
          <div className="cards" ref={innerRef} style={fetchingData ? {width: "100%"} : {}}>
            {fetchingData && <Loading />}
            {portfolios?.map((item, index) => (
              activeTab == 2 ? <AllInvestorsCard item={item} key={index} /> : <BestPicksRecentDealsCard item={item} key={index} activeTab={activeTab} />
            ))}
          </div>
        </div>
        <ViewAllCta title={tabs[activeTab]} url={`${ET_WEB_URL}${tabLinks[activeTab]}`} isNoBorderRightArrow={focusArea === "market"} />
      </div>
      <style jsx>{`  
        .news {
          .arr {
            display: none;
          }
        } 
          
        .dflex{
          display: flex;
        }

        .align-center{
          align-items: center;
        }
        
        .mr-6{
          margin-right: 6px;
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
          min-height: 135px;
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

function BestPicksRecentDealsCard({ item, activeTab }) {

  let companyName = "", companyId = "", companyType = "", row2Col1Trend = "", investorDid = "";
  let row2Col1Label = "", row2Col2Label = "", row2Col3Label = "";
  let row2Col1Value = "", row2Col2Value = "", row2Col3Value = "";

  if(activeTab === 0) {
    companyName = item?.bestPickStockData?.companyData?.text;
    companyId = item?.bestPickStockData?.companyData?.companyId;
    companyType = item?.bestPickStockData?.companyData?.companyType;
    row2Col1Label = item?.bestPickStockData?.stockdata?.[0]?.uiLabel?.text;
    row2Col2Label = item?.bestPickStockData?.stockdata?.[1]?.uiLabel?.text;
    row2Col3Label = item?.bestPickStockData?.stockdata?.[2]?.uiLabel?.text;
    row2Col1Value = item?.bestPickStockData?.stockdata?.[0]?.uiValue?.text;
    row2Col2Value = item?.bestPickStockData?.stockdata?.[1]?.uiValue?.text;
    row2Col3Value = item?.bestPickStockData?.stockdata?.[2]?.uiValue?.text;

    row2Col1Trend = item?.bestPickStockData?.stockdata?.[0]?.uiValue?.trend;
    investorDid = "Best Pick of";
  } else if(activeTab === 1) {    
    companyName = item?.companyData?.text;
    companyId = item?.companyData?.companyId;
    companyType = item?.companyData?.companyType;

    if(item?.dealSignal?.toString()?.toLowerCase() === "bought") {
      const changeSinceBought = item?.stockdata?.find((stock) => stock.uiLabel.text === "Chg Since Bought");
      const stakeBought = item?.stockdata?.find((stock) => stock.uiLabel.text === "Stake Bought %");
      const invested = item?.stockdata?.find((stock) => stock.uiLabel.text === "Deal Value (cr)");

      row2Col1Label = changeSinceBought?.uiLabel?.text;
      row2Col2Label = stakeBought?.uiLabel?.text;
      row2Col3Label = invested?.uiLabel?.text;
      row2Col1Value = changeSinceBought?.uiValue?.text;
      row2Col2Value = stakeBought?.uiValue?.text;
      row2Col3Value = invested?.uiValue?.text;
    } else {
      const changeSinceSold = item?.stockdata?.find((stock) => stock.uiLabel.text === "Chg Since Sold");
      const stakeSold = item?.stockdata?.find((stock) => stock.uiLabel.text === "Stake Sold %");
      const soldFor = item?.stockdata?.find((stock) => stock.uiLabel.text === "Deal Value (cr)");

      row2Col1Label = changeSinceSold?.uiLabel?.text;
      row2Col2Label = stakeSold?.uiLabel?.text;
      row2Col3Label = soldFor?.uiLabel?.text;
      row2Col1Value = changeSinceSold?.uiValue?.text;
      row2Col2Value = stakeSold?.uiValue?.text;
      row2Col3Value = soldFor?.uiValue?.text;
    }
    row2Col1Trend = item?.changePercentSinceDeal > 0 ? "UP" : "DOWN";
    investorDid = item?.dealSignal?.toString()?.toLowerCase() === "bought" ? "Bought by" : "Sold by";
  }  

  return (
    <>
      <div className="card">
        <div className='comWrp'> 
          <div className="comp">
            {activeTab === 1 && <span className="date">{dateFormat(new Date(item?.dealDate), "On %D, %MMM %d, %Y")}</span>}             
            <span className="companyName">{companyName}</span>
          </div>
          <WatchlistAddition
            companyName={companyName}
            companyId={companyId}
            companyType={companyType}
            customStyle={{
              width: "18px",
              height: "18px",
            }}
          />          
        </div>
        <div className="row2">
          <div className={`return3M ${row2Col1Trend}`}>
            <span className="title">{row2Col1Label}</span>
            <span className="value"><RenderText text={row2Col1Value} /></span>
          </div>
          <div>
            <span className="title">{row2Col2Label}</span>
            <span className="value">{row2Col2Value}</span>
          </div>
          <div>
            <span className="title">{row2Col3Label}</span>
            <span className="value">{row2Col3Value}</span>
          </div>
        </div>
        <div className="investorRow">
          <div className="left">
            <img src={item?.investorIntro?.imageURL} alt="Investor Logo" width={42} height={42}/>
          </div>
          <div className="right">
            <span className={`best ${item?.dealSignal}`}>{investorDid}</span>
            <span className="investorName">{item?.investorIntro?.name}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .card {
          font-family: Montserrat;
          border: 1px solid #C4C4C4;
          box-shadow: 0px 4px 4px 0px #00000017;          
          padding: 12px 10px 12px 10px;          
          border-radius: 7px; 
          position: relative;
          background: #fff; 
          width: 320px;  

          .comWrp{
            display: flex;
            justify-content: space-between;  

            .comp {
              display: flex;
              flex-direction: column;

              .date {
                font-size: 10px;
                color: #666;                              
              }
            }
          }       

          .row2 {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px; 

            > div {
              padding: 7px;
            }  

            .title {
              color: #666;
            }
            .value {
              font-size: 14px;
              font-weight: 400;
              display: inline-block;
              margin-top: 6px;              
            }        
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
            border-top: 1px dashed #ccc;
            padding-top: 10px;

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

              &.BOUGHT {
                color: #147014;
              }

              &.SOLD {
                color: #EA2227;
              }
            }

            .investorName {              
              font-size: 12px;
              font-weight: 600;              
            }
          } 

          .return3M {
            &.UP {
              background: #EDFFF9;
              color: #147014;

            }
            &.DOWN {
              background: #fef1f3;
            }

            .value {              
              font-weight: 700;
            }
          }      
        }
      `}</style>
    </>
  )
}

function AllInvestorsCard({ item }) {
  return (
    <>
      <div className="card">        
        <div className="investorRow">
          <div className="left">
            <img src={item?.investorIntro?.imageURL} alt="Investor Logo" width={42} height={42}/>
          </div>
          <div className="right">
            {item?.investorIntro?.name}
          </div>
        </div>
        <div className="row2">
          <div className="col1">
            <div className="title">{item?.stockGroupdata?.[0]?.uiLabel?.text || ""}</div>
            <div className="value">{item?.stockGroupdata?.[0]?.uiValue?.text || ""}</div>
          </div>
          <div className="col2">
            <div className="title">{item?.stockGroupdata?.[1]?.uiLabel?.text || ""}</div>
            <div className="value">{item?.stockGroupdata?.[1]?.uiValue?.text || ""}</div>
          </div>
          <div className="col3">
            <div className="title">{item?.stockGroupdata?.[2]?.uiLabel?.text || ""}</div>
            <div className={`value ${item?.stockGroupdata?.[2]?.uiValue?.trend}`}>
              <RenderText text={item?.stockGroupdata?.[2]?.uiValue?.text || ""} /></div>
          </div>
        </div>
        <div className="row3">   
            <div className="subCard">
              <span className="floatLabel">{item?.cards?.[0]?.text || ""}</span>
              <div className="label">{item?.cards?.[0]?.uiLabel?.text || ""}</div>
              <div className={`${item?.cards?.[0]?.uiValue?.trend}`}><RenderText text={item?.cards?.[0]?.uiValue?.text || ""} /></div>
            </div>        
            <div className="subCard">
              <span className="floatLabel">{item?.cards?.[1]?.text || ""}</span>
              <div className="label">{item?.cards?.[1]?.uiLabel?.text || ""}</div>
              <div className={`${item?.cards?.[1]?.uiValue?.trend}`}><RenderText text={item?.cards?.[1]?.uiValue?.text || ""} /></div>
            </div>
        </div>
      </div>
      <style jsx>{`
        .card {
          font-family: Montserrat;
          border: 1px solid #C4C4C4;
          box-shadow: 0px 4px 4px 0px #00000017;          
          padding: 12px 10px 12px 10px;          
          border-radius: 7px; 
          position: relative;
          background: #fff;  
          width: 320px;

          .investorRow {
            display: flex;
            align-items: center;
            gap: 12px;   
            margin-bottom: 5px;                     

            img {
              border-radius: 50%;
            }  

            .right {              
              font-size: 12px;
              font-weight: 600;              
            }
          }        

          .row2 {
            display: flex;
            justify-content: space-between;            
            margin-bottom: 10px; 

            .title {
              font-size: 11px;
            }

            .value {
              font-size: 14px;
              font-weight: 700;
              margin-top: 6px;
            }

            .col3 {
              .value {
                &.UP {
                  color: #147014;
                }
                &.DOWN {
                  color: #EA2227;
                }
              }
            }
          }

          .row3 {
            display: flex;
            gap: 15px;

            .subCard {
              flex: 1;
              padding: 25px 10px 10px 10px;
              background: #f4f4f4;
              position: relative;
              border-radius: 5px;

              .floatLabel {
                font-size: 10px;
                position: absolute;
                top: 0;
                right: 0;
                padding: 3px 6px 2px 5px;
                border-radius: 0 5px 0 5px;
                color: #fff;
                font-weight: 500;
              }

              &:first-child {
                .floatLabel {
                  background: #f3a655;                                    
                }
              }

              &:last-child {
                .floatLabel {
                  background: #003B65;                                    
                }
              }

              div {
                font-size: 10px;
              }

              .label {
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 5px;
              }

              .UP {
                span {
                  font-weight: 600;
                  color: #147014;
                }
              }

              .DOWN {
                span {
                  color: #EA2227;
                  font-weight: 600;
                }
              }
            }
          }
        }
      `}</style>
    </>
  )
}

  