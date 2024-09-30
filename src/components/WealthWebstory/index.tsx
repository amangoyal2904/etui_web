import MoreFromLink from 'containers/PrimeHome/MoreFromLink'
import styles from './styles.module.scss';

const WealthWebstory = ({data, heading}) => {
  return (
    <div className={styles.wealth_ws}>
        <div className={styles.pd_txt}>Web Stories</div>
        <div className={styles.overh}>
            <div className={styles.sliderWidget}>
                <ul className={styles.slider_ul}>
                    {data?.map((item, index) => (
                        <li className={styles.listItem} key={`politics_${index}`}> 
                            <a target="_blank" href={item.url} className={styles.ancher}>
                                <img width="250" height="444" alt={item.title} loading="lazy" src={item.img} />
                                <p className={styles.title}>
                                    <span className={`${styles.subSprite} ${styles.webStIcon}`}></span>
                                    {item.title}
                                </p>
                            </a>
                            
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.nextprevBtn}>
                <i className={`${styles.subSprite} ${styles.prevbtn} ${styles.btn} ${styles.disable}`} title="Button Prev"></i>
                <i className={`${styles.subSprite} ${styles.nextbtn} ${styles.btn} ${styles.flr}`} title="Button Next"></i>
            </div>
        </div>
    </div>
  )
}

export default WealthWebstory
