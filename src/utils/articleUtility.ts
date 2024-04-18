import { APP_ENV } from 'utils';
import API_CONFIG from '../network/config.json'
import { getCookie } from './utils';
import Service from 'network/service';

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
    let url = API_CONFIG.pushGA[APP_ENV],
        grxMapObj = JSON.parse(JSON.stringify(window.objVc.growthRxDimension)),
        newGrxMapObj = {},
        objUserData = {};
    
    for(const ele in grxMapObj) {
        newGrxMapObj['dimension'+ele.split('d')[1]] = grxMapObj[ele]
    }

    if(window.objUser && window.objUser.info.isLogged){
        const { primaryEmail,mobile,firstName,lastName} = window.objUser.info;
        const fullName = (firstName + (lastName ? ' ' + lastName : ''));

        objUserData.email = primaryEmail;
        objUserData.mobile = mobile;
        objUserData.fname = firstName;
        objUserData.fullname = fullName;
     }
     console.log('objUser', window.objUser, objUserData);
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
    console.log('grxPushData',url, pushData, planUrl, newPlanUrl)
    Service.post({url, headers:{}, payload: pushData, params: {}})
    .then((res) => {
        console.log('res', res);
        window.location.href = newPlanUrl;
    })
    .catch((err) => {
        window.location.href = newPlanUrl;
    });
}

export default {
    getParameterByName,
    grxPushData
}