import React from 'react'

export default function OneImgTwoColsNewsLayout({ data, more = {text: ""} }) {
  const first = data[0]
  const rest = data.slice(1)
  console.log({more})
  return (
    <>
      <div className="wrap">
        <div className="first">
          <img src={first?.img} alt={first?.title} width={335} height={291} />
          <h3>{first?.title}</h3>
          <p>{first?.synopsis}</p>
        </div>
        <div className="rest">
          {rest.map((item, index) => (
            <a href={item?.url} key={index}>{item?.title}</a>
          ))}
          <div className="more">
            <a target="_blank" href="/news/politics-nation" data-ga-onclick="More - href">More From »</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .wrap {
          display: inline-block;
        }
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

        .rest {
          width: 335px;
          display: inline-block;
          vertical-align: top;

          a {
            display: block;
            font: 18px 'Faustina', serif;
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
              font-family: 'Montserrat', sans-serif;
              border: 0;
              text-align: right;
              margin-top: 10px;
            }
          }
        }        
      `}</style>
    </>
  )
}
