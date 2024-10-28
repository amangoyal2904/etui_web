import RightArrow from 'components/Icons/RightArrow'
import React from 'react'
import { trackingEvent } from 'utils/ga';

export default function ViewAllCta({ title, viewAllText = "", url, isNoBorderRightArrow = false }: { title: string, viewAllText?: string, url: string, isNoBorderRightArrow?: boolean }) {
  const fireTracking = (text) => {
    trackingEvent("et_push_event", {
      event_category: 'Subscriber Homepage', 
      event_action: `View All click`, 
      event_label: text,
    });
  }
  return (
    <>
      {isNoBorderRightArrow ? <>
        <div className="viewAllCta">
          <a onClick={()=>fireTracking(title)} href={url} target="_blank">{viewAllText ? viewAllText : "View All"} {title} <RightArrow /></a>
        </div>
        <style jsx>{`
          .viewAllCta {
            display: flex;
            justify-content: flex-end;            
          }
          a {            
            display: inline-flex;
            align-items: center;                        
            padding: 5px;
            font-family: Montserrat;
            font-size: 12px;
            font-weight: 600;
            line-height: 14.63px;            
          }
          `}</style>
      </>
      :
      <>
        <a href={url} target="_blank">View All {title}</a>
        <style jsx>{`
          a {
            display: block;
            border-radius: 4px;
            border: 1px solid #000;  
            text-align: center;
            width: 80%;
            margin: 0 auto;
            padding: 5px;
            font-family: Montserrat;
            font-size: 12px;
            font-weight: 600;
            line-height: 14.63px;
            text-align: center;
          }
        `}</style>
      </>
      }
    </>
  )
}
