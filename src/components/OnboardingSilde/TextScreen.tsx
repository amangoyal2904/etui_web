// TextScreen.js
import React from 'react';

const TextScreen = ({ data, objObd }) => {
    const inputVal = data.questions[0].answer || '';

    return (
        <li data-scrn="text_type" className="survey_scrn" data-ques="Welcome">
            <div className="screen 1">
                <div className="head_title">{data.boldTitle}</div>
                <div className="head_des">{data.desc}</div>
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
                <div className="btnBox font_faus">
                    <button data-screen="1" className="btn btn_ctn">CONTINUE</button>
                </div>
            </div>
        </li>
    );
};

export default TextScreen;

  