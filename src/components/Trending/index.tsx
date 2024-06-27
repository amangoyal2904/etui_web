import React, { FC, useCallback } from 'react';
import styles from "./styles.module.scss";
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../CarouselArrowBtn'
  import { DotButton, useDotButton } from '../CarouselDotBtn'


interface TrendingProps {
  data: { title: string; url: string }[]; // Define the type of data prop
  title: string;
}

export default function Trending({ data, title }: TrendingProps) {

  const OPTIONS = {loop: true}
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

  const subsets: { title: string; url: string }[][] = [];
  const chunkSize = 4;

  // Split data into subsets of 4 items each
  for (let i = 0; i < data.length; i += chunkSize) {
    subsets.push(data.slice(i, i + chunkSize));
  }
  

  return (
    <div className={`embla ${styles.trending} trending ${global.test}`}>
      <h2>
        {title}
        <div className={`${styles.spotligt_btn_slider} ${styles.embla__buttons}`}>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <div className="embla__dots">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={'embla__dot'.concat(
                    index === selectedIndex ? ' embla__dot--selected' : ''
                  )}
                />
              ))}
            </div>
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </h2>
      <div ref={emblaRef}>
        <div className={`embla__container ${styles.trending_wrp}`}>
          {subsets.map((subset, i) => (
            <div className={`embla__slide` } key={`subset_${i}`}>
              {subset.map((item, j) => (
                <a href={item.url} key={`trending_${i}_${j}`}>{item.title}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
