import React, { useState } from 'react';
import styles from "./styles.module.scss";

const AppDownloadScreen = ({ data, type, slideIndex, totalSlide, handleContinueBtn, showQues }) => {
  const [elmTrigger, setElmTrigger] = useState(0);
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const img_f = type === 'market' ? '88391331' : '88304350';
  const img_t = type === 'market' ? '88391358' : '88304359';
  const img_th = type === 'market' ? '88391371' : '88304374';
  const img_fut = type === 'market' ? '88391387' : '88304386';
  const url = type === 'market' ? "https://www.ecoti.in/kCsbea86" : "https://www.ecoti.in/WJ2LKY0";
  const scrnType = type === 'market' ? 'marketapp' : 'etapp';

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
    }
  };

  const handleSendSMS = async () => {
    if (/^\d{10}$/.test(mobileNumber)) {
      setErrorMessage('');
      setIsLoading(true);

      const msgText = scrnType === 'etapp' 
        ? "Knowledge makes the difference. Stay on top with the latest business news. Download The Economic Times app: " + url 
        : "Profits are waiting. Stay on top of stocks & get fresh investment ideas. Download ETMarkets app: " + url;
      const dltContentId = scrnType === 'etapp' ? "1007112036184964575" : "1007743339569549126";
      const action = scrnType === 'etapp' ? "appdownload" : "marketsappdownload";

      try {
        const response = await fetch('https://etdev8243.indiatimes.com/sms_api.cms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: mobileNumber,
            text: msgText,
            dltContentId,
            feedtype: "etjson",
          }),
        });

        const result = await response.json();

        if (result.state === 'SUBMIT_ACCEPTED') {
          setSuccessMessage('We just shared a download link to your number. Click, download, and profit from insights.');
          setIsLoading(false);
          // Trigger event (replace grxEvent with your event handler)
          // grxEvent('event', { event_category: 'Onboarding', event_action: action, event_label: "appdownload_SMSsent" }, 1);
        } else {
          setErrorMessage('Message sending failed. Please check your mobile number and try again.');
          setIsLoading(false);
          // grxEvent('event', { event_category: 'Onboarding', event_action: action, event_label: "appdownload_SMSAPIError" }, 1);
        }
      } catch (error) {
        setErrorMessage('Message sending failed. Please check your mobile number and try again.');
        setIsLoading(false);
        // grxEvent('event', { event_category: 'Onboarding', event_action: action, event_label: "appdownload_SMSResError" }, 1);
      }
    } else {
      setErrorMessage('Kindly enter a valid mobile number');
      const action = scrnType === 'etapp' ? "appdownload" : "marketsappdownload";
      // grxEvent('event', { event_category: 'Onboarding', event_action: action, event_label: "appdownload_SMSError_mobile_validate" }, 1);
    }
  };

  const handleNoThanks = () => {
    const gaAction = scrnType === 'etapp' ? "appdownload" : "marketsappdownload";
    // Simulate the event triggering (replace grxEvent with your actual event handler)
    // grxEvent('event', { event_category: 'Onboarding', event_action: gaAction, event_label: "appdownload_nothanks" }, 1);

    document?.querySelector(`[data-scrn="${data.templateId}"]`)?.classList.add('nothanks', 'val_upd');
    handleContinueBtn(slideIndex);
  };

  return (
    <li className={`${styles.surveyScrn} ${styles.app_d_scrn} ${elmTrigger ==1 ? 'val_update' : ''}  ${showQues == data.questions[0].key ? styles.slideBlock : ''}`} data-scrn={data.templateId} data-ques={data.questions[0].key}>
      <div className="screen">
        <div className={styles.headTitle}>{data.boldTitle}</div>
        <div className={styles.headDes}>{data.desc}</div>
        <div className={`${styles.app_download} ${type}`}>
          <div className={styles.msg_send_box}>
            <div className={styles.msg_box_wrp}>
              <div className={`${styles.errMsg} ${errorMessage ? '' : styles.hide}`}>{errorMessage}</div>
              <div className={styles.msg_input_box}>
                <span>+ 91 - </span>
                <input
                  type="number"
                  className="font_mon"
                  maxLength={10}
                  autoComplete="off"
                  placeholder="Enter your mobile number"
                  onChange={handleInputChange}
                  value={mobileNumber}
                />
              </div>
              <span className={styles.msg_send_btn} onClick={handleSendSMS}>
                {isLoading ? 'Sending...' : 'TEXT ME THE LINK'}
              </span>
              <p className={`${styles.successMsg} ${successMessage ? '' : styles.hide}`}>{successMessage}</p>
            </div>
          </div>
          <div className={styles.rating_wrp}>
            <span className={styles.rr_tg}>Ratings<br />& Review</span>
            <span className={`${styles.i_sprite} ${styles.line_i}`}></span>
            <span className={styles.tl_rt}>4.4<i className={`${styles.i_sprite} ${styles.star_i}`}></i><span className={styles.out_of}>out of 5</span></span>
            <span className={styles.lin1}></span>
            <span className={styles.app_d}>5M+<span className={styles.dw_t}>DOWNLOADS</span></span>
          </div>
          <div className={styles.app_scrn_wrp}>
            <img src={`https://img.etimg.com/photo/${img_f}.cms`} alt="App Screenshot 1" loading="lazy"  />
            <img src={`https://img.etimg.com/photo/${img_t}.cms`} alt="App Screenshot 2" loading="lazy"  />
            <img src={`https://img.etimg.com/photo/${img_th}.cms`} alt="App Screenshot 3" loading="lazy"  />
            <img src={`https://img.etimg.com/photo/${img_fut}.cms`} alt="App Screenshot 4" loading="lazy"  />
          </div>
        </div>
        <div className={styles.btnBox}>
          <button className={`${styles.btn}`} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen={data.key} onClick={() => {handleContinueBtn(slideIndex); setElmTrigger(0);}}>
            {slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}
          </button>
        </div>
        <div className={styles.no_thank_wrp}><span onClick={handleNoThanks}>I already have the app</span></div>
      </div>
    </li>
  );
};

export default AppDownloadScreen;
