import React from 'react'

export default function PrimeIcon({ style = {}}) {
  return (
    <>
      <span style={{...style}}></span>
      <style jsx>{`
        span {          
          width: 19px;
          height: 20px;
          background: url(https://img.etimg.com/photo/msid-110869446,quality-100/common-sprite.jpg) no-repeat;
          background-position: -405px -8px;
          vertical-align: top;
          position: relative;
          top: 2px;          
          background-size: 678px;          
          display: inline-block;          
        }
      `}</style>
    </>    
  )
}
