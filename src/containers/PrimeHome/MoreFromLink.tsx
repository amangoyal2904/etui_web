import React from 'react'

export default function MoreFromLink({ target = "_blank", href, moreText = "More From", appendText = "" }) {
  return (
    <>
      <div className="more">
        <a target={target} href={href} style={{fontSize: "12px", border: 0}}>{moreText} {appendText} »</a>
      </div>
      <style jsx>{`
        .more {
          text-align: right;
          a {            
            color: #ed193b;
            font-family: 'Montserrat', sans-serif !important;
            border: 0;            
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  )
}
