import React from 'react'
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn';

export default function PrimeBenefitsBucket({focusArea}) {
  const OPTIONS = {loop: false}
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  const items = [
    {
      title: "Prime Exclusives",
      iconPosition: "-17px -22px",
    }, 
    {
      title: "Investment Ideas",
      iconPosition: "-68px -22px",
    },
    {
      title: "Stock Reports",
      iconPosition: "-118px -22px",
    },
    {
      title: "BigBull Portfolio",
      iconPosition: "-114px -99px",
    },
    {
      title: "ET Grandmasters",
      iconPosition: "-48px -255px",
    },
    {
      title: "Markets Mood",
      iconPosition: "-5px -230px",
    },
    {
      title: "Wealth Magazine",
      iconPosition: "-169px -22px",
    },
    {
      title: "Today's ePaper",
      iconPosition: "-12px -104px",
    },
    {
      title: "Redeem Benefits",
      iconPosition: "-118px -60px",
    }
  ];

  return (
    <>      
      <div className={`primeBenefitsBucket embla ${focusArea}`}>                   
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container itemWrap">
          {
            items.map((item, index) => (
              <a key={index} className="item embla__slide">
                <span className="icon" style={{backgroundPosition: item.iconPosition}}></span>
                <span className="title">{item.title}</span>
              </a>
            ))
          }
          </div>
        </div>   
        <span className="prev arr"></span>
        <span className="next arr"></span>                   
      </div>      
      <style jsx>{`
        .primeBenefitsBucket {
          overflow: hidden;
          padding: 15px 0 5px 10px;
          position: relative;

          .embla__slide {
            flex: 0 0 85px;
          }

          &.news {
            border-left: 1px dotted #9b8680;
          }

          &.market {
            padding-left: 0;
            margin-bottom: 25px;
          }

          .arr {
            width: 18px;
            height: 18px;
            display: inline-block;
            background: #DA4617CC;
            border-radius: 50%;
            position: absolute;            
            cursor: pointer;
            pointer-events: all;

            &:after {
              content: '';
              display: inline-block;
              width: 6px;
              height: 6px;
              border-top: 1px solid #fff;
              border-left: 1px solid #fff;
              transform: rotate(-45deg);
              position: absolute;
              top: 5px;
              left: 6px;
            }

            &.prev {
              left: 3px;
              top: 46px;
            }

            &.next {
              right: 3px;
              top: 46px;
              transform: rotate(180deg);
            }
          }

          .itemWrap {
            display: inline-flex;
            gap: 10px;
            
            .item {
              background: #fff7f3;
              box-shadow: 0 4px 4px 0 rgba(231,206,206,0.25);
              border: solid 1.5px #f9d8cb;
              border-radius: 5px;
              font-size: 10px;
              font-weight: 700;
              transition: .5s all ease 0;
              position: relative;
              height: 74px;
              width: 85px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              text-align: center;
              padding: 0 7px;

              .icon {
                margin-bottom: 7px;
                background: url(https://img.etimg.com/photo/msid-112277608,quality-100/benefits-icon-sprite.jpg) no-repeat;
                display: inline-block;
                background-size: 210px;
                width: 24px;
                height: 24px;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
