"use client";

import Politics from "./Politics";
import Explainers from "./Explainers";
import MoreFromEconomicTimes from "./MoreFromEconomicTimes";
import Panache from "./Panache";
import Slideshows from "./Slideshows";
import WebStories from "./WebStories";
import CryptocurrencyNews from "./CryptocurrencyNews";
import Rise from "./Rise";
import Tech from "./Tech";
import Wealth from "./Wealth";
import MutualFunds from "./MutualFunds";
import MarketNews from "./MarketNews";
import TopSectionLayout from "./TopSectionLayout";
import Podcast from "./Podcast";
import MostReadStories from './MostReadStories';
import VideoWidget from "./VideoWidget";
import { useEffect } from "react";
import { useStateContext } from "store/StateContext";

function PrimeHome({ searchResult, isDev, ssoid}) {  
  const marketNews = searchResult?.find(item => item?.name === "market_news") || {};
  const marketExpertViews = searchResult?.find(item => item?.name === "market_expert_views") || {};
  const marketLiveblog = searchResult?.find(item => item?.name === "market_liveblog") || {};
  const marketMoguls = searchResult?.find(item => item?.name === "market_moguls") || {};
  const marketPodcastData = searchResult?.find(item => item?.name === "market_podcast") || {};
  const mutualFunds = searchResult?.find(item => item?.name === "mutual_funds") || {};
  const wealth = searchResult?.find(item => item?.name === "wealth") || {};
  const tech = searchResult?.find(item => item?.name === "tech") || {};
  const techNewsLetters = searchResult?.find(item => item?.name === "tech_newsletters") || {};
  const rise = searchResult?.find(item => item?.name === "rise") || {};
  const popularInSmallBiz = searchResult?.find(item => item?.name === "popular_in_small_biz") || {};
  const cryptocurrencyNews = searchResult?.find(item => item?.name === "cryptocurrency_news") || {};
  const wealthslideshow = searchResult?.find(item => item?.name === "et_wealth_slideshow") || {};
  const wealthWebStories = searchResult?.find(item => item?.name === "wealth_web_stories") || {};
  const cryptoTv = searchResult?.find(item => item?.name === "crypto_tv") || {};
  const cryptoExpert = searchResult?.find(item => item?.name === "crypto_expert_speak") || {};
  const politics = searchResult?.find(item => item?.name === "politics") || {};
  const slideshows = searchResult?.find(item => item?.name === "slideshows") || {};
  const webStories = searchResult?.find(item => item?.name === "web_stories") || {};
  const panache = searchResult?.find(item => item?.name === "panache") || {};
  const panacheVideosSlideshows = searchResult?.find(item => item?.name === "panache_videos_slideshow") || {};
  const explainers = searchResult?.find(item => item?.name === "explainers") || {};
  const moreFromeEconomicTimes = searchResult?.find(item => item?.name === "more_from_economictimes")?.data || [];
  const podcast = searchResult?.find(item => item?.name === "podcast")?.data || [];
  const MostReadStoriesData = searchResult?.find(item => item?.name === "most_read_stories") || {};
  const VideoWidgetData = searchResult?.find(item => item?.name === "videos") || {};  

  const { state, dispatch } = useStateContext();
  const { isLogin } = state.login;

  useEffect(() => {
    dispatch({
      type: "SETPINKTHEME",
      payload: {
        isPink: true
      },
    });
  }, []);

  useEffect(() => {    
    const devCheck = typeof window !== "undefined" && window.location.href.includes("dev=1");    
    if(isLogin != null && !isLogin && !devCheck){
      location.href = "https://etdev8243.indiatimes.com/"
    }    
  }, [isLogin]);

  return (
    <>
      <TopSectionLayout searchResult={searchResult} isDev={isDev} ssoid={state.ssoid || ssoid}/>
      <MostReadStories MostReadStoriesRes={MostReadStoriesData?.data || []} />          
      <MarketNews data={marketNews?.data || []} title={marketNews?.title || ""} podcastData={marketPodcastData?.data || []} marketExpertViews={marketExpertViews?.data || []} marketMoguls={marketMoguls?.data || []} marketLiveblog={marketLiveblog?.data || []} />
      <MutualFunds data={mutualFunds?.data || []} title={mutualFunds?.title || ""} isDev={isDev} />
      <VideoWidget VideoWidgetData={VideoWidgetData?.data || []} isDev={isDev} />
      <Wealth data={wealth?.data || []} title={wealth?.title || ""} wealthslideshow={wealthslideshow} wealthWebStories={wealthWebStories} />
      <Tech data={tech?.data || []} title={tech?.title || ""} newsLetterData= {techNewsLetters?.data}/>
      <Rise data={rise?.data || []} title={rise?.title || ""} isDev={isDev} popularInSmallBiz={popularInSmallBiz} />
      <CryptocurrencyNews data={cryptocurrencyNews?.data || []} dataTv={cryptoTv?.data || []} dataExpert={cryptoExpert?.data || []} title={cryptocurrencyNews?.title || ""} titleTv={cryptoTv?.title || ""} titleExpert={cryptoExpert?.title || ""} isDev={isDev} />
      <Podcast data={podcast || []}/>
      <Politics data={politics?.data || []} title={politics?.title || ""} />
      <Slideshows data={slideshows?.data || []} title={slideshows?.title || ""} />
      <WebStories data={webStories?.data || []} title={webStories?.title || ""} />
      <Panache data={panache?.data || []} title={panache?.title || ""} panacheVideosSlideshows={panacheVideosSlideshows} />
      <Explainers data={explainers?.data || []} title={explainers?.title || ""} />
      <MoreFromEconomicTimes data={moreFromeEconomicTimes} />
      <style jsx global>{`
        body {
          background: #ffe9e2;
        }
        .secBox {
          padding-top: 1px;
          position: relative;
          border-top: 1px solid #9b8680;
          box-sizing: border-box;
          padding-bottom: 50px;
        }
        a[href*="articleshow"]:visited, a[href*="videoshow"]:visited, a[href*="slideshow"]:visited, a[href*="liveblog"]:visited {
            color: #636363;
        }
        .addToWatchListIcon {
          width: 17px;
          height: 17px;
          background: #0288D1;
          border-radius: 3px;
          display: inline-block;
          color: #fff;
          font-size: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 10px;
          top: 10px;
        }

        @media (max-width: 1260px) {
          .layout1260 {
            padding: 0 20px;
          }

          .isprimeuser .pageHolder {
            width: 1260px;
          }
        }
      `}</style>
    </>
  )
}

export default PrimeHome;