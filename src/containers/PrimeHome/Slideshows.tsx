//@ts-nocheck

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn';

export default function Slideshows({ title, data }) {
  const OPTIONS = {loop: false}
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  function changeImageWidthHeight(imageUrl, desiredWidth, desiredHeight, desiredResizeMode) {
    const newUrl = imageUrl.replace(/width-\d+/g, `width-${desiredWidth}`).replace(/height-\d+/g, `height-${desiredHeight}`);

    if(desiredResizeMode) {
      return newUrl.replace(/resizemode-\w+/g, `resizemode-${desiredResizeMode}`);
    }

    return newUrl;
  }

  const subsets = [];
  for (let i = 0; i < data.length; i += 5) {
    subsets.push(data.slice(i, i + 5));
  }

  return (
    <>
    <section className="slideshow">
      <div className="left">
        <div className="title">Economictimes</div>
        <h2>Slideshows</h2>
        <p>Get the glimpse of the top &amp; latest news with trending photos.</p>
      </div>      
      <div className="right">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={'red'} widget={`other`} />
        <div className="embla" ref={emblaRef}>
          {/*
            data?.map((item, index) => {
              return (              
                <a href={item?.link} target="_blank" className="item" key={index}>
                  <span className="imgWrap">
                    <img src={changeImageWidthHeight(item?.img, 165, 124, 6)} alt={item?.title} width={165} height={124} title={item?.title} />                  
                    <span className="subSprite webStIcon"></span>                    
                  </span>
                  {item?.title || ""}
                </a>              
              )
            })
          */} 
          <div className="embla__container">
          {
            subsets.map((subset, index) => {
              return (
                <div key={index} className="embla__slide itemWrap">
                  {
                    subset.map((item, index1) => {
                      return (
                        <a href={item?.url} target="_blank" className="item" key={index1}>
                          <span className="imgWrap">
                            <img src={changeImageWidthHeight(item?.img, 165, 124, 6)} alt={item?.title} width={165} height={124} title={item?.title} />                  
                            <span className="subSprite webStIcon"></span>                    
                          </span>
                          <span className="caption">{item?.title || ""}</span>
                        </a>       
                      )
                    })
                  }
                </div>
              )
            })
          }    
          </div>   
        </div> 
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} color={'red'} widget={`other`} />
      </div>        
    </section>
    <style jsx>{`
      .subSprite {
        background: url(https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg) no-repeat;
        display: inline-block;
        background-size: 475px;
      }
      .webStIcon {
        width: 20px;
        height: 20px;
        position: absolute;
        background-position: -273px -286px;
        bottom: 3px;
        left: 0;
      }
      .imgWrap {
        position: relative;
      }
      .slideshow {
        display: flex;            
        border-top: 1px solid #9b8680;    

        .left {
          border-right:  1px solid #9b8680;
          padding: 12px 32px 0 15px;
          width: 182px;
          .title {
            font-size: 13px;
            font-weight: 600;
            line-height: 1.85;
            color: #ed193b;
          }
        }

        .right {
          position: relative;
          width: calc(100% - 182px);
        }

        h2 {
          font-size: 23px;
          line-height: 1.04;
          margin: 2px 0 5px 0;
        }

        .itemWrap {
          display: inline-flex;              
          padding-bottom: 20px;
          padding-left: 43px;              
          list-style: none;
          padding-top: 12px;
          gap: 44px;
          box-sizing: border-box;
  
          .item {            
            width: 165px;
            img {
              width: 100%;
              height: auto;
            }

            .caption {
              font-size: 14px;
              margin-top: 6px;
              display: inline-block;
            }

            .webstoryIcon {
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
    `}</style>
    </>
  )
}
