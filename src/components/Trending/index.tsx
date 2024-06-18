import React, { FC, useCallback } from 'react';
import styles from "./styles.module.scss";
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../CarouselArrowBtn'


interface TrendingProps {
  data: { title: string; url: string }[]; // Define the type of data prop
  title: string;
}

export default function Trending({ data, title }: TrendingProps) {

  const [emblaRef, emblaApi] = useEmblaCarousel();

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

  // const CustomPrevArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return <div className={`${className} arw_blk`} onClick={onClick}><span className="alft"></span></div>;
  // };

  // const CustomNextArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return <div className={`${className} arw_blk`}  onClick={onClick}><span className="aryt"></span></div>;
  // };

  const subsets: { title: string; url: string }[][] = [];
  const chunkSize = 4;

  // Split data into subsets of 4 items each
  for (let i = 0; i < data.length; i += chunkSize) {
    subsets.push(data.slice(i, i + chunkSize));
  }

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   prevArrow: <CustomPrevArrow className={styles.prevBtn}/>,
  //   nextArrow: <CustomNextArrow className={styles.nextBtn}/>,
  // };
  

  return (
    <div className={`embla ${styles.trending} trending ${global.test}`}>
      <h2>
        {title}
        <div className={`${styles.spotligt_btn_slider} ${styles.embla__buttons}`}>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </h2>
      <div ref={emblaRef}>
        <div className={`embla__container ${styles.trending_wrp}`}>
          {subsets.map((subset, i) => (
            <div className={styles.emblaWrp} key={`subset_${i}`}>
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
