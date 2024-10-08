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
  const [newsData, setNewsData] = useState([]);
  const [currentSIndex, setCurrentSIndex] = useState(0);
  const [liveStatus, setLiveStatus] = useState(false);
  const [eventId, setEventId] = useState("");
  const [eventToken, setEventToken] = useState("");
  const [iframeURL, setIframeURL] = useState("");
  const [followingData, setFollowingData] = useState<any>([]);
  const [expertFollowers, setExpertFollowers] = useState("");
  const iframeRef = useRef();
  const IFRAME_BASE = "https://cpl.sli.ke";
  const { state } = useStateContext();
  const { isLogin } = state.login;
  const APP_ENV = typeof window !== "undefined" ? window.APP_ENV : "";

  const fetchList = async () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    const sevenDaysEarlierDate = currentDate.getTime();
    const data = {
      conditions: [
        {
          fieldName: "eventStatus",
          value: [3, 5],
          operation: "in"
        },
        {
          fieldName: "streamFlag",
          value: [1, 2],
          operation: "in"
        },
        {
          fieldName: "endTime",
          value: sevenDaysEarlierDate,
          operation: "greaterThanEq"
        },
        {
          fieldName: "paidEvent",
          value: true,
          operation: "notEqual"
        }
      ],
      multiSort: [
        {
          field: "eventStatus",
          type: "asc"
        },
        {
          field: "startTime",
          type: "desc"
        }
      ],
      pageNumber: 1,
      pageSize: 5
    };
    const apiUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/getEventData";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      cache: "no-store"
    });
    const newData = await response.json();
    return newData; // Return the parsed JSON data
  };
  const fetchToken = async () => {
    const requestUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/generateToken";
    const name = window.objUser && isLogin ? window.objUser?.info?.firstName : "Guest User";
    const userID = isLogin
      ? window.objUser?.info && window.objUser?.info.primaryEmail
      : getCookie("_grx")
      ? getCookie("_grx")
      : getCookie("pfuuid")
      ? getCookie("pfuuid")
      : Math.random().toString(36).slice(2);
    const payload = {
      eventID: eventId,
      eventToken,
      meta: {
        isloggedin: isLogin || false,
        section: "ETMain_HP_MWeb"
      },
      name,
      role: 0,
      userID
    };
    // Replace Service.post with fetch
    const tokenRes = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
    const tokenData = await tokenRes.json(); // Parse the JSON response
    return tokenData;
  };

  const onLoadIframe = () => {
    try {
      window.addEventListener("message", (event) => {
        if (event.origin !== IFRAME_BASE) return;
        const { action, data } = event.data;
        if (action && action === "READY_TO_USE") {
          iframeTrigger();
        }
      });
    } catch (err) {
      console.error("bind iframe event", err);
    }
  };
  const iframeTrigger = () => {
    const payload = {
      action: "CREATE_SESSION",
      data: {}
    };
    const iframe: any = iframeRef.current;
    if (iframe && iframe?.contentWindow) {
      iframe.contentWindow.postMessage(payload, IFRAME_BASE);
    }
  };
  const startFetching = () => {
    fetchList()
      .then((response: any) => {
        if (response) {
          const { result = [] } = response;
          if (result?.length) {
            const filteredEvents = result?.filter(
              (event: { eventStatus: number }) => event.eventStatus === 3 || event.eventStatus === 5
            );
            if (filteredEvents?.length) {
              setNewsData(filteredEvents);
              prepareData(filteredEvents[0]);
            }
          }
        }
      })
      .catch((e: any) => console.log("No LiveStream is LIVE at this time", e));
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
    setIframeURL("");
    if (eventId && eventToken) {
      fetchToken()
        .then((response: any) => {
          const tokenValue = response?.token || "";
          if (!tokenValue) throw response;
          const url = `${
            (APIS_CONFIG as any)?.["SLIKE_CLEO_URL"][APP_ENV]
          }/#id=${eventId}&jwt=${tokenValue}&apikey=et-n9GgmFF518E5Bknb&qna=false&comments=false&screenshot=false&controls=true&headless=false&autoplay=2&ffsmobile=false&bgpause=false&log=0${
            !liveStatus ? "&dvr=true" : "&dvr=true"
          }`;
          setIframeURL(url);
        })
        .catch((e: any) => console.log("error in fetchToken", e));
    }
  }, [eventId, eventToken, liveStatus]);

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
            iframeURL={iframeURL}
            onSwitching={onSwitching}
            currentSIndex={currentSIndex}
            onLoadIframe={onLoadIframe}
            expertFollowers={expertFollowers}
            followingData={followingData}
            fetchFollowingExperts={fetchFollowingExperts}
            APP_ENV={APP_ENV}
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
