import React, { useEffect } from 'react'
import Service from 'network/service';
import APIS_CONFIG from "network/config.json";
import styles from './styles.module.scss'

function PopulateComment() {
  const url = "https://economictimes.indiatimes.com/commentsdata.cms?appkey=ET&sortcriteria=CreationDate&order=asc&lastdeenid=0&after=true&withReward=true&msid=95532873&pagenum=1&size=25"
  useEffect(() => {
    fetch(url, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        console.log("comments data",data);
      })
      .catch(err => {
        console.log('error: ', err);
      })
  },[]);

  return (
    <div id={styles.populateComment}>
      <div className={styles.commentTitle}>
        <h4>Recent Messages (6)</h4>
      </div>
      <div className={`${styles.commentBox} ${styles.level1}`}>
        <div className={styles.commentUser}>
          <div className={styles.userImage}>
            <a href="http://mytimes.indiatimes.com/profile/807448453">
              <img alt="user" className={styles.avatar} width={40} height={40} src="https://img.etimg.com/photo/47865640.cms"/>
            </a>
            <div style={{height: 18,display: "block",paddingBottom: 3,position: "relative"}}>
              {" "}
              <span style={{color: "#336797",cursor: "pointer",fontSize: 11,fontWeight: "normal",float: "left",height: 17}}>
                <div className={styles.followbtn} />
              </span>
            </div>
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              <a className={styles.author} href="http://mytimes.indiatimes.com/profile/807448453" id="profileLink12645000131">
                Dayanidhi Gupta
              </a>
              <div className={styles._timespoints} id="loggedtpoint12645000131">
                <div>
                  <div className={`${styles._tpbar} ${styles.tpbarBronze}`}>
                    <span>
                      <span className={`${styles.crown} ${styles.commentSprite}`}/> 6
                    </span>{" "}
                  </div>
                </div>
                <div className={styles.badgepointnw}>6 Points</div>
              </div>{" "}
              <span className={styles.userLocation} data-location="" />{" "}
            </div>
            <span style={{display: "block",fontWeight: "normal",color: "#868686",fontSize: 11}} id="dtfrmt2645000131">
              1 day ago
            </span>{" "}
          </div>
          <div className={styles.commentText}>
            <p className="">India is growing</p>
            <div className={styles.commentUserInputs}>
              <a className={styles.agree}>
                <span className={styles.commentSprite} />
                <span className={styles.val}>1</span>
              </a>
              <a className={styles.disagree}>
                <span className={styles.commentSprite} />
                <span className={styles.val}>0</span>
              </a>{" "}
              <a className={styles._reply}>
                <span className={styles.commentSprite} />
                Reply
              </a>{" "}
              <div className={styles.offensive_wrap}>
                <a className={styles.offensive}>
                  <span className={styles.commentSprite} />
                  Flag
                </a>
              </div>
              <div className={styles.cmtReplier} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopulateComment;