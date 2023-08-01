import { FC, useEffect, useState } from 'react';
import styles from './styles.module.scss'
interface ReplyOnCommentProps {
    activeIndex: any,
    setActiveIndex: any,
    commentCardId: number,
    level: number
}
const ReplyOnComment:FC<ReplyOnCommentProps> = (props) => {
    const {activeIndex, setActiveIndex, commentCardId, level} = props;
    const [openReplyForm, setOpenReplyForm] = useState(true);
    const [formData, setFormData] = useState({});
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    const closeReplyForm = () => {
        setActiveIndex({"isReplyActive":null,"isFlagActive":null})
        setOpenReplyForm(false);
    }

    const handleCommentChange = (event) => {
        const charLength = event.target.value.length;
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
        closeReplyForm();

        // console.log("formData",JSON.stringify(formData));
        let formPayLoad = Object.keys(formData)?.map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(formData[k])
          }).join('&');
        formPayLoad = formPayLoad + `&ArticleID=95532873&msid=95532873&userid=dayanidhi.gupta%40timesinternet.in&loggedstatus=1&uid=13m5au00issy12epvvdfef92s&configid=48112188&appkey=ET&parentid=${commentCardId}&rootid=${commentCardId}`;
        fetch('https://etdev8243.indiatimes.com/post_comment.cms?feedtype=json', { //https://economictimes.indiatimes.com/post_comment.cms?feedtype=json
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

    return (
       <>
        {openReplyForm && <div className={styles.cmtReplier}>
            <form onSubmit={handleSubmit} className={`${styles.commentForm} ${level > 1 ? styles.greyBgColor : ""}`}>
                 <textarea name="message" placeholder="Your reply" onChange={handleCommentChange}></textarea>
                 <p className={styles.chars_remain}>Characters Remaining (<span id="atrcharcount1">1500</span>)</p>
                 <div>
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
                                    {/* <div className={`${styles.shareSprite} ${styles.twitterIcon}`}></div> */}
                                </label>
                                <div style={{clear:"both"}}></div>
                            </div>
                            <div className={styles.floatRight}>
                                <div className={styles.floatRight}>
                                    <input className={styles.commentSubmitButton} value="POST" type="submit"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input value="" id="parentid2" name="parentid2" type="hidden"></input>
                    <input value="" id="rootid2" name="rootid2" type="hidden"></input>
                 </div>
                 <div className={styles.msg} style = {{display:"none"}}><h6 className={styles.thankText}>Thank you!</h6><p className={styles.thankText}>We appreciate you taking time to post your opinion on this article.</p><p className={styles.thankText}>You might also like to read <a href="/opinions/95532873.cms">what others have to say</a> on this article.</p></div>
            </form>
            <span onClick={closeReplyForm} className={styles.closeBtn}>x</span>
        </div>}
       </>
    );
}
export default ReplyOnComment;