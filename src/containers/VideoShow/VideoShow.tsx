'use client';

import styles from "./VideoShow.module.scss";
import { useEffect, Fragment, FC, useRef } from "react";
import { useSelector } from "react-redux";
import { PageProps, VideoShowProps, OtherVidsProps } from "types/videoshow";
// import { AppState } from "app/store";
import { getPageSpecificDimensions } from "../../utils";
import { ET_WAP_URL, getSubsecString } from "../../utils/common";
import PostComments from "../../components/Comments/PostComments";
import PopulateComment from "../../components/Comments/PopulateComment";
import SocialShare from "../../components/Videoshow/SocialShare";
import { setGetPlayerConfig, dynamicPlayerConfig, handleAdEvents, handlePlayerEvents } from "../../utils/slike";
import MostPopularNews from "../../components/MostPopularNews";
import DfpAds from "../../components/Ad/DfpAds";
import Listing from "components/Listing";
import ReadMore from "components/ReadMore";
import MostViewVideos from "components/MostViewVideos";
import { log } from "console";
import Layout from "components/Layout";

declare global {
  interface Window {
    isprimeuser: number;
    spl: any;
    SlikePlayer: any;
  }
}

const VideoShow: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;
  const mostPopularNews = props?.searchResult?.find((item) => item.name === "most_popular_news");
  const mostViewedVideos = props?.searchResult?.find((item) => item.name === "most_viewed_videos");
  const relatedVideos = props?.searchResult?.find((item) => item.name === "related_videos") as any;
  const { seo = {}, version_control, parameters } = props;
  console.log({props})
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;
  // const loginState = useSelector((state: AppState) => state.login);

  const vidRef = useRef(null);

  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };

    const subSecs = getSubsecString(seo?.subsecnames);
    const playerConfig = setGetPlayerConfig({
      dynamicPlayerConfig,
      result,
      autoPlay: true,
      pageTpl: "videoshow",
      isPrimeUser: window.isprimeuser,
      subSecs
    });

    document.addEventListener('slikeReady', () => {
      window?.spl?.load(playerConfig, (status) => {
        if (status) {
          const player = new window.SlikePlayer(playerConfig);
          handleAdEvents(player);
          handlePlayerEvents(player);
        }
      });
    });
    
  }, [props]);

  return (    
      <>
        <section className={`pageContent ${styles.videoshow} col3`}>
          <h1>{result.title}</h1>
          <div id={`id_${result.msid}`} className={styles.vidContainer}></div>
          <p>{result.synopsis}</p>
          <ReadMore readMoreText={result.relKeywords} />
          <Listing type="grid" title={relatedVideos.title} data={relatedVideos} />
          {/* <PostComments /> */}
          {/* <PopulateComment msid={msid}/> */}
          {/* <SEO {...seoData} /> */}
          {/* <GreyDivider />
          <AppDownloadWidget tpName="videoshow" />
          */}
        </section>
        <aside className="sidebar">
          <DfpAds adInfo={{key: "atf", index: 0}} objVc={version_control}/>
          <DfpAds adInfo={{key: "mtf", index: 1}} objVc={version_control}/>
          <MostViewVideos data={mostViewedVideos} />
          <MostPopularNews data={mostPopularNews} />
        </aside>
      </>
  );
};

export default VideoShow;
