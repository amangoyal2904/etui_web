import React from 'react'

export default function PrimeExclusives({ title, data }) {
  return (
    <>
      <div className="primeExclusives">
        <h2 className="title">{title}</h2>
        <div className="grid">
          <div className="col first">            
            <img width="248" height="186" title="Left out in a hot market, how a melted ice cream business gave HUL the chills" alt="Left out in a hot market, how a melted ice cream business gave HUL the chills" src="https://img.etimg.com/thumb/msid-113338491,imgsize-119648,width-248,height-186,quality-100/left-out-in-a-hot-market-how-a-melted-ice-cream-business-gave-hul-the-chills.jpg" />            
            <div className="content">
              <div className="text">
                <span className="category">FMCG</span>
                <a href="#" className="heading">Left out in a hot market, how a melted ice cream business gave HUL the chills</a>
              </div>
              <div className="meta">
                <span className="left">
                  <span className="duration">4 mins read</span>
                  <span className="author">By <a href="#">Shishir Prasad</a></span>
                </span>
                <span className="bookmarkIcon"></span>
              </div>
            </div>
          </div>
          <div className="row">    
            <div className="col">
              <div className="innerCol">
                <div className="content">
                  <div className="text">
                    <span className="category">ARTIFICAL INTELLGENCE</span>
                    <a href="#" className="heading">Left out in a hot market, how a melted ice cream business gave HUL the chills</a>
                  </div>                
                </div>
                <img width="100" height="75" title="Left out in a hot market, how a melted ice cream business gave HUL the chills" alt="Left out in a hot market, how a melted ice cream business gave HUL the chills" src="https://img.etimg.com/thumb/msid-113338491,imgsize-119648,width-248,height-186,quality-100/left-out-in-a-hot-market-how-a-melted-ice-cream-business-gave-hul-the-chills.jpg" />                                            
              </div>
              <div className="meta">
                  <span className="left">
                    <span className="duration">4 mins read</span>
                    <span className="author">By <a href="#">Shishir Prasad</a></span>
                  </span>
                  <span className="bookmarkIcon"></span>
                </div>
            </div>
            <div className="col">
              <div className="content">
                <div className="text">
                  <span className="category">INVESTING</span>
                  <a href="#" className="heading">Left out in a hot market, how a melted ice cream business gave HUL the chills</a>
                </div>
                <div className="meta">
                  <span className="left">
                    <span className="duration">4 mins read</span>
                    <span className="author">By <a href="#">Shishir Prasad</a></span>
                  </span>
                  <span className="bookmarkIcon"></span>
                </div>
              </div>
              <img width="100" height="75" title="Left out in a hot market, how a melted ice cream business gave HUL the chills" alt="Left out in a hot market, how a melted ice cream business gave HUL the chills" src="https://img.etimg.com/thumb/msid-113338491,imgsize-119648,width-248,height-186,quality-100/left-out-in-a-hot-market-how-a-melted-ice-cream-business-gave-hul-the-chills.jpg" />                          
            </div>
          </div>        
        </div>
      </div>
      <style jsx>{`
        .primeExclusives {
          padding-left: 20px;
          border-left: 1px dotted #9b8680;
          margin-top: 1px;
          position: relative;

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
              display: flex;
              gap: 20px;

              .col {
                padding-top: 17px;
                border-top: 1px solid #e8d2cb;
                margin-top: 30px;

                .heading {
                  font: 18px Faustina;
                  padding-bottom: 20px;
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
                }
                
                .bookmarkIcon {
                  background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
                  display: inline-block;
                  background-size: 475px;
                  width: 9px;
                  height: 15px;
                  background-position: -79px -6px;
                }

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
          }
        }
      `}</style>
    </>
  )
}
