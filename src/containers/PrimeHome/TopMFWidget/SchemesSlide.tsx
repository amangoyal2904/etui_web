import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Loading from 'components/Loading';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../../../components/CarouselArrowBtn';
import { DotButton, useDotButton } from '../../../components/CarouselDotBtn';

const SchemesSlide = ({ primaryName, secondaryObj, keyIndex, selectedTabClick, selectedTab, topMFSchemes, selectedYear }) => {
    const OPTIONS = { loop: false, dragFree: false };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
    // const { onDotButtonClick } = useDotButton(emblaApi);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    // const selectTopMFCat = topMFSchemes.find(item => item.primaryObj == primaryName);

    const logSlidesInViewOnce = useCallback(() => {
        const selectedSlideName = emblaApi?.slideNodes()[emblaApi.selectedScrollSnap()].getAttribute("data-type");
        console.log("selectedSlideName 34", selectedTab, selectedSlideName, (selectedSlideName !== selectedTab.secondaryObj))
        //if (selectedSlideName !== selectedTab.secondaryObj) {
            selectedTabClick(primaryName, selectedSlideName);
        //}
        //emblaApi?.off('pointerUp', logSlidesInViewOnce);
    }, [emblaApi]);

    useEffect(() => {
        if (emblaApi) emblaApi.on('pointerUp', logSlidesInViewOnce);
    }, [emblaApi, logSlidesInViewOnce]);

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

    return (
        <>
            <div ref={emblaRef} key={`tmf_cat_wrap_${keyIndex}`} className="embla tmf_cat_wrap" data-cat={primaryName}>
                <div className="embla__container">
                    {secondaryObj.map((value1, index1) => (
                        <div className="tmf_scat_wrap embla__slide" data-type={value1.value} key={index1}>
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
                                                        {console.log("selectedSlideName 45", value3?.response)}
                                                        {
                                                            value3?.secondaryObj == value1.value && value3?.response?.map((value4, index4) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            value4?.schemeList?.map((value5, index5) => {
                                                                                return (
                                                                                    <li className='schemeList'>
                                                                                        <div className='mfinfo_wrap'>
                                                                                            <div className='tmf_s_name'>
                                                                                                <a target="_blank" href={`/${value5.seoName}/mffactsheet/schemeid-${value5.schemeId}.cms`}>{value5.nameOfScheme}</a>
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
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </>    
                                                                )
                                                            })
                                                        }
                                                    </>
                                                )
                                            })
                                        )
                                    })
                                }
                                <li>
                                    <Loading />
                                </li>
                            </ul>
                            
                        </div>
                    ))}
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

                        .schemeList{
                            padding: 8px 9px 9px 10px;
                            border-bottom: 1px solid #ecc0b3;
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
                    }
                }
            }
        `}</style>
        </>
    );
};

export default React.memo(SchemesSlide);
