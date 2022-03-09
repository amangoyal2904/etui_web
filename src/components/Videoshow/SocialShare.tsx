import { NextPage } from "next";
import Share from "../Share";



const SocialShare: NextPage = (props) => {  
  return (
    <>      
        <Share />
        <div className="codeMailVideo">
          <span className="email socialSprite" title="Email this video"></span>
        </div>
        <div className="codeVideo">
          <span>Copy URL</span>
        </div>
        <div className="codeVideo">
          <span>Embed</span>
        </div>
    </>
  );
};

export default SocialShare;
