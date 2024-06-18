import { NextPage } from "next";
import Link from "next/link"
import styles from './styles.module.scss'
import {urlValidation} from '../../utils/utils';

const MostViewVideos: NextPage<any> = (props) => {  
    let listingData = props.data;
    //console.log('__MostViewViedeos components__', listingData);
    const title = listingData.title;
    const relatedVideoData = listingData.data ? listingData.data : '';
    const relatedVideoHandler = ()=>{
      let htmlListData = []
      if(relatedVideoData){
        relatedVideoData.map((item, index)=>{
          let _urlVal = urlValidation(item.url)
          let _genHtml = <li key={index}>
            <div className={styles.text}>
              <a href={_urlVal}>{item.title}</a>
            </div>
            <div className={styles.img}>
              <a href={_urlVal}>
                <img src={item.img} width="80" height="60" alt={item.title} title={item.title}/>
              </a>
              <span className={styles.timeFrame}>{item.duration}</span>
            </div>
          </li>
          return htmlListData.push(_genHtml)
        })
      }
      return htmlListData;
    }
    return (
      <>      
          <div className={styles.mostViewVideoList}>
              <h4 className={styles.head4}>{title}</h4>
              <ul className={styles.listing}>{relatedVideoHandler()}</ul>
          </div>
      </>
    );
  };
  
  export default MostViewVideos;