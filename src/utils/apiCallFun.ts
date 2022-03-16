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
    let url = `https://etdev8243.indiatimes.com/reactfeed_videoshowweb.cms?feedtype=etjson&msid=${msid}&showjcmserror=1&showxslterror=1`;
    let  data = await fetch(url,{mode: 'no-cors'});
    let  _res =  await data.json();
    return _res;
  };
  
export  const mailSendAPICall = async (data:any)=>{
    let url = `https://economictimes.indiatimes.com/json/postmail.cms?recaptcha=1`;
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