// TextScreen.js
import React from 'react';
import styles from "./styles.module.scss";

const TextScreen = ({ data, objObd,  slideIndex, totalSlide, handleContinueBtn}) => {
    const inputVal = data.questions[0].answer || '';

    return (
        <li data-scrn="text_type" className={`${styles.surveyScrn} ${slideIndex == 0 ? styles.slideBlock : ''}`} data-ques="Welcome">
            <div className="screen 1">
                <div className={styles.headTitle}>{data.boldTitle}</div>
                <div className={styles.headDes}>{data.desc}</div>
                <div className="inputBox font_mon">
                    <label>{data.questions[0].question}</label><br/>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        maxLength={40} 
                        className="name tac" 
                        value={inputVal} 
                        placeholder="Enter Your Name" 
                        required 
                    />
                </div>
                <div className={styles.btnBox}>
                    <button data-screen="1" className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} onClick={() => handleContinueBtn(slideIndex)}>{slideIndex == totalSlide - 1 ? "submit" : "CONTINUE"}</button>
                </div>
            </div>
        </li>
    );
};

export default TextScreen;

  