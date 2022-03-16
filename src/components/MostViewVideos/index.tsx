import { NextPage } from "next";
import styles from './styles.module.scss'
import Image from "next/image";

const MostViewVideos: NextPage<any> = (props) => {  
    let listingData = props.viewVideos;
    //console.log('__MostViewViedeos components__', listingData);
    const title = listingData.title;
    const relatedVideoData = listingData.data ? listingData.data : '';
    const relatedVideoHandler = ()=>{
      let htmlListData = []
      if(relatedVideoData){
        relatedVideoData.map((item, index)=>{
          let _genHtml = <li key={index} attr-data-position={index}>
            <div className={styles.text}>
              <a href={item.webUrl}>
                {item.title}
              </a>
            </div>
            <div className={styles.img}>
              <Image src={item.img} width="80" height="60" alt={item.title} title={item.title}/>
                <span className={styles.timeFrame}>
                    <span>{item.duration}</span>
                </span>
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