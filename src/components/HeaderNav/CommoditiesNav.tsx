import React, { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV } from 'utils';

// Define the interface for the story object returned by the commodity news API
interface CommodityNewsStory {
  msid: number;
  seolocation: string;
  stname: string;
}

// Define the interface for the props passed to CommoditiesNav component
interface CommoditiesNavProps {
  sec: {
    nm: string;
    link: string;
    sec?: {
      nm: string;
      link: string;
    }[]
  }[];
}

const CommoditiesNav: React.FC<CommoditiesNavProps> = ({ sec }) => {
  const [viewsCommoditiesData, setViewsCommoditiesData] = useState<CommodityNewsStory[]>([]);
  const [newsCommoditiesData, setNewsCommoditiesData] = useState<CommodityNewsStory[]>([]);

  useEffect(() => {
    document.addEventListener('mousemove', handleHoverEvent);
    return () => {
      document.removeEventListener('mousemove', handleHoverEvent);
    };
  }, []);

  const commodityNewsApi = (listcount: number, msid: number) => {
    const url = APIS_CONFIG.commodityNews[APP_ENV];
    Service.get({
      url,
      params: { feedtype: "etjson", listcount, msid }
    })
    .then((res) => {
      if(msid == 50991765){
        const viewDataArr: CommodityNewsStory[] = [];
        res?.data?.story && viewDataArr.push(res?.data?.story);
        setViewsCommoditiesData(viewDataArr);
      } 
      msid == 50991753 && setNewsCommoditiesData(res.data);
    })
    .catch((err) => {
      console.error(`Error in commodityNewsApi: ${err}`);
    });
  }
  
  const handleHoverEvent = () => {
    document.removeEventListener('mousemove', handleHoverEvent);
    commodityNewsApi(1, 50991765);
    commodityNewsApi(5, 50991753);
  }

  return (
    <div className={`${styles.miniMenu} ${styles.comnav}`}>
      <div className={`${styles.flt} ${styles.com_box}`}>
        {
          sec.slice(0, 2).map((l1, index1) => {
            return (
              <React.Fragment key={`commodities_nav_f_${index1}`}>
                <a href={l1.link} data-ga-onclick={l1.link} className={styles.subsec1}>
                  {l1.nm}
                </a>
                {viewsCommoditiesData && l1.nm == "Views" && <div className={styles.cn_list1}> 
                  {
                    viewsCommoditiesData.map((story, index) => {
                      return (
                        <div key={`viewsCommoditiesData-${story.msid}-${index}`} className={styles.commodity_news}>
                          <a href={`/${story.seolocation}/articleshow/${story.msid}.cms`}>
                            <img height="60" width="60" src={`https://img.etimg.com/thumb/msid-${story.msid},width-60,height-60/${story.seolocation}.jpg`} alt={story.stname} />
                          </a>
                          <a href={`/${story.seolocation}/articleshow/${story.msid}.cms`}>{story.stname}</a>
                        </div> 
                      )
                    })
                  }
                </div>
                }
                {newsCommoditiesData && l1.nm == "News" && <div className={styles.cn_list2}> 
                  {
                    newsCommoditiesData.map((story, index) => {
                      return (
                        <React.Fragment key={`newsCommoditiesData-${story.msid}-${index}`}>
                          <div className={styles.commodity_news}>
                            <a href={`/${story.seolocation}/articleshow/${story.msid}.cms`}>{story.stname}</a>
                          </div> 
                        </React.Fragment>
                      )
                    })
                  }
                </div>
                }
              </React.Fragment>
            )
          })
        }
      </div>
      <div className={`${styles.flt} ${styles.com_box}`}>
        {
          sec.slice(2, 4).map((l1, index1) => {
            return (
              <React.Fragment key={`commodities_nav_s_${index1}`}>
                <a href={l1.link} data-ga-onclick={l1.link} className={styles.subsec1}>
                  {l1.nm}
                </a>
                {
                    l1?.sec.map((l2, index2) => {
                      return (
                        <React.Fragment key={`commodities_nav_s_l2_${index1}_${index2}`}>
                          <a href={l2.link} data-ga-onclick={l2.link} className={styles.subsec2}>
                            {l2.nm}
                          </a>
                        </React.Fragment>
                      )
                    })
                  }
              </React.Fragment>
            )
          })
        }
      </div>
      <div className={`${styles.flt} ${styles.com_box}`}>
        {
          sec.slice(4).map((l1, index1) => {
            return (
              <React.Fragment key={`commodities_nav_t_${index1}`}>
                <a href={l1.link} data-ga-onclick={l1.link} className={styles.subsec1}>
                  {l1.nm}
                </a>
                {
                    l1?.sec.map((l2, index2) => {
                      return (
                        <React.Fragment key={`commodities_nav_t_l2_${index1}_${index2}`}>
                          <a href={l2.link} data-ga-onclick={l2.link} className={styles.subsec2}>
                            {l2.nm}
                          </a>
                        </React.Fragment>
                      )
                    })
                  }
              </React.Fragment>
            )
          })
        }
      </div>
    </div>
  );
};

export default CommoditiesNav;