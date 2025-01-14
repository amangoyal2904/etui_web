//@ts-nocheck
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "../../components/CarouselArrowBtn";
import { changeImageWidthHeight } from "utils";
import RenderText from "components/RenderText";
import { ET_WAP_URL, ET_WEB_URL } from "utils/common";

export default function Explainers({ data, title }) {
  const OPTIONS = { loop: false };
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const subsets = [];
  for (let i = 0; i < data.length; i += 4) {
    subsets.push(data.slice(i, i + 4));
  }

  return (
    <>
      <section
        className="explainers secBox"
        data-ga-impression={`Subscriber Homepage#Editor Pick widget impression widget impression#`}
      >
        <h2>{title || ""}</h2>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={"red"} widget={`other`} data-ga-onclick={`Subscriber Homepage#Editor Pick widget click#Button Prev`}/>
        <div className="slider embla" ref={emblaRef}>
          <div className="embla__container">
            {subsets.map((subset, index) => {
              return (
                <div key={index} className="embla__slide itemWrap">
                  {subset.map((item, index1) => {
                    return (
                      <a
                        target="_blank"
                        className="item"
                        key={`${index}_${index1}`}
                        href={`${item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}`}
                        data-ga-onclick={`Subscriber Homepage#Editor Pick widget click#${index1+1} - href`}
                      >
                        <img
                          alt={item?.title}
                          width={256}
                          height={192}
                          title={item?.title}
                          src={changeImageWidthHeight({ imageUrl: item?.img, desiredWidth: 256, desiredHeight: 192 })}
                          loading="lazy" 
                        />
                        <RenderText text={item?.title} />
                      </a>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} color={"red"} widget={`other`} data-ga-onclick={`Subscriber Homepage#Editor Pick widget click#Button Next`}/>
      </section>
      <style jsx>{`
        .subSprite {
          background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
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
                font-size: 18px;
                font-family: "Faustina", serif;

                &:hover {
                  text-decoration: underline;
                }

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
  );
}
