import React, { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import useNewsletterSubscription from 'components/useNewsletterSubscription';

const NewsletterList = ({option, handleChangeEvent, elmTrigger, createRes}) => {
    const [subs, setSubs] = useState(option.subscribed);
    const [isLoading, setIsLoading] = useState(false);
    const { initSubscription, unsubsNews } = useNewsletterSubscription();

    const handleSubscription = (elm, sid, nlName, isSubscribed) => {
        setIsLoading(true);
    
        if (isSubscribed) {
            setSubs(false);

          unsubsNews({ sid: sid, email: "testonboarding@givmail.com" }, function (res) {
            console.log(res);
            if (res.message === 'successfully Unsubscribed') {
                setSubs(false);
              // Update UI accordingly after unsubscribing
              console.log("Successfully unsubscribed.");
              setIsLoading(false);
            }
          });
        } else {
            setSubs(true);
          initSubscription({ sid: sid, email: "testonboarding@givmail.com" }, function (res) {
            console.log(res);
            if (res.message === 'successfully saved.') {
                setSubs(true);
              // Update UI accordingly after subscribing
              console.log("Successfully subscribed.");
              setIsLoading(false);
            }
          });
        }
      };

      useEffect(() => {
        if(elmTrigger){
            const resObj = createRes();
            console.log("resObj--", resObj);
        }
      }, [subs])

    return (
        <div
              className={styles.nl_wrp}
              data-name={option.value}
              data-subs={subs}
              data-select={subs}
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
                <div className={`${styles.nl_sbs_btn} ${subs ? styles.subs : ''}`}>
                  <span onClick={(e) => {handleSubscription(e, option.key, option.value, subs); handleChangeEvent();}}>{subs ? 'SUBSCRIBED' : 'SUBSCRIBE'}</span>
                </div>
              </div>
            </div>
    )
}

export default NewsletterList;
