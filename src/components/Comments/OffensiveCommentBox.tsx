import React, { FC, useEffect, useState } from 'react'
import styles from './styles.module.scss'
interface ReplyOnCommentProps {
  commentCardId: number,
  activeIndex: any,
  setActiveIndex: any,
  setShowOffensiveMark
}
interface FormDataType {
  ofcommenthostid: number,
  ofcommentchannelid: number,
  ofcommentid:number,
  ofcommenteroid:number,
  ofreason: string,
  ofusername: string,
  ofuserisloggedin:number,
  ofuserssoid: string,
  ofuseruid:string
}
const OffensiveCommentBox:FC<ReplyOnCommentProps> = (props) => {
    const {commentCardId, activeIndex, setActiveIndex,setShowOffensiveMark} = props;
    const [openAbuseForm,setOpenAbuseForm] = useState(true);
    const [openOthersReason, setOpenOthersReason] = useState(false);
    // const [selectedOption, setSelectedOption] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
      ofcommenthostid: 153,
      ofcommentchannelid: 2147477890,
      ofcommentid:95532873,
      ofcommenteroid: commentCardId,
      ofreason: "",
      ofusername: "",
      ofuserisloggedin: 1,
      ofuserssoid: "dayanidhi.gupta@timesinternet.in",
      ofuseruid: "dayanidhi.gupta@timesinternet.in"
    });
    const [response, setResponse] = useState('');
    // const handleOptionChange = (event) => {
    //   setSelectedOption(event.target.value);
    // };
    const handleFormChange = (event) => {
      if(event.target.value === "Others: "){
        setOpenOthersReason(true);
      }else if(event.target.name === "ofotherreason"){
        setFormData({
          ...formData,
          ["ofreason"]: "Others: " + event.target.value
      });
      }else if(event.target.name === "ofusername"){
        setFormData({
          ...formData,
          ["ofusername"]: event.target.value
        });
      }else {
        setOpenOthersReason(false);
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
      });
      }      
  };
    const handleSubmit = (event) => {
      event.preventDefault();
      let formPayLoad = Object.keys(formData).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(formData[k])
      }).join('&');
      console.log("formData",formData);
      console.log("formPayLoad",formPayLoad);
      // setFormSubmitted(true);
      setShowOffensiveMark(true);
      // fetch('https://etdev8243.indiatimes.com/offensive/mark', { //https://economictimes.indiatimes.com/offensive/mark
      //   method: 'POST',
      //   headers : {
      //     "content-type": "application/x-www-form-urlencoded",
      //   },
      //   body: formPayLoad,
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log("offensive response",data);
      //     setFormSubmitted(true);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    };
 
    const handleCloseAbuseForm = () => {
      setActiveIndex({"isReplyActive":null,"isFlagActive":null});
      setOpenAbuseForm(false);
    }
    return(
      <>
        { openAbuseForm && <div id={styles.reportAbuseDiv}>
        <form id={styles.abuseForm} onSubmit={handleSubmit}>
          <input defaultValue="fdc9c803-1c41-4b9f-9774-ffb531e06db4" id="_commentId" name="_commentId" type="hidden"/>
          <input defaultValue="reco4fdc9c803-1c41-4b9f-9774-ffb531e06db4" id="cookieValue" name="cookieValue" type="hidden"/>
          <div className={styles.formElms}>
            <p className={styles.head}>Find this comment offensive?</p>
            <div className={styles.container_offensive}>
              <p className={styles.des}>
                Choose your reason below and click on the Report button. This will
                alert our moderators to take action
              </p>
              <label htmlFor="ofusername">
                <b>Name</b>
              </label>
              <input maxLength={100} size={45} id="ofusername" name="ofusername" type="text" onChange={handleFormChange}/>
              <p className={styles.headGrey}>Reason for reporting:</p>
              <input id="ofreason" name="ofreason" type="hidden" defaultValue="" />
              <label>
                <input defaultValue="Foul language" name="ofreason" type="radio" onChange={handleFormChange}/>
                <span>Foul language</span>
              </label>
              <label>
                <input defaultValue="Slanderous" name="ofreason" type="radio" onChange={handleFormChange}/>
                <span>Slanderous</span>
              </label>
              <label>
                <input defaultValue="Inciting hatred against a certain community" name="ofreason" type="radio" onChange={handleFormChange}/>
                <span>Inciting hatred against a certain community</span>
              </label>
              <label>
                <input defaultValue="Others: " name="ofreason" type="radio" onChange={handleFormChange}/>
                <span>Others</span>
              </label>
              <div className="clr" />
              {openOthersReason && <textarea className={styles.hidden} name="ofotherreason" onChange={handleFormChange} />}
              <button type="submit">Report this!</button>
              <input className={styles.closeBtn} defaultValue="Close" type="button" onClick={handleCloseAbuseForm}/>
            </div>
            {/* <input id="ofcommenteroid" name="ofcommenteroid" type="hidden" defaultValue={2645002884}/> */}
            {/* <input defaultValue={153} id="ofcommenthostid" name="ofcommenthostid" type="hidden"/> */}
            {/* <input defaultValue={2147477890} id="ofcommentchannelid" name="ofcommentchannelid" type="hidden"/> */}
            {/* <input id="ofuseremail" name="ofuseremail" type="hidden" defaultValue="dayanidhi.gupta@timesinternet.in"/> */}
            {/* <input id="ofcommentid" name="ofcommentid" type="hidden" defaultValue={95532873}/> */}
            {formSubmitted && <div className={styles.msg}>
              <p>Your Reason has been Reported to the admin.</p>
              <input className={styles.closeBtn} defaultValue="Close" type="button" />
            </div>}
          </div>
        </form>
      </div>}
      </>
    );
}
export default OffensiveCommentBox;