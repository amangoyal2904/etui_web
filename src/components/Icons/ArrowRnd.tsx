import React from 'react'

export default function ArrowRnd() {
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
          border: 1px solid #333;
          margin-left: 10px;

          &:before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            border-top: 1.6px solid #eb2227;
            border-left: 1.6px solid #ed193b;
            transform: rotate(135deg);
            top: 6px;
            right: 4px;
          }
          &:after {
            content: '';
            position: absolute;
            width: 1.4px;
            height: 9px;
            background: #eb2227;
            transform: rotate(-90deg) translate(3.5px,0);
            top: 8px;
            left: 8px;
          }
        }
      `}</style>
    </>
    
  )
}
