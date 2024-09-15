import React from 'react'

export default function LiveIcon() {
  return (
    <>
      <span className="liveIcon"></span>
      <style jsx>{`
        .liveIcon {
          width: 6px;
          height: 6px;          
          position: relative;
          display: inline-block;          
          background: red;
          border-radius: 50%;
          margin: 0 10px 0 3px;
          bottom: 1px;

          &:before, &:after {
            animation: pulse 2s linear infinite;
            border: #f00 solid 1px;
            border-radius: 50%;
            box-sizing: border-box;
            content: ' ';
            height: 8px;
            width: 8px;
            left: -1px;
            opacity: .6;
            position: absolute;
            top: -1px;
            transform: scale(.714);
            z-index: 1;
          }

          &:after {            
            animation-delay: 1s;            
          }
        }
      `}</style>
    </>
  )
}
