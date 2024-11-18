import React from 'react'

export default function LiveTvWidget({ objVc }) {
  const livetv = objVc?.livetv || {};
  const title = livetv?.streamtype?.livestreamsliketitle || livetv?.title || '';
  const type = livetv?.type || '';

  return (
    <>
      <div>
        <div className="livetv_widgetspinTitle">
          <p><span className="spinTitleArrow"></span>Watch</p>
        </div>
        <p className="live_Tvtitle">{title}</p>        
        <div className="videoBox_wrap">
        {
          type === 'youtube' ? (
            <iframe width="320" height="250" allowFullScreen src={`https://www.youtube.com/embed/${livetv?.vid}?ecver=1&autoplay=1&mute=1&rel=0&showinfo=0`} frameBorder="0" title="TV video Box"></iframe>
          ) : (
            <iframe width="320" height="250" allowFullScreen src={`https://${objVc.env == 'dev' ? 'etdev8243' : 'economictimes'}.indiatimes.com/videodash.cms?autostart=1&msid=${livetv?.vid}&widget=home&prerollurl=true&tpname=home&iswebpre=true`} title="TV video Box"></iframe>
          )
        }
        </div>            
      </div>
      <style jsx>{`
        .livetv_widgetspinTitle {
          border-bottom: 3px solid #9b8680;
          padding-bottom: 12px;

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
        
        .videoBox_wrap {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
          margin-bottom: 20px;
          margin-top: 10px;

          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
          }
        }
      `}</style>
    </>
  )
}
