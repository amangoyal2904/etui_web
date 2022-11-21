import { NextPage } from "next";
import Share from "../Share";
import {useState} from 'react';
import styles from './styles.module.scss';

const SocialShare: NextPage = (props:any) => {  
  const url = props.mailData.url && props.mailData.url != '' ? props.mailData.url : ''
  const [showUrl, setShowUrl] = useState('no');
  const [showEmbed, setShowEmbed] = useState('no');
  const [showMail, setShowMail] = useState('no');
  
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
    setShowMail('no')
  }
  return (
    <>      
        <Share />
        <div className={styles.codeMailVideo}>
          <span onClick={()=>{setShowMail('yes')}} className={styles.email} title="Email this video"></span>
          {
            //showMail === 'yes' ? <MailSendTemplate mailData={props.mailData} onclickhandler={closeMailHandler} /> : ''
          }
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
    </>
  );
};

export default SocialShare;
