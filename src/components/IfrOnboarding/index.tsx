'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./styles.module.scss";
import { useStateContext } from "../../store/StateContext";
import { delete_cookie, getCookie, setCookieToSpecificTime, APP_ENV } from 'utils';
import APIS_CONFIG from "../../network/config.json";

const IfrOnboarding = (onClose) => {
  const [showIframe, setShowIframe] = useState(false);
  //const [onboardApiHit, setOnboardApiHit] = useState(false);
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, ssoid, email, isPink } = state.login;
  const onboardTimerRef = useRef<any>(null);
  let onboardApiHit = false;

  const handleOnboardvisibility = (secondsOpenDialog) => {
    onboardTimerRef.current = setTimeout(() => {
      console.log('Timeout executed!');
      // Your timeout logic here
      console.log("popupContent --- handleOnboardvisibility" , showIframe)
      setShowIframe(true);
      setCookieToSpecificTime('onboardShown', true,  1, 0, 0, "")
    }, secondsOpenDialog * 1000);
  }

  const fetchHit = async () => {
    let serviceUrl = APIS_CONFIG["FetchQuestionnaire"][APP_ENV]; //'https://etonboard-stg.economictimes.indiatimes.com/etonboard/api/v2/fetchQuestionnaire.json';

    // Parameters to be sent with the GET request
    const params = new URLSearchParams({
        isPaidUser: 'true',
        email: email,
        isEdit: 'false'
    });

    try {
        // Fetching the questionnaire data
        const fetchQues = await fetch(`${serviceUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': ssoid,
                'Content-Type': 'application/json'
            }
        });

        // Checking if the response is OK (status code 200-299)
        if (!fetchQues.ok) {
            throw new Error(`HTTP error! Status: ${fetchQues.status}`);
        }

        // Parsing the response to JSON
        const jsonFetchQues = await fetchQues.json();

        let questionnaireDto = jsonFetchQues && jsonFetchQues.questionnaireDto;
        let noShow = questionnaireDto && questionnaireDto.noShow;
        let secondsOpenDialog = questionnaireDto && questionnaireDto.secondsOpenDialog;
        let status = questionnaireDto && questionnaireDto.status;
        let displayFrame = !noShow && (status != 'Complete');

        setCookieToSpecificTime("isprimeuser", isPrime, 30, 0, 0, "");

        getCookie("showOnboard") == undefined && setCookieToSpecificTime('showOnboard', displayFrame ? '1' : '0', 1, 0, 0, "")
        setCookieToSpecificTime('secondsToOpen', secondsOpenDialog, 1, 0, 0, "");

        if(displayFrame){
          handleOnboardvisibility(secondsOpenDialog);
        }else{
          const event = new Event('nextPopup');
          window.dispatchEvent(event);
        }
        console.log("popupContent --- fetchHit" , displayFrame)
        onboardApiHit = false;
        //setOnboardApiHit(false);
    } catch (error) {
        return {};
        const event = new Event('nextPopup');
        window.dispatchEvent(event);
        // Logging any error that occurs during the fetch process
        console.error('Error fetching the questionnaire:', error);
    }
};

// Call the function
// const fetchQuesData = await fetchHit();

  const checkOnboard = () => {
    if (onboardTimerRef.current) {
      clearTimeout(onboardTimerRef.current);
    }

    let showOnboard = getCookie("showOnboard");
    let onboardShown = getCookie("onboardShown"); 
    let secondsToOpen = getCookie('secondsToOpen');

    onboardShown && setShowIframe(false);
    console.log("testing--", isPrime);
    if(isLogin && isPrime && !onboardShown){
      if (showOnboard == '1') {
        handleOnboardvisibility(secondsToOpen)
      } else if( showOnboard == undefined && !onboardApiHit){
        onboardApiHit = true;
       // setOnboardApiHit(true);
       fetchHit();
      }
    }else if(!isLogin){
      delete_cookie("showOnboard");
      delete_cookie("onboardShown");
    }
  }

  useEffect(() => {
    if(onboardApiHit) fetchHit();
  }, [onboardApiHit]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'removeIframe') {
        setShowIframe(false);
        console.log("onClose", onClose)
        const event = new Event('nextPopup');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    checkOnboard();
  }, [isPrime]);

  return (
    <>
      {
        showIframe &&
        <div id="onboardFrameContainer" className={`${styles.onboardContainer}`}>
          <iframe
              id="ifr_onboarding"
              className={`${styles.onboardFrame}`}
              src={APIS_CONFIG["Ifm_Onboarding"][APP_ENV]}
          />
        </div>
      }
    </>
  )
}

export default IfrOnboarding;
