import React, { useState } from 'react';
import styles from "./styles.module.scss";
import NewsletterList from './NewsletterList';

const NewsletterScreen = ({ data, slideIndex, totalSlide, handleContinueBtn, showQues, createRes }) => {
  const newsletterList = data.questions[0].options.filter(option => !option.subscribed);
  const [elmTrigger, setElmTrigger] = useState(0);

  const handleChangeEvent = (elm) => {
    setElmTrigger(1);
  }

  return (
    <li className={`${styles.surveyScrn} ${elmTrigger ==1 ? 'val_update' : ''} ${showQues == data.questions[0].key ? styles.slideBlock : ''}`} data-scrn={data.templateId} data-ques={data.questions[0].key}>
      <div className="screen">
        <div className={styles.headTitle}>{data.boldTitle}</div>
        <div className={styles.headDes}>{data.desc}</div>
        <div className={styles.newsletter_scrn}>
          {newsletterList.map((option, index) => (
            <NewsletterList option={option} handleChangeEvent={handleChangeEvent} elmTrigger={elmTrigger} createRes={createRes} />
          ))}
        </div>
        <div className={styles.btnBox}>
          <button className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen={data.key} onClick={() => {handleContinueBtn(slideIndex); setElmTrigger(0);}}>{slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}</button>
        </div>
      </div>
    </li>
  );
};

export default NewsletterScreen;
