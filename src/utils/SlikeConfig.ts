import GLOBAL_CONFIG from "network/global_config.json";

export const scriptInit = (config) => {
    const script = document.createElement('script');
    script.onload = () => {
        console.log('you can run your distribution script.......', config);
       
        createEventJWTTockenAPI(config);
    };
    script.src = GLOBAL_CONFIG[window.APP_ENV]['sdkCleoSlike'];
    document.head.appendChild(script);
    console.log('Module Loaded: ', GLOBAL_CONFIG[window.APP_ENV]['sdkCleoSlike']);
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
        const endPoint = window.isDev ? "http://localhost:3002/api/livestreamtocken" : `${GLOBAL_CONFIG[window.APP_ENV]['mktAPIURL']}/generateToken`;
        const response = await fetch(endPoint, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              token: GLOBAL_CONFIG[window.APP_ENV]["slikeAPIToken"]
            },
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
      // debugger;
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