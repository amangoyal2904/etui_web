import MoreFromLink from 'containers/PrimeHome/MoreFromLink'
import styles from './styles.module.scss';
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn';

const WealthWebstory = ({data, heading}) => {
    const OPTIONS = {loop: false}
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

  return (
    <div className={styles.wealth_ws}>
        <div className={styles.pd_txt}>Web Stories</div>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}  color={'red'} widget={`other`} />
            <div ref={emblaRef} className={`embla ${styles.sliderWidget}`}>
                <ul className={`embla__container ${styles.slider_ul}`}>
                    {data?.map((item, index) => (
                        <li className={`embla__slide ${styles.listItem}`} key={`politics_${index}`}> 
                            <a target="_blank" href={item.url} className={styles.ancher}>
                                <img width="250" height="444" alt={item.title} loading="lazy" src={item.img} />
                                <p className={styles.title}>
                                    <span className={`${styles.subSprite} ${styles.webStIcon}`}></span>
                                    {item.title}
                                </p>
                            </a>
                            
                        </li>
                    ))}
                </ul>
            </div>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}  color={'red'} widget={`other`} />  
    </div>
  )
}

export default WealthWebstory
