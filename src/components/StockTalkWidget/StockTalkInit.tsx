import React, { useEffect, useCallback } from 'react';

let CleoClient: any;


const StockTalk = (props) => {
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

  const createEventJWTTockenAPI = useCallback(async () => {
    const _id = document.querySelector('.jsPlayStream_st')?.getAttribute('data-id') || '';
    const userEmail = window?.objUser?.info?.primaryEmail || (document.cookie.includes('_grx') ? document.cookie : Math.random().toString(36).slice(2));
    const userName = window?.objUser?.info?.firstName || 'Guest User';
    const _eventToken = document.querySelector('.jsPlayStream_st')?.getAttribute('data-eventToken') || '';
    
    const _data = {
      eventID: _id,
      userID: userEmail,
      name: userName || '',
      role: 0,
      eventToken: _eventToken,
      meta: {
        isloggedin: !!window.objUser.ssoid,
        section: 'ETMain_HP_Web'
      }
    };

    try {
        const response = await fetch(`${apiUrlMkt}/generateToken`, {
            method: 'POST',
            headers: headerData,
            body: JSON.stringify(_data)
        });

        const data = await response.json();
        if (data?.token) {
            setStreamIframUrl(data.token, _id);
            generateTokenGaEventFire(_eventToken);
        }
    } catch (error) {
      console.error('createEventJWTTockenAPI error', error);
    }
  }, [apiUrlMkt, headerData]);

  const setStreamIframUrl = (jwtKey: string, _id: string) => {
    const isIFrameExist = document.getElementById('sdkStreamWrapDistribution_st')?.children.length;
    if (!isIFrameExist) {
      const checkVideoLiveOrNot = document.querySelector('.jsPlayStream_st')?.getAttribute('data-eventstatus');
      const autoplay = checkVideoLiveOrNot === '3' ? 2 : 1;
      const recording = checkVideoLiveOrNot !== '3';

      const streamWrapper = document.getElementById('sdkStreamWrapDistribution_st');
      if (streamWrapper) streamWrapper.remove();
      
      const liveStreamElement = document.createElement('div');
      liveStreamElement.id = 'sdkStreamWrapDistribution_st';
      liveStreamElement.classList.add('jsPlaySreamIframe');
      document.querySelector('#liveStrmStockTalk .jsPlayStream_st .athena_stream')?.appendChild(liveStreamElement);

      cleoSDKConfig('sdkStreamWrapDistribution_st', jwtKey, autoplay, recording, _id);
      chatFunctionUserRole();
    }
  };

  const loadSDKCleo = useCallback(() => {
    const script = document.createElement('script');
    script.onload = function () {
      console.log('you can run your distribution script.......');
      createEventJWTTockenAPI();
    };
    script.src = sdkCleoSlike;
    document.head.appendChild(script);
    console.log('Module Loaded: ', sdkCleoSlike);
  }, [createEventJWTTockenAPI, sdkCleoSlike]);

  const cleoSDKConfig = (contEl: string, jwt: string, autoplay: number, recording: boolean, eventId: string) => {
    const cleoConfig = {
      contEl, // container element
      eventId,
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

    new CleoClient(cleoConfig, function (err: any) {
      if (err) {
        console.error('Cleo client error', err);
        return;
      }
      console.log('Cleo client loaded');
    });
  };

  const generateTokenGaEventFire = (eventToken: string) => {
    const _action = `GenerateToken - default_prime`;
    const interval = setInterval(() => {
      const puuid = document.cookie.includes('peuuid') ? 'peuuid' : 'pfuuid';
      const label = `Title=pfuuid=${puuid}-eventToken=${eventToken}`;
      console.log('grxEvent', { event_category: 'ETLive-Core', event_action: _action, event_label: label });
      clearInterval(interval);
    }, 1000);
  };

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

  // Load SDK on component mount
  useEffect(() => {
    loadSDKCleo();
  }, [loadSDKCleo]);

  return (
    <div id="liveStrmStockTalk">
      <div className="jsPlayStream_st"></div>
      <div data-id="{eventId}" data-eventStatus="{eventStatus}" data-eventToken="{eventToken}" data-primeevent="{primeEvent}" data-paidevent="{paidEvent}" data-expertid="{expertId}" className="jsPlayStream_st">
	        <div className="athena__video prel">
                <div className="athena_stream"></div>
                {/* style="background-image: url({eventImageUrl})" */}
            </div>
      </div>
    </div>
  );
};

export default StockTalk;
