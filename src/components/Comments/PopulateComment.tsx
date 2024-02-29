import { FC, useEffect, useRef, useState } from 'react';
import Service from 'network/service';
import APIS_CONFIG from "network/config.json";
import axios from 'axios';
import styles from './styles.module.scss'
import CommentCard from './CommentCard';
interface commentsProps {
  msid: number | string;
}


const PopulateComment:FC<commentsProps> = ({msid}) => {
  const [commentsData,setCommentsData] = useState<Object []>([]);
  const [activeIndex, setActiveIndex] = useState({"isReplyActive":null,"isFlagActive":null});
  const loadMoreCount = useRef(1);
  const visibleComments = useRef(2);
  console.log('Populate comment :', msid);
  const url = `https://etdev8243.indiatimes.com/commentsdata.cms?appkey=ET&sortcriteria=CreationDate&order=asc&lastdeenid=0&after=true&withReward=true&msid=${msid}`;
  useEffect(() => {
    fetch(url + "&pagenum=1&size=2", {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        setCommentsData(data);
      })
      .catch(err => {
        console.log('error: ', err);
      })
  }, [url]);

  const loadMore = (pageNumber,numberOfComments=25) => {
    fetch(url + `&pagenum=${pageNumber}&size=${numberOfComments}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(nextCommentsData => {
        visibleComments.current += numberOfComments;
        setCommentsData([...commentsData,...nextCommentsData.slice(1)]);
      })
      .catch(err => {
        console.log('error: ', err);
      })
  };

  const commentCount = commentsData[0];
  const recentMessageCount = commentCount?.totalcount;
  function populate(cards:Object[],level=1){
    let commentList = [];
    cards.forEach((item,index)=>{
      commentList.push(<CommentCard key = {item._id} commentCardId = {item._id} activeIndex = {activeIndex} setActiveIndex = {setActiveIndex} userFullName = {item.F_NAME} commentTime = {item.C_D} commentText = {item.C_T} statusPoints = {item.user_reward?.statusPoints} level = {level}/>);
      if(item.CHILD){
        commentList.push(populate(item.CHILD,level+1));
      }
    });
    return commentList;
  }
  return (
    <div id={styles.populateComment}>
      <div className={styles.commentTitle}>
        <h4>Recent Messages ({recentMessageCount})</h4>
      </div>
      {populate(commentsData.slice(1))}
      {visibleComments.current < commentCount?.cmt_c && <button onClick={()=>{loadMore(++loadMoreCount.current,2)}}>Load More</button>}
    </div>
  );
}

export default PopulateComment;