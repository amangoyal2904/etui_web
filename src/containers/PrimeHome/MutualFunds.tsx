import React from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'
import TopMF from './TopMFWidget'
import TopMFDiscover from './TopMFDiscover';
import { ET_WEB_URL } from "../../utils/common";
import SectionHeaderWithNewsletter from './SectionHeaderWithNewsletter';

export default function MutualFunds({ title, data, isDev }) {  
  return (
    <>
    <section className="politics" data-ga-impression={`Subscriber Homepage#Mutual Funds widget impression#`}>      
      <SectionHeaderWithNewsletter url="/mutual-funds" title={title} sid="5f5a31db80f79664e95679cf" />
      <div className='mfWrap'>
        <OneImgTwoColsNewsLayout data={data} more={{text: "Mutual Funds", link: "/mutual-funds"}} widget="Mutual Funds"/>
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
