import { Authors } from 'components/Authors';
import ArrowRnd from 'components/Icons/ArrowRnd'
import PrimeIcon from 'components/Icons/PrimeIcon'
import React from 'react'

export default function PrimeExclusives({ title, data, focusArea }) {
  const firstRow = data[0];
  const secondRow = data.slice(1, 3);
  const thirdRow = data.slice(3, 5);

  const rest = [secondRow, thirdRow];

  return (
    <>
      <div className={`primeExclusives ${focusArea}`}>
        <h2 className="title">{ focusArea == 'market' && <PrimeIcon />}  {title}</h2>
        <div className="grid">
          <div className="col first">            
            <img width="248" height="186" title={firstRow.title} alt={firstRow.title} src={firstRow.img} />
            <div className="content">
              <div className="text">
                <a href={firstRow.categoryLink} className="category" target="_blank">{firstRow.categoryName}</a>
                <a href={firstRow.url} className="heading" target="_blank">{firstRow.title}</a>
              </div>
              {
              focusArea == 'news' && <div className="meta">
                <span className="left">
                  <span className="duration">{firstRow.readtime} mins read</span>
                  <span className="author">By <a href="#">Shishir Prasad</a></span>
                </span>
                <span className="bookmarkIcon"></span>
              </div>
              }
            </div>
          </div>        
          {
            rest.map((item, index) => {
              return (
                <div className="row" key={index}>
                  {item.map((item, index) => {
                    return (
                      <div className="col" key={`col-${index}`}>
                        <div className="innerCol">
                          <div className="content">
                            <div className="text">
                              <span className="category">{item.categoryName}</span>
                              <a href={item.url} className="heading">{item.title}</a>
                            </div>                
                          </div>
                          <img width="100" height="75" title={item.title} alt={item.title} src={item.img} />
                        </div>
                        {focusArea == 'news' &&
                        <div className="meta">
                          <span className="left">
                            <span className="duration">{item.readtime} mins read</span>
                            <span className="author">By <Authors authors={item.authors} /> </span>
                          </span>
                          <span className="bookmarkIcon"></span>
                        </div>
                        }
                      </div> 
                    )
                  })}
                </div>
              )
            })
          }
        </div>
        {focusArea == 'news' && <a className="seeAllLink" href="/prime" target="_blank" data-ga-onclick="Exclusives - See All - href">See All Prime Exclusives Stories <ArrowRnd /></a>}
      </div>
      <style jsx>{`
        .primeExclusives {                
          margin-top: 1px;
          position: relative;

          &.news {
            border-left: 1px dotted #9b8680;
            padding-left: 20px;    

            .row {
              .col {
                .heading {
                  font-size: 18px;
                  padding-bottom: 20px;
                }
              }
            }
          }

          &.market {
            .first {
              flex-direction: column;

              img {
                width: 100%;
                height: auto;
              }
              .content {
                .heading {                  
                  font-size: 20px !important;
                  font-weight: 600;
                  line-height: 24px !important;                  
                }
              }
            }

            .title {
              padding-top: 0;
              border-bottom: 3px solid #9b8680;
              &:before {
                display: none;
              }
            }

            .row {
              display: block !important;

              .col {
                margin-top: 15px !important;

                .heading {
                  font-size: 16px;
                }
              }
            }            
          }

          .title {
            border-bottom: 1px solid #9b8680;
            font-size: 20px;
            font-weight: 800;
            padding-bottom: 7px;
            padding-top: 15px;
            text-transform: uppercase;

            &::before {
              content: '';
              left: -7px;
              top: 19px;
              position: absolute;
              width: 16px;
              height: 17px;
              background: url('https://img.etimg.com/photo/109967743.cms');
              background-size: 500px;
              background-position: -395px -135px;
            }
          }

          .grid {
            display: grid;   
            
            .row {
              display: grid;
              gap: 20px;
              grid-template-columns: repeat(2, 1fr);

              .col {
                display: flex;
                flex-direction: column;
                padding-top: 17px;
                border-top: 1px solid #e8d2cb;
                margin-top: 30px;

                .innerCol {
                  display: flex;
                  flex: 1;
                  gap: 20px;
                  justify-content: space-between;
                } 

                .heading {
                  font-family: Faustina;                  
                }

                .text {
                  
                }
              }
            }
            
            .col {
              display: flex;
              gap: 15px;
              padding-top: 12px;
              border-top: 1px solid #e8d2cb;

              .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;                

              .category {
                color: #930017;
                text-transform: uppercase;
                display: inline-block;
                margin-bottom: 5px;
              }

              a.heading {
                display: block;
                font-size: 30px;
                line-height: 1.17;
                font-family: Faustina;
              }
            }

            .author {

                  &::before {
                    background-color: #ed193b;
                    width: 3px;
                    height: 3px;
                    display: inline-block;
                    content: "";
                    margin: 5px;
                    font-weight: bold;
                    top: 3px;
                    position: relative;
                    border-radius: 50%;
                  }
                }

                .meta {
                  display: inline-flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                }
                
                .bookmarkIcon {
                  background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
                  display: inline-block;
                  background-size: 475px;
                  width: 9px;
                  height: 15px;
                  background-position: -79px -6px;
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
        
      `}</style>
    </>
  )
}