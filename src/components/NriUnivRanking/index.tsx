"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { NextButton, PrevButton, usePrevNextButtons } from "components/CarouselArrowBtn";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "components/CarouselDotBtn";
import UnivRankSlider from "./UnivRankSlider";

const NriUnivRanking = ({ univDataResp }: any) => {
  const OPTIONS = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  
  const [isDisabled, setIsDisabled] = useState(false); // Add state to manage button disabling
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const handlePrevClick = () => {
    if (isDisabled) return; // Prevent action if buttons are disabled
    onPrevButtonClick(); // Trigger original previous button click handler
    setIsDisabled(true); // Disable buttons
    setTimeout(() => setIsDisabled(false),700); // Re-enable after 0.7s
  };

  const handleNextClick = () => {
    if (isDisabled) return; // Prevent action if buttons are disabled
    onNextButtonClick(); // Trigger original next button click handler
    setIsDisabled(true); // Disable buttons
    setTimeout(() => setIsDisabled(false), 700); // Re-enable after 0.7s
  };

  const updateSlideClasses = useCallback(() => {
    if (!emblaApi) return;

    const slideNodes = emblaApi.slideNodes();
    const totalSlides = slideNodes.length;

    emblaApi.scrollSnapList().forEach((_, index) => {
      slideNodes[index].classList.remove(styles.current, styles.justbefore, styles.justafter);
    });

    const current = emblaApi.selectedScrollSnap();
    const prev = (current - 1 + totalSlides) % totalSlides;
    const next = (current + 1) % totalSlides;

    slideNodes[current].classList.add(styles.current);
    slideNodes[prev].classList.add(styles.justbefore);
    slideNodes[next].classList.add(styles.justafter);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateSlideClasses(); 
    emblaApi
      .on("reInit", () => {
        updateSlideClasses();
      })
      .on("select", updateSlideClasses);
  }, [emblaApi, updateSlideClasses]);

  return (
    <div className={styles.univRankMain}>
      <h2 className={styles.title}>University Rankings</h2>
      <div className={styles.univRankSlider}>
        <div className={styles.leftRightButton}>
          <PrevButton onClick={handlePrevClick} className={styles.univPriv} disabled={prevBtnDisabled || isDisabled} color={"red"} widget={`univSLideIcon`} />
          <NextButton onClick={handleNextClick} className={styles.univNext} disabled={nextBtnDisabled || isDisabled} color={"red"} widget={`univSLideIcon`} />
        </div>
        <div ref={emblaRef} className={`embla ${styles.univRankEmbla}`}>
          <div className={`embla__container ${styles.univRankEmblacontainer}`}>
            {univDataResp.map((data, index) => (
              <div className={`${styles.univRankEmblaslide}`} key={index}>
                <UnivRankSlider data={data} />
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles.univSlideDot}`}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot univDot'.concat(
                index === selectedIndex ? ' embla__dot--selected red' : ''
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NriUnivRanking;
