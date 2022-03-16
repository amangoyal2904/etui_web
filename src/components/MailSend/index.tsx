import { NextPage } from "next";
import styles from './styles.module.scss';
import {useState} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import {mailSendAPICall} from '../../utils/apiCallFun';

// open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
const MailSendTemplate: NextPage<any> = (props) => { 
    const [loading, setlLoading] = useState('no');
    const [thanksMessage, setThanksMessage] = useState('no'); 
    const [username, setUsename] = useState('');
    const [replyto, setReplyto] = useState('');
    const [fromname1, setFromname1] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const msid = props.mailData.msid && props.mailData.msid != '' ? props.mailData.msid : '';
    const articlelink = props.mailData.articlelink && props.mailData.articlelink != '' ? props.mailData.articlelink : '';
    const syn = props.mailData.syn && props.mailData.syn != '' ? props.mailData.syn : '';
    const pageTitle = props.mailData.pageTitle && props.mailData.pageTitle != '' ? props.mailData.pageTitle : '';
    const subject = props.mailData.subject && props.mailData.subject != '' ? props.mailData.subject : '';
    const closeHandler = ()=>{
        props.onclickhandler();
    }
    const emailSend = {
        validate: function(toaddress:string, replyto:string, value:string){
            let trimtomail = emailSend.mailtrim(toaddress);
            let trimfrommail = emailSend.mailtrim(replyto);
            let fromname1 = value;
            
            let returnValue:Boolean = true;
            let emails = trimtomail.split(",");
            emails.forEach(function (email:string) {
              if(emailSend.checkMail(email.trim()) == false){
                  returnValue =  false;
              }
            });
            
            if(trimtomail == ''){
                alert('Please enter  email address in - Recievers Email Address Field');
                return false;
            }else if (returnValue == false) {
               alert('Please enter to valid email address in - Recievers Email Address Field');
                  return false;
            }else if(fromname1 == "" || fromname1 == "Your Name") {
                alert('Please enter Your name.');
                return false;
            }else if(emailSend.checkMail(trimfrommail) == false) {
                alert('Please enter a valid email address in - Your Email Address');
                return false;
            }else if(captchaValue == ''){
                alert('Please select reCaptcha');
                return false;
            }
            else{
                emailSend.postMailHit();
                return false;
            }
            return false;
        },
        mailtrim:function(mvalue:string) {
            let temp1 = mvalue;
            var obj = /^(\s*)([\W\w]*)(\b\s*$)/;
            if (obj.test(temp1)) {
                temp1 = temp1.replace(obj, '$2');
            }
            var obj = /  /g;
            while (temp1.match(obj)) {
                temp1 = temp1.replace(obj, " ");
            }
            return temp1;
        },
        checkMail:function(inmail:string) {
            var x = inmail;
            var y = 0;
            var filter = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/i;
            if (x.indexOf(',') != -1) {
                var seperatevalues = x.split(',');
                var xx = 0;
                for (xx = 0; xx < seperatevalues.length; xx = xx + 1) {
                    if (filter.test(seperatevalues[xx]))
                        y = y + 1;
                }
                if (xx == y)
                    return true;
                else
                    return false;
            } else {
                if (filter.test(x))
                    return true;
                else
                    return false;
            }
        },
        postMailHit: async function() {
            const  objUserData ={
                subject:subject,
                pgtitle:pageTitle,
                syn:syn,
                articlelink:articlelink,
                mailtitle:'Economic Times',
                title:'Economic Times',
                servername:'economictimes.indiatimes.com',
                fromname:'mailerservice@indiatimes.com',
                fromaddress:'mailerservice@indiatimes.com',
                ArticleID:msid,
                msid:msid,
                successUrl:`https://economictimes.indiatimes.com/mail.cms?msid=${msid}&thanks=1`,
                failUrl:'https://economictimes.indiatimes.com/mail.cms?failure=1',
                configid:'6188155',
                toaddress:username,
                fromname1:fromname1,
                replyto:replyto,
                g_recaptcha_response:captchaValue
            }
            console.log('__objUserData', objUserData);
            setlLoading('yes')
            const  res = await mailSendAPICall(objUserData);
            console.log('res', res);
            setlLoading('no')
            if(res && res.postmail.error){
                alert("Please select reCaptcha or may be some error");
                emailSend.postSecondForm(); 
                return false;
            }else{
                emailSend.postSecondForm(); 
            }

        },
        postSecondForm:function(){
            // ga('send','event','Articleshow','Email Article',document.mailForm.toaddress.value)
           setThanksMessage('yes')
        }
    }
    const captchaHandler = (value:any)=>{
        console.log('captchaHandler', value);
        setCaptchaValue(value);
    }
    const formSubmitHandler = (e:any)=>{
        e.preventDefault();
        emailSend.validate(username, replyto, fromname1)
        console.log('formSubmitHandler function call', username)
    }
    return (
      <>      
          <div className={styles.wrap}>
              <div className={styles.layerSec}>
                {
                    loading !== 'no' ? <div className={styles.loading}>
                        <div className={styles.loader}>
                            <div className={styles.loader__bar}></div>
                            <div className={styles.loader__bar}></div>
                            <div className={styles.loader__bar}></div>
                            <div className={styles.loader__bar}></div>
                            <div className={styles.loader__bar}></div>
                            <div className={styles.loader__ball}></div>
                        </div>
                        <p>Please wait...</p>
                    </div> : ''
                }
                
                <div className={styles.layerContent}>
                    <span className={styles.layerClose} onClick={closeHandler}></span>
                    <h3>Mail This Video</h3>
                    {
                        thanksMessage === 'no' ? <div className={styles.formBody}>
                            <form>
                                <div className={styles.formGroup}>
                                    <label>
                                        <input type="text" defaultValue={username} onChange={(e)=>{setUsename(e.target.value)}} name="toaddress" placeholder="Recipient's mail" />
                                    </label>
                                    <div className={styles.smallText}>( For more than one recipient, type addresses seperated by commas )</div>
                                </div>
                                <div className={styles.formGroupInlineForm}>
                                    <label>
                                        <input type="text" defaultValue={fromname1} onChange={(e)=>{setFromname1(e.target.value)}} name="fromname1" placeholder="Your Name" />
                                    </label>
                                    <label>
                                        <input type="text" defaultValue={replyto} onChange={(e)=>{setReplyto(e.target.value)}} name="replyto" placeholder="Your Email ID" />
                                    </label>
                                </div>
                                <div className={styles.captchaSec}>
                                    <div className={styles.capthcaResize}>
                                    <ReCAPTCHA
                                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                        onChange={captchaHandler}
                                    />
                                        {/* <div className="g-recaptcha" data-sitekey="6Le_434UAAAAAO2v9F1iJlM9Gxht1RVivI5vmgY9"></div> */}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <input className={styles.btnSubmit}  value="Submit" name="Button" onClick={formSubmitHandler} type="submit" />
                                </div>
                            </form>
                        </div>: <div className={styles.formBody}>
                                    <div className={styles.thanks}>
                                        <h3>Thank you!</h3>
                                        <h6>Your email with the Video link has been sent.</h6>
                                        <div className={styles.mostLink}>Also, check out our <a target="_blank" href="https://economictimes.indiatimes.com/mostemailed.cms">Most Shared articles.</a></div>
                                    </div>
                                </div>
                    }
                </div>
              </div>
          </div>
      </>
    );
  };
  
  export default MailSendTemplate;