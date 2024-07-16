import React, {FC, useState} from 'react';
import {Share} from "../Share";
import styles from './styles.module.scss';
import EmailStory from 'components/EmailStory';

interface SocialShareProps {
  mailData: {
    shareUrl: string;
    title: string;
    msid: number | string;
    hostId: number | string;
    type: number | string;
  }
}

const SocialShare: FC<SocialShareProps> = (props) => {  
  const url = props.mailData.shareUrl && props.mailData.shareUrl != '' ? props.mailData.shareUrl : ''
  const [showUrl, setShowUrl] = useState('no');
  const [showEmbed, setShowEmbed] = useState('no');
  const [showMail, setShowMail] = useState(false);
  
  const showHandlerModule = (val:string)=>{
    let _url = '';
    let _embed = '';
    if(val === 'url'){
      _url = 'yes';
      _embed = 'no'
    }else if(val === 'embed'){
      _url = 'no';
      _embed = 'yes'
    }
    setShowUrl(_url);
    setShowEmbed(_embed)
  }
  const closeHandler = ()=>{
    setShowUrl('no');
    setShowEmbed('no')
  }
  const closeMailHandler = ()=>{
    setShowMail(false)
  }
  const openMailHandler = () => {
    setShowMail(true)
  }
  return (  
    <Share>
        <div className={styles.codeMailVideo}>
          <span onClick={openMailHandler} className={styles.email} title="Email this video"></span>
        </div>
        <div className={styles.codeVideo}>
          <span onClick={()=>{showHandlerModule('url')}}>Copy URL</span>
          {
            showUrl === 'yes' ?  <span className={styles.copyUrlSec}>
            <input readOnly type="text" value={url} className={styles.readUrl} />
            <i  className={styles.close} onClick={closeHandler}></i>
          </span> : ''
          }
        </div>
        <div className={styles.codeVideo}>
          <span onClick={()=>{showHandlerModule('embed')}}>Embed</span>
          {
            showEmbed === 'yes' ? <span className={styles.copyUrlSec}>
            <textarea readOnly defaultValue={`<iframe mozallowfullscreen="true" webkitallowfullscreen="true" allowfullscreen="true" width="560" height="420" frameborder="0" defaultValue=${url} src=${url}></iframe>`}>{
              
            }</textarea>
            <i  className={styles.close} onClick={closeHandler}></i>
          </span> : ''
          }
          
        </div>
       {showMail ? <EmailStory closeMailHandler={closeMailHandler}/> :""}
    </Share>
  );
};

export default SocialShare;
