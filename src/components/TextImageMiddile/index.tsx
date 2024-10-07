import MoreFromLink from 'containers/PrimeHome/MoreFromLink'
import styles from './styles.module.scss';

const TextImageMiddile = ({data, heading}) => {
    // console.log("test", data);
  return (
    <div className={styles.riseMiddle}>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.content}>
            <ul>
                {data?.map((item, index) => (
                    <li key={`politics_${index}`}> 
                        <a data-ga-onclick="Expert Views - 1 - href" target="_blank" href={item.url} className={styles.imglink}>
                            <img width="100" height="75" alt={item.title} loading="lazy" src={item.img} />
                            {item.type === "slideshow" && <span className={`${styles.subSprite} ${styles.slideIcon}`}></span> }
                        </a>
                        <a target="_blank" href={item.url}>{item.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default TextImageMiddile
