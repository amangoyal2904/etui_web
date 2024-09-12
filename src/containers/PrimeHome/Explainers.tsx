//@ts-nocheck
import React from 'react'

export default function Explainers({ data, title }) {

  function moveSlider(direction) {
    const itemWrap = document.querySelector(".slider .itemWrap");
    const slider = document.querySelector(".slider");
    // const itemsCount = document.querySelectorAll(".slider .item").length;

    const itemWrapWidth = itemWrap?.offsetWidth || 0;
    const sliderWidth = slider?.offsetWidth || 0;

    const itemWrapMarginLeft = itemWrap?.style?.marginLeft || 0;
    itemWrap.style.transition = "margin-left 0.5s";
    
    if(direction === "left") {
      itemWrap.style.marginLeft = `${parseInt(itemWrapMarginLeft) + sliderWidth}px`;
    } else {
      itemWrap.style.marginLeft = `${parseInt(itemWrapMarginLeft) - sliderWidth}px`;      
    }
    
  }

  return (
    <>
      <section className="explainers secBox">
        <h2>{title || ""}</h2>
        <div className="slider">
          <div className="itemWrap">
          {
            data?.map((item, index) => <a key={index} className="item" href={item?.link} target="_blank">
                <img src={item?.img} alt={item?.title} width={256} height={192} title={item?.title} />
                {item?.title || ""}
              </a>
            
            )
          }
          </div>
          <div className="nextPrevBtn">
            <i className="prevBtn subSprite btn disable" onClick={() => moveSlider("left")}></i>
            <i className="nextBtn subSprite btn flr" onClick={() => moveSlider("right")}></i>
          </div>
        </div>
      </section>
      <style jsx>{`
        .nextPrevBtn {
          top: 50%;
          position: absolute;
          width: 100%;
          margin-top: -17.5px;

          .btn {
            width: 32px;
            height: 32px;
            position: relative;
            z-index: 11;
            cursor: pointer;
          }

          .disable {
            opacity: .8;
            cursor: not-allowed;
          }

          .prevBtn {
            background-position: -359px -477px;
            left: -16px;
          }

          .nextBtn {
            background-position: -429px -477px;
            right: -16px;
          }
        }
        .subSprite {
          background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
          display: inline-block;
          background-size: 475px;
        }
        .explainers {
          h2 {
            font-size: 36px;
            padding-top: 35px;
            border-top: 3px solid #9b8680;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .slider {            
            overflow: hidden;

            .itemWrap {
              display: inline-flex;              
              padding-bottom: 20px;              
              list-style: none;
      
              .item {
                width: 260px;
                box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.1);
                background-color: #fff9f7;
                padding: 15px;
                margin-right: 33.357px;

                &:nth-child(4n) {
                  margin-right: 0;
                }

                img {
                  width: 100%;
                  height: auto;
                  margin-bottom: 10px;
                }
              }
            }
          }
        }
      `}</style>
    </>
  )
}
