'use client';

import styles from "./VideoShow.module.scss";
import { useEffect, FC, useRef, useState } from "react";
import { PageProps, VideoShowProps } from "types/videoshow";
import { getPageSpecificDimensions } from "../../utils";
import { ET_WEB_URL, getSubsecString } from "../../utils/common";
import { setGetPlayerConfig, dynamicPlayerConfig, handleAdEvents, handlePlayerEvents } from "../../utils/slike";
import MostPopularNews from "../../components/MostPopularNews";
import DfpAds from "../../components/Ad/DfpAds";
import Listing from "components/Listing";
import ReadMore from "components/ReadMore";
import MostViewVideos from "components/MostViewVideos";
import {Share} from "components/Share";
import SocialShare from "components/Videoshow/SocialShare";
import PostComments from "components/Comments/PostComments";
import PopulateComment from "components/Comments/PopulateComment";
import { log } from "console";
import Trending from "components/Trending";

declare global {
  interface Window {
    isprimeuser: number;
    spl: any;
    SlikePlayer: any;
    slikePlayers: any;
  }
}

const options = {
  root: null,
  rootMargin: "0px 0px -50% 0px",
  threshold: [0.5]
};

const VideoShow: FC<PageProps> = (props) => {
  const [isPopupVid, setIsPopupVid] = useState(false);
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;
  const mostPopularNews = props?.searchResult?.find((item) => item.name === "most_popular_news");
  const mostViewedVideos = props?.searchResult?.find((item) => item.name === "most_viewed_videos");
  const trendingVideos = props?.searchResult?.find((item) => item.name === "trending_videos") as any;
  const relatedVideos = props?.searchResult?.find((item) => item.name === "related_videos") as any;
  const { seo = {}, version_control, parameters, isprimeuser } = props;
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;

  const subsecNames = props?.seo?.subsecnames;

  const vidRef = useRef(null);

  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };

    const subSecs = getSubsecString(subsecNames);

    let adSection = "videoshow", isDeferredPreRoll = false;
    if (subsecNames?.subsec1 == 13352306) { // industry
      adSection = "industry";
      isDeferredPreRoll = true;
    }

    const playerConfig = setGetPlayerConfig({
      dynamicPlayerConfig,
      result,
      autoPlay: true,
      pageTpl: "videoshow",
      isPrimeUser: window.isprimeuser,
      subSecs,
      adSection,
      isDeferredPreRoll
    });

    document.addEventListener('slikeReady', () => {
      window?.spl?.load(playerConfig, (status) => {
        // console.log({playerConfig,status});
        
        if (status) {
          const player = new window.SlikePlayer(playerConfig);
          handleAdEvents(player);
          handlePlayerEvents(player);
          window.slikePlayers = player;
        }
      });
    });
    
  }, [props]);

  useEffect(() => {
    if(vidRef.current) {
      const observer = new IntersectionObserver(() => {
        window.scrollY < 500 ? setIsPopupVid(false) : setIsPopupVid(true);
      }, options);

      observer.observe(vidRef.current);

      return () => {
        vidRef.current && observer.unobserve(vidRef.current);
      };
    }
  }, [vidRef.current]);

  return (
    <>
      <section className={`pageContent ${styles.videoshow} col3`}>
        <h1>{result.title}</h1>
        <div className={styles.byline}>
          <div>
            {result.agency} | <time dateTime={result.date}>{result.dtline || result.date}</time>
          </div>
          <span className={styles.bookmarkCta}>
            <img src="https://img.etimg.com/photo/63696304.cms" alt="bookmark icon" />
          </span>
          <PostComments />
        </div>
        <div className={styles.vidWrapper} ref={vidRef}>
          <div className={styles.shareBar}>
            <SocialShare
              mailData={{
                shareUrl: ET_WEB_URL + result.url,
                title: result.title,
                msid: result.msid,
                hostId: result.hostid,
                type: "5"
              }}
            />
          </div>
            <div className={`vidWrapInner ${isPopupVid ? styles.popupVid : ''}`}>
              {isPopupVid && <div className={styles.title}>{result.title}</div> }
            <div id={`id_${result.msid}`} className={`${styles.vidContainer} ${styles.vid}`}></div>
            </div>
          </div>
          <div className={styles.videoDesc}>
            <p>{result.synopsis}</p>
            <a href="https://twitter.com/EconomicTimes" rel="nofollow" className="twitter-follow-button" data-show-count="false" data-lang="en">Follow @EconomicTimes</a>
          </div>
          <ReadMore readMoreText={result.relKeywords} />
          { !isprimeuser &&
            <div className="adContainer">
              <DfpAds adInfo={{key: "mid1"}} objVc={version_control}/>
            </div>
          }
          <Listing type="grid" title={relatedVideos.title} data={relatedVideos} />
          {/* <PostComments /> */}
          {/* <PopulateComment msid={msid}/> */}
          {/* <SEO {...seoData} /> */}
          {/* <GreyDivider />
          <AppDownloadWidget tpName="videoshow" />
          */}
        </section>
        <aside className="sidebar">
        { !isprimeuser && <>
            <div className="adContainer"><DfpAds adInfo={{key: "atf", index: 0}} objVc={version_control}/></div>
            <div className="adContainer"><DfpAds adInfo={{key: "mtf", index: 1}} objVc={version_control}/></div>
          </>
        }
          <MostViewVideos data={mostViewedVideos} />
          <Trending data={trendingVideos?.data} title={trendingVideos?.title} />
          <MostPopularNews data={mostPopularNews} />
          { !isprimeuser &&
            <div className="adContainer"><DfpAds adInfo={{key: "btf", index: 1}} objVc={version_control}/></div>
          }
        </aside>
      </>
  );
};

export default VideoShow;
