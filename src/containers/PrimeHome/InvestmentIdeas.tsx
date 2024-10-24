import ArrowRnd from 'components/Icons/ArrowRnd'
import React from 'react'
import HeadingWithRightArrow from './HeadingWithRightArrow'
import PrimeIcon from 'components/Icons/PrimeIcon'
import Separator from 'components/Separator'
import RenderText from 'components/RenderText'
import { ET_WEB_URL } from 'utils/common'

export default function InvestmentIdeas({ data, focusArea }) {
  const firstRow = data[0] || {};
  const secondRow = data.slice(1, 3) || [];
  const thirdRow = data.slice(3, 5) || [];
  const rest = [secondRow, thirdRow];
  
  return (
    <>
      <div className={`investmentIdeas ${focusArea}`}>
        {
          focusArea == 'market' && <>
            <PrimeIcon style={{zoom: 0.7, marginRight: '7px', top: '4px'}}/>
            <HeadingWithRightArrow title="Investment Ideas" href="/prime/investment-ideas" /> 
          </>
        }
        {
          focusArea == 'news' && <>
            <Separator />
            <HeadingWithRightArrow title="Investment Ideas" href="/prime/investment-ideas" />
            <span className="title"></span>            
          </> 
        }

        <a href={firstRow.url} target="_blank" className="first">
          <img width="248" height="186" title={firstRow.title} alt={firstRow.title} src={firstRow.img} />
          <RenderText text={firstRow.title} />
        </a>        
        {
          rest.map((item, index) => {
            return (
              <div className="row" key={index}>
                {item.map((item, index1) => {
                  return (
                    <div className="col" key={`col-${index1}`}>
                      { focusArea === "news" && <span className="counter">{(index + 1) * 2 + index1}</span> }
                      <a target="_blank" className="hl" href={item.url} data-conttype="100">
                        <RenderText text={item.title} />
                        { focusArea === "market" && <img width="100" height="75" title={item.title} alt={item.title} src={item.img} /> }
                      </a>                      
                    </div>
                  )
                })
              }
              </div>
            )
          })
        }
        { focusArea === "news" && <a className="seeAllLink" href={`${ET_WEB_URL}/prime/investment-ideas`} target="_blank" data-ga-onclick="Exclusives - See All - href">See All Investment Ideas Stories <ArrowRnd /></a> }
      </div>
      <style jsx>{`
        .investmentIdeas {          
          margin-top: 1px;
          position: relative;

          &.news {
            padding-left: 20px;
            border-left: 1px dotted #9b8680;
            margin-top: -13px;
          }          

          .title {
            border-bottom: 1px solid#9b8680;
            font-size: 20px;
            font-weight: 800;
            padding-bottom: 7px;
            padding-top: 15px;
            text-transform: uppercase;

            &:before {
              content: "";
              left: -7px;
              top: 22px;
              position: absolute;
              width: 16px;
              height: 17px;
              background: url("https://img.etimg.com/photo/109967743.cms");              
              background-size: 500px;
              background-position: -395px -135px;
            }
          }

          .first {
            display: flex;
            align-items: flex-start;
            padding-top: 10px;
            gap: 15px;
            font: 30px Faustina;
            border-bottom: 1px solid #e8d2cb;
            padding-bottom: 20px;
          }

          .row {
            display: flex;
            gap: 20px;
            font: 18px Faustina;
            .col {
              flex: 1;
              display: inline-flex;
              border-bottom: 1px solid #e8d2cb;
              padding: 15px 0;
              gap: 20px;

              .counter {
                font-weight: 700;
                font-style: italic;
                font-size: 40px;
                font-family: 'Faustina';
                color: #ffc3b0;
                position: relative;
                top: -9px;
              }
            }
          }

          .seeAllLink {
            font-size: 14px;
            line-height: 18px;
            font-weight: 700;
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
            padding-bottom: 1.5rem;
          }

          &.market {
            .first {
              flex-direction: column;
              font-size: 20px;
              gap: 5px;
              line-height: 24px;

              img {
                width: 100%;
                height: auto;
              }
            }

            .row {
              flex-direction: column;
              gap: 0;

              .col {

                a {
                  display: inline-flex;
                  font-size: 16px;
                  gap: 20px;
                }
              }

              &:last-child {
                .col:last-child {
                  border-bottom: none;
                }
              }
            }
          }
        }
      `}</style>
    </>    
  )
}