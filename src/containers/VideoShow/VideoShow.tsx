import { NextPage } from 'next';
import Link from 'next/link';
import styles from './VideoShow.module.scss';
import DfpAds from 'components/Ad/DfpAds';
import SEO from 'components/SEO';
import SocialShare from 'components/Videoshow/SocialShare';
import VideoEmbed from 'components/Videoshow/VideoEmbed';
import VideoListing from 'components/Videoshow/VideoListing';
interface PageProps {
  query: string | string[]
}

const fetchImmediateSubsec = (objSec) => {
  return  objSec.subsecname4 ? objSec.subsecname4 : objSec.subsecname3 ? objSec.subsecname3 : objSec.subsecname2 ? objSec.subsecname2 : objSec.subsecname1 ? objSec.subsecname1 : '';
}

const seoData = {
  lang: 'en',
  title: 'Title VideoShow ',
  url: 'https://economictimes.com/xyz',
  actualURL: '',
  canonical: '',
  type: 'videoshow',
  description: 'Page description',
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
  keywords: '',
  news_keywords: '',
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

const VideoShow: NextPage<PageProps> = ({ query }) => {

  return (
    <div className={styles.header}>
      <div className={styles.videoshow}>
        <section className={styles.pageContent}>
            <h1  className="h1Title">Russia-Ukraine crisis: Ukraine says Russian forces seize Zaporizhzhia nuclear plant</h1>
            <div className={styles.bylineFull}>
                <div className={`${styles.byline} flt`}>
                    Times Now | 
                    <time attr-date-time="04 Mar 2022, 01:34 PM IST"> 04 Mar 2022, 01:34 PM IST</time>
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
                        <SocialShare />
                    </div>
                    <div className={styles.videoEmbedSec}>
                        <VideoEmbed />
                    </div>
                </div>
                <div className={styles.videoListSec}>
                    <VideoListing />
                </div>
            </div>
        </section>
        <aside className={styles.sideBar}>
            right side 
        </aside>
      </div>
      <div className={`${styles.hdAdContainer} adContainer`}>
        <DfpAds adInfo={{ "key": "atf" }} />
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