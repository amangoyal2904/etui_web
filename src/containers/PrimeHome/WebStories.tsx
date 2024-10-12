// @ts-nocheck
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn';
import { changeImageWidthHeight } from 'utils';

export default function WebStories({ title, data }) {
  const OPTIONS = {loop: false}
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  // make a chunk of 5 items from data
  const subsets = [];
  for (let i = 0; i < data.length; i += 5) {
    subsets.push(data.slice(i, i + 5));
  }

  return (
    <>
    <section className="webStories secBox">
      <h2>{title}</h2>
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={'red'} widget={`other`} />
      <div className="slider embla" ref={emblaRef}>
        <div className="embla__container">
          {
            subsets.map((subset, index) => {
              return (
                <div key={index} className="embla__slide itemWrap">
                  {
                    subset.map((item, index1) => {
                      return (
                        <a href={item?.url} target="_blank" className="item" key={`${index}_${index1}`}>
                          <img alt={item?.title} width={240} height={427} title={item?.title} src={changeImageWidthHeight({imageUrl: item?.img, desiredWidth: 240, desiredHeight: 427})} />
                          <span className="title">
                            <span className="subSprite webStIcon"></span>
                            {item?.title || ""}
                          </span>
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
      </section>
      <style jsx>{`
        .subSprite {
          background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
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

        .embla__slide {
          display: flex;
        }
      `}</style>
      </>
  )
}
