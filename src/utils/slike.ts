import { ET_WEB_URL } from "../utils/common";


declare global {
  interface Window {
    fromIframeNewVideo: any;

  }
}

const playerEvents = {
  onPlayerError: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onInit: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoStarted: () => {
    //console.log('Player event ', eventName, eventData);
    // if(!slikePlayerProps.isamp && isPwa == null) {
    //     parent && parent.onVideoStart && parent.onVideoStart();
    // }
  },
  onVideoResumed: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoPaused: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVolumeChange: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoMuted: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoCompleted: () => {
    //console.log('Player event ', eventName, eventData, player);
  },
  onVideoEnded: () => {
    //console.log('Player event ', eventName, eventData, player);
  },
  onVideoProgress: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoFullscreenchange: () => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoNext: (player, eventName, eventData) => {
    //console.log('Player event Next Video ', eventName, eventData);
    if (window?.top?.fromIframeNewVideo) {
      window.top.fromIframeNewVideo(eventData);
    }
  },
  onVideoPrev: (player, eventName, eventData) => {
    //console.log('Player event Prev Video  ', eventName, eventData);
    if (window?.top?.fromIframeNewVideo) {
      window.top.fromIframeNewVideo(eventData);
    }
  }
};

const adEvents = {
  onAdComplete: () => {
    //console.log('Ad Event ', eventName, eventData);
    // if(!slikePlayerProps.isamp && isPwa == null) {
    //     parent && parent.onadComplete && parent.onadComplete();
    // }
  },
  onAdSkip: () => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdLoaded: () => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdRequest: () => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdError: () => {
    // if(!slikePlayerProps.isamp && isPwa == null) {
    //     parent && parent.onadComplete && parent.onadComplete();
    // }
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdResume: () => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdStart: () => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdPause: () => {
    //console.log('Ad Event ', eventName, eventData);
  }
};

export function handlePlayerEvents(player) {
  function eventToFunction(player, eventName, data) {
    const funcName = eventName.replace("spl", "on");
    data = Object.assign({}, data, player.store.video);
    if (playerEvents && typeof playerEvents[funcName] === "function") {
      playerEvents[funcName](player, funcName, data);
    }
  }
  Object.keys(window.SlikePlayer.Events).forEach((eventKey) => {
    const eventName = window.SlikePlayer.Events[eventKey];
    player.on(eventName, eventToFunction.bind(null, player));
  });
}

export function handleAdEvents(player) {
  function eventToFunction(player, eventName, data) {
    //console.log(eventName);
    const funcName = eventName.replace("spl", "on");
    const eventData = data || {};
    if (adEvents && typeof adEvents[funcName] === "function") {
      adEvents[funcName](player, funcName, eventData);
    }
  }
  Object.keys(window.SlikePlayer.AdEvents).forEach((eventKey) => {
    const eventName = window.SlikePlayer.AdEvents[eventKey];
    player.on(eventName, eventToFunction.bind(null, player));
  });
}

export const dynamicPlayerConfig = {
  apiKey: "etweb75sb26l69w5cyc21zpi8hbp6t",
  contEl: "id_",
  debug: false,
  video: {
    id: "",
    playerType: "",
    shareUrl: "",
    image: "https://img.etimg.com/photo/60882360.cms",
    title: "video title"
  },
  controls: {
    dock: {
      fallback: true,
      type: "native"
    }
  },
  player: {
    msid: "",
    autoPlay: true,
    adSection: "videoshow",
    fallbackMute: true,
    mute: true,
    skipAd: 0,
    volume: 100,
    shareOptions: ["t", "f", "w", "e"],
    playlistUrl: "",
    playlist: true,
    pagetpl: "videoshow",
    pageSection: "",
    sg: "",
    ppid: "",
    playInBackground: true,
    transmit:  typeof window != "undefined" && typeof window?.geolocation != "undefined" && window?.geolocation == 2 ? true : false,
    scrollBehaviour: {
      inViewPercent: 100,
      dock: true,
      autoPlay: true,
      autoPause: true
    },
    showTitle: true
  }
};

export function setGetPlayerConfig({ dynamicPlayerConfig, result, autoPlay, pageTpl, isPrimeUser = false, subSecs, adSection='default', isDeferredPreRoll=false, relvideo }) {
  const playerConfig = JSON.parse(JSON.stringify(dynamicPlayerConfig));
  playerConfig.contEl = "id_" + result?.msid;
  playerConfig.video.id = result?.slikeid;
  playerConfig.video.playerType = result?.playertype;
  playerConfig.video.shareUrl = ET_WEB_URL + result?.url;
  playerConfig.player.description_url = ET_WEB_URL + result?.url; // no need to modify; added specifically for tracking purpose by Slike team
  playerConfig.video.image = result?.img;
  playerConfig.video.title = result?.title;
  playerConfig.player.msid = result?.msid;
  playerConfig.player.autoPlay = autoPlay;
  playerConfig.player.pagetpl = pageTpl;
  playerConfig.player.skipAd = isPrimeUser;
  playerConfig.player.isPrime = Boolean(isPrimeUser);
  playerConfig.player.pageSection = subSecs;
  playerConfig.player.adSection = adSection;
  playerConfig.player.relvideo = relvideo;

  if (isDeferredPreRoll) {
    playerConfig.player.deferredPreroll = 5;
  }

  return playerConfig;
}
