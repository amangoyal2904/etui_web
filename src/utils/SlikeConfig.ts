const isLive = window.location.host.includes('economictimes.indiatimes.com');
let sdkCleoSlike = 'https://cpl-dev.sli.ke/cca.dev.js' // for dev
// customDimension.dimension20 = 'Web';
let mktAPIURL = '', slikeAPIToken = '', mktTicketAPI = '', cleoPlayURL= '', lastActiveSlide = 0;
if(isLive) {
    mktAPIURL = 'https://etwebcast.indiatimes.com/ET_WebCast'; // for Production
    mktTicketAPI = 'https://etmarketsapis.indiatimes.com/ET_Screeners/fetchSsoData'; // for Prroduction 
    slikeAPIToken = '18huogo9zl6gollkog9kzkoz6l69ggl9'; // for Production
    cleoPlayURL = 'https://play.sli.ke';
    sdkCleoSlike = 'https://cpl.sli.ke/cca.js';
} else {
    mktAPIURL = 'https://json.bselivefeeds.indiatimes.com/ET_WebCast'; // for dev 
    mktTicketAPI = 'https://qcbselivefeeds.indiatimes.com/ET_Screeners/fetchSsoData'; // dev
    slikeAPIToken = '18tgggz9ko6z999z9ko6zzg9gz9ko9kg'; // for dev 
    cleoPlayURL = 'https://play-dev.sli.ke';
    sdkCleoSlike = 'https://cpl-dev.sli.ke/cca.dev.js'; 
}
const apiUrlMkt = mktAPIURL;
const headerData  = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    token: slikeAPIToken
};

export const scriptInit = (config) => {
    const script = document.createElement('script');
    script.onload = () => {
        console.log('you can run your distribution script.......', config);
        createEventJWTTockenAPI(config);
    };
    script.src = sdkCleoSlike;
    document.head.appendChild(script);
    console.log('Module Loaded: ', sdkCleoSlike);
}

const createEventJWTTockenAPI = async(config) => {
    const userEmail = window?.objUser?.info?.primaryEmail;
    const userName = window?.objUser?.info?.firstName || 'Guest User';
    
    const _data = {
      eventToken: config?.eventToken,
      eventID: config?.eventId,
      userID: userEmail,
      name: userName || '',
      role: 0,
      meta: {
        isloggedin: !!window.objUser.ssoid,
        section: 'ETMain_HP_Web'
      }
    };

    try {
        const endPoint = isLive ? `${apiUrlMkt}/generateToken` : "http://localhost:3002/api/livestreamtocken";
        const response = await fetch(endPoint, {
            method: 'POST',
            headers: headerData,
            body: JSON.stringify(_data)
        });

        const data = await response.json();
        if (data?.livestreamdata?.token) {
          setStreamIframUrl(data?.livestreamdata?.token, config);
          generateTokenGaEventFire(config);
        }
    } catch (error) {
      console.error('createEventJWTTockenAPI error', error);
    }
  };

  const setStreamIframUrl = (jwtKey: string, config) => {
    const isIFrameExist = document.getElementById('sdkStreamWrapDistribution_st')?.children.length;
    if (!isIFrameExist) {
      const checkVideoLiveOrNot = config?.eventStatus;
      const autoplay = checkVideoLiveOrNot === '3' ? 2 : 1;
      const recording = checkVideoLiveOrNot !== '3';

      const streamWrapper = document.getElementById('sdkStreamWrapDistribution_st');
      if (streamWrapper) streamWrapper.remove();
      
      const liveStreamElement = document.createElement('div');
      liveStreamElement.id = 'sdkStreamWrapDistribution_st';
      liveStreamElement.classList.add('jsPlaySreamIframe');
      document.querySelector('#liveStrmStockTalk .jsPlayStream_st .athena_stream')?.appendChild(liveStreamElement);
      cleoSDKConfig('sdkStreamWrapDistribution_st', jwtKey, autoplay, recording, config);
      chatFunctionUserRole();
    }
  };

  const generateTokenGaEventFire = (config) => {
    const _action = `GenerateToken - default_prime`;
    const interval = setInterval(() => {
      const puuid = document.cookie.includes('peuuid') ? 'peuuid' : 'pfuuid';
      const label = `Title=pfuuid=${puuid}-eventToken=${config?.eventToken}`;
      console.log('grxEvent', { event_category: 'ETLive-Core', event_action: _action, event_label: label });
      clearInterval(interval);
    }, 1000);
  };

  const cleoSDKConfig = (contEl: string, jwt: string, autoplay: number, recording: boolean, config) => {
    const cleoConfig = {
      contEl,// container element
      eventId: config?.eventId,
      jwt,
      comm: {
        qna: false,
        comments: true,
        screenshot: false,
      },
      player: {
        controls: true,
        headless: true,
        autoplay,
        forceFsMobile: false,
        bgpause: false,
      },
      apikey: 'et-n9GgmFF518E5Bknb',
      recording,
    };

    const AUTO_PLAY_BEHAVIOUR = {
      NEVER: 0,
      WITHOUT_SOUND: 1,
      ALLOW: 2,
    };

    const clientSdk = new window.CleoClient(cleoConfig, function (err: any) {
      if (err) {
        console.error('Cleo client error', err);
        return;
      }
      console.log('Cleo client loaded');
    });
}

const chatFunctionUserRole = () => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'REQUEST_LOGIN') {
        document.querySelector('.jsChaatLoginFunction')?.classList.remove('hidden');
      } else if (event.data.action === 'CLOSE_CHAT') {
        document.querySelector('.jsChaatLoginFunction')?.classList.add('hidden');
      } else if (event.data.action === 'VIDEO_ENDED') {
        document.querySelector('.ls_container')?.remove();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
};