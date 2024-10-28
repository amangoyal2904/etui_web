import { ET_WAP_URL, ET_WEB_URL } from 'utils/common';
import styles from './styles.module.scss';
import RenderText from 'components/RenderText';

const TextImageMiddile = ({data, heading, widget}) => {    
  return (
    <div className={styles.riseMiddle}>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.content}>
            <ul>
                {data?.map((item, index) => (
                    <li key={`politics_${index}`}> 
                        <a 
                            target="_blank" 
                            href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)} 
                            className={styles.imglink}
                            data-ga-onclick={`Subscriber Homepage#${widget} widget click#${index+1} - href`}
                        >
                            <img width="100" height="75" alt={item.title} loading="lazy" src={item.img} />
                            {item.type === "slideshow" && <span className={`${styles.subSprite} ${styles.slideIcon}`}></span> }
                        </a>
                        <a target="_blank" href={item?.url?.replace(ET_WAP_URL, ET_WEB_URL)}  data-ga-onclick={`Subscriber Homepage#${widget} widget click#${index+1} - href`}>
                            <RenderText text={item.title} />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default TextImageMiddile
