import React, { useState } from 'react';
import styles from "./styles.module.scss";
import DropDown from './DropDown';

const DropdownScreen = ({ data, slideIndex, totalSlide, handleContinueBtn, showQues }) => {
  const [elmTrigger, setElmTrigger] = useState(0);

  const handleSelectChange = (e) => {
    setElmTrigger(1);
  };

  return (
    <li data-scrn="dd_type" className={`${styles.surveyScrn} ${elmTrigger ==1 ? 'val_update' : ''} ${showQues == data.questions[0].key ? styles.slideBlock : ''}`} data-ques={data.questions[0].key}>
      <div className="screen 2">
        <div className={styles.headTitle}>{data.boldTitle}</div>
        <div className={styles.headDes}>{data.desc}</div>
        <div className={styles.inputBox}>
          {data.questions.map((question, index) => (
            <div className={styles.selectBox} key={index}>
              <div className={styles.leftB}><label>{question.question}</label></div>
              <div className={styles.rightB}>
                <DropDown question={question} handleSelectChange={handleSelectChange} elmTrigger={elmTrigger} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.btnBox}>
          <button className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen="2" onClick={() => {handleContinueBtn(slideIndex); setElmTrigger(0);}}>{slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}</button>
        </div>
      </div>
    </li>
  );
};

export default DropdownScreen;
