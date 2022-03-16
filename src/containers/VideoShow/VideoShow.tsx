import { NextPage } from 'next';
import Link from 'next/link';
import styles from './VideoShow.module.scss';
import DfpAds from 'components/Ad/DfpAds';
import SEO from 'components/SEO';
import SocialShare from 'components/Videoshow/SocialShare';
import VideoEmbed from 'components/Videoshow/VideoEmbed';
import VideoListing from 'components/VideoListing';
import ReadMore from 'components/ReadMore';;
import MostViewVideos from 'components/MostViewVideos';
import MostPopularNews from 'components/MostPopularNews';
import {mailSendProps} from './types';

interface PageProps {
  query: string | string[]
}

const fetchImmediateSubsec = (objSec) => {
  return  objSec.subsecname4 ? objSec.subsecname4 : objSec.subsecname3 ? objSec.subsecname3 : objSec.subsecname2 ? objSec.subsecname2 : objSec.subsecname1 ? objSec.subsecname1 : '';
}


interface Props {
  apiData: any,
  query:any
}
const VideoShow = (props:Props ) => {
  const _data = props && props.apiData &&  props.apiData.searchResult ?  props.apiData.searchResult : '';
  const videoData =  _data 
  //console.log('______Videos Show Tsx file Props___videoData', videoData)
  const pageHead = videoData[0].data[0].title;
  const pageTime = videoData[0].data[0].dtline;
  const pageAgency = videoData[0].data[0].ag;
  let readMoreText = videoData[0].data[0].relKeywords;
  const iframeData = videoData[0].data[0].embedFrame;
  const relatedVideo = videoData[1];
  const _mostViewedVideos = videoData[2];
  const _mostPopularNews = videoData[3];
  const _seoData =  videoData[4].data;
  //console.log('_seoData', _seoData)
  const seoData = {
    lang: _seoData.lang,
    title: _seoData.title ? _seoData.title : 'Title VideoShow ',
    url: 'https://economictimes.com/xyz',
    actualURL: _seoData.actualURL ?  _seoData.actualURL : '' ,
    canonical: _seoData.canonical ?  _seoData.canonical :'',
    type: 'videoshow',
    description: _seoData.description ?  _seoData.description : 'Page description',
    image: 'https://img.etimg.com/thumb/msid-89883381,width-300,imgsize-48776,,resizemode-4,quality-100/nutella.jpg',
    inLanguage: 'en',
    authors: [],
    agency: [],
    date: '27 Feb, 2022',
    updated: '27 Feb, 2022 09:40',
    story: 'story excerpt goes here',
    remove_paywall_schema: 0,
    behindLogin: 0,
    hostid: 317,
    langInfo: [],
    ampURL: '',
    keywords: _seoData.keywords ?  _seoData.keywords :'',
    news_keywords: _seoData.news_keywords ?  _seoData.news_keywords :'',
    noindex: 1,
    noindexFollow: 0,
    expiry: '',
    sponsored: 0,
    maxImgPreview: 0,
    isPrime: 1,
    schemaType: 'videoshow',
    subsecnames: {
      "subsec1": 13352306,
      "subsecname1": "Industry",
      "subsec2": 13353990,
      "subsecname2": "Transportation",
      "subsec3": 13354027,
      "subsecname3": "Airlines / Aviation"
    },
    seoschema: {},
    articleSection: "Airlines / Aviation", //fetchImmediateSubsec(seoData.subsecnames),
  };
  const _mailData:mailSendProps = {
    url:_seoData.actualURL ?  _seoData.actualURL : '',
    msid:_seoData.msid ?  _seoData.msid : '',
    articlelink:`${_seoData.actualURL}?frm=mailtofriend&intenttarget=no`,
    syn:_seoData.description ?  _seoData.description : 'Page description',
    pageTitle:_seoData.title ? _seoData.title : 'Title VideoShow ',
    subject:`Economictimes.com: ${_seoData.title}`
  }
  return (
    <div className={styles.header}>
      <div className={styles.videoshow}>
        <section className={styles.pageContent}>
        <h1  className="h1Title">{pageHead}</h1>
            <div className={styles.bylineFull}>
                <div className={`${styles.byline} flt`}>
                    {pageAgency} | 
                  <time> {pageTime}</time>
                </div>
                <div className={styles.cmtLinks}>
                    <a data-track="newPostComment" className={styles.postComment}>Post a Comment</a>
                </div>
                <div className={styles.videoBookmark}>
                    <a data-msid="89989081" data-arttype="5" title="Bookmark this Video" className={styles.bookmarkIcon} ></a>
                </div>
                <div className="clr"></div>
                <div className={styles.videoWrap}>
                    <div className={styles.videoShareSec}>
                        <SocialShare mailData={_mailData} />
                    </div>
                    <div className={styles.videoEmbedSec}>
                        <VideoEmbed iframeData={iframeData} />
                    </div>
                    <div className={styles.videoDesc}>
                    Apple on Tuesday unveiled a new version of its budget-priced iPhone that's capable of connecting to ultrafast 5G wireless networks, an upgrade that's already been available on the company's upscale models for more than a year. The latest iPhone SE marks the first upgrade to the bare-bones version of Apple's most popular product in nearly two years.
                    </div>
                    <ReadMore readMoreText={readMoreText}/>
                </div>
                <div className={`${styles.hdAdContainer} adContainer`}>
                  <DfpAds adInfo={{ "key": "atf" }} />
                </div>
                <div className={styles.videoListSec}>
                    <VideoListing relatedVideo={relatedVideo}/>
                </div>
            </div>
        </section>
        <aside className={styles.sideBar}>
            <MostViewVideos viewVideos={_mostViewedVideos} />
            <MostPopularNews viewVideos={_mostPopularNews}/>
        </aside>
      </div>
      
      <div>
        <Link href="/">
          <a>
            Back Home
          </a>
        </Link>
      </div>
      <SEO data={seoData} page="videoshow"/>
    </div>
  )
}

export default VideoShow;