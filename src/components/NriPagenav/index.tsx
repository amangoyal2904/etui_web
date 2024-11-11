import React from 'react'
import styles from "./styles.module.scss";

const NriPagenav = () => {
  return (
    <div className={styles.nrinav}>
      <ul>
        <li className={`${styles.active} ${styles.first}`}>
          <a href="#usa">USA</a>
        </li>
        <li><a href="#canada">Canada</a></li>
        <li><a href="#uk">United Kingdom</a></li>
        <li><a href="#australia">Australia</a></li>
        <li><a href="#rankings">University Rankings</a></li>
        <li><a href="#articles">Articles</a></li>
        <li className={styles.last}>
          <a href="#faq">FAQ</a>
        </li>
      </ul>
    </div>
  )
}

export default NriPagenav
