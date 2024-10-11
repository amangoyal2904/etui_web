"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./LiveStreamPlay.module.scss";
import APIS_CONFIG from "network/config.json";
import { getCookie } from "utils/utils";
import LiveStreamPlayCards from "./LiveStreamPlayCards";
import { useStateContext } from "store/StateContext";

declare global {
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}
const LiveStreamPlay = (props: any) => {
  const {APP_ENV} = props;
  const [newsData, setNewsData] = useState([]);
  const [currentSIndex, setCurrentSIndex] = useState(0);
  const [liveStatus, setLiveStatus] = useState(false);
  const [eventId, setEventId] = useState("");
  const [eventToken, setEventToken] = useState("");
  const [followingData, setFollowingData] = useState<any>([]);
  const [expertFollowers, setExpertFollowers] = useState("");
  const iframeRef = useRef();
  const { state } = useStateContext();
  const { isLogin, userInfo } = state.login;

  const fetchData = async (url: string, method: string, body?: any) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Rethrow to handle it in the calling function
    }
  };

  const fetchList = async () => {
    const data = {
      conditions: [
        { fieldName: "eventStatus", value: [3, 5], operation: "in" },
        { fieldName: "streamFlag", value: [1, 2], operation: "in" },
        { fieldName: "paidEvent", value: true, operation: "notEqual" }
      ],
      multiSort: [
        { field: "eventStatus", type: "asc" },
        { field: "startTime", type: "desc" }
      ],
      pageNumber: 1,
      pageSize: 5
    };
    const apiUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/getEventData";
    //const apiUrl = "http://localhost:3002/api/livestream";
    return await fetchData(apiUrl, "POST", data);
  };

  const fetchToken = async () => {
    const requestUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/generateToken";
    //const requestUrl = "http://localhost:3002/api/livestreamtocken";
    const name = isLogin ? userInfo?.firstName || "Guest User" : "Guest User";
    const userID = isLogin
      ? userInfo?.primaryEmail || getCookie("_grx") || getCookie("pfuuid") || Math.random().toString(36).slice(2)
      : getCookie("_grx") || getCookie("pfuuid") || Math.random().toString(36).slice(2);

    const payload = {
      eventID: eventId,
      eventToken,
      meta: { isloggedin: isLogin, section: "ETMain_HP_MWeb" },
      name,
      role: 0,
      userID
    };

    return await fetchData(requestUrl, "POST", payload);

    //return tokenData.livestreamdata;
  };

  useEffect(() => {
    if (eventId && eventToken) {
      fetchToken()
    }
  }, [eventId, eventToken, liveStatus]);

  const startFetching = async () => {
    try {
      const response = await fetchList();
      const { result = [] } = response.livestreamdata || response;
      const filteredEvents = result.filter((event: { eventStatus: number }) => event.eventStatus === 3 || event.eventStatus === 5);
      if (filteredEvents.length) {
        setNewsData(filteredEvents);
        prepareData(filteredEvents[0]);
      }
    } catch (error) {
      console.log("No LiveStream is LIVE at this time", error);
    }
  };

  const fetchFollowingExperts = async () => {
    try {
      const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
      if (!!authorization) {
        const requestUrl = (APIS_CONFIG as any)?.["getFollowedExperts"][APP_ENV];
        // Replace Service.get with fetch
        const response = await fetch(requestUrl, {
          method: "GET",
          headers: {
            Authorization: authorization,
            "Content-Type": "application/json"
          },
          cache: "no-store"
        });
        const followingsData = await response.json(); // Parse the JSON response
        setFollowingData(followingsData);
      }
    } catch (e) {
      console.log("Error in fetching following experts", e);
    }
  };

  const prepareData = (item: any) => {
    setEventId(item?.eventId);
    setEventToken(item?.eventToken);
    setLiveStatus(item?.eventStatus == 3 || item?.eventStatus === 5 ? true : false);
    if (item.eventStatus == 3 || item?.eventStatus === 5) {
      sessionStorage.setItem("doNotRefreshPage", "1");
      fetchFollowingExperts();
      fetchFollowingData(item);
    } else {
      sessionStorage.removeItem("doNotRefreshPage");
    }
  };

  const fetchFollowingData = async (item: any) => {
    try {
      const data = [{ prefDataVal: item.expertId, userSettingSubType: "Expert" }];
      const apiUrl = (APIS_CONFIG as any)?.["expertFollower"][APP_ENV];
      // Replace Service.post with fetch
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        cache: "no-store"
      });
      const followingData = await response.json(); // Parse the JSON response
      setExpertFollowers(followingData?.prefDataValCountList[0]?.count);
    } catch (e) {
      console.log("Error in fetching following data", e);
    }
  };

  useEffect(() => {
    startFetching();
  }, []);

  const onSwitching = (index: any) => {
    setCurrentSIndex(index);
    const item = newsData[index];
    item && prepareData(item);
  };
  return newsData && liveStatus ? (
    <div className={styles.livestreamBox}>
      <div className={styles.streamIconBox}>
        <span className={`${styles.subSprite} ${styles.streamIcon}`}></span>
      </div>
      <div className={styles.sliderContainer}>
        {newsData?.length ? (
          <LiveStreamPlayCards
            iframeRef={iframeRef}
            newsData={newsData}
            onSwitching={onSwitching}
            currentSIndex={currentSIndex}
            expertFollowers={expertFollowers}
            followingData={followingData}
            fetchFollowingExperts={fetchFollowingExperts}
            APP_ENV={props.APP_ENV}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    ""
  );
};
export default LiveStreamPlay;
