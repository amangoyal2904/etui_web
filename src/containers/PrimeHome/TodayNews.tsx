import LiveIcon from 'components/Icons/LiveIcon';
import RenderText from 'components/RenderText';
import Separator from 'components/Separator';
import React, { Fragment, useEffect } from 'react'

export default function TodayNews({ todayNews, focusArea }) {  
  const topNews = todayNews?.data?.find(item => item.section == "top") || {};
  const wealthNews = todayNews?.data?.find(item => item.section == "wealth") || {};
  const techNews = todayNews?.data?.find(item => item.section == "tech") || {};
  const briefNews = todayNews?.data?.find(item => item.section == "brief") || {};

  return (
    <div data-ga-impression={`Subscriber Homepage#Today news widget impression#`}>
      <div className="title">{todayNews?.title}</div>
      <ul>
        {
          topNews?.data?.map((item, index) => (
            <li key={index}>
              {item?.title?.includes('<a') ? <RenderText text={item?.title} /> :
              <a href={item?.url} target="_blank" data-ga-onclick='Subscriber Homepage#Today news widget click#href' >
                {item.type == "liveblog" &&  <LiveIcon />}
                <RenderText text={item?.title} />
              </a>
        }
            </li>
          ))
        }
      </ul>
      {wealthNews?.data?.length > 0 && <>
        <Separator height={2}/>
        <div className="wealthTitle">{wealthNews?.title}</div>
        <ul>
          {
            wealthNews?.data?.map((item, index) => (
              <li key={index}>                
                {item?.title?.includes('<a') ? <RenderText text={item?.title} /> :
                <a href={item?.url} target="_blank" data-ga-onclick='Subscriber Homepage#Today news widget click#href'>                
                  <RenderText text={item?.title} />                  
                </a>
                }
              </li>
            ))
          }
        </ul>
      </>
      }

      { focusArea === 'market' && techNews?.data?.length > 0 && <>
        <Separator height={2}/>
        <div className="wealthTitle">{techNews?.title}</div>
        <ul>
          {
            techNews?.data?.slice(0,7)?.map((item, index) => (
              <li key={index}>
                {item?.title?.includes('<a') ? <RenderText text={item?.title} /> :
                <a href={item?.url} target="_blank" data-ga-onclick='Subscriber Homepage#Today news widget click#href'>
                  <RenderText text={item?.title} />
                </a>
                }
              </li>
            ))
          }
        </ul>
      </>
      }

      {
        briefNews?.section == "brief" && briefNews?.data?.length > 0 && <MorningEveningBrief briefNews={briefNews} />
      }

      <style jsx>{`
        .title {
          border-bottom: 3px solid #9b8680;
          font-size: 20px;
          font-weight: 800;
          padding-bottom: 7px;
          text-transform: uppercase;
        }
        a {
          &:hover {
            text-decoration: underline;
          }
        }
        ul {
          padding-left: 0;
          list-style: none;

          li {
            padding: 14px 0;
            border-bottom: 1px solid #e8d2cb;
            font: 18px Faustina, Georgia, serif;

            &:first-child {
              font-weight: 600;
            }

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .wealthTitle {
          font-weight: 400;
          font-size: 12px;
          font-family: 'Montserrat',sans-serif;
          margin-bottom: 2px;
          color: #930017;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}

function MorningEveningBrief({ briefNews }) {

  const data = briefNews?.data?.[0] || {};

  return (
    <>
      <div id="briefWidget">        
        <div className={`subSprite briefIcon ${briefNews?.type == "morning" ? "mb" : "eb"}`}></div>        
        <div className="stry font_faus">
          <a target="_blank" href={data?.url} data-ga-onclick='Subscriber Homepage#LHS ET morning brief click#href'>
            <RenderText text={data?.title} />
            <img title={data?.title} alt={data?.title} height={48} width={64} src={data?.img}/>            
          </a>
          </div>
        <div className="tac">
          <a href={briefNews?.catchUpUrl} target="_blank" className="briefLink" data-ga-onclick='Subscriber Homepage#LHS ET morning brief click#all-stories'>{briefNews?.catchUpTitle}</a>
        </div>
      </div>
      <style jsx>{`
        #briefWidget {
          border-top: 2px solid #9b8680;
          margin-top: 8px;
          padding-top: 15px;
        }

        .subSprite {
          background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
          display: inline-block;
          background-size: 475px;          
          width: 143px;
          height: 16px;

          &.mb {            
            background-position: -260px -580px;
          }

          &.eb {
            background-position: -260px -602px;
          }
        }

        .stry {
          padding: 3px 0 15px 0;
          font-size: 18px;
          font-weight: 600;

          a {
            display: inline-flex;
            gap: 10px;

            img {
              padding: 0;
            }
          }
        }  

        .tac {
          text-align: center;

          a {
            border-radius: 3px;
            border: solid 1px #ed193b;
            width: 240px;
            font-weight: 500;
            color: #ed193b;
            line-height: 23px;
            display: inline-block;
          }
        }
      `}</style>
    </>
  );   
}