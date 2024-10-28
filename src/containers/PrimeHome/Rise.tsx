import React from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'
import TextImageMiddile from 'components/TextImageMiddile';
import MarketGainers from 'components/RiseGainers';
import SectionHeaderWithNewsletter from './SectionHeaderWithNewsletter';

export default function Rise({ title, data, isDev, popularInSmallBiz }) { 
  
  return (
    <>
    <section className="rise" data-ga-impression={`Subscriber Homepage#Rise widget impression#`}>
      <SectionHeaderWithNewsletter url="/small-biz" title="Rise" sid="5f5a31db80f79664e95679d5" />
      <OneImgTwoColsNewsLayout data={data} more={{text: "Rise", link: "/small-biz"}} />
      <div className="second">
      <TextImageMiddile data={popularInSmallBiz?.data || []} heading="Popular in Small Biz" widget="Rise"/>
      </div>
      <div className="third">
        <MarketGainers isDev={isDev} />
      </div>      
    </section>
    <style jsx>{`
      .rise {
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
        .second{
          width: 255px;
          display: inline-block;
          vertical-align: top;
          margin: 0 20px;
        }
        .third {
          width: 275px;
          display: inline-block;
          vertical-align: top;
        }
          
      }

    `}</style>
    </>
  )
}
