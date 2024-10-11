import { ET_WAP_URL, ET_WEB_URL } from 'utils/common';
import styles from './styles.module.scss';

const TextImageMiddile = ({data, heading}) => {    
  return (
    <div className={styles.riseMiddle}>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.content}>
            <ul>
                {data?.map((item, index) => (
                    <li key={`politics_${index}`}> 
                        <a data-ga-onclick="Expert Views - 1 - href" target="_blank" href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)} className={styles.imglink}>
                            <img width="100" height="75" alt={item.title} loading="lazy" src={item.img} />
                            {item.type === "slideshow" && <span className={`${styles.subSprite} ${styles.slideIcon}`}></span> }
                        </a>
                        <a target="_blank" href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}>{item.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default TextImageMiddile
