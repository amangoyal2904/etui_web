import React, { useEffect, useState } from 'react'
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';
import API_CONFIG from '../../../network/config.json';

export default function BigBullPortfolio() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Best Picks", "Recent Deals", "All Investors"];
  const [data, setData] = useState([]);

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
      <div>
        <HeadingWithRightArrow title="BigBull Portfolio" />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="cards">
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
        <ViewAllCta title="Portfolio" url="/bigbull-portfolio" />
      </div>
      <style jsx>{`
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
      `}</style>
    </>
  )
}
