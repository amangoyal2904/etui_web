"use client";

import styles from "./VideoShow.module.scss";
import { useEffect, useRef, useState } from "react";
import { VideoShowProps } from "types/videoshow";
import { getPageSpecificDimensions } from "../../utils";
import { ET_WEB_URL, getSubsecString } from "../../utils/common";
import { setGetPlayerConfig, dynamicPlayerConfig, handleAdEvents, handlePlayerEvents } from "../../utils/slike";
import MostPopularNews from "../../components/MostPopularNews";
import DfpAds from "../../components/Ad/DfpAds";
import Listing from "components/Listing";
import ReadMore from "components/ReadMore";
import MostViewVideos from "components/MostViewVideos";
import SocialShare from "components/Videoshow/SocialShare";
import PostComments from "components/Comments/PostComments";
import Trending from "components/Trending";
import { useStateContext } from "../../store/StateContext";
import Bookmark from "components/Bookmark";
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

const VideoShow = (props) => {
  const [isPopupVid, setIsPopupVid] = useState(false);
  const [isPopupVidClosed, setIsPopupVidClosed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;
  const mostPopularNews = props?.searchResult?.find((item) => item.name === "most_popular_news");
  const mostViewedVideos = props?.searchResult?.find((item) => item.name === "most_viewed_videos");
  const trendingVideos = props?.searchResult?.find((item) => item.name === "trending_videos") as any;
  const relatedVideos = props?.searchResult?.find((item) => item.name === "related_videos") as any;
  const { seo = {}, version_control, parameters, isprimeuser } = props;
  const { msid } = parameters || {};
  const { cpd_wap = "0" }: any = version_control || {};
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, isPink } = state.login;

  const subsecNames = props?.seo?.subsecnames;
  const vidRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    // set page specific customDimensions
    //renderInterstatialAds();
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };

    const subSecs = getSubsecString(subsecNames);
    let adSection = "videoshow",
      isDeferredPreRoll = false;
    if (subsecNames?.subsec1 == 13352306) {
      // industry
      adSection = "industry";
      isDeferredPreRoll = true;
    }

    const playerConfig = setGetPlayerConfig({
      dynamicPlayerConfig,
      result,
      autoPlay: true,
      pageTpl: "videoshow",
      isPrimeUser: window?.isprimeuser,
      subSecs,
      adSection,
      isDeferredPreRoll,
      relvideo: true
    } as any);

    document.addEventListener("slikeReady", () => {
      window?.spl?.load(playerConfig, (status) => {
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
    if (vidRef.current) {
      const observer = new IntersectionObserver(() => {
        window.scrollY < 500 ? setIsPopupVid(false) : setIsPopupVid(true);
      }, options);

      observer.observe(vidRef.current);

      return () => {
        vidRef.current && observer.unobserve(vidRef.current);
      };
    }
  }, [vidRef.current]);

  const closePopupVid = () => {
    setIsPopupVidClosed(true);
  };

  const jsonLd = seo.pageSchema || {};

  return (
    result ? 
    <>
      <section className={`pageContent ${styles.videoshow} col3`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.vidWrapper} ref={vidRef}>
          <div className={`vidWrapInner ${!isPopupVidClosed && isPopupVid ? styles.popupVid : ""}`}>
            {!isPopupVidClosed && isPopupVid && (
              <div>
                <div className={styles.title}>
                  <span className={styles.closeVideo} onClick={closePopupVid}>
                    X
                  </span>
                  {result.title}
                  <div className={styles.bookmarkCta}>
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div id={`id_${result.msid}`} className={`${styles.vidContainer} ${styles.vid}`}></div>
          </div>
        </div>
        <h1>{result.title}</h1>
        <div className={styles.byline}>
          <div>
            {result.agency} | <time dateTime={result.date}>{result.dtline || result.date}</time>
          </div>
        </div>
        
        <div className={styles.videoDesc}>
          <p className={isExpanded ? styles.expanded : styles.collapsed}>{result.synopsis}</p>
          <a onClick={toggleExpand} title="showMoreLess" className={styles.showMLBtn}>{isExpanded ? 'Show Less' : 'Show More'}</a>
        </div>
        <div className={styles.shareBar}>
            <SocialShare
              mailData={{
                shareUrl: ET_WEB_URL + result.url,
                title: result.title,
                msid: result.msid,
                hostId: result.hostid,
                type: "5"
              }}
              articleData={result}
            />
            <Bookmark msid={result.msid} hostId={result.hostid} type="5" />
            <PostComments />
          </div>
        <div className={styles.readMore}>
        <ReadMore readMoreText={result?.relKeywords} />
        </div>
        {!isPink && (
          <div className="adContainer">
              <div id={`taboola-mid-article-thumbnails-${result.msid}`} 
              className="wdt-taboola" 
              data-mode="thumbnails-300x250" 
              data-target_type="mix" 
              style={{height: '280px', marginTop:'7px', overflow:'hidden', width:'300px'}}
              data-placement-name = {`Mid Video Thumbnails`}
              data-placement={`Mid Video Thumbnails`} />
          </div>
        )}
        <Listing type="grid" title={relatedVideos.title} data={relatedVideos} />
      </section>
      <aside className="sidebar">
        {!isPink && (
          <>
            <div className="adContainer">
              <DfpAds adInfo={{ key: "atf300", index: 0 }} objVc={version_control} />
            </div>
            <div className="adContainer">
              <DfpAds adInfo={{ key: "mtf", index: 1 }} objVc={version_control} />
            </div>
          </>
        )}
        <MostViewVideos data={mostViewedVideos} />
        <Trending data={trendingVideos?.data} title={trendingVideos?.title} />
        <MostPopularNews data={mostPopularNews} />
        {!isPink && <div className="adContainer">
        <DfpAds adInfo={{ key: "btf300", index: 2 }} objVc={version_control} />
        </div>}
      
      </aside> 
    </>:""
  );
};

export default VideoShow;