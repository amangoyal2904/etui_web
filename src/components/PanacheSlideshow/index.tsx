import MoreFromLink from 'containers/PrimeHome/MoreFromLink'
import styles from './styles.module.scss';
import { ET_WAP_URL, ET_WEB_URL } from "../../utils/common";

const PanacheSlideshow = ({data, heading}) => {
  return (
    <div className={styles.psec_r_box}>
        <h4>Videos &amp; Slideshows</h4>
                <ul>
                    {data?.data?.map((item, index) => (
                        <li className={styles.listItem} key={`politics_${index}`}> 
                            <a target="_blank" className={styles.ancher} href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}>
                                <img width="250" height="160" alt={item.title} loading="lazy" src={item.img} />
                                <span className={`${styles.subSprite} ${styles.slideIcon}`}></span>
                            </a>
                            <a target="_blank" href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}>
                                <p className={styles.title}>{item.title}</p>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className={`${styles.moreNews}`}>
                    <span>More <a target="_blank" href={`${ET_WEB_URL}/et-now`}>Videos</a> & <a target="_blank" href={`${ET_WEB_URL}/multimedia`}>Slideshows »</a></span>
                </div>
        </div>
  )
}

export default PanacheSlideshow
