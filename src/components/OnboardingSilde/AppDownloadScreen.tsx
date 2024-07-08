import React from 'react';

const AppDownloadScreen = ({ data, type }) => {
    const img_f = type === 'market' ? '88391331' : '88304350';
    const img_t = type === 'market' ? '88391358' : '88304359';
    const img_th = type === 'market' ? '88391371' : '88304374';
    const img_fut = type === 'market' ? '88391387' : '88304386';

    const handleInput = (e) => {
        const input = e.target as HTMLInputElement;
        if (input.value.length > input.maxLength) {
            input.value = input.value.slice(0, input.maxLength);
        }
    };

    return (
        <li className="survey_scrn app_d_scrn" data-scrn={data.templateId} data-ques={data.questions[0].key}>
            <div className="screen">
                <div className="head_title">{data.boldTitle}</div>
                <div className="head_des">{data.desc}</div>
                <div className={`app_download clearfix ${type}`}>
                    <div className="msg_send_box">
                        <div className="msg_box_wrp">
                            <div className="errMsg hide">Kindly enter a valid mobile number</div>
                            <div className="msg_input_box">
                                <span>+ 91 - </span>
                                <input 
                                    type="number" 
                                    className="font_mon" 
                                    maxLength={10} 
                                    autoComplete="off" 
                                    placeholder="Enter your mobile number" 
                                    onInput={handleInput} 
                                />
                            </div>
                            <span className="msg_send_btn">TEXT ME THE LINK</span>
                        </div>
                        <p className="success_msg hide">We just shared a download link to your number. Click,<br/> download, and profit from insights. </p>
                    </div>
                    <div className="rating_wrp">
                        <span className="rr_tg dib">Ratings<br/>& Review</span>
                        <span className="i_sprite line_i dib"></span>
                        <span className="tl_rt dib">4.4<i className="i_sprite star_i dib"></i><span className="out_of">out of 5</span></span>
                        <span className="lin1 dib"></span>
                        <span className="app_d dib">5M+<span className="dw_t">DOWNLOADS</span></span>
                    </div>
                    <div className="app_scrn_wrp">
                        <img src={`/photo/${img_f}.cms`} />
                        <img src={`/photo/${img_t}.cms`} />
                        <img src={`/photo/${img_th}.cms`} />
                        <img src={`/photo/${img_fut}.cms`} />
                    </div>
                </div>
                <div className="btnBox">
                    <button className="btn btn_ctn" data-screen={data.key}>CONTINUE</button>
                </div>
                <div className="no_thank_wrp tac"><span>I already have the app</span></div>
            </div>
        </li>
    );
};

export default AppDownloadScreen;
