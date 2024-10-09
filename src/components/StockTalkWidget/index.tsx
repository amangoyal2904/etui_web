import { useEffect, useState } from "react";
import { fetchAllMetaInfo } from 'utils/articleUtility';
import jStorageReact from "utils/jStorage";
import APIS_CONFIG from "network/config.json";
import styles from "./styles.module.scss";
import { grxEvent } from "utils/ga";
import Timer from "./Timer";
import StockTalk from "./StockTalkInit";


export default function StockTalkWidget() {
    const [liveStreamStarted, setLiveStreamStarted] = useState(false);
    const [startingSoon, setStartingSoon] = useState(false);
    const [streamingData, setStreamingData] = useState('');
    const [allMetaData, setAllMeta] = useState<any>({});
    const [showWidget, setShowWidget] = useState(true);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [counterTime, setCounterTime] = useState(0);
    const [showTimer, setShowTimer] = useState(false);

    useEffect(() => {
        fetchMetaInfo();
    }, [])

    useEffect(() => {
        const widgetEnabled = typeof allMetaData?.PrimaryTag != undefined && allMetaData?.PrimaryTag?.toLowerCase() === "on";
        if(widgetEnabled) {
            widgetCondition();
            setTimeout(() => {
                streamData();
            }, 2000);
        }
    }, [allMetaData])

    /* const scriptInit = () => {
        const __script = document.createElement('script');
        __script.onload = () => {
            const CleoClientCBB = new Event("CleoClientCBB");
            document.dispatchEvent(CleoClientCBB);
            console.log('you can run your distribution __script.......', window.CleoClient);
        };
        __script.src = 'https://cpl-dev.sli.ke/cca.dev.js';
        document.head.appendChild(__script);
        console.log('Module Loaded: ');
    } */

    const fetchMetaInfo = async() => {
        const allMetaData = await fetchAllMetaInfo(109489257) || {};
        setAllMeta(allMetaData);
    }

    const widgetCondition = () => {
        const skipInfo = jStorageReact.get('skip_ls') && JSON.parse(jStorageReact.get('skip_ls')),
            session_type = new Date().getHours() >= 12 ? 'evening' : 'morning';
        if(skipInfo && !skipInfo[session_type]) {
            jStorageReact.deleteKey('skip_ls');
        }

        const morningTS = getTimeStamp(allMetaData?.Sluglinebeforeheadline),
            eveningTS = getTimeStamp(allMetaData?.Sluglineafterheadline),
            morningTimerTime = timerTS(morningTS, allMetaData?.overridetemplate, "subtract"),
            eveningTimerTime = timerTS(eveningTS, allMetaData?.canonicalURL, "subtract"),
            now = +new Date();
        
        const morningTimerCondition = morningTS > now && morningTimerTime < now;
        const eveningTimerCondition = eveningTS > now && eveningTimerTime < now;
        
        const morningLSTime = timerTS(morningTS, 60);
        const eveningLSTime = timerTS(eveningTS, 60);
        
        const morningLSCondition = morningTS < now && morningLSTime > now;
        const eveningLSCondition = eveningTS < now && eveningLSTime > now;
        
        if(skipInfo && skipInfo[session_type]['timer'] && skipInfo[session_type]['full']) {
            setShowWidget(false);
        } else {
            const timerConditionCheck = (morningTimerCondition || eveningTimerCondition) && !skipInfo;
            const lsWidgetConditionCheck = (skipInfo ? skipInfo[session_type] && !skipInfo[session_type]['full'] : true) && !morningTimerCondition && !eveningTimerCondition && (morningLSCondition || eveningLSCondition);
            
            let gaElegible = false;
            if(timerConditionCheck) {
                const counterTS = session_type === "evening" ? eveningTS : morningTS;
                setCounterTime(counterTS);
                setShowWidget(true);
                gaElegible = true;
            } else if(lsWidgetConditionCheck) {
                streamData();
                setShowWidget(true);
                gaElegible = true;
            }
            
            if(gaElegible) {
                grxEvent('event', {'event_category': 'stocktalk', 'event_action': 'impression', 'event_label': "stocktalk homepage"}, 1);
            }
        }
    }

    const timerTS = (ts, min, flag = "add") => {
        const date = new Date(ts); 
        flag === "add" ? date.setMinutes(date.getMinutes() + min) : date.setMinutes(date.getMinutes() - min); 
        return +date;
    }

    const getTimeStamp = (time) => {
        const timeUpdate = time.toString().length === 3 ? '0'+time : time;
        const date = new Date();
        if(time) {
            date.setHours(timeUpdate.toString().substr(0,2));
            date.setMinutes(timeUpdate.toString().substr(2,4));
            date.setSeconds(0);
        }
        return +date;
    }

    const fetchList = async () => {
        const data = {
            "conditions":[
                {"fieldName":"eventStatus","value":[3,5],"operation":"in"},
                {"fieldName":"streamFlag","value":[1,2],"operation":"in"},
                {"fieldName":"dayCount","value":0,"operation":"equal"}
            ],
            "multiSort":[
                {"field":"eventStatus","type":"asc"},
                {"field":"startTime","type":"desc"}
            ],
            "pageNumber":1,
            "pageSize":5
        };
        
        // const apiUrl = (APIS_CONFIG as any)?.liveStream[window.APP_ENV] + "/getEventData";
        const apiUrl = "http://localhost:3002/api/livestream";
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
          cache: "no-store"
        });
        const newData = await response.json();
        return newData;
      };

    const streamData = async() => {
        setShowTimer(false);
        setStartingSoon(true);
        const data = await fetchList();
        const streamDataFromAPI = data?.livestreamdata?.result?.[0];

        console.log('stream data', streamDataFromAPI);
        if(streamDataFromAPI) {
            setStartingSoon(false);
            setLiveStreamStarted(true);
            if(redirectUrl) {
                setRedirectUrl(redirectUrl);
            }

            setShowWidget(true);
            setStreamingData(streamDataFromAPI);
            // streamData();
        } else {
            setTimeout(function() {
                streamData();
            }, 30*1000)
        }
    }

    const navigateToLiveStream = (flag) => {
        grxEvent('event', {'event_category': 'stocktalk', 'event_action': 'clicked', 'event_label': `stocktalk <${flag}>`}, 1);
        window.location.href = redirectUrl || '/markets/etmarkets-live/expert-bio/stock-talk,expertid-133.cms?from=mdr&utm_source=platform&utm_medium=web&utm_campaign=stocktalk';
    }

    const closeWidget = () => {
        grxEvent('event', {'event_category': 'stocktalk', 'event_action': 'clicked', 'event_label': 'stocktalk <Close Btn>'}, 1);
        const session_type = new Date().getHours() >= 12 ? 'evening' : 'morning';
        const objToSave = {[session_type] : {timer: 1, full : showTimer ? 1 : 0}};
        jStorageReact.set('skip_ls', JSON.stringify(objToSave));
        
        if(!showTimer) {
            const timeDiff = Number(counterTime) - (+new Date());
            setTimeout(() => {
                streamData();
            }, timeDiff)
        }
        setShowWidget(false);
    }

  return (
    <>
        {showWidget && <div className={streamingData ? `${styles.ls_container} ${styles.session_started_hp}` : styles.ls_container}>
            <div className={styles.inner_container}>
                <div>
                    <p className={styles.st_heading}>
                        <img width="122" alt="Stock Talk" src="https://img.etimg.com/photo/msid-109535402,quality-100/stock-talk.jpg" />
                        Exclusively for <strong>ETPrime Members</strong>
                    </p>
                    <p className={styles.st_subheading}>{allMetaData?.Matchid}</p>
                    <p className={styles.ls_timings}>{allMetaData?.Altdescription}</p>
                    <button onClick={navigateToLiveStream} className={styles.ask_cta}>Ask Now</button>
                    <p className={styles.ls_note}>Assured reply during the session or via email.</p>
                </div>
                <button onClick={navigateToLiveStream} className={styles.join_cta}>Join Today’s Session</button>
                {liveStreamStarted ? <div className={styles.ls_video}><StockTalk data={streamingData} /></div> : 
                    <>
                        {startingSoon ? <div className={styles.starting_soon}>Starting Soon</div> : 
                        <Timer time={counterTime} streamData={streamData} />}
                    </>
                }
                <img onClick={closeWidget} width="85" alt="Close" className={styles.close_ls} src="https://img.etimg.com/photo/msid-109535409,quality-100/close.jpg" />
            </div>
        </div>}
    </>
  )
}
