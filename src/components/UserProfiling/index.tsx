import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.module.scss';
import APIS_CONFIG from "../../network/config.json";
import { useStateContext } from "../../store/StateContext";
import jStorageReact from 'utils/jStorage';
interface Option {
    key: string;
    value: string;
    name: string;
    selected: boolean;
    questions?: Question[];
}
interface Question {
    key: string;
    type: 'Text' | 'DropDown';
    name: string;
    showQuestion: boolean;
    question: string;
    answer: string;
    options?: Option[];
}
// Define types for profile data
interface ProfileData {
    name: string;
    email: string;
    mobile: string;
    location: string;
    occupation: object;
}

// Define types for OTP state
interface OTP {
    digit1?: string;
    digit2?: string;
    digit3?: string;
    digit4?: string;
    digit5?: string;
    digit6?: string;
}

// Define types for errors
interface Errors {
    [key: string]: string;
}
type Questionnaire = Question[];
const UserProfile = (onClose) => {
    const { state, dispatch } = useStateContext();
    const { isPrime, isPink, isLogin } = state.login;
    const otpBoxReference = useRef<HTMLInputElement[]>([]);
    const [profileObj, setProfileObj] = useState<ProfileData>({
        name: "",
        email: "",
        mobile: "",
        location: "",
        occupation: {}
    });
    const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
    const [occupation, setOccupation] = useState<Question[]>([]);
    const [Mobile, setMobile] = useState<string>("");
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>([]);
    const [uuid, setUuid] = useState<string>("");
    const [showThankYouPopup, setShowThankYouPopup] = useState<boolean>(false);
    const [isMobileChanged, setIsMobileChanged] = useState<boolean>(false);
    const [otp, setOtp] = useState<OTP>({});
    const [errors, setErrors] = useState<Errors>({});
    const [wrongOtp, setWrongOtp] = useState<boolean>(false);

    useEffect(() => {

        console.log("popmanage -- UserProfile", )

        if(isLogin !== null){
            if(isLogin){
                fetchProfileQuestions();
            }else{
                setTimeout(function(){
                    const event = new Event('nextPopup');
                    window.dispatchEvent(event); 
                }, 500)     
            }
        }
        
        return () => {
            document.body.classList.remove(styles.noscroll);
        }
    }, [isLogin]);

    const fetchProfileQuestions = () => {
        const isLive = window.location.host.includes('economictimes.indiatimes.com');
        const onboardingDomain = isLive ? "etonboard" : "etonboard-stg";
        const isPaidUser = typeof window.objUser !== 'undefined' && window.objUser.permissions && window.objUser.permissions.includes('subscribed');
        const email = typeof window.objUser !== 'undefined' && window.objUser.info && window.objUser.info.primaryEmail || '';
        const isPopupShown = jStorageReact.get('profile_update_shown');
        if (!isPopupShown) {
            const url = `https://${onboardingDomain}.economictimes.indiatimes.com/etonboard/api/v3/fetchQuestionnaire.json?isPaidUser=true&email=${email}&isEdit=true`;
            fetch(url, {
                headers: {
                    'Authorization': typeof window.objUser !== 'undefined' && window.objUser.info && window.objUser.ssoid || '2eay77d9dlvyhluun6rh5u942',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(res => {
                    const profile = res?.questionnaireDto?.screens?.filter(ele => ele.key === "screen1") || [];
                    const isProfileComplete = profile.length > 0 && profile[0].status.toLowerCase() === "complete";
                    const questionnaire = res?.questionnaireDto?.screens?.[0].questions || [];
                    setQuestionnaire(questionnaire);
                    questionnaire?.map(question => {
                        if (question?.key == 'occupation') {
                            const firstQues = question?.options?.find(() => true) || {};
                            const selectedOption = question?.options.find(option => option?.selected);
                            console.log("@@@ firstQues", firstQues)
                            console.log("@@@ selectedOption", selectedOption)
                            if (selectedOption === undefined) {

                                setOccupation(firstQues.questions)
                                setProfileObj((prevData) => ({ ...prevData, occupation: { name: firstQues.name, value: firstQues.value, selected: true, key: firstQues.key } }));
                            } else {
                                setOccupation(selectedOption?.questions)
                                setProfileObj((prevData) => ({ ...prevData, occupation: { name: selectedOption.name, value: selectedOption.value, selected: true, key: selectedOption.key } }));
                            }

                        }
                    })
                    setUuid(res.userUuid || "");
                    if (!isProfileComplete && email) {
                        const userInfo = typeof window.objUser !== 'undefined' && window.objUser.info;

                        setShowProfileForm(true);
                        setDefaultData(userInfo);
                        // fireGaEvent('Popup Shown', window.location.href);
                        document.body.classList.add(styles.noscroll);
                    }else{
                        const event = new Event('nextPopup');
                        window.dispatchEvent(event);    
                    }
                });
        }
    };
    const handleOccupationChange = (e: any) => {
        const { name, value } = e.target;
        questionnaire?.map(question => {
            if (question?.key == name) {
                question?.options?.map(option => {
                    if (option?.value == value) {
                        if (option?.questions) {
                            occupation && occupation.length && occupation?.map(data => {
                                setProfileObj((prevData) => ({ ...prevData, [data.key]: "" }))
                            })
                            setOccupation(option?.questions);
                        }
                        setProfileObj((prevData) => ({ ...prevData, [name]: { name: option?.name, value: option?.value, selected: true, key: option?.key } }));
                    }
                })
            }
        })
    }
    const handleOccupOptionChange = (e: any) => {
        const { name, value } = e.target;
        occupation?.map(question => {
            if (question?.key == name) {
                question?.options?.map(option => {
                    if (option?.value == value) {
                        setProfileObj((prevData) => ({ ...prevData, [name]: { name: option?.name, value: option?.value, selected: true, key: option?.key } }));
                    }
                })
            }
        })
    }
    const onChangeHandler = (e: any) => {
        const { name, value } = e.target;
        setProfileObj((prevData) => ({ ...prevData, [name]: value }));
    }
    const onPopUpClose = () => {
        // fireGaEvent('Popup Closed', window.location.href);
        setShowProfileForm(false);
        jStorageReact?.set('profile_update_shown', 1, { TTL: timeLeftForNextDay() });
        document.body.classList.remove(styles.noscroll);
        const event = new Event('nextPopup');
        window.dispatchEvent(event);
    }
    const setDefaultData = userInfo => {
        if (typeof window.geoinfo !== "undefined" && window.geoinfo) {
            setProfileObj((prevData) => ({ ...prevData, location: window.geoinfo.city }));
        }
        setProfileObj((prevData) => ({ ...prevData, name: userInfo?.firstName ? userInfo?.firstName : "" + " " + userInfo?.lastName ? userInfo?.lastName : "" }));
        setProfileObj((prevData) => ({ ...prevData, email: userInfo?.primaryEmail }));
        const mobileNumber = userInfo?.mobileData && userInfo?.mobileData?.Verified && userInfo?.mobileData?.Verified?.mobile ? userInfo?.mobileData?.Verified?.mobile : "";
        setMobile(mobileNumber);
        setProfileObj((prevData) => ({ ...prevData, mobile: mobileNumber }));
    }

    const saveProfileData = (otpVerified = false) => {
        if (profileObj?.mobile != Mobile && !otpVerified) {
            if (profileObj?.mobile?.length < 10) {
                alert('Please enter 10 digit Valid Mobile No.');
                // fireGaEvent('Popup Error', 'Incorrect Mobile number');
                document.getElementById("mobile")?.focus();
            } else {
                // window.objUser && window.objUser.loadSsoApi(function () {
                window.jsso?.v1AddUpdateMobile(profileObj?.mobile, submitMobileCallbak)
                // });
            }
        } else {
            const url = (APIS_CONFIG as any)["SAVEPROFILE"][window.APP_ENV];
            const header = {
                "Content-Type": "application/json",
            }
            const profileData: any[] = [];
            Object.keys(profileObj) && Object.keys(profileObj).map((key) => {
                // fireGaEvent(`Popup Filled-${key}`);
                if (profileObj[key].selected) {
                    profileObj[key] && profileData.push({ questionKey: key, answers: [{ ...profileObj[key] }] })
                } else {
                    profileObj[key] && profileData.push({ questionKey: key, answer: profileObj[key] })
                }
            });
            const payload = {
                paidUser: isPrime,
                responses: profileData,
                uuid: uuid
            }
            const requestOptions = {
                method: "POST",
                headers: header,
                body: JSON.stringify(payload),
            };

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.statusCode == 200) {
                        // fireGaEvent('Popup Completed', 'CTA Clicked');
                        setShowThankYouPopup(true);
                        // fireGaEvent('Thank you Popup Shown');
                        jStorageReact?.set('profile_update_shown', 1, { TTL: timeLeftForNextDay() });
                        setTimeout(() => {
                            // fireGaEvent('Thank you Popup Closed');
                            document.body.classList.remove(styles.noscroll);
                            setShowProfileForm(false);
                            setShowThankYouPopup(false)
                        }, 3000);
                    }
                })
                .catch((error) => console.log("error", error));
        }

    }
    // const fireGaEvent = (action: any, label: any = "") => {
    //     window.grxEvent('event', { 'event_category': 'User Profile', 'event_action': action, 'event_label': label }, 1);
    // }
    const submitMobileOtp = () => {
        const errors = validateDigits(otp);
        console.log("@@@@err", errors);
        setErrors((prevData) => ({ ...prevData, ...errors }));
        if (Object.keys(errors).length == 0) {
            const mobileOtp = `${otp.digit1}${otp.digit2}${otp.digit3}${otp.digit4}${otp.digit5}${otp.digit6}`;
            // fireGaEvent('OTP Popup Clicked', 'Verify');
            window.jsso?.v1VerifyAlternateMobile(profileObj?.mobile, mobileOtp, uuid, submitMobileOtpCallbak);
        } else {

        }
    }
    const setOtpDigits = (e: any, index: any) => {
        const { name, value } = e.target;
        setWrongOtp(false);
        setOtp((prevData) => ({ ...prevData, [name]: value }));
        if (value && index < 5) {
            otpBoxReference.current[index + 1].focus()
        }
        const errors = validateOTPOnChange(name, value);
        setErrors((prevState) => ({ ...prevState, ...errors }));
    }
    const validateOTPOnChange = (name, value) => {
        switch (name) {
            case "digit1":
                errors.digit1 = !value ? "required" : "";
                break;
            case "digit2":
                errors.digit2 = !value ? "required" : "";
                break;
            case "digit3":
                errors.digit3 = !value ? "required" : "";
                break;
            case "digit4":
                errors.digit4 = !value ? "required" : "";
                break;
            case "digit5":
                errors.digit5 = !value ? "required" : "";
                break;
            case "digit6":
                errors.digit6 = !value ? "required" : "";
                break;
        }
        for (let key in errors) {
            if (errors.hasOwnProperty(key) && (errors[key] === "" || errors[key] === "undefined" || typeof errors[key] === "undefined")) {
                delete errors[key];
            }
        }

        return errors;
    }
    const submitMobileCallbak = (res) => {
        if (res?.status == "SUCCESS" && res?.code == 200) {
            const uuid = res && res?.data && res?.data?.uuid || "";
            uuid && setUuid(uuid);
            setIsMobileChanged(true);
            // fireGaEvent('OTP Popup Shown');
        } else {
            alert('Error message is ' + res.message + ' ---> ' + res.messageDesc);
            //saveProfileData(true);
        }
    }
    const validateDigits = (otp: any) => {
        errors.digit1 = !otp.digit1 ? "required" : "";
        errors.digit2 = !otp.digit2 ? "required" : "";
        errors.digit3 = !otp.digit3 ? "required" : "";
        errors.digit4 = !otp.digit4 ? "required" : "";
        errors.digit5 = !otp.digit5 ? "required" : "";
        errors.digit6 = !otp.digit6 ? "required" : "";

        for (let key in errors) {
            if (errors.hasOwnProperty(key) && (errors[key] === "" || errors[key] === "undefined" || typeof errors[key] === "undefined")) {
                delete errors[key];
            }
        }

        return errors;
    }
    const onClickBack = () => {
        setIsMobileChanged(false);
        setErrors({});
        // fireGaEvent('OTP Popup Clicked', 'Back');

    }
    const submitMobileOtpCallbak = (res: any) => {
        if (res?.status == "SUCCESS" && res?.code == 200) {
            saveProfileData(true);
        } else if (res?.status == "FAILURE") {
            //setErrors({msg:"Something Went Wrong"});
            if (res?.message == "ALREADY_VERIFIED") {
                saveProfileData(true);
            } else {
                setWrongOtp(true);
                setOtp({});
                alert(res.message);
                // fireGaEvent('OTP Popup Error', res.message);
            }
        }
    }
    const handleBackspaceAndEnter = (e: any, index: any) => {
        if ((e.key === "Backspace" || e.keyCode == 8) && !e.target.value && index > 0) {
            otpBoxReference.current[index - 1].focus()
        }
    }
    const resendOtp = () => {
        // fireGaEvent('OTP Popup Clicked', 'Resend');
        window.jsso?.v1AddUpdateMobile(profileObj?.mobile, resendOTPCallbak);
    }
    const resendOTPCallbak = (res) => {
        if (res.status == "SUCCESS") {
            alert('We have sent a 6 digit code to your mobile ' + profileObj?.mobile);
            setOtp({});
        } else {
            alert('some error message is  ' + res.message);
        }
    }
    const timeLeftForNextDay = () => {
        let ms = 0;
        let currentDate = new Date();
        let a = new Date();
        currentDate.setDate(currentDate.getDate() + 4);
        let b = new Date(currentDate.toDateString());
        ms = (b.getTime() - a.getTime());
        return ms;
    }

    return (
        <>
            {showProfileForm ? <div className={styles.shadowUserProfile}>
                <div className={styles.userProfilePopup}>
                    {showThankYouPopup ? (
                        <div className={styles.thanksMain}>
                            {/* <span onClick={() => setShowThankYouPopup(false)}>&#8592;</span> */}
                            <span className={styles.close} onClick={onPopUpClose} />
                            <div className={styles.thanksImg}>
                                <img src="https://img.etimg.com/photo/105439791.cms" loading="lazy" />
                            </div>
                            <p className={styles.thankYouTitle}>Thank you!</p>
                            <p className={styles.thankYouMsg}>Your profile has been updated successfully.</p>

                        </div>
                    ) : isMobileChanged ?
                        <div className={styles.optMain}>
                            <span className={styles.backArrow} onClick={onClickBack}>
                                <span className={styles.arw}></span>
                                <span className={styles.line}></span>
                            </span>
                            <span className={styles.close} onClick={onPopUpClose} />
                            <p className={styles.otpScreenTitle}>Verify your mobile</p>
                            <p className={styles.otpScreenMsg}>We have sent you a verification code at <b>{profileObj?.mobile}</b>. please enter the code below to verify your mobile.</p>
                            <div className={styles.otpBoxSec}>
                                <div className={styles.optBoxMain}>

                                    {["digit1", "digit2", "digit3", "digit4", "digit5", "digit6"].map((digit, index) => (
                                        <input
                                            key={index + 1}
                                            maxLength={1}
                                            name={digit}
                                            value={wrongOtp ? "" : otp[digit] || ""}
                                            onChange={(e) => setOtpDigits(e, index)}
                                            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                                            ref={(reference: any) => (otpBoxReference.current[index] = reference)}
                                            className={`${styles.otpboxes} ${errors[digit] && styles.errField}`}
                                        />
                                    ))}
                                </div>
                                <div className={`${styles.resendBox} ${Object.keys(errors).length ? styles.errorMsg : ''}`}>
                                    {Object.keys(errors).length ? <p className={styles.errMsg}>Please enter correct OTP</p> : ""}
                                    <p className={styles.resend} onClick={resendOtp}>Resend</p>

                                </div>
                            </div>
                            <div className={styles.btnMain}>
                                <button className={styles.btn} onClick={submitMobileOtp}>Verify</button>
                            </div>
                        </div>
                        : <>
                            <span className={styles.close} onClick={onPopUpClose} />
                            <div className={styles.userProfile}>
                                <span className={styles.canvasText}>{profileObj.name[0]}</span>
                                <div className={styles.profileDetails}>
                                    <h2 className={styles.userName}>Hi {profileObj.name.split(" ")[0]}</h2>
                                    <h3 className={styles.msg}>Complete your profile and get exciting rewards</h3>
                                </div>
                            </div>
                            <div className={styles.userProfileForm}>
                                {questionnaire.map((question, i) => {
                                    if (question.type === 'Text' && question.showQuestion && !['name', 'email', 'location'].includes(question.key)) {
                                        return <div className={styles.fieldGroup} key={`field_${i}`}>
                                            <label>{question.name}</label>
                                            <input className={!question?.answer ? "" : styles.highLightField} type="text" id={question.key} disabled={question.key == "email"} value={profileObj[question.key]} name={question.key} onChange={(e) => onChangeHandler(e)} />
                                        </div>
                                    }

                                    if (question.type === 'DropDown' && question.showQuestion) {
                                        if (['occupation'].includes(question.key)) {
                                            return <>
                                                <div className={styles.fieldGroup} key={`field_${i}`}>
                                                    <label>{question.name}</label>
                                                    <select name={question.key} className={question?.answer ? "" : styles.highLightField} onChange={(e) => { handleOccupationChange(e) }}>
                                                        {/* <option selected disabled value={question.question}>{question.question}</option> */}
                                                        {
                                                            question.options?.map((option, j) => (
                                                                <option key={option.key} value={option.name} selected={option.selected}>{option.value}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                {
                                                    occupation && occupation.map((question, i) => {
                                                        if (question.type === 'Text' && question.showQuestion) {
                                                            return <div className={styles.fieldGroup} key={`field_${i}`}>
                                                                <label>{question.name}</label>
                                                                <input className={question?.answer ? "" : styles.highLightField} type="text" name={question.key} value={question.answer} onChange={(e) => onChangeHandler(e)} />
                                                            </div>
                                                        }

                                                        if (question.type === 'DropDown' && question.showQuestion) {
                                                            return <div className={styles.fieldGroup} key={`field_${i}`}>
                                                                <label>{question.name}</label>
                                                                <select className={question?.answer ? "" : styles.highLightField} name={question.key} onChange={(e) => { handleOccupOptionChange(e) }}>
                                                                    <option selected disabled value={question.question}>{question.question}</option>
                                                                    {
                                                                        question.options?.map((option, j) => (
                                                                            <option key={option.key} selected={option.selected} value={option.name}>{option.value}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                        }

                                                    })}
                                            </>
                                        } else {

                                            return <div className={styles.fieldGroup} key={`field_${i}`}>
                                                <label>{question.name}</label>
                                                <select name={question.key} className={!question?.answer ? "" : styles.highLightField} onChange={(e) => { handleOccupationChange(e) }}>
                                                    <option selected disabled value="">{question.question}</option>
                                                    {
                                                        question.options?.map((option, j) => (
                                                            <option key={option.key} value={option.name}>{option.value}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        }
                                    }

                                })}

                            </div>
                            <div className={styles.btnMain}>
                                <button className={styles.btn} onClick={() => saveProfileData()}>Save Profile</button>
                            </div>
                        </>}
                </div>
            </div> : ""}
        </>
    );
}

export default UserProfile;