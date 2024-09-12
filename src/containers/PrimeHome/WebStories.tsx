import React from 'react'

export default function WebStories({ title, data }) {

  function moveSlider(direction) {
    const itemWrap = document.querySelector(".slider .itemWrap");
    const slider = document.querySelector(".slider");
    // const itemsCount = document.querySelectorAll(".slider .item").length;

    const itemWrapWidth = itemWrap.offsetWidth;
    const sliderWidth = slider.offsetWidth;

    const itemWrapMarginLeft = itemWrap.style.marginLeft || 0;
    itemWrap.style.transition = "margin-left 0.5s";
    
    if(direction === "left") {
      itemWrap.style.marginLeft = `${parseInt(itemWrapMarginLeft) + sliderWidth}px`;
    } else {
      itemWrap.style.marginLeft = `${parseInt(itemWrapMarginLeft) - sliderWidth}px`;      
    }
    
  }

  function changeImageWidthHeight(imageUrl, desiredWidth, desiredHeight, desiredResizeMode) {
    const newUrl = imageUrl.replace(/width-\d+/g, `width-${desiredWidth}`).replace(/height-\d+/g, `height-${desiredHeight}`);

    if(desiredResizeMode) {
      return newUrl.replace(/resizemode-\w+/g, `resizemode-${desiredResizeMode}`);
    }

    return newUrl;
  }

  return (
    <>
    <section className="webStories secBox">
      <h2>{title}</h2>
      <div className="slider">
        <div className="itemWrap">
          {
            data?.map((item, index) => {
              return (              
                <a href={item?.link} target="_blank" className="item" key={index}>
                  <img src={changeImageWidthHeight(item?.img, 240, 427, 6)} alt={item?.title} width={240} height={427} title={item?.title} />
                  <span className="title">
                    <span className="subSprite webStIcon"></span>
                    {item?.title || ""}
                  </span>
                </a>              
              )
            })
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
          .webStIcon {
              width: 26px;
    height: 26px;
    background-position: -224px -579px;
    box-shadow: 0 3px 5px 0 rgba(0,0,0,0.81);
    display: block;
    margin-bottom: 10px;
      }
        .webStories {
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
                width: 240px;
                margin-right: 15px;
                position: relative;
                min-height: 427px;

                &:nth-child(5n) {
                  margin-right: 0;
                }

                &::after {
                  content: '';
                  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000);
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 180px;
                }

                img {
                  width: 100%;
                  height: auto;
                  margin-bottom: 10px;
                }

                .title {
                  position: absolute;
                  bottom: 15px;
                  color: #FFF;
                  font-size: 16px;
                  font-weight: 600;
                  line-height: 1.31;
                  padding: 0 15px;
                  z-index: 1;
                  left: 5px;
                }
              }
            }
          }
        }
      `}</style>
      </>
  )
}
