import React from "react";
import styles from "./style.module.scss";
import UnivRankSlider from "./UnivRankSlider";

const NriUnivRanking = () => {
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  return (
    <div className={styles.univRankMain}>
      <h2 className={styles.title}>University Rankings</h2>
      <UnivRankSlider slides={SLIDES} />
    </div>
  );
};

export default NriUnivRanking;
