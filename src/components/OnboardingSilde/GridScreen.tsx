import React, { useState } from 'react';
import styles from "./styles.module.scss";

const GridScreen = ({ data, slideIndex, totalSlide, handleContinueBtn, showQues }) => {
  const gridData = data.questions[0].options;
  const [elmTrigger, setElmTrigger] = useState(0);

  const handleChangeEvent = (elm) => {
    setElmTrigger(1);
  }

  return (
    <li data-scrn="grid_type" data-ques={data.questions[0].key} className={`${styles.surveyScrn} ${elmTrigger ==1 ? 'val_update' : ''} ${showQues == data.questions[0].key ? styles.slideBlock : ''} `}>
      <div className="screen 3">
        <div className={styles.headTitle}>{data.boldTitle}</div>
        <div className={styles.headDes}>{data.desc}</div>
        <div className={gridData[0].iconUrl ? styles.inputBox : styles.screen4}>
          {gridData.map((option, index) => {
            const checkedVal = !!option.selected ? true : false;
            const innerCls = option.iconUrl
              ? option.selected ? `${styles.checkedActive} ${styles.catBox}` : `${styles.catBox}`
              : option.selected ? `${styles.bg_white} ${styles.topBox}` : `${styles.topBox}`;
            const boxHtml = option.iconUrl ? (
              <React.Fragment>
                <div className={styles.ovel}>
                  <img height="45" src={option.iconUrl} loading="lazy" />
                </div>
                <div className={styles.chkText}>
                  <h4>{option.name}</h4>
                  <p>{option.desc}</p>
                </div>
              </React.Fragment>
            ) : (
              <div className={styles.chkText}>{option.name}</div>
            );

            return (
              <div className={innerCls + ' clearfix'} key={option.key}>
                <label className={styles.container} htmlFor={option.key}>
                  <input
                    data-desc={option.desc}
                    data-iconurl={option.iconUrl}
                    data-imageurl={option.imageUrl}
                    data-key={option.key}
                    data-name={option.name}
                    type="checkbox"
                    // checked={checkedVal} // Ensure boolean value
                    value={option.name}
                    name={option.key}
                    id={option.key}
                    onChange={(e) => handleChangeEvent(e)}
                  />
                  <span className={styles.checkmark}></span>
                  {boxHtml}
                </label>
              </div>
            );
          })}
        </div>
        <div className={styles.btnBox}>
          <button className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen="3" onClick={() => {handleContinueBtn(slideIndex); setElmTrigger(0);}}>{slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}</button>
        </div>
      </div>
    </li>
  );
};

export default GridScreen;
