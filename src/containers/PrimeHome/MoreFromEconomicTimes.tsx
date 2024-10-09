import React from 'react';
import { ET_WEB_URL } from "../../utils/common";

export default function MoreFromEconomicTimes({data}) {
  return (
    <>
      <section className="moreFromEconomicTimes secBox">
        <h2>{data?.title || ""}</h2>
        <div className="flex">
          {
            data?.children?.map((item, index) => {
              return (
                <div key={index} className="whiteBox">
                  <a href={`${ET_WEB_URL}${item?.link}`} target="_blank" className="category">{item?.category || ""}</a>
                  <ul>
                  {
                    item?.children?.map((child, index) => {
                      return (
                        <li key={index}>
                          <a href={`${ET_WEB_URL}${child?.link}`} target="_blank">
                            {index === 0 && <img src={child?.img} alt={child?.title} width={256} height={192} title={child?.title} />}
                            {child?.title || ""}
                          </a>
                        </li>
                      )
                    })
                  }
                  </ul>
                </div>
              )
            })
          }
        </div>
      </section>
      <style jsx>{`
        .moreFromEconomicTimes {
          h2 {
            font-size: 36px;
            padding-top: 35px;
            border-top: 3px solid #9b8680;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .flex {
            display: flex;
            gap: 32px;
          }
          .whiteBox {                    
            padding: 15px;
            box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.1);
            background-color: #fff9f7;            
            margin-bottom: 6px;
            flex: 1;

            .category {
              font-size: 24px;
              font-weight: 600;
              text-transform: uppercase;
              padding-bottom: 10px;
              display: inline-block;

              &::after {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                top: -1px;
                left: 3px;
                border-top: 2px solid #000;
                border-left: 2px solid #000;
                position: relative;
                cursor: pointer;
                transform: rotate(135deg);
              }
            }

            img {
              padding-bottom: 5px;
            }

            li:first-child {
              font-weight: 600;
              font-size: 18px;
            }

            li {
              font-size: 16px;
              font-family: faustina;
              list-style: none;
            }

            li + li {
              border-top: 1px solid #e6d2cb;
              padding-top: 8px;
              margin-top: 12px;
            }
            a:hover {
              text-decoration: underline;
            }
        }
      `}</style>
    </>
  )
}
