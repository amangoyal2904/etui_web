import React from 'react';
import styles from "./styles.module.scss";

const DropdownScreen = ({ data, slideIndex, totalSlide, handleContinueBtn, showQues }) => {

  const handleSelectChange = (e) => {
    e.target.classList.add("slt_chg");
  };

  return (
    <li data-scrn="dd_type" className={`${styles.surveyScrn} ${showQues == data.questions[0].key ? styles.slideBlock : ''}`} data-ques={data.questions[0].key}>
      <div className="screen 2">
        <div className={styles.headTitle}>{data.boldTitle}</div>
        <div className={styles.headDes}>{data.desc}</div>
        <div className={styles.inputBox}>
          {data.questions.map((question, index) => (
            <div className={styles.selectBox} key={index}>
              <div className={styles.leftB}><label>{question.question}</label></div>
              <div className={styles.rightB}>
                <select id={question.key} name={question.key} onChange={handleSelectChange}>
                  {question.options.map((option, i) => (
                    <option
                      data-key={option.key}
                      value={option.value}
                      selected={option.selected}
                      disabled={i === 0}
                    >
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.btnBox}>
          <button className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen="2" onClick={() => handleContinueBtn(slideIndex)}>{slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}</button>
        </div>
      </div>
    </li>
  );
};

export default DropdownScreen;
