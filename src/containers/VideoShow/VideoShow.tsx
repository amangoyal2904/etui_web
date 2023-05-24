import styles from "./VideoShow.module.scss";
import { useEffect, Fragment, FC } from "react";
import { useSelector } from "react-redux";
import { PageProps, VideoShowProps, OtherVidsProps } from "types/videoshow";
import { AppState } from "app/store";
import { getPageSpecificDimensions } from "../../utils";
import { ET_WAP_URL } from "../../utils/common";
import PostComments from "../../components/Comments/PostComments";
import PopulateComment from "../../components/Comments/PopulateComment";
import SocialShare from "../../components/Videoshow/SocialShare";

const VideoShow: FC<PageProps> = (props) => {
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;
  const loginState = useSelector((state: AppState) => state.login);
  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
  }, [props]);

  const VideoContainer = () => {
    {
      return props?.searchResult?.map((item) => {
        if (item.name === "videoshow") {
          const result = item.data as VideoShowProps;
          const url = `${result.iframeUrl}&skipad=${loginState.isprimeuser}`;
          return (
            <Fragment key={item.name}>
              <div className={styles.videoshow}>
                {/* <VideoEmbed url={url} /> */}

                <div className={styles.wrap}>
                  <h1 role="heading">{result.title}</h1>
                  <div className={styles.synopsis}>
                    <p>{result.synopsis}</p>
                  </div>
                  <div className={styles.date}>
                    {result.agency} | {result.date}
                  </div>
                </div>
                {/* <SocialShare
                  shareParam={{
                    shareUrl: ET_WAP_URL + result.url,
                    title: result.title,
                    msid: result.msid,
                    hostId: result.hostid,
                    type: "5"
                  }}
                /> */}
                <SocialShare mailData={{
                    shareUrl: ET_WAP_URL + result.url,
                    title: result.title,
                    msid: result.msid,
                    hostId: result.hostid,
                    type: "5"
                }}/>
              </div>
              {/* <SeoWidget data={result.relKeywords} title="READ MORE" /> */}
            </Fragment>
          );
        } else if (item.name === "other_videos" && Array.isArray(item.data)) {
          const otherVids = item as OtherVidsProps;
          // return <Listing type="grid" title={otherVids.title} data={otherVids} key={item.name} />;
        }
      });
    }
  };
  return (
    <>      
      <section className={`${styles.mainContent} col3`}>
        {VideoContainer()}
        {/* <PostComments /> */}
        {/* <PopulateComment msid={msid}/> */}
        {/* <SEO {...seoData} /> */}
        {/* <GreyDivider />
        <AppDownloadWidget tpName="videoshow" />
         */}
      </section>
      <aside className="col1">sidebar</aside>
    </>
  );
};

export default VideoShow;
