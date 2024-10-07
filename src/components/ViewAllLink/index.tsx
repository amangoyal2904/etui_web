"use client";
import styles from "./ViewAll.module.scss";
import RightArrow from 'components/Icons/RightArrow'

const ViewAllLink = (props: any) => {
  const { text, link } = props || {};
  return (
    <div className={styles.moreWrap}>
      <a
        className={styles.more}
        href={link}
        target="_blank"
      >
        {text}
        <RightArrow />
      </a>
    </div>
  );
};
export default ViewAllLink;
