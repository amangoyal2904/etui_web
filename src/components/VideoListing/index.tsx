import { NextPage } from "next";
import Link from "next/link"
import styles from './styles.module.scss'
import Image from "next/image";
import {ImageClickHandler, urlValidation} from '../../utils/utils';

const VideoListing: NextPage<any> = (props) => {  
  let listingData = props.relatedVideo;
  //console.log('__VideoListing components__', listingData);
  const title = listingData.title;
  const relatedVideoData = listingData.data ? listingData.data : '';
  const relatedVideoHandler = ()=>{
    let htmlListData = []
    if(relatedVideoData){
      relatedVideoData?.map((item, index)=>{
        let _urlVal = urlValidation(item.url)
        let _genHtml = <li key={index} attr-data-position={index}>
          <div className={styles.img}>
            <Image  onClick={()=>{ImageClickHandler(item.url)}} src={item.img} width="100" height="75" alt={item.title} title={item.title}/>
              <span className={styles.timeFrame}>{item.duration}</span>
          </div>
          <div className={styles.text}>
            
            <Link href={_urlVal}>
                
                  {item.title}
                
            </Link>
              <span className={styles.view}>Views: {item.views}</span>
          </div>
        </li>
        return htmlListData.push(_genHtml)
      })
    }
    return htmlListData;
  }
  return (
    <>      
        <div className={styles.videoList}>
            <h5 className={styles.head5}>{title}</h5>
            <ul className={styles.listing}>{relatedVideoHandler()}</ul>
        </div>
    </>
  );
};

export default VideoListing;
