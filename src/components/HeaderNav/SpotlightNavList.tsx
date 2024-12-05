import React, { FC, useCallback } from 'react';
import styles from "./styles.module.scss";
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../CarouselArrowBtn'
  
const SpotlightNavList = ( props ) => {
    const { data } = props;

    const [emblaRef, emblaApi] = useEmblaCarousel();

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <>
            <div className={`embla ${data.nm == "Innovative Solution" ? styles.Edition_carouseltwo : styles.Edition_carouselone}`} >
                {data.nm == "Innovative Solution" && <h2>{data.nm}</h2>}
                <div ref={emblaRef}>
                    <ul className={`embla__container ${styles.Edition_wrp}`}>
                        {
                        data.sec?.map((value1, index1) => {
                            return (                            
                                <li key={index1} className="embla__slide">
                                {
                                    value1 && Array.isArray(value1) && value1.map((value2, index2) => {
                                    return (                                        
                                        <div className={styles.spotlightContent} key={index2}>
                                            <a href={value2.link ? value2.link : '#;'}>
                                            <img src={value2.im} width="120" height="70" alt={value2.nm} loading="lazy"  />
                                            </a>
                                            <a className={styles.txt} href={value2.link ? value2.link : '#;'}>
                                            {value2.nm}
                                            </a>
                                        </div>                                        
                                    )
                                    })
                                }
                                </li>                        
                            )
                        })
                        }
                    </ul>
                </div>
                <div className={`${styles.spotligt_btn_slider} ${styles.embla__buttons}`}>
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </>
    )
}
  
  export default SpotlightNavList;