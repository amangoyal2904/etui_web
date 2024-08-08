import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Script from 'next/script';
import ReCAPTCHA from 'react-google-recaptcha';

const EmailStory = ({closeMailHandler}) =>{
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [formData, setFormData] = useState({ name: '', toaddress: '', replyto: '' });
    const webSiteKey = "6LdMBfYpAAAAABOjUi6JLRRYzolwkV-fssdaRWdN";// 6Le_434UAAAAAO2v9F1iJlM9Gxht1RVivI5vmgY9 
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleRecaptcha = (value) => {
      setRecaptchaValue(value);
    };
    useEffect(()=>{
        <Script src={`https://www.google.com/recaptcha/api.js?render=${webSiteKey}`} strategy="beforeInteractive" />
    },[]);

    const sendEmail = () =>{

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
    console.log("@@@@-->",formData);
        if (!recaptchaValue) {
          alert('Please complete the reCAPTCHA.');
          return;
        }
    
        // Send form data and reCAPTCHA value to your server
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, recaptchaValue }),
        });
    
        const result = await response.json();
    
        if (result.success) {
          alert('Form submitted successfully!');
          setFormData({ name: '', replyto: '', toaddress: '' });
          setRecaptchaValue(null);
        } else {
          alert('Form submission failed. Please try again.');
        }
    };
    const handleClose = () => {
      closeMailHandler(false);
    }

    return(
     <div className={styles.overlay}>
      <div className={styles.emailStoryWrapper}>
                <h3 className={styles.title}>Mail This Video
                    <span onClick={handleClose} className={styles.close}/>
                </h3>
                <div className={styles.internalLayer}>
                    <input id="" type="text" name="toaddress" maxLength={255} placeholder="Recipient's mail" onChange={handleChange} value={formData.toaddress}/>
                    <div className={styles.addMore}>( For more than one recipient, type addresses seperated by commas )</div>
                    <div className={styles.inlineForm}>
                        <label>
                            <input type="text" name="name" maxLength={300} placeholder="Your Name" onChange={handleChange} value={formData.name}/>
                        </label>
                        <label>
                            <input type="text" name="replyto" maxLength={300} placeholder="Your Email ID" onChange={handleChange} value={formData.replyto}/>
                        </label>
                    </div>
                    <div className={styles.reCAPTCHAWrapper}>
                        <div style={{display:"inline-block"}}>
                        <ReCAPTCHA
                            sitekey={webSiteKey}
                            onChange={handleRecaptcha}
                        />
                        </div>
                    </div>    
                </div>
                <div className={styles.submitBtn}>
                    <button type="submit" name="Button" onClick={handleSubmit}>Submit</button>
                </div>
        </div>
         </div>
    )
}
export default EmailStory;