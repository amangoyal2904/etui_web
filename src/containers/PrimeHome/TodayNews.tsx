import LiveIcon from 'components/Icons/LiveIcon';
import React from 'react'

export default function TodayNews({ todayNews }) {
  console.log("todayNews", todayNews);
  return (
    <>
      <div className="title">{todayNews?.title}</div>
      <ul>
        {
          todayNews?.data?.map((item, index) => (
            <li key={index}>
              <a href={item?.url} target="_blank">
                {item.type == "liveblog" &&  <LiveIcon />}
                {item?.title}
              </a>
            </li>
          ))
        }
      </ul>
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
          }
        }
      `}</style>
    </>
  )
}
