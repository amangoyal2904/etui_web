import { NextPage } from "next";


const VideoEmbed: NextPage<any> = (props) => {  
  console.log('videoembed frame', props);
  const iframData = props.iframeData.iframe;
  let iframUrl = iframData['@src']
  return (
    <>      
        <div>
          <iframe src={iframUrl} />
        </div>
    </>
  );
};

export default VideoEmbed;
