import React from 'react'

export default function LiveTvWidget() {
  return (
    <>
      <div>
        <div className="livetv_widgetspinTitle">
          <p><span className="spinTitleArrow"></span>Watch</p>
        </div>
        <p className="live_Tvtitle">Test LIVE TV Prime Home Only</p>
      </div>
      <style jsx>{`
        .livetv_widgetspinTitle {
          border-bottom: 3px solid #9b8680;
          padding-bottom: 10px;

          p {
            border: 1px solid #ed193b;
            display: inline-block;
            color: #ed193b;
            font-size: 10px;
            font-weight: 600;
            padding: 3px 12px 3px 8px;
            text-transform: uppercase;
            border-radius: 2px;

            .spinTitleArrow {
              display: inline-block;
              width: 0;
              height: 0;
              border-top: 4px solid transparent;
              border-left: 6px solid #ed193b;
              border-bottom: 4px solid transparent;
              margin-right: 2px;
            }
          }
        }

        .live_Tvtitle {
          font-size: 14px;
          margin: 6px 0;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}
