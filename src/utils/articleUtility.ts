import API_CONFIG from '../network/config.json'
import { getCookie } from './utils';
import Service from 'network/service';

declare global {
    interface Window {
        objVc: any;
    }
}

export const getParameterByName = (name) => {
    if (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    } else {
        return '';
    }
}

export const grxPushData = (planDim: any, planUrl: string) => {
    let url = API_CONFIG.pushGA[window.APP_ENV],
        grxMapObj = JSON.parse(JSON.stringify(window.objVc.growthRxDimension)),
        newGrxMapObj = {},
        objUserData: any = {};
    
    for(const ele in grxMapObj) {
        newGrxMapObj['dimension'+ele.split('d')[1]] = grxMapObj[ele]
    }

    if(window?.objUser?.info?.isLogged){
        const { primaryEmail, mobile, firstName, lastName } = window.objUser.info;
        const fullName = (firstName + (lastName ? ' ' + lastName : ''));

        objUserData.email = primaryEmail;
        objUserData.mobile = mobile;
        objUserData.fname = firstName;
        objUserData.fullname = fullName;
     }
    //  console.log('objUser', window.objUser, objUserData);
    const dataToPost = {
        ET: planDim,
        grxMappingObj: newGrxMapObj,
        objUserData: objUserData,
    }
    const pushData = {
        "logdata": JSON.stringify(dataToPost),
        "merchantType": 'ET',
        "grxId": getCookie('_grx')
    }
    const ticketId = getCookie("encTicket") ? `&ticketid=${getCookie("encTicket")}` : '';
    const newPlanUrl = planUrl + (planUrl.indexOf('?') == -1 ? '?' : '&') + 'ru='+encodeURI(window.location.href) +'&grxId=' + getCookie('_grx') + ticketId    
    Service.post({url, headers:{}, payload: pushData, params: {}})
    .then((res) => {        
        window.location.href = newPlanUrl;
    })
    .catch((err) => {
        window.location.href = newPlanUrl;
    });
}

export const isLiveApp = () => {
    const lh = window.location.host,
      isLive = lh.indexOf("localhost") !== -1 || lh.indexOf("etnext") != -1 || lh.indexOf("etpwa") != -1 ? 0 : 1;
    return isLive;
};

export const fetchAllMetaInfo = async (msid) => {
    try {
      const response = await fetch(
        `https://${
          isLiveApp() ? "economictimes" : "etdev8243"
        }.indiatimes.com/feed_meta_all.cms?msid=${msid}&feedtype=etjson`
      );
      if (response.ok) {
        const data = await response.json();
        if (
          data.info &&
          data.info.feed_meta_all &&
          data.info.feed_meta_all.allmetalist &&
          data.info.feed_meta_all.allmetalist.sec
        ) {
          const metaArray = data.info.feed_meta_all.allmetalist.sec;
          const metaObj = {};
          for (const meta of metaArray) {
            metaObj[meta.mname] = meta.minfo;
          }
          return metaObj;
        }
      } else {
        throw new Error("Network response was not OK");
      }
    } catch (err) {
      console.error("Error fetch Abound Banner", err);
    }
};

export const currPageType = () => {
    let type = 'home_page';
    const lh = window.location.href;
    if(lh.includes('videoshow')) {
        type = 'videoshow';
    }
    return type;
}

export default {
    getParameterByName,
    fetchAllMetaInfo,
    currPageType,
    grxPushData
}