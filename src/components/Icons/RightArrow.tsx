import React from 'react'

export default function RightArrow() {
  return (
    <>
      <span></span>
      <style jsx>{`
        span {
          display: inline-block;
          width: 19px;
          height: 19px;
          position: relative;
          border-radius: 50%;
          text-align: center;                    

          &:before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            border-top: 1.6px solid #333;
            border-left: 1.6px solid #333;
            transform: rotate(135deg);
            top: 6px;
            right: 4px;
          }
          &:after {
            content: '';
            position: absolute;
            width: 1.4px;
            height: 9px;
            background: #333;
            transform: rotate(-90deg) translate(3.5px,0);
            top: 9px;
            left: 9px;
          }
        }
      `}</style>
    </>
  )
}
