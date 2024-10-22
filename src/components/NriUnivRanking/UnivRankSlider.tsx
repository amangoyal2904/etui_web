"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { NextButton, PrevButton, usePrevNextButtons } from "components/CarouselArrowBtn";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from "embla-carousel";
import { useDotButton } from "components/CarouselDotBtn";

const TWEEN_FACTOR_BASE = 0.52;
const numberWithinRange = (number, min, max) => Math.min(Math.max(number, min), max);

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const UnivRankSlider: React.FC<PropType> = (props) => {
  const { slides } = props;

  // Enable loop and tweak options
  const OPTIONS = { loop: true }; // Enable loop and center alignment
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);
  const tweenOpacity = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const opacity = numberWithinRange(tweenValue, 0, 1).toString();
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity;
      });
    });
  }, []);
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

    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);
    updateSlideClasses(); // Add classes initially
    emblaApi
      .on("reInit", () => {
        setTweenFactor(emblaApi);
        tweenOpacity(emblaApi);
        updateSlideClasses();
      })
      .on("scroll", tweenOpacity)
      .on("select", updateSlideClasses) // Update classes on slide change
      .on("slideFocus", tweenOpacity);
  }, [emblaApi, tweenOpacity, updateSlideClasses]);

  return (
    <div className={styles.univRankSlider}>
      <div className={styles.leftRightButton}>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={"red"} widget={`liveStreamRight`} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} color={"red"} widget={`liveStreamRight`} />
      </div>
      <div ref={emblaRef} className={`embla ${styles.univRankEmbla}`}>
        <div className={`embla__container ${styles.univRankEmblacontainer}`}>
          {slides.map((index) => (
            <div className={`${styles.univRankEmblaslide}`} key={index}>
              <img className="embla__slide__img" src={`https://picsum.photos/600/350?v=${index}`} alt="Slide" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnivRankSlider;
