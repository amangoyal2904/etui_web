import MoreFromLink from 'containers/SubscriberHome/MoreFromLink'
import styles from './styles.module.scss';
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn';
import { ET_WAP_URL, ET_WEB_URL } from 'utils/common';
import { changeImageWidthHeight } from 'utils';

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
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}  color={'red'} widget={`other`} data-ga-onclick={`Subscriber Homepage#Wealth widget click#Button Prev`}/>
            <div ref={emblaRef} className={`embla ${styles.sliderWidget}`}>
                <ul className={`embla__container ${styles.slider_ul}`}>
                    {data?.map((item, index) => (
                        <li className={`embla__slide ${styles.listItem}`} key={`politics_${index}`}> 
                            <a target="_blank" href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)} className={styles.ancher} data-ga-onclick={`Subscriber Homepage#Wealth widget click#Web Stories - href`}>
                                <img width="250" height="444" alt={item.title} loading="lazy" src={changeImageWidthHeight({imageUrl: item.img, desiredWidth: 250, desiredHeight: 444})} />
                                <p className={styles.title}>
                                    <span className={`${styles.subSprite} ${styles.webStIcon}`}></span>
                                    {item.title}
                                </p>
                            </a>
                            
                        </li>
                    ))}
                </ul>
            </div>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}  color={'red'} widget={`other`} data-ga-onclick={`Subscriber Homepage#Wealth widget click#Button Next`} />  
    </div>
  )
}

export default WealthWebstory
