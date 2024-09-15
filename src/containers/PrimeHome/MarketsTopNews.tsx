import LiveIcon from 'components/Icons/LiveIcon'
import React from 'react'

export default function MarketsTopNews() {
  const data = [
    {
      title: "Sensex extends losses to Day 4, drops 280 pts",
      url: "#",
      live: true,
    },
    {
      title: "Infosys Q1 Results: Catch all live updates here",
      url: "#",
      live: true,
    },
    {
      title: "Are PSUs essential for portfolio? Read this",
      url: "#",
    },
    {
      title: "12 stocks held by MFs in July surged over 70%",
      url: "#",
    },
    {
      title: "HAL Q1 Results: Net profit soars 77% YoY",
      url: "#",
    },
    {
      title: "Mazagon Dock Q1 PAT surges 121% YoY",
      url: "#",
    },
    {
      title: "Federal Bank Q1 PAT rises 18% YoY to Rs 1,009 cr",
      url: "#",
    }
  ]
  return (
    <>
    <div>
      <ul>
        {
          data.map((item, index) => (
            <li key={index}>
              {item.live && <LiveIcon />}
              <a href={item.url}>{item.title}</a>              
            </li>
          ))
        }
      </ul>
    </div>
    <style jsx>{`

      ul {
        padding-left: 20px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li {
        margin-bottom: 10px;
        border-bottom: 1px solid #E8D2CB;
        padding: 5px 0;

        &:first-child {
         font-weight: 600;
        }
      }

      
    `}</style>
    </>
  )
}
