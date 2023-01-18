import React, { useEffect } from "react";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import styles from "./styles.module.scss";

function CommentCard(props) {
  const { userFullName, commentTime, statusPoints, commentText, level } = props;
  return (
    <div className={`${styles.commentBox} ${level > 1 && styles.commentGray}`}>
      <div className={styles.commentUser}>
        <div className={styles.userImage}>
          <a href="http://mytimes.indiatimes.com/profile/807448453">
            <img
              alt="user"
              className={styles.avatar}
              width={40}
              height={40}
              src="https://img.etimg.com/photo/47865640.cms"
            />
          </a>
          <div style={{ height: 18, display: "block", paddingBottom: 3, position: "relative" }}>
            {" "}
            <span
              style={{
                color: "#336797",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: "normal",
                float: "left",
                height: 17
              }}
            >
              <div className={styles.followbtn} />
            </span>
          </div>
        </div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>
            <a
              className={styles.author}
              href="http://mytimes.indiatimes.com/profile/807448453"
              id="profileLink12645000131"
            >
              {userFullName}
            </a>
            {statusPoints && <div className={styles._timespoints} id="loggedtpoint12645000131">
              <div>
                <div className={`${styles._tpbar} ${styles.tpbarBronze}`}>
                  <span>
                    <span className={`${styles.crown} ${styles.commentSprite}`} />{statusPoints}
                  </span>{" "}
                </div>
              </div>
              <div className={styles.badgepointnw}>6 Points</div>
            </div>}{" "}
            <span className={styles.userLocation} data-location="" />{" "}
          </div>
          <span
            style={{ display: "block", fontWeight: "normal", color: "#868686", fontSize: 11 }}
            id="dtfrmt2645000131"
          >
            {commentTime}
          </span>{" "}
        </div>
        <div className={styles.commentText}>
          <p className="">{commentText}</p>
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
  );
}

export default CommentCard;
