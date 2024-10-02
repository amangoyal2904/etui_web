import MoreFromLink from 'containers/PrimeHome/MoreFromLink'
import styles from './styles.module.scss';

const PanacheSlideshow = ({data, heading}) => {
  return (
    <div className={styles.psec_r_box}>
        <h4>Videos &amp; Slideshows</h4>
                <ul>
                    {data?.map((item, index) => (
                        <li className={styles.listItem} key={`politics_${index}`}> 
                            <a target="_blank" href={item.url} className={styles.ancher}>
                                <img width="250" height="160" alt={item.title} loading="lazy" src={item.img} />
                                <span className={`${styles.subSprite} ${styles.slideIcon}`}></span>
                            </a>
                            <a target="_blank" href={item.url}>
                                <p className={styles.title}>{item.title}</p>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="moreNews tar">
                    <span>More <a target="_blank" href="/et-now">Videos</a> and <a target="_blank" href="/multimedia">Slideshows</a></span>»</div>
        </div>
  )
}

export default PanacheSlideshow
