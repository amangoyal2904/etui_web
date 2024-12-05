import styles from "./style.module.scss";
const UnivRankSlider = ({data}:any) => {
  return (
    <div className={styles.univSlideMain}>
        <h3 className={styles.slideTitle}>{data?.title}</h3>
        <ul className={styles.slideList}>
          {data?.children.map((country:any, index:any) =>{
            return(
            <li key={`country_${index}`}>
              <span className={styles.countryTitle}>{country.title}</span>
              <img src={`https://img.etimg.com/thumb/width-30,height-20,imgsize-${country.thumbsize},msid-${country.msid}.jpg`} alt={country.title} loading="lazy" />
            </li>
            )
          })}
          
        </ul>
    </div>
  );
};

export default UnivRankSlider;
