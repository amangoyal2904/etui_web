import { useEffect, useState } from "react";

import { fetchAllMetaInfo } from 'utils/articleUtility';
import API_CONFIG from "../../network/config.json"
import jStorageReact from "utils/jStorage";
import styles from "./styles.module.scss";
import { grxEvent } from "utils/ga";
import Timer from "./Timer";

export default function StockTalkWidget(props) {
    const [startingSoon, setStartingSoon] = useState(false);
    const [allMetaData, setAllMeta] = useState<any>({});
    const [showWidget, setShowWidget] = useState(true);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [counterTime, setCounterTime] = useState(0);
    const [showTimer, setShowTimer] = useState(false);

    const isWeekend = new Date().getDay() == 0 || new Date().getDay() == 6,
        isSponserdAS = props?.subsec1_common === 9174539;

    useEffect(() => {
        if(!isWeekend && !isSponserdAS) {
            widgetCondition();
        }
        // streamData();
        fetchMetaInfo();
    }, [])

    const fetchMetaInfo = async() => {
        const allMetaData = await fetchAllMetaInfo(109489257) || {};
        setAllMeta(allMetaData);
    }

    const widgetCondition = () => {
        const widgetEnabled = typeof allMetaData?.PrimaryTag != undefined && allMetaData?.PrimaryTag?.toLowerCase() === "on";
                    
        if(widgetEnabled) {
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
            
            var morningTimerCondition = morningTS > now && morningTimerTime < now;
            var eveningTimerCondition = eveningTS > now && eveningTimerTime < now;
            
            var morningLSTime = timerTS(morningTS, 60);
            var eveningLSTime = timerTS(eveningTS, 60);
            
            var morningLSCondition = morningTS < now && morningLSTime > now;
            var eveningLSCondition = eveningTS < now && eveningLSTime > now;
            
            if(skipInfo && skipInfo[session_type]['timer'] && skipInfo[session_type]['full']) {
                $('.ls_container').remove();
            } else {
                var timerConditionCheck = (morningTimerCondition || eveningTimerCondition) && !skipInfo;
                var lsWidgetConditionCheck = (skipInfo ? skipInfo[session_type] && !skipInfo[session_type]['full'] : true) && !morningTimerCondition && !eveningTimerCondition && (morningLSCondition || eveningLSCondition);
                
                let gaElegible = false;
                if(timerConditionCheck) {
                    var counterTS = session_type === "evening" ? eveningTS : morningTS;
                    setCounterTime(counterTS);
                    $('.ls_container').removeClass('hidden');
                    gaElegible = true;
                } else if(lsWidgetConditionCheck) {
                    streamData();
                    $('.ls_container').removeClass('hidden');
                    gaElegible = true;
                }
                
                if(gaElegible) {
                    grxEvent('event', {'event_category': 'stocktalk', 'event_action': 'impression', 'event_label': "stocktalk homepage"}, 1);
                }
            }
        }
    }

    const timerTS = (ts, min, flag = "add") => {
        const date = new Date(ts); 
        flag === "add" ? date.setMinutes(date.getMinutes() + min) : date.setMinutes(date.getMinutes() - min); 
        return +date;
    }

    const getTimeStamp = (time) => {
        var timeUpdate = time.toString().length === 3 ? '0'+time : time;
        var date = new Date();
        if(time) {
            date.setHours(timeUpdate.toString().substr(0,2));
            date.setMinutes(timeUpdate.toString().substr(2,4));
            date.setSeconds(0);
        }
        return +date;
    }

    const streamData = async() => {
        setShowTimer(false);
        setStartingSoon(true);

        const baseEP = true ? "https://json.bselivefeeds.indiatimes.com" : "https://etwebcast.indiatimes.com",
            endPoint = `${baseEP}/ET_WebCast/getEventData`,
            bodyData = {
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

        const response = await fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
    
        const data = await response.json();
        console.log('stream data', data);
        if(data) {
            setStartingSoon(false);
            $('#liveWidget').remove();
            var lsEle = $($.parseHTML(data)) && $($.parseHTML(data)).filter("#liveStrmStockTalk");
            if(lsEle) {
                setRedirectUrl(lsEle.attr('redirecturl'));
            }

            $('.ls_container').removeClass('hidden').addClass('session_started_hp');
            $('.ls_video').html(data);
            objStcokTalk.init();
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
        {showWidget && <div className={styles.ls_container}>
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
                <button className={styles.join_cta}>Join Today’s Session</button>
                {startingSoon ? 
                    <div className={styles.starting_soon}>Starting Soon</div> : 
                    <Timer time={counterTime} streamData={streamData} />
                }
                <div className={styles.ls_video}></div>
                <img onClick={closeWidget} width="85" alt="Close" className={styles.close_ls} src="https://img.etimg.com/photo/msid-109535409,quality-100/close.jpg" />
            </div>
        </div>}
    </>
  )
}
