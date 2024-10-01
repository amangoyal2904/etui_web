import React from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'
import TopMF from './TopMFWidget'
import TopMFDiscover from './TopMFDiscover'

export default function MutualFunds({ title, data, isDev }) {  
  return (
    <>
    <section className="politics">
      <h2><a href="">{title}</a></h2>
      <div className='mfWrap'>
        <OneImgTwoColsNewsLayout data={data} more={{text: "Mutual Funds"}} />
        <TopMF />
      </div>
      <TopMFDiscover isDev={isDev} />
    </section>

    <style jsx>{`
      .politics {
        padding-bottom: 50px;
        border-top: 1px solid #9b8680;
        margin-bottom: 1px;
        border-bottom: 1px solid #9b8680;

        .mfWrap{
          display: flex;
          justify-content: space-between;
        }

        h2 {
          font-size: 36px;
          padding-top: 35px;
          border-top: 3px solid #9b8680;
          text-transform: uppercase;
          margin-bottom: 20px;

          a {
            &::after {
              content: '';
              display: inline-block;
              width: 15px;
              height: 15px;
              top: -4px;
              left: 3px;
              border-top: 2px solid #000;
              border-left: 2px solid #000;
              position: relative;
              cursor: pointer;
              transform: rotate(135deg);
            }
          }
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
      }

    `}</style>
    </>
  )
}
