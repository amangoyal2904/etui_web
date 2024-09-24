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
import NewsByIndustry from "./NewsByIndustry";
import MostReadStories from './MostReadStories';
import VideoWidget from "./VideoWidget";
import Opinion from "./Opinion";

function PrimeHome({ searchResult }) {  
  const marketNews = searchResult?.find(item => item?.name === "market_news") || {};
  const mutualFunds = searchResult?.find(item => item?.name === "mutual_funds") || {};
  const wealth = searchResult?.find(item => item?.name === "wealth") || {};
  const tech = searchResult?.find(item => item?.name === "tech") || {};
  const rise = searchResult?.find(item => item?.name === "rise") || {};
  const cryptocurrencyNews = searchResult?.find(item => item?.name === "cryptocurrency_news") || {};
  const politics = searchResult?.find(item => item?.name === "politics") || {};
  const slideshows = searchResult?.find(item => item?.name === "slideshows") || {};
  const webStories = searchResult?.find(item => item?.name === "web_stories") || {};
  const panache = searchResult?.find(item => item?.name === "panache") || {};
  const explainers = searchResult?.find(item => item?.name === "explainers") || {};
  const moreFromeEconomicTimes = searchResult?.find(item => item?.name === "more_from_economictimes")?.data || [];
  const podcast = searchResult?.find(item => item?.name === "podcast")?.data || [];
  const NewsByIndustryData = searchResult?.find(item => item?.name === "news_by_industry") || {};
  const MostReadStoriesData = searchResult?.find(item => item?.name === "most_read_stories") || {};
  const VideoWidgetData = searchResult?.find(item => item?.name === "videos") || {};
  const OpinionData = searchResult?.find(item => item?.name === "opinion") || {};
  // console.log("explainers", explainers);

  return (
    <>
      <TopSectionLayout searchResult={searchResult} />
      <NewsByIndustry data={NewsByIndustryData?.data || []} title={NewsByIndustryData?.title || ''} />
      <MostReadStories MostReadStoriesRes={MostReadStoriesData?.data || []} />
      <VideoWidget VideoWidgetData={VideoWidgetData?.data || []} />
      <Opinion OpinionData={OpinionData?.data || []} />
      <MarketNews data={marketNews?.data || []} title={marketNews?.title || ""} />
      <MutualFunds data={mutualFunds?.data || []} title={mutualFunds?.title || ""} />
      <Wealth data={wealth?.data || []} title={wealth?.title || ""} />
      <Tech data={tech?.data || []} title={tech?.title || ""} />
      <Rise data={rise?.data || []} title={rise?.title || ""} />
      <CryptocurrencyNews data={cryptocurrencyNews?.data || []} title={cryptocurrencyNews?.title || ""} />
      <Podcast data={podcast || []}/>
      <Politics data={politics?.data || []} title={politics?.title || ""} />
      <Slideshows data={slideshows?.data || []} title={slideshows?.title || ""} />
      <WebStories data={webStories?.data || []} title={webStories?.title || ""} />
      <Panache data={panache?.data || []} title={panache?.title || ""} />
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
      `}</style>
    </>
  )
}

export default PrimeHome;