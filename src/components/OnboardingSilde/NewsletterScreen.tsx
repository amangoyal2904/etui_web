import React from 'react';
import styles from "./styles.module.scss";

const NewsletterScreen = ({ data, slideIndex, totalSlide, handleContinueBtn }) => {
  const newsletterList = data.questions[0].options.filter(option => !option.subscribed);

  return (
    <li className={`${styles.surveyScrn} ${slideIndex == 0 ? styles.slideBlock : ''}`} data-scrn={data.templateId} data-ques={data.questions[0].key}>
      <div className="screen">
        <div className={styles.headTitle}>{data.boldTitle}</div>
        <div className={styles.headDes}>{data.desc}</div>
        <div className={styles.newsletter_scrn}>
          {newsletterList.map((option, index) => (
            <div
              className={styles.nl_wrp}
              data-name={option.value}
              data-subs={option.subscribed}
              data-select={option.selected}
              data-desc={option.desc}
              data-id={option.key}
              data-img={option.imageUrl}
              key={option.key}
            >
              <div className={styles.nl_icon}>
                <img width="65" height="65" src={option.imageUrl} alt={option.value} />
              </div>
              <div className={styles.nl_ctn}>
                <div className={styles.nl_nm}>{option.value}</div>
                <p className={styles.nl_desc}>{option.desc}</p>
                <div className={`${styles.nl_sbs_btn} ${option.subscribed ? styles.subs : ''}`}>
                  <span>SUBSCRIBE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.btnBox}>
          <button className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen={data.key} onClick={() => handleContinueBtn(slideIndex)}>{slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}</button>
        </div>
      </div>
    </li>
  );
};

export default NewsletterScreen;
