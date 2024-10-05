import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import HeadingWithRightArrow from '../HeadingWithRightArrow'
import Tabs from '../Tabs'
import ViewAllCta from '../ViewAllCta';
import ViewReportCta from '../ViewReportCta';
import API_CONFIG from '../../../network/config.json';

export default function StockReportPlus() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData]: any = useState([]);
  const tabs = ["High Upside", "Top Score Companies", "Score Upgrade"];

  useEffect(() => {
    const api = API_CONFIG["SCREENER_BY_SCREENERID"][window.APP_ENV];    

    const screenerId = 2554;

    const payload = {
      deviceId: "web",
      pageno: 1,
      pagesize: 20,
      screenerId: screenerId,
      viewId: 5246,
      filterType: "index",
      filterValue: [],
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
        // setData(data?.recoData?.[0]?.data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [activeTab]);

  return (
    <>
      <div>
        <HeadingWithRightArrow title="Stock Report Plus" />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />      
        {data.map((item, index) => (
          <div className="card">
            <div className="left">
              <a href="#" className="name">Fusion Micro Finance</a>
              <div className="title">Hold</div>
              <div className="description">Mean Recos by 9 Analysts</div>
              <ViewReportCta />
            </div>
            <div className="right up">
              <div>
                Expected <br/>Returns
                <span className="bold">56.70%</span>
              </div>
              <div>
                1Y Target
                <span className="bold">₹2,570</span>
              </div>
              <div>
                Current Price
                <span>765.45</span>
              </div>
            </div>
          </div> 
        ))}
         

        {/* <div className="card">
          <div className="left">
            <a href="#" className="name">Fusion Micro Finance</a>
            <div className="title">Hold</div>
            <div className="description">Mean Recos by 9 Analysts</div>

            <ViewReportCta />
          </div>
          <div className="right up">
            <div>
              Expected <br/>Returns
              <span className="bold">56.70%</span>
            </div>
            <div>
              1Y Target
              <span className="bold">₹2,570</span>
            </div>
            <div>
              Current Price
              <span>765.45</span>
            </div>
          </div>
        </div>   */}

        <ViewAllCta title="High Upside Stocks" url="/stock-report-plus" />
      </div>
      <style jsx>{`
        .card {          
          position: relative;          
          border: 1px solid #d5d5d5;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
          margin: 10px 0;
          display: flex;
          gap: 10px;

          .left {
            flex: 1;

            .name {
              font-size: 18px;
              font-weight: 600;
              line-height: 1.25;              
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin-bottom: 8px;
              display: block;
            }

            .title {
              font-size: 14px;
              font-weight: 500;
              line-height: 17px;
              margin-top: 10px;              
            }

            .description {
              margin-bottom: 25px;
            }
          }

          .right {
            width: 80px;
            padding: 8px;

            > div:not(:first-child) {
              border-top: 1px dashed #a5c9bd;
              padding-top: 10px;
              margin-top: 10px;
            }

            &.up {
              background: #edfff9;
            }

            span {
              display: block;

              
            }
          }

          .bold {
            font-weight: 700;
          }
        }
      `}</style>
    </>
  )
}
