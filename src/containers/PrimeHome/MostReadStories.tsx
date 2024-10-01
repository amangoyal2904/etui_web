import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn'
  import { DotButton, useDotButton } from '../../components/CarouselDotBtn';
  import SocialShare from "../../utils/socialShare";
import Bookmark from 'components/Bookmark';

const MostReadStories = ({MostReadStoriesRes}) => {
    const OPTIONS = {loop: false}
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const subsets: {
        map(arg0: (item: any, j: any) => React.JSX.Element): React.ReactNode; title: string; url: string; img: string; 
        }[] = [];
    const chunkSize = 6;

    // Split data into subsets of 6 items each
    for (let i = 0; i < MostReadStoriesRes.length; i += chunkSize) {
        subsets.push(MostReadStoriesRes.slice(i, i + chunkSize));
    }
    
  return (
    <>
        <div id="trending" className="mostReadStories">
            <div className='mostReadStoriesWrp'>
                <div className="leftDiv font_faus">
                    <span className="subSprite arrow"></span>
                    <h3>Most Read<span>Stories</span></h3>
                </div>
                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={'red'} widget={`mostReadStories`} />
                <div ref={emblaRef} className={`embla mostReadStoriesSlider`}>
                    <div className={`embla__container`}>
                        {subsets.map((value, index) => (
                            <div className={`embla__slide` } key={`MostReadStoriesRes_${index}`}>
                                {value?.map((item, j) => {
                                    return (                                        
                                        <div className="content" key={j}>
                                            <div className='contentWrap'>
                                                <a 
                                                    target="_blank" 
                                                    href={item.url}
                                                    className='flr'
                                                >
                                                    <img 
                                                        src={item.img} 
                                                        width="100" 
                                                        height="75" 
                                                        alt={item.title} 
                                                        title={item.title}  
                                                        className="im lazy" />
                                                </a>
                                                <div className="info_box">
                                                    <span>News</span>
                                                    <a 
                                                        title={item.title}  
                                                        target="_blank" 
                                                        className="line_4" 
                                                        href={item.url}
                                                    >{item.title}</a>
                                                </div>
                                            </div>
                                            <div className='icon'>
                                                <span className="cSprite pshare-icon socialShare vat" data-msid={item.msid} data-arttype="0" data-channelid="1">
                                                    <div className="share_block sharingIcon">
                                                        <span className="text">Share This Article</span>
                                                        <div className='shareIconWrp'>
                                                            <span 
                                                                className="fb cSprite" 
                                                                onClick={e => SocialShare.Share(e, { ...{title: item.title, url:item.url}, type: "fb" })}></span>
                                                            <span 
                                                                className="twt cSprite" 
                                                                onClick={e => SocialShare.Share(e, { ...{title: item.title, url:item.url}, type: "twt" })}
                                                            ></span>
                                                            <span 
                                                                className="wa cSprite" 
                                                                onClick={e => SocialShare.Share(e, { ...{title: item.title, url:item.url}, type: "wa" })}
                                                            ></span>
                                                        </div>
                                                    </div>
                                                </span>
                                                {/* <span className="cSprite bookmark-icon vat" data-msid={item.msid} data-arttype="0" data-channelid="1"></span> */}
                                                <Bookmark msid={item.msid} hostId={`153`} type="5" widget={`mostread_primehome`} apiType={'all'} />
                                            </div>
                                        </div>                                    
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} color={'red'} widget={`mostReadStories`} />
            </div>
            <div className="embla__dots mostreadDots">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={'embla__dot'.concat(
                    index === selectedIndex ? ' embla__dot--selected red' : ''
                  )}
                />
              ))}
            </div>  
        </div>
        <style jsx>{`
            .mostreadDots{
                display: flex;
                justify-content: center;
                padding: 30px 0 50px;
            }
            .mostReadStoriesWrp{
                padding-top: 50px;
                border-top: 3px solid #9b8680;
                margin-bottom: 0;
                position: relative;
                display: flex;

                .mostReadStoriesSlider{
                    width: calc(100% - 200px);
                }

                .leftDiv {
                    color: #fff;
                    width: 200px;
                    background-color: #ed193b;
                    height: 278px;
                    vertical-align: bottom;

                    .arrow {
                        background-position: -357px -517px;
                        height: 50px;
                        width: 56px;
                        left: 20px;
                        position: absolute;
                        bottom: 109px;
                    }

                    h3 {
                        font-size: 30px;
                        line-height: 30px;
                        display: inline-block;
                        position: absolute;
                        bottom: 30px;
                        left: 20px;

                        span {
                            display: block;
                            font-size: 48px;
                            line-height: 44px;
                        }
                    }
                }

                .embla__slide{
                    .content {
                        display: inline-flex;
                        flex-wrap: wrap;
                        width: 318px;
                        min-height: 110px;
                        padding: 12px;
                        background-color: #fff9f7;
                        font-family: Faustina;
                        font-size: 18px;
                        font-weight: 500;
                        margin: 0 5px 10px;
                        position: relative;

                        .contentWrap{
                            width: 100%;
                        }

                        .info_box {
                            width: 205px;

                            span {
                                color: #930017;
                                font-family: Montserrat;
                                font-size: 12px;
                                font-weight: 400;
                                display: block;
                                text-transform: uppercase;
                            }

                            .line_4 {
                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 4;
                                -webkit-box-orient: vertical;
                                font-weight: 200;
                            }
                        }

                        .icon {
                            font-size: 11px;
                            text-align: right;
                            margin-top: 5px;
                            display: flex;
                            position: absolute;
                            right: 10px;
                            top: 96px;

                            .shareIconWrp{
                                display: flex;
                                margin-top: 5px;
                                justify-content: space-evenly;
                            }

                            .share_block {
                                display: none;
                                height: 67px;
                                width: 133px;
                                box-sizing: border-box;
                                background: #fff;
                                position: absolute;
                                right: 47px;
                                z-index: 1;
                                top: -27px;
                                padding: 6px;
                                border: 1px solid #979797;
                                text-align: center;
                                border-radius: 3px;

                                &:before, &:after {
                                    top: 50%;
                                    left: 100%;
                                    border: solid transparent;
                                    content: "";
                                    height: 0;
                                    width: 0;
                                    position: absolute;
                                    pointer-events: none;
                                }
                                &:before {
                                    border-color: rgba(194, 225, 245, 0);
                                    border-left-color: #979797;
                                    border-width: 9px;
                                    margin-top: -9px;
                                }

                                &:after {
                                    border-color: rgba(136, 183, 213, 0);
                                    border-left-color: #fff;
                                    border-width: 7px;
                                    margin-top: -7px;
                                }                                

                                span.text {
                                    font-family: Montserrat;
                                    font-size: 9px;
                                    text-align: center;
                                    text-transform: uppercase;
                                }

                                .fb{
                                    width: 33px;
	                                height: 33px;
                                    background-position: -12px -615px;
                                    cursor: pointer;

                                    &:hover{
                                        background-position: -142px -615px;    
                                    }
                                }

                                .twt{
                                    width: 33px;
	                                height: 33px;
                                    background-position: -54px -615px;
                                    cursor: pointer;

                                    &:hover{
                                        background-position: -182px -615px;    
                                    }
                                }

                                .wa{
                                    width: 33px;
	                                height: 33px;
                                    background-position: -98px -615px;
                                    cursor: pointer;

                                    &:hover{
                                        background-position: -222px -615px;    
                                    }
                                }
                            }

                            .socialShare:hover .share_block{
                                display: block;
                            }

                            .bookmark-icon {
                                width: 9px;
                                height: 15px;
                                background-position: -79px -6px;
                                cursor:pointer;
                            }

                            .pshare-icon {
                                width: 20px;
                                height: 15px;
                                background-position: -153px -4px;
                                margin-right: 20px;
                                padding-bottom: 10px;

                                &:after {
                                    content: '';
                                    display: inline-block;
                                    width: 3px;
                                    height: 3px;
                                    top: -4px;
                                    left: 10px;
                                    border-radius: 50%;
                                    position: relative;
                                    background-color: #ed193b;
                                }
                            }
                        }
                    }
                }

                .subSprite, .cSprite {
                    background: url('https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg') no-repeat;
                    display: inline-block;
                    background-size: 475px;
                }
            }
        `}</style>
    </>
  )
}

export default MostReadStories