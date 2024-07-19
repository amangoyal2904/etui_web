import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { ET_IMG_DOMAIN } from "utils/common";
import { useStateContext } from "../../store/StateContext";

export default function UserProfiling() {
  const { state, dispatch } = useStateContext();
  const { isPrime } = state.login;

  const fetchQuestions = () => {
    const isLive = window.location.host.includes('https://economictimes.indiatimes.com/');
    const url = `https://${isLive ? "etonboard" : "etonboard-stg"}.economictimes.indiatimes.com/etonboard/api/v3/fetchQuestionnaire.json`;

    fetch(`${url}?isPaidUser=${isPrime}&email=&isEdit=true`, {
        method: 'GET',
      })
        .then(res => res.json())
        .then(data => {
          //setCommentsData(data);
        })
        .catch(err => {
          console.log('error: ', err);
        })
  }

  return (
    <>    
        <div className={styles.bgLayerProfile}></div>  
        <div className={styles.profileDetailsBox}>
            <div className={styles.profile_box}>
                <img src={`${ET_IMG_DOMAIN}/photo/105255513.cms`} height="15" width="15" title="close" alt="close" className={styles.dialog_closeicon} />
                <div className={styles.loadingSec}>
                    <div className={styles.newLoading}>
                        <div className="loading" style={{ display: 'block' }}>
                            <div className="loader">
                                <div className="loader__bar"></div>
                                <div className="loader__bar"></div>
                                <div className="loader__bar"></div>
                                <div className="loader__bar"></div>
                                <div className="loader__bar"></div>
                                <div className="loader__ball"></div>
                            </div>
                            <p>Please wait...</p>
                        </div>
                    </div>
                </div>
                <div className={styles.usrProTopWrap}>
                    <div className="dib headWrap">
                        <h2 className="username_box">Hi <span className="jsUserName">User</span>,</h2><h3 className="offer_box">Complete your profile</h3>
                    </div>
                </div>
                
                <div className={styles.dynamicFormBox}>
                    <div className={styles.dynamicForm}></div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <button className="btn flr saveData">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

