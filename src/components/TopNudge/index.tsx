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
      if (getSubsContent && typeof getSubsContent === 'string') {
        try {
          const parsedContent = JSON.parse(getSubsContent);
          if (parsedContent?.message) {
            setSubsContent(parsedContent.message);
          } else {
            throw new Error('Invalid content structure');
          }
        } catch (parseError) {
          console.error("Error parsing stored content:", parseError);
          // Fallback to fetch fresh content
          getSubscriptionContent((res) => {
            setSubsContent(res);
          });
        }
      } else {
        getSubscriptionContent((res) => {
          setSubsContent(res);
        });
      }
    } catch (er) {
      console.error("Error in content fetching:", er);
    }
  };
  useEffect(()=>{
    if(Object.keys(subsContent)?.length == 0){
      loadSubsContent();
    }
  })
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
