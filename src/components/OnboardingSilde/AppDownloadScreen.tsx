import React from 'react';
import styles from "./styles.module.scss";

const AppDownloadScreen = ({ data, type, slideIndex, totalSlide, handleContinueBtn }) => {
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
        <li className={`${styles.surveyScrn} ${styles.app_d_scrn} ${slideIndex == 0 ? styles.slideBlock : ''}`} data-scrn={data.templateId} data-ques={data.questions[0].key}>
            <div className="screen">
                <div className={styles.headTitle}>{data.boldTitle}</div>
                <div className={styles.headDes}>{data.desc}</div>
                <div className={`${styles.app_download} ${type}`}>
                    <div className={styles.msg_send_box}>
                        <div className={styles.msg_box_wrp}>
                            <div className={`${styles.errMsg} ${styles.hide}`}>Kindly enter a valid mobile number</div>
                            <div className={styles.msg_input_box}>
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
                            <span className={styles.msg_send_btn}>TEXT ME THE LINK</span>
                        </div>
                        <p className={`${styles.success_msg} ${styles.hide}`}>We just shared a download link to your number. Click,<br/> download, and profit from insights. </p>
                    </div>
                    <div className={styles.rating_wrp}>
                        <span className={styles.rr_tg}>Ratings<br/>& Review</span>
                        <span className={`${styles.i_sprite} ${styles.line_i}`}></span>
                        <span className={styles.tl_rt}>4.4<i className={`${styles.i_sprite} ${styles.star_i}`}></i><span className={styles.out_of}>out of 5</span></span>
                        <span className={styles.lin1}></span>
                        <span className={styles.app_d}>5M+<span className={styles.dw_t}>DOWNLOADS</span></span>
                    </div>
                    <div className={styles.app_scrn_wrp}>
                        <img src={`https://img.etimg.com//photo/${img_f}.cms`} />
                        <img src={`https://img.etimg.com//photo/${img_t}.cms`} />
                        <img src={`https://img.etimg.com//photo/${img_th}.cms`} />
                        <img src={`https://img.etimg.com//photo/${img_fut}.cms`} />
                    </div>
                </div>
                <div className={styles.btnBox}>
                    <button className={`${styles.btn} `} data-btn={`${slideIndex == totalSlide - 1 ? 'btn_sbt' : 'btn_ctn'}`} data-screen={data.key} onClick={() => handleContinueBtn(slideIndex)}>{slideIndex == totalSlide - 1 ? "Submit" : "CONTINUE"}</button>
                </div>
                <div className={styles.no_thank_wrp}><span>I already have the app</span></div>
            </div>
        </li>
    );
};

export default AppDownloadScreen;
