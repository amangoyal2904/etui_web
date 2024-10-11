import LiveIcon from 'components/Icons/LiveIcon';
import Separator from 'components/Separator';
import React, { Fragment, useEffect } from 'react'

export default function TodayNews({ todayNews }) {  
  const topNews = todayNews?.data?.find(item => item.section == "top");
  const wealthNews = todayNews?.data?.find(item => item.section == "wealth");
  const briefNews = todayNews?.data?.find(item => item.section == "brief");

  return (
    <div data-ga-impression={`Subscriber Homepage#Today news widget impression#`}>
      <div className="title">{todayNews?.title}</div>
      <ul>
        {
          topNews?.data?.map((item, index) => (
            <li key={index}>
              <a href={item?.url} target="_blank">
                {item.type == "liveblog" &&  <LiveIcon />}
                {item?.title}
              </a>
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
                <a href={item?.url} target="_blank">                
                  {`${item?.title}`}
                </a>
              </li>
            ))
          }
        </ul>
      </>
      }

      <style jsx>{`
        .title {
          border-bottom: 3px solid #9b8680;
          font-size: 20px;
          font-weight: 800;
          padding-bottom: 7px;
          text-transform: uppercase;
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
