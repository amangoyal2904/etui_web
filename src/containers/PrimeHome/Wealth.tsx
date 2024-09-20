import React from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'

export default function Wealth({ title, data }) {  
  return (
    <>
    <section className="wealth">
      <h2><a href="">{title}</a></h2>
      <OneImgTwoColsNewsLayout data={data} more={{text: "Wealth"}}/>
    </section>
    <style jsx>{`
      .wealth {
        padding-bottom: 50px;
        border-top: 1px solid #9b8680;
        margin-bottom: 1px;
        border-bottom: 1px solid #9b8680;

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
      }

    `}</style>
    </>
  )
}
