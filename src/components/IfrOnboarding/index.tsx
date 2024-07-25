'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./styles.module.scss";
import { useStateContext } from "../../store/StateContext";
import { delete_cookie, getCookie, setCookieToSpecificTime } from 'utils';

const IfrOnboarding = () => {
  const [showIframe, setShowIframe] = useState(false);
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const onboardTimerRef = useRef<any>(null);

  const handleOnboardVisibility = (secondsOpenDialog) => {
    onboardTimerRef.current = setTimeout(() => {
      console.log('Timeout executed!');
      setShowIframe(true);
      setCookieToSpecificTime('onboardShown', true, 1, 0, 0, "");
    }, secondsOpenDialog * 1000);
  };

  const fetchQuestionnaire = async () => {
    const serviceUrl = 'https://etonboard-stg.economictimes.indiatimes.com/etonboard/api/v2/fetchQuestionnaire.json';
    const params = new URLSearchParams({
      isPaidUser: 'true',
      email: "testonboarding@givmail.com",
      isEdit: 'false'
    });

    try {
      const response = await fetch(`${serviceUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': "ad7qnu3xtwikuv358ln9pftex",
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const { questionnaireDto } = data;
      const { noShow, secondsOpenDialog, status } = questionnaireDto || {};

      const displayFrame = !noShow && status !== 'Complete';

      setCookieToSpecificTime("isprimeuser", isPrime, 30, 0, 0, "");
      if (getCookie("showOnboard") === undefined) {
        setCookieToSpecificTime('showOnboard', displayFrame ? '1' : '0', 1, 0, 0, "");
      }
      setCookieToSpecificTime('secondsToOpen', secondsOpenDialog, 1, 0, 0, "");

      if (displayFrame) {
        handleOnboardVisibility(secondsOpenDialog);
      }
    } catch (error) {
      console.error('Error fetching the questionnaire:', error);
    }
  };

  const checkOnboard = () => {
    if (onboardTimerRef.current) {
      clearTimeout(onboardTimerRef.current);
    }

    const showOnboard = getCookie("showOnboard");
    const onboardShown = getCookie("onboardShown");
    const secondsToOpen = getCookie('secondsToOpen');

    if (onboardShown) {
      setShowIframe(false);
      return;
    }

    if (isLogin && isPrime && !onboardShown) {
      if (showOnboard === '1') {
        handleOnboardVisibility(secondsToOpen);
      } else if (showOnboard === undefined) {
        fetchQuestionnaire();
      }
    } else if (!isLogin) {
      delete_cookie("showOnboard");
      delete_cookie("onboardShown");
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'removeIframe') {
        setShowIframe(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    checkOnboard();
  }, [isLogin, isPrime]);

  return (
    <>
      {showIframe && (
        <div id="onboardFrameContainer" className={styles.onboardContainer}>
          <iframe
            id="ifr_onboarding"
            className={styles.onboardFrame}
            src="https://etdev8243.indiatimes.com/onboarding.cms?obd_ifrm=1"
          />
        </div>
      )}
    </>
  );
};

export default IfrOnboarding;
