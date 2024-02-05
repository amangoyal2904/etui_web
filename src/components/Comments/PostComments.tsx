import { FC, useEffect, useState } from 'react';
import styles from './styles.module.scss'
const PostComments:FC = (props) => {
    const [openPostCommentBox, setOpenPostCommentBox] = useState(false);
    const [openThankYouBox, setOpenThankYouBox] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    const openCommentBox = () => {
        setOpenPostCommentBox(true);
    }
    const closeCommentBox = () => {
        setOpenPostCommentBox(false);
    }

    const closeThankYouBox = () => {
        setOpenThankYouBox(false);
    }

    const handleCommentChange = (event) => {
        const charLength = event.target.value.length;
        if(charLength == 3){
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

    const handleFormChange = (event) => {
        
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
   
    const handleSubmit = (e) => {
        e.preventDefault();
        closeCommentBox();
        setOpenThankYouBox(true);

        // console.log("formData",JSON.stringify(formData));
        let formPayLoad = Object.keys(formData)?.map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(formData[k])
          }).join('&');
        formPayLoad = formPayLoad + "&ArticleID=95532873&msid=95532873&userid=dayanidhi.gupta%40timesinternet.in&loggedstatus=1&uid=13m5au00issy12epvvdfef92s&configid=48112188&appkey=ET";
        fetch('https://etdev8243.indiatimes.com/post_comment.cms?feedtype=json', {//https://economictimes.indiatimes.com/post_comment.cms?feedtype=json
            method: 'POST',
            headers : {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: formPayLoad
        })
            .then((response) => response.json())
            .then((data) => {
            console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    };
    const openWindow = (width, height, url) => {
        window.open(url, '_blank', `width=${width},height=${height}`);
    }
    return (
        <>
        <div className={styles.postButton}>
          <a onClick={openCommentBox}>Post a Comment</a>
        </div>
        {openPostCommentBox && (<div id={styles.postCommentBox}>
            <form onSubmit={handleSubmit} className={styles.commentForm}>
                 <h5>Have something to say? <b>Post your comment</b></h5>
                 <textarea name="message" placeholder="Your comment" onChange={handleCommentChange}></textarea>
                 {showForm && <div>
                    <div className={isLoggedIn ? styles.logged : ""}>
                        <h4>To post this comment you must</h4>
                        <div className={styles.loginButtons}>
                            <p className={styles.floatLeft}>Log In/Connect with:</p>
                            <a href="#" onClick={()=>openWindow(600,600,"https://jsso.indiatimes.com/sso/identity/login/socialLogin?channel=et&oauthsiteid=facebook")} className={`${styles.floatLeft} ${styles.shareSprite} ${styles.fbLogin}`}></a>
                            <a href="#" onClick={()=>openWindow(600,600,"https://jsso.indiatimes.com/sso/identity/login/socialLogin?channel=et&oauthsiteid=googleplus")} className={`${styles.floatLeft} ${styles.shareSprite} ${styles.gpLogin}`}></a>
                            <a href='#' className={`${styles.floatLeft} ${styles.moreLoginOpt}`}>Indiatimes Network</a>
                        </div>
                    </div>
                    
                    <div style={{margin:" 0px -15px -15px",display: "inline-block"}} className={styles.userInfo}>
                        <div className={isLoggedIn ? styles.logged : `${styles.commentInfo} ${styles.nonLogged} ${styles.floatLeft}`}>
                            <h3>Fill in your details:</h3>
                            <label className={styles.nonLogged}>
                                <input onChange={handleFormChange} name="fromname" maxLength={20} placeholder="Name" type="text"/>
                                <p>Will be displayed</p>
                            </label>
                            <label className={styles.nonLogged}>
                                <input onChange={handleFormChange} name="fromaddress"  maxLength={40} placeholder="Email" type="text"/>
                                <p>Will not be displayed</p>
                            </label>
                            <label>
                                <input onChange={handleFormChange} name="location" maxLength={20} placeholder="Location" type="text"/>
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
            <span onClick={closeThankYouBox} className={styles.close}></span>
        </div>)}
        </>
    );
}
export default PostComments;