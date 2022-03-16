import { NextPage } from "next";
import Share from "../Share";
import {useState} from 'react';
import MailSendTemplate from '../MailSend';



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
        <div className="codeMailVideo">
          <span onClick={()=>{setShowMail('yes')}} className="email socialSprite" title="Email this video"></span>
          {
            showMail === 'yes' ? <MailSendTemplate mailData={props.mailData} onclickhandler={closeMailHandler} /> : ''
          }
        </div>
        <div className="codeVideo">
          <span onClick={()=>{showHandlerModule('url')}}>Copy URL</span>
          {
            showUrl === 'yes' ?  <span className="copyUrlSec">
            <input readOnly type="text" value={url} className="readUrl" />
            <i  className="close" onClick={closeHandler}></i>
          </span> : ''
          }
        </div>
        <div className="codeVideo">
          <span onClick={()=>{showHandlerModule('embed')}}>Embed</span>
          {
            showEmbed === 'yes' ? <span className="copyUrlSec">
            <textarea readOnly defaultValue={`<iframe mozallowfullscreen="true" webkitallowfullscreen="true" allowfullscreen="true" width="560" height="420" frameborder="0" defaultValue=${url} src=${url}></iframe>`}>{
              
            }</textarea>
            <i  className="close" onClick={closeHandler}></i>
          </span> : ''
          }
          
        </div>
    </>
  );
};

export default SocialShare;
