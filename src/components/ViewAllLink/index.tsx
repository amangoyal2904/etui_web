"use client";
import Link from "next/link";
import styles from "./ViewAll.module.scss";

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
        <span className={`eticon_caret_right ${styles.arr}`}></span>
      </a>
    </div>
  );
};
export default ViewAllLink;
