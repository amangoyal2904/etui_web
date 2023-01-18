import { FC, useEffect, useState } from 'react';
import Service from 'network/service';
import APIS_CONFIG from "network/config.json";
import styles from './styles.module.scss'
import CommentCard from './CommentCard';
interface commentType {
  commentsData:object[]
}

const PopulateComment:FC<commentType> = ({commentsData}) => {
  // const {totalcount}:any = commentsData[0];
  console.log(commentsData[0]);
  // const recentMessageCount:any = totalcount;
  function populate(cards,level=1){
    let commentList = [];
    cards.forEach((item,index)=>{
      commentList.push(<CommentCard key = {item._id} userFullName = {item.F_NAME} commentTime = {item.C_D} commentText = {item.C_T} statusPoints = {item.user_reward?.statusPoints} level = {level}/>);
      if(item.CHILD){
        commentList.push(populate(item.CHILD,++level));
      }
    });
    return commentList;
  }
  return (
    <div id={styles.populateComment}>
      <div className={styles.commentTitle}>
        <h4>Recent Messages (7)</h4>
      </div>
      {populate(commentsData.slice(1))}
    </div>
  );
}

export default PopulateComment;