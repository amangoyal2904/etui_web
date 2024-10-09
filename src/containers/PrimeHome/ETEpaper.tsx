import React, { useState } from 'react';
import { dateFormat } from "../../utils/utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import HeadingWithRightArrow from './HeadingWithRightArrow';
import Separator from 'components/Separator';
import PrimeIcon from 'components/Icons/PrimeIcon';

export default function ETEpaper({ focusArea, etEpaperData, isDev }) {
  const dayName = useState(dateFormat(new Date(), '%D'))[0];
    
  const epaperDomain = GLOBAL_CONFIG[isDev ? "development" : "production"]["Epaper_Domain"];
  const imgDomain = GLOBAL_CONFIG["ET_IMG_DOMAIN"];

  const epaperUrl = `${epaperDomain}/timesepaper/publication-the-economic-times,city-delhi.cms`;
  const wealthEditionUrl = `${epaperDomain}/${etEpaperData?.wealth?.seopath}/wealth_editionshow/${etEpaperData?.wealth?.msid}.cms`;

  const epaperImage = `${imgDomain}/thumb/width-267,height-228,imgsize-${etEpaperData?.todayEpaper?.thumbsize},msid-${etEpaperData?.todayEpaper?.msid}/.jpg`;
  const wealthImage = `${imgDomain}/thumb/width-267,height-228,imgsize-${etEpaperData?.wealth?.thumbsize},msid-${etEpaperData?.wealth?.msid}/.jpg`;

  return (
    <>
      <div className={`etEPaper ${focusArea} ${dayName}`}>
        { focusArea === "news" && <Separator /> }
        { focusArea === "news" ? <span className='title'></span> : <PrimeIcon style={{zoom: 0.7, marginRight: '7px', top: '4px'}}/> }
        <HeadingWithRightArrow title={`ET ePaper`} />
        {
          dayName !== "Mon" ? (
            focusArea === "news" ? (
              <div className="printBox">
                <div className="lft">
                  <a href={epaperUrl}>
                    <img className="im" src={epaperImage} width="266" height="210" alt="Today's Paper" />
                  </a>
                </div>
                <div className="rht">
                  <img src={`${imgDomain}/photo/110526566.cms`} alt="Today's Paper" width="223" height="36" />
                  <p className="empw">Empower your mornings.</p>
                  <p className="read">Read your favourite newspaper, the digital way.</p>
                  <a href={epaperUrl} className="explore_cta">Explore<span className="dbl_arw"></span></a>
                </div>
              </div>
            ) : (
              <div className="epaper-cards">
                <div className="epaper-card epaper_news">
                  <img height="24" width="150" title="Today's Paper" alt="Today's Paper" src={`${imgDomain}/photo/110526566.cms`} className="logo" />
                  <p className="empw">Empower your mornings.</p>
                  <p className="read">Read your favourite newspaper, the digital way.</p>
                  <div className="mainImg">
                    <img title="Today's Paper" alt="Today's Paper" height="152" width="178" src={epaperImage} className="im" />
                  </div>
                  <a href={epaperUrl} className="explore_cta">Explore<span className="dbl_arw"></span></a>
                </div>
              </div>
            )
          ) : (
            <div className="epaper-cards">
              <div className="epaper-card epaper_news">
                <img height="24" width="150" title="Today's Paper" alt="Today's Paper" src={`${imgDomain}/photo/110526566.cms`} className="logo" />
                <p className="empw">Empower your mornings.</p>
                <p className="read">Read your favourite newspaper, the digital way.</p>
                <div className="mainImg">
                  <img title="Today's Paper" alt="Today's Paper" height="152" width="178" src={epaperImage} className="im" />
                </div>
                <a href={epaperUrl} className="explore_cta">Explore<span className="dbl_arw"></span></a>
              </div>
              <div className="epaper-card epaper_wealth">
                <p className="wdText">Wealth Edition</p>
                <p className="txt"><b>Latest Edition: </b>September 23-29, 2024</p>
                <p className="read">Your weekly money management guide</p>
                <div className="mainImg">
                  <img title="September 23-29, 2024" alt="Wealth Edition" height="152" width="178" src={wealthImage} className="im" />
                </div>
                <a href={wealthEditionUrl} className="explore_cta">Explore<span className="dbl_arw"></span></a>
              </div>
            </div>
          )
        }
      </div>

      <style jsx>{`
        .etEPaper{
          padding-left: 20px;
          border-left: 1px dotted #9b8680;
          margin-top: 1px;
          position: relative;

          &.news {
            margin-top: -13px;
            padding-bottom: 25px;
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

         .txt {
              border-top: 1px solid;
              border-bottom: 1px solid;
              padding: 1px 0 0;
              margin: 5px 0 10px 0;
          }

          .explore_cta {
              background: #FFFFFF85;
              position: relative;
              border: 1.2px solid;
              border-radius: 3.6px;
              padding: 6px 50px;
              font-weight: 700;
              display: inline-flex;
              margin-top: 10px;

            .dbl_arw {
                transform: rotate(135deg);
                top: 6px;
                right: 0px;
                display: inline-flex;
                width: 5px;
                height: 5px;
                border-top: 1px solid #ed193b;
                border-left: 1px solid #ed193b;
                position: relative;

                &:before{
                  display: inline-block;
                  width: 5px;
                  height: 5px;
                  border-top: 1px solid #ed193b;
                  border-left: 1px solid #ed193b;
                  position: relative; 
                  content: '';
                  right: 3px;
                  top: -3px;
                }
            }
          }

          .epaper-cards{
            display: flex;
            justify-content: space-between;

            .read {
                font-size: 11px;
                line-height: 16px;
                letter-spacing: -0.01em;
            }

            .empw {
                font-size: 14px;
                font-weight: 700;
                line-height: 20px;
                letter-spacing: -0.01em;
            }

            .epaper-card{
              width: 270px;
              border: 5px solid;
              padding: 14px 4px 10px 10px;
              margin-top: 20px;
              text-align: center;
              box-sizing: border-box;

              .mainImg {
                margin: 34px auto 0;
                background: url("https://img.etimg.com/photo/110394052.cms") no-repeat;
                width: 235px;
                height: 142px;
                background-size: 235px;
                img {
                  box-shadow: 0px -0.44px 3.95px 0px #00000029;
                  position: relative;
                  bottom: 22px;
                }
              }
            }

            .epaper_news{
              border-color: #FFF2EECC;
              background-image: linear-gradient(#FFEDCE, #FFD6D0);
            }

            .epaper_wealth{
              border-color: #F1FFEE;
              background-image: linear-gradient(#EEFBE9, #F8F1C3);

              .wdText {
                  font-size: 20px;
                  line-height: 20px;
                  color: #23A025;
                  font-weight: 700;
              }

              .read {
                font-size: 13px;
                line-height: 19px;
              }
            }
         }

          .printBox{
            display: flex;
            justify-content: space-between;
            background-image: linear-gradient(#FFEDCE, #FFD6D0);
            text-align: left;
            border: 10px solid #FFF2EECC;
            padding: 14px 4px 10px 0;
            margin-top: 10px;            

            .read {
              font-size: 15px;
              line-height: 22px;
              letter-spacing: -0.01em;
            }


            .empw {
              font-size: 18px;
              font-weight: 700;
              line-height: 27px;
              letter-spacing: -0.01em;
            }

              
            .lft {
              background: url("https://img.etimg.com/photo/110402145.cms") no-repeat;
              width: 310px;
              height: 215px;
              margin-top: 20px;
              background-size: 310px;

              .im {
                  position: relative;
                  top: -15px;
                  left: 0;
                  box-shadow: 0px -0.69px 6.24px 0px #00000029;
              }
            }  

            .rht {
                margin-top: 20px;
                width: 250px;
            }
          }

          &.market{
            border-left: 0;
            padding-left: 0;

            .epaper-cards{
              display: flex;
              flex-direction: column;  
            }

            .epaper-card{
              width: 100%;
            }

            .empw, .read{
              display: none;
            }

            .title {
              &:before {
                display: none;
              }
            }
          }
        }
      `}</style>
    </>
  );
}
