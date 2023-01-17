import { FC, useEffect, useState } from 'react';
import styles from './styles.module.scss'
const PostComments:FC = (props) => {
    const [openPostCommentBox, setPostCommentBox] = useState(false);
    const [openThankYouBox, setOpenThankYouBox] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    const openCommentBox = () => {
        setPostCommentBox(true);
    }
    const closeCommentBox = () => {
        setPostCommentBox(false);
    }

    const closeThankYouBox = () => {
        setOpenThankYouBox(false);
    }

    const handleChange = (event) => {
        const charLength = event.target.value.length;
        if(charLength > 2){
            console.log("greater than 2");
            setShowForm(true);
        }
        if (charLength > 1500){
            alert("You have entered more than 1500 characters");
        } 
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    // fetch("https://economictimes.indiatimes.com/post_comment.cms?feedtype=json", {
    // "headers": {
    //     "accept": "*/*",
    //     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    //     "cache-control": "no-cache",
    //     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //     "pragma": "no-cache",
    //     "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "sec-ch-ua-model": "",
    //     "sec-ch-ua-platform": "\"macOS\"",
    //     "sec-ch-ua-platform-version": "\"12.6.1\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "x-requested-with": "XMLHttpRequest"
    // },
    // "referrer": "https://economictimes.indiatimes.com/news/india/we-have-opened-more-bank-accounts-than-americas-population-since-2014-pm-modi-in-bali/videoshow/95532873.cms",
    // "referrerPolicy": "strict-origin-when-cross-origin",
    // "body": "fromname=Dayanidhi+Gupta&fromaddress=dayanidhi.gupta%40timesinternet.in&location=&message=more+accounts+opening&ArticleID=95532873&msid=95532873&userid=dayanidhi.gupta%40timesinternet.in&loggedstatus=1&uid=13m5au00issy12epvvdfef92s&configid=48112188&redirectionurl=https%3A%2F%2Feconomictimes.indiatimes.com%2Fnews%2Findia%2Fwe-have-opened-more-bank-accounts-than-americas-population-since-2014-pm-modi-in-bali%2Fvideoshow%2F95532873.cms&appkey=ET",
    // "method": "POST",
    // "mode": "cors",
    // "credentials": "include"
    // });
    const handleSubmit = (event) => {
        event.preventDefault();
        closeCommentBox();
        setOpenThankYouBox(true);
        // fetch("https://economictimes.indiatimes.com/post_comment.cms?feedtype=json", {
        //     method: 'POST',
        //     body: JSON.stringify(formData),
        //     headers: { 'Content-Type': 'application/' },
        //   })
        //     .then((response) => response.json())
        //     .then((data) => {
        //       console.log(data);
        //     });
        console.log("formData",formData);
    };
    return (
        <>
        <div className={styles.postButton}>
          <a onClick={openCommentBox}>Post a Comment</a>
        </div>
        {openPostCommentBox && (<div id={styles.postCommentBox}>
            <form onSubmit={handleSubmit} className={styles.commentForm}>
                 <h5>Have something to say? <b>Post your comment</b></h5>
                 <textarea name="message" placeholder="Your comment" onChange={handleChange}></textarea>
                 {showForm && <div>
                    <div className={isLoggedIn && styles.logged}>
                        <h4>To post this comment you must</h4>
                        <div className={styles.loginButtons}>
                            <p className={styles.floatLeft}>Log In/Connect with:</p>
                            <a className={`${styles.floatLeft} ${styles.shareSprite} ${styles.fbLogin}`}></a>
                            <a className={`${styles.floatLeft} ${styles.shareSprite} ${styles.gpLogin}`}></a>
                            <a className={`${styles.floatLeft} ${styles.moreLoginOpt}`}>Indiatimes Network</a>
                        </div>
                    </div>
                    
                    <div style={{margin:" 0px -15px -15px",display: "inline-block"}} className={styles.userInfo}>
                        <div className={isLoggedIn ? styles.logged : `${styles.commentInfo} ${styles.nonLogged} ${styles.floatLeft}`}>
                            <h3>Fill in your details:</h3>
                            <label className={styles.nonLogged} style={{display: "block"}}>
                                <input onChange={handleChange} name="fromname" maxLength={20} placeholder="Name" type="text"/>
                                <p>Will be displayed</p>
                            </label>
                            <label className={styles.nonLogged}>
                                <input onChange={handleChange} name="fromaddress"  maxLength={40} placeholder="Email" type="text"/>
                                <p>Will not be displayed</p>
                            </label>
                            <label style={{margin: "0"}}>
                                <input onChange={handleChange} name="location" maxLength={20} placeholder="Location" type="text"/>
                                <p>Will be displayed</p>
                            </label>
                        </div>

                        <div className={`${styles.shareComment} ${styles.floatRight}`}>
                            <div>
                                <h3 className={styles.floatLeft}>Share this Comment:</h3>
                                <label>
                                    <input name="check_twitter" value="0" type="checkbox"/>
                                        Post to Twitter 
                                    <div className={`${styles.shareSprite} ${styles.twitterIcon}`}></div>
                                </label>
                                <div style={{clear:"both"}}></div>
                            </div>
                            <div className={styles.floatRight}>
                                <div className={styles.floatRight}>
                                    <input className={styles.commentSubmitButton} value="Post Comment" type="submit"/>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>}
            </form>
            <span onClick={closeCommentBox} className={styles.close}></span>
        </div>)}
        {openThankYouBox && (<div id={styles.postCommentBox} className={styles.commentMessage}>
            <h6 className={styles.thankText}>Thank you!</h6>
            <p className={styles.thankText}>We appreciate you taking time to post your opinion on this article.</p>
            <span  onClick={closeThankYouBox} className={styles.close}></span>
        </div>)}
        </>
    );
}
export default PostComments;