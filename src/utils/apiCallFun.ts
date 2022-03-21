import Service from 'network/service';
import APIS_CONFIG from "network/config.json";

const apiURL = 'https://etdev8243.indiatimes.com/reactfeed.cms?'
const findMsid = (arrayVal:any[])=>{
    let arrayList = arrayVal;
    let msidHash = '';
    let msid =  '';
    arrayList.map(function(item){
        let _text = item;
        if(_text.indexOf('.cms')){
            return msidHash = _text;
        }
    })
    msid = msidHash.replace('.cms','');
    return msid;
}

export const videoShowDataAPICall = async (queryObj:any)=> {
     let  msid = findMsid(queryObj);
    let url =`${apiURL}feedtype=etjson&type=videoshow&msid=${msid}`
    let  data = await fetch(url,{mode: 'no-cors'});
    let  _res =  await data.json();
    return _res;

            //let url = APIS_CONFIG.WEBAPI;
            // let url = 'https://etdev8243.indiatimes.com/reactfeed.cms?';
            // let params = {
            //     feedtype: "etjson",
            //     type:"videoshow",
            //     msid: msid
            // };
            // Service.get(url, params)
            // .then(res => {
            //     //setData(res.data || {});
            //     console.log(res.data,"Data");
            // })

  };
  
export  const mailSendAPICall = async (data:any)=>{
    let url = `https://economictimes.indiatimes.com/json/postmail.cms`;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }
    let  _data = await fetch(url,requestOptions);
    let  _res =  await _data.json();
    return _res;
} 
  let outputItem = {videoShowDataAPICall, mailSendAPICall}
  
  export default outputItem