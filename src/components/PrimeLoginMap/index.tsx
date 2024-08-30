"use client";

import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import jStorage from "jstorage-react";
import { useStateContext } from "../../store/StateContext";
import {
    initSSOWidget,
    logout
  } from "../../utils";

const PrimeLoginMap = (onClose) => {
    const { state, dispatch } = useStateContext();
    const { isLogin, userInfo, ssoReady, isPrime, ssoid, email, isPink } = state.login;
    const [primeUserData, setPrimeUserData] = useState<any>({});
    const [primeSavedEmail, setPrimeSavedEmail] = useState("");
    const [isElegible, setIsElegible] = useState(false);

    const checkElegibility = (flag) => {
        const primeData = JSON.parse(jStorage.get('primeUserLoginMap') || localStorage.getItem('primeUserLoginMap'));
        console.log("popupContent --- checkElegibility -- primeData" , primeData)
        if (!primeData) return false;
        
        setPrimeUserData(primeData);
        const isSameDay = new Date(primeData.lastClosedNudgeDate).getDate() === new Date().getDate();
        const isOverlayExist = document.querySelector('.bottomNudgePopUp') !== null;

        const skipPopup = window.objVc.skipPopup === 1;
        if (flag === 'launch' && primeData.count_web && !isSameDay && !isOverlayExist && !skipPopup) {
            return true;
        }
        return false;
    };

    const appendDialog = () => {
      console.log("popupContent - appendDialog - ", primeUserData)
        if (primeUserData.loginId) {
            setIsElegible(true);
            primeUserData.lastClosedNudgeDate = Date.now();
            setData()
            const primeId = primeUserData.loginId;
            const isEmailId = primeId.includes('@');
            const maskedID = isEmailId ? maskEmail(primeId) : maskPhoneNumber(primeId);
            setPrimeSavedEmail(maskedID);
        }
    };

    const closeDialog = () => {
        primeUserData.count_web -= 1;
        setData();
        setIsElegible(false);
        const event = new Event('nextPopup');
        window.dispatchEvent(event);
    };

    const signIn = () => {
        document.body.classList.remove('noScroll');
        jStorage.set('userlogin_galabel', 'Relogin_popup_on_launch');
        if (isLogin) {
            logout();
        } else {
            initSSOWidget();
        }
    };

    const setData = () => {
        jStorage.set('primeUserLoginMap', JSON.stringify(primeUserData));
    };

    const maskEmail = (email) => {
        const atIndex = email.indexOf('@');
        if (atIndex > 6) {
            return email.substring(0, 3) + '***' + email.substring(atIndex - 3);
        } else if (atIndex === 6 || atIndex === 5) {
            return email.substring(0, 2) + '**' + email.substring(atIndex - 2);
        } else {
            return email;
        }
    };

    const maskPhoneNumber = (phoneNumber) => {
        return phoneNumber.substr(phoneNumber.length - 10, 10).replace(/^(\d{6})(\d+)/, '******$2');
    };

    useEffect(() => {
      console.log("popmanage -- PrimeLoginMap", )
        if(isPrime !== null){
          console.log("popupContent --- checkElegibility" , isPrime, (!isPrime && checkElegibility('launch')))
          if (!isPrime && checkElegibility('launch')) {
            appendDialog();
          }else{
            const event = new Event('nextPopup');
            window.dispatchEvent(event);
          }
        }
    }, [isPrime, primeUserData]);

    return (
        <>
            {console.log("popupContent --- isElegible", isElegible)}
          {isElegible && (
            <>
              <div className={styles.BgLayer} onClick={() => closeDialog()} />
              <div className={styles.BottomNudgePopUp}>
                <div className={styles.BottomNudgePopUpContent}>
                  <span className={styles.CloseIcon} onClick={() => closeDialog()}>
                    <img src="https://img.etimg.com/photo/msid-102770784,quality-100/close.jpg" width="75" alt="Close" />
                  </span>
                  <div className={styles.HeaderText}>Prime Account Detected!</div>
                  <div className={styles.HeaderText2}>It seems like you're already an ETPrime member with</div>
                  <div className={styles.PrimeSavedEmail}>{primeSavedEmail}</div>
                  <div className={styles.ContentBox}>
                    <div className={`${isLogin ? 'loggedIn' : 'nonLoggedIn'}`}>
                      {isLogin ? <>
                        <p>Log out of your current logged-in account</p>
                        <strong className="currEmail">{email}</strong>
                        <p>and log in again using your ET Prime credentials to enjoy all member benefits.</p>
                      </> : <>
                      Login using your ET Prime credentials to enjoy all member benefits 
                      </>}
                    </div>
                  </div>
                  <div className={styles.SigninCta} onClick={signIn}>Sign in & Access ET Prime</div>
                </div>
              </div>
            </>
          )}
        </>
      );
}

export default PrimeLoginMap;