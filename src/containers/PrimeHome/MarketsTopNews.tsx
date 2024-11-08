import LiveIcon from 'components/Icons/LiveIcon'
import React from 'react'
import HeadingWithRightArrow from './HeadingWithRightArrow'
import RenderText from 'components/RenderText';

export default function MarketsTopNews({ data, focusArea }) {
  
  // move type = 'slideshow' to top of the list
  data.sort((a, b) => {
    if (a.type === 'liveblog') return -1;
    if (b.type === 'liveblog') return 1;
    return 0;
  });

  // if focusArea is market, keep only first 3 items
  const sliceMap = {
      market: 3,
      news: 5,
  };

  if (sliceMap[focusArea]) {
      data = data.slice(0, sliceMap[focusArea]);
  }

  return (
    <>
    <div>
      <HeadingWithRightArrow title="News" href="/markets/stocks/news"/>
      <ul>
        {
          data.map((item, index) => (
            <li key={index}>
              {item.type == "liveblog" && <LiveIcon />}
              <a href={item.url} target="_blank"><RenderText text={item.title} /></a>
            </li>
          ))
        }
      </ul>
    </div>
    <style jsx>{`
      div {
        padding-top: 10px;
      }
      ul {
        padding-left: 20px;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          margin-bottom: 5px;
          border-bottom: 1px solid #E8D2CB;
          padding: 7px 0;

          &:first-child {
            font-weight: 600;
          }

          &:last-child {
            border-bottom: none;
          }

          a {
            font-family: Faustina;
            font-size: 18px;          
            line-height: 23px;
          }
        }
      }

    `}</style>
    </>
  )
}