import React from 'react'
import MoreFromLink from './MoreFromLink'
import RenderText from 'components/RenderText'
import { ET_WAP_URL, ET_WEB_URL } from 'utils/common'
import { changeImageWidthHeight } from 'utils'

export default function OneImgTwoColsNewsLayout({ data, more = {text: "", link: ""} }) {
  const first = data[0]
  const rest = data.slice(1)
  
  return (
    <>
      <div className="wrap">
        <div className="first">
          <a href={first?.url?.replace(ET_WAP_URL, ET_WEB_URL)} target="_blank">
            <img alt={first?.title} width={335} height={291} src={changeImageWidthHeight({imageUrl: first?.img, desiredWidth: 335, desiredHeight: 291, quality: 100})} />
            <h3><RenderText text={first?.title} /> </h3>
          </a>
          <p>{first?.synopsis}</p>
        </div>
        <div className="rest">
          {rest.map((item, index) => (
            <a href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)} target="_blank" key={index}>
              <RenderText text={item?.title} />
            </a>
          ))}
          
          <MoreFromLink href={more.link} appendText={more.text} />
        </div>
      </div>
      <style jsx>{`
        .wrap {
          display: inline-block;
        }
        .first {
          width: 335px;
          margin-right: 20px;
          display: inline-block;

          h3 {
            font-size: 34px;
            font-weight: 600;
            line-height: 1.18;
            margin-top: 6px;
            font-family: 'Faustina', serif;
          }
          p {            
            font-size: 14px;
            line-height: 1.43;
            color: #4a4a4a;
            margin-top: 9px;
          }
        }

        .rest {
          width: 335px;
          display: inline-block;
          vertical-align: top;

          a {
            display: block;
            font: 18px 'Faustina', serif;
            padding: 10px 0 16px 0;
            border-bottom: 1px solid #ddc2bb;

            &:hover {
              text-decoration: underline;
            }

            &:first-child {
              padding-top: 0;
            }
          }
        }        
      `}</style>
    </>
  )
}
