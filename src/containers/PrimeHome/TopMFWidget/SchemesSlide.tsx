import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Loading from 'components/Loading';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../../../components/CarouselArrowBtn';
import { DotButton, useDotButton } from '../../../components/CarouselDotBtn';

const SchemesSlide = ({ primaryName, secondaryObj, keyIndex, selectedTabClick, selectedTab, topMFSchemes, selectedYear, mainEmblaApi, primaryIndex }) => {
    const OPTIONS = { loop: false, dragFree: false };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const isAtLastSlide = useRef(false);
    const isAtFirstSlide = useRef(false);

    const checkIfLastSlide = useCallback(() => {
        if (!emblaApi) return false;
        const snapList = emblaApi.scrollSnapList();
        const currentSnap = emblaApi.selectedScrollSnap();
        return currentSnap === snapList.length - 1;
    }, [emblaApi]);

    const checkIfFirstSlide = useCallback(() => {
        if (!emblaApi) return false;
        const currentSnap = emblaApi.selectedScrollSnap();
        return currentSnap === 0;
    }, [emblaApi]);

    const handleSelect = useCallback(() => {
        if (!emblaApi) return;

        const currentSnap = emblaApi.selectedScrollSnap();
        const selectedSlideName = emblaApi.slideNodes()[currentSnap].getAttribute("data-type");
        
        isAtLastSlide.current = checkIfLastSlide();
        isAtFirstSlide.current = checkIfFirstSlide();
        
        selectedTabClick(primaryName, selectedSlideName);
    }, [emblaApi, primaryName, selectedTabClick, checkIfLastSlide, checkIfFirstSlide]);

    const handleNextClick = useCallback(() => {
        if (!emblaApi) return;

        const snapList = emblaApi.scrollSnapList();
        if (snapList.length === 1 || (isAtLastSlide.current && !emblaApi.canScrollNext())) {
            // We're at the last slide and can't scroll further in the child carousel
            if (mainEmblaApi) {
                const currentMainSnap = mainEmblaApi.selectedScrollSnap();
                const totalMainSlides = mainEmblaApi.slideNodes().length;
                const nextMainSnap = (currentMainSnap + 1) % totalMainSlides;
                mainEmblaApi.scrollTo(nextMainSnap);
                
                const nextCurrentMainSnap = mainEmblaApi.selectedScrollSnap();
                const selectedSlideName = mainEmblaApi.slideNodes()[nextCurrentMainSnap].getAttribute("data-cat");

                const selectedSubSlide = document.querySelector(`.tmf_cat_wrap[data-cat="${selectedSlideName}"] .embla__slide--selected`);
                const selectedSubSlideName = selectedSubSlide?.getAttribute('data-type')
                selectedTabClick(selectedSlideName, selectedSubSlideName);
            }
        } else {
            emblaApi.scrollNext();
        }
    }, [emblaApi, mainEmblaApi]);

    const handlePrevClick = useCallback(() => {
        if (!emblaApi) return;

        const snapList = emblaApi.scrollSnapList();
        if (snapList.length === 1 || (isAtFirstSlide.current && !emblaApi.canScrollPrev())) {
            // We're at the first slide and can't scroll further in the child carousel
            if (mainEmblaApi) {
                const currentMainSnap = mainEmblaApi.selectedScrollSnap();
                const totalMainSlides = mainEmblaApi.slideNodes().length;
                const prevMainSnap = (currentMainSnap - 1 + totalMainSlides) % totalMainSlides;
                mainEmblaApi.scrollTo(prevMainSnap);

                const prevCurrentMainSnap = mainEmblaApi.selectedScrollSnap();
                const selectedSlideName = mainEmblaApi.slideNodes()[prevCurrentMainSnap].getAttribute("data-cat");

                const selectedSubSlide = document.querySelector(`.tmf_cat_wrap[data-cat="${selectedSlideName}"] .embla__slide--selected`);
                const selectedSubSlideName = selectedSubSlide?.getAttribute('data-type')
                selectedTabClick(selectedSlideName, selectedSubSlideName);
            }
        } else {
            emblaApi.scrollPrev();
        }
    }, [emblaApi, mainEmblaApi]);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.on('select', handleSelect);
            
            return () => {
                emblaApi.off('select', handleSelect);
            };
        }
    }, [emblaApi, handleSelect]);

    const renderStars = (vrRating) => {
        const totalStars = 5;
        const rating = parseInt(vrRating, 10); // Convert vrRating to a number
        
        if (isNaN(rating) || rating < 1 || rating > 5) {
          return (
            <span style={{ color: 'gainsboro' }}>
              {'★'.repeat(totalStars)}
            </span>
          );
        }
    
        return (
          <>
            <span className="rating">
              {'★'.repeat(rating)}
            </span>
            <span style={{ color: 'gainsboro' }}>
              {'★'.repeat(totalStars - rating)}
            </span>
          </>
        );
    };

    const getClassName = (yearValue) => {
        if (yearValue < 0) {
          return 'tmf_s_return red';
        } else if (!yearValue) {
          return 'tmf_s_return';
        } else {
          return 'tmf_s_return green';
        }
    };

    const renderReturnValue = (yearValue) => {
        if (!yearValue) {
          return 'N.A.';
        }
        return `${parseFloat(yearValue).toFixed(2)}%`;
    };

    const getPeriodShortName = (yearval) => {
        switch (yearval) {
          case 'sinceLaunch':
            return 'MAX';
          case 'r5Year':
            return '5Y';
          case 'r3Year':
            return '3Y';
          case 'r1Year':
            return '1Y';
          case 'r6Month':
            return '6M';
          case 'r3Month':
            return '3M';
          case 'r1Month':
            return '1M';
          default:
            return ''; // Return empty if no match
        }
    };

    const CategoryReturnsGraph = ({ yearval, data }) => {
        // Extract graph index, min, and max values dynamically based on yearval
        const graphIndex = `${yearval}CategoryGraphValue`;
        const minIndex = `${yearval}CategoryMin`;
        const maxIndex = `${yearval}CategoryMax`;
      
        // Get the values from the data object
        const minVal = parseFloat(data[minIndex]).toFixed(2);
        const maxVal = parseFloat(data[maxIndex]).toFixed(2);
        const graphWidth = parseFloat(data[graphIndex]);

        // Convert to numbers for comparison
        const minValNum = parseFloat(minVal);
        const maxValNum = parseFloat(maxVal);
      
        return (
          <div className="tmf_s_graph">
            <span>Category Returns</span>
            <span className="bar">
              <div className="process" style={{
            width: `${Math.min(graphWidth, 100)}%`, // Ensures the width doesn't exceed 100%
            maxWidth: '100%', // Set max-width here
          }}></div>
              
              <span className="val minVal">
                {minValNum > 0 ? '+' : ''}
                {minVal}%
              </span>
              <span className="val maxVal">
                {maxValNum > 0 ? '+' : ''}
                {maxVal}%
              </span>
            </span>

            <style jsx>{`
                .tmf_s_graph {
                    width: 27%;

                    span:first-child {
                        display: block;
                        font-size: 9px;
                        color: #9b9b9b;
                        line-height: 16px;
                        text-transform: uppercase;
                    }

                    .bar {
                        display: block;
                        position: relative;
                        width: 112px;
                        height: 2px;
                        background: #4a4a4a;
                        top: 2px;

                        .val {
                            position: absolute;
                            font-size: 9px;
                            line-height: 11px;
                            font-weight: 800;
                            top: 5px;

                            &.minVal {
                                left: 0;
                            }

                            &.maxVal {
                                right: 0;
                            }
                        }

                        .process {
                            position: absolute;
                            display: inline-block;
                            width: 0;
                            max-width: 0;
                            height: 2px;
                            background: #ff9300;
                            -webkit-transition: max-width 2s;
                            transition: max-width 2s;
                            z-index: 2;

                            &:after {
                                content: '';
                                position: absolute;
                                display: inline-block;
                                width: 2px;
                                height: 7px;
                                background: #ff9300;
                                top: -2px;
                                right: 0;
                                z-index: 3;
                            }
                        }
                    }
                }
            `}</style>
          </div>
        );
    };

    const mfBuyclientButton = (value5) => {
        // Extract the clientTypeId from the mfBuyclientObject
        const clientType1 = (Array.isArray(value5?.mfBuyclientObject) ? value5?.mfBuyclientObject : [value5?.mfBuyclientObject])?.find((obj) => obj?.clientTypeId == 1);
        const clientType2 = (Array.isArray(value5?.mfBuyclientObject) ? value5?.mfBuyclientObject : [value5?.mfBuyclientObject])?.find((obj) => obj?.clientTypeId == 2);

        // Conditional logic for promotedURL and clientName
        const promotedURL = clientType1?.buyNowUrl || clientType2?.buyNowUrl || '';
        const buttonText = clientType1?.buttonText || clientType2?.buttonText || '';

        return (
            <>
                {
                    promotedURL && <div className="tmf_s_btns">
                        <a target="_blank" rel="nofollow sponsered" href={promotedURL}>{buttonText}</a>
                    </div>
                }
                <style jsx>{`
                    .tmf_s_btns {
                        width: 21%;

                        a{
                            background-color: #183651;
                            color: #fff;
                            text-transform: uppercase;
                            border-radius: 2px;
                            display: inline-block;
                            padding: 8px 14px;
                            margin-top: 3px;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 10px;
                        }
                    }
                `}</style>
            </>
        )
    }

    const schemeURL = (value5) => {
        const clientType1 = (Array.isArray(value5?.mfBuyclientObject) ? value5?.mfBuyclientObject : [value5?.mfBuyclientObject])?.find((obj) => obj?.clientTypeId == 1);
        const clientType2 = (Array.isArray(value5?.mfBuyclientObject) ? value5?.mfBuyclientObject : [value5?.mfBuyclientObject])?.find((obj) => obj?.clientTypeId == 2);
        
        const promotedURL = clientType1?.buyNowUrl || clientType2?.buyNowUrl || '';

        // {console.log("selectedSlideName 45", value5)}

        return promotedURL ? promotedURL : `/${value5?.seoName}/mffactsheet/schemeid-${value5?.schemeId}.cms`;
    }

    const topMfSchemList = (value5, index5, s_type) => {

        return (
            <>
                {
                    value5 && <li className={`schemeList`} key={`topmf_schemelist_${index5}`}>
                        <div className='mfinfo_wrap'>
                            {s_type == "promotedSchemes" && <div className="promoted_text">FEATURED</div>}
                            <div className='tmf_s_name'>
                                <a target="_blank" href={schemeURL(value5)}>{value5?.nameOfScheme}</a>
                                <div className='tmf_s_rating'>
                                    {renderStars(value5.vrRating)}
                                </div>
                            </div>
                            <div className='tmf_s_info'>
                                <div className={getClassName(value5[selectedYear])}>
                                    <span>{getPeriodShortName(selectedYear)} RETURN</span>
                                    <span>{renderReturnValue(value5[selectedYear])}</span>
                                </div>
                                <div className="tmf_s_fund">
                                    <span>FUND SIZE</span>
                                    <span>{`${parseFloat(value5.assetSize).toFixed(2)} Crs`}</span>
                                </div>
                                {CategoryReturnsGraph({yearval: selectedYear, data: value5})}
                                {mfBuyclientButton(value5)}
                            </div>
                        </div>
                    </li>
                }

                <style jsx>{`
                    .schemeList{
                        padding: 8px 9px 9px 10px;
                        border-bottom: 1px solid #ecc0b3;

                        &:hover {
                            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.15);
                        }

                        .promoted_text {
                            font-size: 9px;
                            color: #000;
                            padding: 2px 0;
                        }

                        .tmf_s_name {
                            margin-bottom: 2px;
                            display: flex;

                            a{
                                font-size: 12px;
                                font-weight: bold;
                                width: 80%;
                            }

                            .tmf_s_rating {
                                width: 20%;
                                text-align: center;
                                font-size: 15px;
                                line-height: 1;

                                .rating {
                                    color: #e39f20;
                                }
                            }
                        }

                        .tmf_s_return {
                            width: 21%;
                            border-right: 2px solid #e5cdc7;
                            margin-right: 2%;
                        }

                        .tmf_s_info{
                            display: flex;
                            & > * span:first-child {
                                display: block;
                                font-size: 9px;
                                color: #9b9b9b;
                                line-height: 16px;
                                text-transform: uppercase;
                            }
                        }

                        .tmf_s_return, .top_mf_wdgt, .tmf_s_fund {
                            & span:last-child {
                                font-size: 13px;
                                line-height: 18px;
                                color: #4a4a4a;
                                font-weight: bold;
                            }
                        }

                        .tmf_s_return{
                            &.green{
                                span:last-child {
                                    color: #009b2c;
                                }
                            }

                            &.red{
                                color: #C00;
                            }
                        }

                        .tmf_s_fund {
                            width: 26%;
                            border-right: 2px solid #e5cdc7;
                            margin-right: 2%;
                        }
                    }
                `}</style>
            </>
        )
    }

    return (
        <>
            <div ref={emblaRef} key={`tmf_cat_wrap_${keyIndex}`} className="embla tmf_cat_wrap" data-cat={primaryName}>
                <div className="embla__container">
                    {secondaryObj.map((value1, index1) => (
                        <div className={`tmf_scat_wrap embla__slide`.concat(
                            index1 === selectedIndex ? ' embla__slide--selected' : ''
                        )} data-type={value1.value} key={index1}>
                            <div className="tmf_scat_head">
                                <h3>{value1.value}</h3>
                            </div>
                            <ul className="tmf_sl_wrap">
                                {
                                    topMFSchemes?.map((value2, index2) => {
                                        return (
                                            value2?.primaryObj == primaryName && value2?.schemeData?.map((value3, index3) => {
                                                return (
                                                    <>
                                                        {
                                                            value3?.secondaryObj == value1.value && value3?.response.length > 0  ? value3?.response?.map((value4, index4) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                          value4?.promotedSchemes && (Array.isArray(value4?.promotedSchemes) ? value4?.promotedSchemes : [value4?.promotedSchemes]).map((value6, index6) => topMfSchemList(value6, index6, 'promotedSchemes'))
                                                                        }
                                                                        {
                                                                            value4?.schemeList ? 
                                                                            value4?.schemeList?.slice(0, (value4?.promotedSchemes?.length == 0 ? 5 : value4?.promotedSchemes?.length > 1 ? 3 : 4)).map((value5, index5) => topMfSchemList(value5, index5, 'schemeList')) :
                                                                            <li>
                                                                                <h2 className="tmf_error">Sorry, we couldn't find any schemes that match our criteria of top funds for this category. Please proceed to other categories.</h2>
                                                                            </li>
                                                                        }
                                                                    </>    
                                                                )
                                                            }) : value3?.status == "loading" ? <li><Loading /></li> : null
                                                        }
                                                    </>
                                                )
                                            })
                                        )
                                    })
                                }
                                
                            </ul>
                            
                        </div>
                    ))}
                </div>
                <div className='topMFButtonWrp'>
                    {/* <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={'red'} widget={`topMFWd`} /> */}
                    <PrevButton onClick={handlePrevClick} color={'red'} widget={`topMFWd`} />
                    <div className="embla__dots topMfDots">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={'topMfWDDots embla__dot'.concat(
                                index === selectedIndex ? ' embla__dot--selected red' : ''
                            )}

                            />
                        ))}
                    </div>
                    {/* <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} color={'red'} widget={`topMFWd`} /> */}
                    <NextButton onClick={() => {handleNextClick()} } color={'red'} widget={`topMFWd`} />
                </div> 
            </div>
            <style jsx>{`
            .tmf_cat_wrap{
                width: 540px;
                .tmf_scat_wrap{
                    width: 540px;
                    min-height: 440px;
                    position: relative;

                    .tmf_scat_head {
                        background-color: #ffd7cb;
                        padding: 8px 11px;

                        h3 {
                            font-size: 16px;
                        }

                        * {
                            display: inline-block;
                            vertical-align: top;
                            font-weight: 700;
                        }
                    }

                    .tmf_sl_wrap{
                        margin-top: 0;
                        border-color: #ecc0b3;
                        padding: 0 0 8px 0;
                        list-style: none;

                        .tmf_error {
                            margin-top: 9px;
                            border-top: 2px solid #000;
                            font-size: 15px;
                            padding: 20px 0;
                            text-align: center;
                            color: #8b8b8b;
                        }
                    }
                }

                .topMfDots{
                    justify-content: center;

                    .embla__dot{
                        width: 24px;
                        height: 5px;
                        border-radius: 2.5px;
                        background-color: #d8d8d8;
                        display: inline-block;
                        margin-right: 6px;
                        cursor: pointer;
                    }
                }

                .topMFButtonWrp{
                    display: flex;
                    justify-content: space-between;
                    height: 30px;
                    align-items: center;
                }
            }
        `}</style>
        </>
    );
};

export default React.memo(SchemesSlide);
