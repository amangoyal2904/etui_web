import React, { useEffect, useState } from "react";
import OneImgTwoColsNewsLayout from "./OneImgTwoColsNewsLayout";
import MoreFromLink from "./MoreFromLink";
import SectionHeaderWithNewsletter from "./SectionHeaderWithNewsletter";
import { ET_WAP_URL, ET_WEB_URL } from "../../utils/common";
import { changeImageWidthHeight } from "utils";
import { dateFormat } from "utils/utils";

export default function Tech({ title, data, newsLetterData }) {
  const [niftyITData, setNiftyITData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://etmarketsapis.indiatimes.com/ET_Stats/getIndexByIds?sortby=percentChange&sortorder=desc&indexname=&indexid=186&exchange=50&pagesize=5&company=true"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setNiftyITData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 24000); // 24000 milliseconds = 24 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <section className="techMain" data-ga-impression={`Subscriber Homepage#Tech widget impression#`}>
        <SectionHeaderWithNewsletter url="/tech" title="Tech" sid="5f5a31db80f79664e95679e4" />
        <OneImgTwoColsNewsLayout data={data} more={{ text: "Tech", link: "/tech" }} widget="Tech"/>
        <div className="second">
          <NewsLetters newsLetterData={newsLetterData} />
        </div>
        <div className="third">{niftyITData && <MarketChange niftyITData={niftyITData} />}</div>
      </section>
      <style jsx>{`
        .techMain {
          padding-bottom: 50px;
          border-top: 1px solid #9b8680;
          margin-bottom: 1px;
          border-bottom: 1px solid #9b8680;          

          .first {
            width: 335px;
            margin-right: 20px;
            display: inline-block;

            h3 {
              font-size: 34px;
              font-weight: 600;
              line-height: 1.18;
              margin-top: 6px;
            }
            p {
              font-size: 14px;
              line-height: 1.43;
              color: #4a4a4a;
              margin-top: 9px;
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
          .rest {
            width: 335px;
            display: inline-block;
            vertical-align: top;

            a {
              display: block;
              font: 18px "Faustina", serif;
              padding: 10px 0 16px 0;
              border-bottom: 1px solid #ddc2bb;

              &:hover {
                text-decoration: underline;
              }

              &:first-child {
                padding-top: 0;
              }
            }

            .more {
              a {
                font-size: 12px;
                color: #ed193b;
                font-family: "Montserrat", sans-serif;
                border: 0;
                text-align: right;
                margin-top: 10px;
              }
            }
          }
        }
      `}</style>
    </>
  );
}

function NewsLetters({ newsLetterData }) {
  return (
    <>
      <div className="newslettersMain">
        <div className="heading">
          <a target="_blank" href={`${ET_WEB_URL}/tech/newsletters/tech-top-5`} data-ga-onclick={`Subscriber Homepage#Tech widget click#title - Newsletters`}>
            <span className="techLogo subSprite"></span>
            <span className="secname">Newsletters</span>
          </a>
        </div>
        <div className="newsletterList">
          {newsLetterData?.map((item, index) => (
            <div className="newsletterBox" key={`newsLetter_${index}`}>
              <h4 className="publishDate">Published on {dateFormat(item.date, "%d %MMM, %Y")}</h4>
              <a 
                className="nListTitle" 
                target="_blank" 
                title={item.title} 
                href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}
                data-ga-onclick={`Subscriber Homepage#Tech widget click#Newsletters - ${index+1} - href`}
              >
                {item.title}
              </a>
              <a 
                className="nListImgBox" 
                target="_blank" 
                title={item.title} 
                href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}
                data-ga-onclick={`Subscriber Homepage#Tech widget click#Newsletters - ${index+1} - href`}
                >
                <img height="191" width="255" className="lazy" alt={item.title} src={changeImageWidthHeight({ imageUrl: item.img, desiredWidth: 255, desiredHeight: 191 })} />
              </a>
            </div>
          ))}
        </div>
        <MoreFromLink href="/tech/newsletters/tech-top-5" appendText="From Tech Newsletters" moreText="More" widget="Tech widget"/>
      </div>
      <style jsx>{`
        .newslettersMain {
          .heading {
            margin-bottom: 15px;
            .subSprite {
              background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
              display: inline-block;
              background-size: 475px;
            }
            .techLogo {
              width: 72px;
              height: 21px;
              background-position: -11px -524px;
            }

            .secname {
              font-size: 15px;
              font-weight: 500;
              text-transform: uppercase;
              color: #404041;
              padding-left: 7px;
              border-left: 1px dotted;
              margin-left: 7px;
              vertical-align: super;
            }
          }
          .newsletterList {
            .newsletterBox {
              border-bottom: 1px solid #ddc2bb;
              padding-bottom: 10px;
              margin-bottom: 10px;
              &:last-child {
                border: none;
                padding-bottom: 0;
              }
              .publishDate {
                font-size: 12px;
                color: #727272;
                font-weight: normal;
              }
              .nListTitle {
                display: inline-block;
                font-family: Faustina;
                font-size: 18px;
                font-weight: 500;
                width: 254px;
                color: #636363;
                margin-bottom: 10px;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
}

function MarketChange({ niftyITData }) {
  // console.log("@@@ niftyITData -->", niftyITData)
  const compnData = niftyITData && niftyITData.searchresult.length && niftyITData.searchresult[0];
  //console.log("@@@ niftyITData -->", compnData)
  return <>
    <div className="marketChangeMain">
      <h3 className="marketChangeTitle">{compnData.indexName}</h3>
      <h4 className="currDateTime">{dateFormat(compnData.dateTime, "%h:%m | %d %MM %Y")}</h4>
      <h5 className="currDataBox">
        <span className="currVal">{compnData.currentIndexValue}</span>
        <span className={`changeVal ${compnData.perChange > 0 ? 'up' : 'down'}`}>
        <span className={`subSprite icon_arrow ${compnData.perChange > 0 ? 'up' : 'down'}`}></span>
        <span>{compnData.netChange} ({compnData.perChange}%)</span>
        </span>
      </h5>
      <iframe className="lazyIframe" style={{border: 'none'}} width="246" height="139" src={`https://${window.isDev ? 'etdev8243' : 'economictimes'}.indiatimes.com/renderchart.cms?type=index&symbol=CNXIT&exchange=50&height=139&reverseaxis=0&transparentBg=1`}></iframe>
      <div className="dataTable">
        {compnData?.companies?.map((data, index) => (
          <div className="dataTableBox" key={`niftyITCompany_${index}`}>
            <a 
              className="compName" 
              target="_blank" 
              data-ga-onclick={`Subscriber Homepage#Tech widget click#Nifty IT - ${data.companyShortName} - href`}
              title={`Nifty IT - ${data.companyShortName}`} 
              href={`${ET_WEB_URL}/${data.seoName}/stocks/companyid-${data.companyId}.cms`}
              >
                {data.companyShortName}
              </a>
            <span className="curntVal">{data.current}</span>
            <span className={`chngVal ${data.percentChange > 0 ? "up" : "down"}`}>({data.percentChange}%)</span>
          </div>
        ))}
      </div>
    </div>
    <style jsx>{`
      .marketChangeMain{
        margin: 0 0 0 10px;
        padding: 17px 11px 10px 12px;
        background-color: #ffded4;
        box-sizing: border-box;
        .marketChangeTitle{
          display: inline-block;
          font-size: 16px;
          font-weight: 600;
          width: 160px;
          margin-bottom: 15px;
        }
        .currDateTime{
          font-size: 12px;
          font-weight: normal;
          color: #4a4a4a;
          margin-bottom: 6px;
        }
        .currDataBox{
          font-size: 20px;
          margin-bottom: 10px;
          .currVal{
            font-weight: 600;
          }
          .changeVal{
            font-size: 14px;
            font-weight: normal;
            margin-left: 12px;
            &.up{
              color:#009060;
            }
            &.down{
              color: #da2337;
            }
            
            .subSprite{
              background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
              background-size: 475px;
            
              &.icon_arrow{
                display: inline-block;
                width: 9px;
                height: 17px;
                margin:4px 5px 0 0;
                vertical-align: top;
              }
              &.up{
                background-position: -303px -39px;
              }
              &.down{
                background-position: -285px -39px;
              }
            }
          }
        }
        .dataTable{
          font-size: 11px;
          margin-top: 15px;
          .dataTableBox{
            display:flex;
            align-items: center;
            border-top: 1px solid #ddc2bb;
            padding: 6px 0;
            .compName{
              display:flex;
              width: 60%;
            }
            .curntVal{
              width: 20%;
              text-align: right;
              font-weight: 600;
            }
            .chngVal{
              width: 20%;
              text-align: right;
              &.up{
                color: #009060;
              }
              &.down{
                color: #da2337;
              }
            }
            
          }
        }
      }
    `}  
    </style>
  </>
}
