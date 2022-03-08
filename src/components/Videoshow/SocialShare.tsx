import { NextPage } from "next";
import Share from "../Share";



const SocialShare: NextPage = (props) => {  
  const _data = {
    iconClass:'fb', 
    title : 'Russia-Ukraine crisis: Ukraine says Russian forces seize Zaporizhzhia nuclear plant'
  }
  return (
    <>      
        <Share data={_data}/>
    </>
  );
};

export default SocialShare;
