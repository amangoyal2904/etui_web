import styles from "./styles.module.scss";

const MostPopularNews = (props: { data: any }) => {
  let listingData = props?.data;
  const title = listingData?.title;
  const relatedVideoData = listingData?.data ? listingData?.data : "";

  const relatedVideoHandler = () => {
    let htmlListData: any = [];
    if (relatedVideoData) {
      relatedVideoData?.map((item, index) => {
        let _genHtml = (
          <li key={index} attr-data-position={index}>
            <div className={styles.text}>
              <a href={item.url}>{item.title}</a>
            </div>
            <div className={styles.img}>
              <img src={item.img} width="100" height="75" alt={item.title} title={item.title} />
              <span className={styles.timeFrame}>
                <span>{item.duration}</span>
              </span>
            </div>
          </li>
        );
        return htmlListData.push(_genHtml);
      });
    }
    return htmlListData;
  };
  return (
    <>
      <div className={styles.mostPopularNews}>
        <h4 className={styles.head4}>{title}</h4>
        <ul className={styles.listing}>{relatedVideoHandler()}</ul>
      </div>
    </>
  );
};

export default MostPopularNews;
