import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../CarouselArrowBtn';

const BreakingNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const options = {};
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()]);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);
  const titleArr = {10: 'Alert', 11: 'News Flash', 12: 'News Just In', 13: 'What\'s New', 0: 'Breaking News'};
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchNews = useCallback(async () => {
    console.log('Fetching news...');
    try {
      const response = await axios.get('https://etdev8243.indiatimes.com/json_bnews1.cms', {
        responseType: 'text'
      });
      const match = response.data.match(/breakingnews\(\s*(\[.*\])\s*\);?/);
      if (match && match[1]) {
        const newsData = JSON.parse(match[1]);
        setNews(newsData);
        console.log('News fetched:', newsData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }, []);

  const startFetchingNews = useCallback(() => {
    if (!intervalIdRef.current) {
      fetchNews(); // Initial fetch
      intervalIdRef.current = setInterval(() => {
        console.log('Interval triggered, fetching news.');
        fetchNews();
      }, 30000);
      console.log('Started news fetching interval.');
    }
  }, [fetchNews]);

  const stopFetchingNews = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      console.log('Stopped news fetching interval.');
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('Visibility changed:', !document.hidden);
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('Element is in view.');
        setIsPageVisible(true);
      } else {
        console.log('Element is out of view.');
        setIsPageVisible(false);
      }
    });

    if ((emblaRef as any).current) {
      observerRef.current.observe((emblaRef as any).current);
    }

    return () => {
      if (observerRef.current && (emblaRef as any).current) {
        observerRef.current.unobserve((emblaRef as any).current);
      }
    };
  }, [emblaRef]);

  useEffect(() => {
    if (isPageVisible) {
      console.log('Page is visible, starting news fetching.');
      startFetchingNews();
    } else {
      console.log('Page is not visible, stopping news fetching.');
      stopFetchingNews();
    }
  }, [isPageVisible, startFetchingNews, stopFetchingNews]);

  const svgHTML = () => (
    <span className="svg-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="40" viewBox="0 0 50 40" fill="none"> 
        <g id="node_1_0">                              
          <path id="third" fillRule="evenodd" clipRule="evenodd" d="M0 0H3.76004L20 19.8974L3.76004 40H0L15.9563 19.8974L0 0Z" fill="#ED193B"></path>
          <path id="second" fillRule="evenodd" clipRule="evenodd" d="M0 0H3.76004L20 19.8974L3.76004 40H0L15.9563 19.8974L0 0Z" fill="#ED193B"></path>
          <path id="first" fillRule="evenodd" clipRule="evenodd" d="M0 0H3.76004L20 19.8974L3.76004 40H0L15.9563 19.8974L0 0Z" fill="#ED193B"></path>
          <path id="white" fillRule="evenodd" clipRule="evenodd" d="M0 0 L 6 0 L22 20 L6 40 L 0 40 L 0 0 Z" fill="#FFFFFF"></path>
        </g>
      </svg>
    </span>
  );

  const getTitle = (item: any) => {
    return item.title.includes('###') ? item.title.split('###')[0] : titleArr[item.type] || 'BREAKING NEWS';
  };

  return (
    news.length > 0 ? (
      <div id="breakingNews" className={styles.breakingNewsWap}>
        <div className={`embla ${styles.bnewsWrp}`}>
          <div ref={emblaRef} className={styles.emblaWrp}>
            <ul className={`embla__container`}>
              {news.map((item, index) => {
                const [title, subtitle] = item.title.includes('###') ? item.title.split('###').map((str: string) => str.trim()) : [item.title, ''];
                return (
                  item.title && (
                    <li key={index} className={`embla__slide ${styles.breakingNews}`}>
                      <span className={`lb-icon ${styles.customLbIcon}`}></span>
                      <span className={`${styles.head}`}>{getTitle(item)}</span>
                      {svgHTML()}
                      {item.link ? (
                        <a href={item.link} target="_blank" className={`${styles.title}`} rel="noopener noreferrer">
                          {subtitle || title}
                        </a>
                      ) : (
                        <span className={`${styles.title}`}>{subtitle || title}</span>
                      )}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
          <div className={`${styles.embla__buttons}`}>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </div>
      </div>
    ) : null
  );
};

export default BreakingNews;