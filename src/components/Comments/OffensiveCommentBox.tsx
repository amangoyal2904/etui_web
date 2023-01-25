import React, { useEffect } from 'react'
import styles from './styles.module.scss'

function OffensiveCommentBox() {

    const handleSubmit = () => {

    }
    return(
      <div id={styles.reportAbuseDiv}>
        <form id={styles.abuseForm}>
          <input defaultValue="fdc9c803-1c41-4b9f-9774-ffb531e06db4" id="_commentId" name="_commentId" type="hidden"/>
          <input defaultValue="reco4fdc9c803-1c41-4b9f-9774-ffb531e06db4" id="cookieValue" name="cookieValue" type="hidden"/>
          <div className={styles.formElms}>
            <p className={styles.head}>Find this comment offensive?</p>
            <div className={styles.container_offensive}>
              <p className={styles.des}>
                Choose your reason below and click on the Report button. This will
                alert our moderators to take action
              </p>
              <label htmlFor="ofusername" style={{ display: "none" }}>
                <b>Name</b>
              </label>
              <input maxLength={100} size={45} id="ofusername" name="ofusername" type="text" style={{ display: "none" }}/>
              <p className={styles.headGrey}>Reason for reporting:</p>
              <input id="ofreason" name="ofreason" type="hidden" defaultValue="" />
              <label>
                <input defaultValue="Foul language" name="ofreasonradio" type="radio"/>
                <span>Foul language</span>
              </label>
              <label>
                <input defaultValue="Slanderous" name="ofreasonradio" type="radio" />
                <span>Slanderous</span>
              </label>
              <label>
                <input defaultValue="Inciting hatred against a certain community" name="ofreasonradio" type="radio"/>
                <span>Inciting hatred against a certain community</span>
              </label>
              <label>
                <input defaultValue="Others" name="ofreasonradio" type="radio" />
                <span>Others</span>
              </label>
              <div className="clr" />
              {/* <textarea className={styles.hidden} value="" name="offensiveother" style={{ display: "none" }} defaultValue={""}/> */}
              <input defaultValue="Report this!" onClick={handleSubmit} type="button"/>
              <input className={styles.closeBtn} defaultValue="Close" type="button" />
            </div>
            <input id="ofcommenteroid" name="ofcommenteroid" type="hidden" defaultValue={2645002884}/>
            <input defaultValue={153} id="ofcommenthostid" name="ofcommenthostid" type="hidden"/>
            <input defaultValue={2147477890} id="ofcommentchannelid" name="ofcommentchannelid" type="hidden"/>
            <input id="ofuseremail" name="ofuseremail" type="hidden" defaultValue="dayanidhi.gupta@timesinternet.in"/>
            <input id="ofcommentid" name="ofcommentid" type="hidden" defaultValue={95532873}/>
            <div className={styles.msg} style={{ display: "none" }}>
              <p>Your Reason has been Reported to the admin.</p>
              <input className={styles.closeBtn} defaultValue="Close" type="button" />
            </div>
          </div>
        </form>
      </div>
  
    );
}
export default OffensiveCommentBox;