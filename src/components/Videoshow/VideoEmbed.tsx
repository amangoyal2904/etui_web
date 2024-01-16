import { NextPage } from "next";


const VideoEmbed: NextPage<any> = (props) => {  
  //console.log('videoembed frame', props);
  const iframData = props.iframeData && props.iframeData !== '' ? props.iframeData : '';
  const renderIframe = ()=>{
    // console.log('iframData', iframData)
    return {__html: 'iframData'};
  }
  return (
    <>      
        <div dangerouslySetInnerHTML={renderIframe()}></div>
    </>
  );
};

export default VideoEmbed;
