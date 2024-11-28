import styles from "./LiveStreamPlay.module.scss";
import useEmblaCarousel from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "../../components/CarouselArrowBtn";
import { DotButton, useDotButton } from "../../components/CarouselDotBtn";
import APIS_CONFIG from "network/config.json";
import { initSSOWidget } from "../../utils";
import Service from "../../network/service";
import { getCookie } from "utils/utils";
import { useStateContext } from "store/StateContext";
import { useEffect, useRef, useState } from "react";
import StockTalk from "components/StockTalkWidget/StockTalkInit";

const LiveStreamCards = ({
  slide,
  index,
  currentSIndex,
  iframeRef,
  streamData,
  APP_ENV
}: any) => {
  const { state } = useStateContext();
  const [isVisible, setIsVisible] = useState(false);
  const liveStreamRef = useRef(null);
  const { isLogin } = state.login;
  const utmSource = "?utm_source=MarketHome&utm_medium=Self-Referrals";
  const isLive = slide?.eventStatus == 3;
  const expertName = slide?.expertName.replace(/ /g, "") || "";
  const expertId = slide?.expertId;
  const expertURL = `${
    (APIS_CONFIG as any)?.DOMAIN[APP_ENV]
  }/markets/etmarkets-live/expert-bio/expertname-${expertName},expertid-${expertId}.cms${utmSource}`;
  const userObj = slide?.meta?.userData || {};
  const imageMSID = userObj?.imageMSID;
  const expertImg = imageMSID
    ? `https://img.etimg.com/thumb/msid-${imageMSID},width-58,height-54,imgsize-${imageMSID},resizemode-4/expert-image.jpg`
    : "https://img.etimg.com/photo/42031747.cms";
  const streamid = slide?.eventId || "";
  const streamURL =
    streamid &&
    `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}markets/etmarkets-live/streams${
      !isLive ? "recorded" : ""
    }/streamid-${streamid},expertid-${expertId}.cms${utmSource}`;
  const viewsText = isLive ? slide.concurrentViewsText : slide.totalViewsText;
 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5
      }
    );
    if (liveStreamRef.current) {
      observer.observe(liveStreamRef.current);
    }
    return () => {
      if (liveStreamRef.current) {
        observer.unobserve(liveStreamRef.current);
      }
    };
  }, []);

  return (
    <div id={`liveStreamRef_${streamData.eventId}`} className={styles.cardContainer} key={slide.eventId} ref={liveStreamRef}>
      <div style={{ backgroundImage: `url(${slide.eventImageUrl})` }} className={styles.frameWrapper}>
        <div className={styles.iframeContent}>
          {isVisible && index === currentSIndex && <StockTalk data={streamData} />}
        </div>
      </div>
      <div className={styles.cardDescBox}>
        <div className={styles.titleBox}>
          <a className="font_faus" href={streamURL} title={slide.title} data-ga-onclick={`ETLive-Core#et-subscriber-hp-widget-new#Label=VideoClick-Link=${index+1}/Title=VID-${streamData.eventId}-StockTalk:${slide.title}/Expert ID=${expertId}`}>
            {slide.title}
          </a>
        </div>
        <div className={styles.expertBox}>
          <a href={expertURL} target="_blank" title={slide.expertName} data-ga-onclick={`ETLive-Core#et-subscriber-hp-widget-new#Label=ExpertNameClick-Link=${index+1}/Title=VID-${streamData.eventId}-StockTalk: ${slide.title}/Expert ID=${expertId}`}>
            <span className={`${styles.expertimgBox} ${isLive ? styles.liveIcon : ""}`}>
              {expertImg && <img src={expertImg} alt={expertName} title={expertName} loading="lazy" />}
            </span>
            <span className={styles.expertNameBox} data-expertname={slide.expertName} data-userid={expertId}>
              {slide.expertName}
            </span>
          </a>
          <span className={styles.expertViewBox}>{viewsText}</span>
        </div>
      </div>
    </div>
  );
};

const LiveStreamPlayCards = ({
  newsData = [],
  currentSIndex,
  iframeRef,
  onSwitching,
  APP_ENV
}: any) => {
  const OPTIONS = { loop: false };
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const subsets: {
    map(arg0: (item: any, j: any) => React.JSX.Element): React.ReactNode;
    title: string;
    url: string;
    img: string;
  }[] = [];
  const chunkSize = 2;

  // Split data into subsets of 6 items each
  for (let i = 0; i < newsData.length; i += chunkSize) {
    subsets.push(newsData.slice(i, i + chunkSize));
  }
  useEffect(() => {
    if (onSwitching) {
      onSwitching(selectedIndex);
    }
  }, [selectedIndex, onSwitching]);
  return (
    newsData?.length && (
      <div className={styles.liveStreamMain}>
        {newsData?.length > 1 && (
          <div className={styles.leftRightButton}>
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              color={"red"}
              widget={`liveStreamRight`}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              color={"red"}
              widget={`liveStreamRight`}
            />
          </div>
        )}
        <div ref={emblaRef} className={`embla liveStreamRightSlider`}>
          <div className={`embla__container`}>
            {newsData?.map((value: any, index: any) => (
              <div className={`embla__slide`} key={`liveStreamRight${index}`}>
                <LiveStreamCards
                  slide={value}
                  iframeRef={iframeRef}
                  index={index}
                  currentSIndex={currentSIndex}
                  streamData={newsData[index]}
                  APP_ENV={APP_ENV}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default LiveStreamPlayCards;
