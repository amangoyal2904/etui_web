import React from 'react'
import { ET_WEB_URL } from "../../utils/common";

export default function MoreFromLink({ target = "_blank", href, moreText = "More From", appendText = "" , widget}) {
  return (
    <>
      <div className="more">
        <a target={target} 
        href={`${ET_WEB_URL}${href}`} 
        style={{fontSize: "12px", border: 0}}
        data-ga-onclick={`Subscriber Homepage#${widget} widget click#More - ${appendText && appendText != "Market News" ? appendText + "-" : ""} href`}
        >{moreText} {appendText} »</a>
      </div>
      <style jsx>{`
        .more {
          text-align: right;
          a {            
            color: #ed193b !important;
            font-family: 'Montserrat', sans-serif !important;
            border: 0;            
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  )
}
