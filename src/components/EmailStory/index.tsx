import { useState } from "react";
import styles from "./styles.module.scss";
import ReCAPTCHA from 'react-google-recaptcha';

const EmailStory = ({ mailData, articleData, closeMailHandler }) => {
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [formData, setFormData] = useState(
        { name: '', toaddress: '', replyto: ''}
        );
    const webSiteKey = "6LfNNyEqAAAAAGJDvsmOyR1Y-TyHjS0MRQAwiHo2"; // Ensure this key is for reCAPTCHA v2

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const mailTrim = (mvalue) => {
        var temp1 = mvalue;
        var obj = /^(\s*)([\W\w]*)(\b\s*$)/;
        if (obj.test(temp1)) {
          temp1 = temp1.replace(obj, '$2');
        }
        var obj = /  /g;
        while (temp1.match(obj)) {
          temp1 = temp1.replace(obj, " ");
        }
        return temp1;
    }
    const handleRecaptcha = (value) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recaptchaValue) {
            alert('Please complete the reCAPTCHA.');
            return;
        }
        const trimMailToAddress = mailTrim(formData.toaddress);
        console.log("@@@email",trimMailToAddress);
        if(trimMailToAddress == ''){
          alert('Please enter  email address in - Recievers Email Address Field');
          document.getElementById("mobile")?.focus();
          return false;
     // }
    //   else if (returnValue == false) {
    //      alert('Please enter to valid email address in - Recievers Email Address Field');
    //      document.getElementById("toaddress")?.focus();
    //         return false;
    //   }else if(fromname1 == "" || fromname1 == "Your Name") {
    //     alert('Please enter Your name.');
    //     document.mailForm.fromname1.focus();
    //     return false;
    //   }else if(emailSend.checkMail(trimfrommail) == false) {
    //     alert('Please enter a valid email address in - Your Email Address');
    //     document.mailForm.replyto.focus();
    //     return false;
      }else{
        console.log("@@@@articleData",articleData);
          const data = {
            subject:`Economictimes.com:${articleData.title}`,
            pgtitle:"",
            syn:articleData.synopsis,
            articlelink: window.location.href,
            mailtitle:"Economic Times",
            title: articleData.title || "Economic Times",
            servername: "economictimes.indiatimes.com",
            fromname: "feedback@economictimes.com",
            fromaddress: "research@economictimes.com",
            ArticleID: articleData.msid,
            msid: articleData.msid,
            successUrl:" https://economictimes.indiatimes.com/mail.cms?msid=110694459&thanks=1",
            failUrl: "https://economictimes.indiatimes.com/mail.cms?failure=1",
            configid: 6188155,
            ...formData,

          }
      }
        console.log("@@@@recaptca",recaptchaValue, formData);
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
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.emailStoryWrapper}>
                <h3 className={styles.title}>
                    Mail This Video
                    <span onClick={handleClose} className={styles.close} />
                </h3>
                <div className={styles.internalLayer}>
                    <input
                        type="text"
                        name="toaddress"
                        maxLength={255}
                        placeholder="Recipient's mail"
                        onChange={handleChange}
                        value={formData.toaddress}
                    />
                    <div className={styles.addMore}>
                        (For more than one recipient, type addresses separated by commas)
                    </div>
                    <div className={styles.inlineForm}>
                        <label>
                            <input
                                type="text"
                                name="name"
                                maxLength={300}
                                placeholder="Your Name"
                                onChange={handleChange}
                                value={formData.name}
                            />
                        </label>
                        <label>
                            <input
                                type="text"
                                name="replyto"
                                maxLength={300}
                                placeholder="Your Email ID"
                                onChange={handleChange}
                                value={formData.replyto}
                            />
                        </label>
                    </div>
                    <div className={styles.reCAPTCHAWrapper}>
                        <ReCAPTCHA
                            sitekey={webSiteKey}
                            onChange={handleRecaptcha}
                            size="normal"
                        />
                    </div>
                </div>
                <div className={styles.submitBtn}>
                    <button type="button" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default EmailStory;
