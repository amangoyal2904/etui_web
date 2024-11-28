import { useEffect, useState } from "react";
import APIS_CONFIG from "../../network/config.json";
import { currPageType } from "utils";
import NudgeContainer from "./NudgeContainer";
import { grxEvent } from "utils/ga";

import styles from "./styles.module.scss";
import { fetchAllMetaInfo } from "utils/articleUtility";
import { useStateContext } from "../../store/StateContext";
import jStorage from "jstorage-react";
import jStorageReact from "jstorage-react";
import { getSubscriptionContent } from "utils/utils";

export default function TopNudge({objVc}) {
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, permissions, isPink } = state.login;
  const [subsContent, setSubsContent] = useState<any>({});
  
  const loadSubsContent = () => {
    try {
      const getSubsContent = jStorageReact.get("subscriptioncontent");
      if (getSubsContent) {
        setSubsContent(JSON.parse(getSubsContent).message);
      } else {
        getSubscriptionContent((res) => {
          setSubsContent(res);
        });
      }
    } catch (er) {
      console.log("Error in content fetching", er);
    }
  };
  useEffect(()=>{
    if(Object.keys(subsContent)?.length == 0){
      loadSubsContent();
    }
  })
  console.log("@@@@-->",subsContent);
  return (
    <>   {subsContent &&    
      <div className={`${styles.topNudgeWrp} ${isPink ? styles.pink_theme : ""}`}>
        <div className={styles.breadCrumbWrap}>
          <NudgeContainer subsContent={subsContent} />
        </div>
      </div>}
    </>
  );
}
