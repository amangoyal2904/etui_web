import React, { useState } from 'react';
import styles from "./styles.module.scss";
import useNewsletterSubscription from 'components/useNewsletterSubscription';

const NewsletterScreen = ({ data, slideIndex, totalSlide, handleContinueBtn, showQues }) => {
  const newsletterList = data.questions[0].options.filter(option => !option.subscribed);
  const [elmTrigger, setElmTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { initSubscription, unsubsNews } = useNewsletterSubscription();


  const handleChangeEvent = (elm) => {
    setElmTrigger(1);
  }

  const handleSubscription = (sid, nlName, isSubscribed) => {
    setIsLoading(true);

    if (isSubscribed) {
      unsubsNews({ sid: sid, email: "testonboarding@givmail.com" }, function (res) {
        console.log(res);
        if (res.message === 'successfully Unsubscribed') {
          // Update UI accordingly after unsubscribing
          console.log("Successfully unsubscribed.");
          setIsLoading(false);
        }
      });
    } else {
      initSubscription({ sid: sid, email: "testonboarding@givmail.com" }, function (res) {
        console.log(res);
        if (res.message === 'successfully saved.') {
          // Update UI accordingly after subscribing
          console.log("Successfully subscribed.");
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <li className={`${styles.surveyScrn} ${showQues == data.questions[0].key ? styles.slideBlock : ''}`} data-scrn={data.templateId} data-ques={data.questions[0].key}>
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
                  <span onClick={(e) => handleSubscription(option.key, option.value, option.subscribed)}>SUBSCRIBE</span>
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
