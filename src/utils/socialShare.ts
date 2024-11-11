import { removeBackSlash, socialUrl } from "./utils";
export const Share = (evt, shareParam) => {
  try {
    let shareTitle = shareParam.title || "";
    let shareUrl = shareParam.url;
    let type = shareParam.type;
    fireGAEvent(evt, type);
    if (type == "wa") {
      shareUrl =
        socialUrl.whatsapp +
        encodeURIComponent(
          removeBackSlash(shareTitle).replace(
            " - The Economic Times",
            ""
          )
        ) +
        " - " +
        shareUrl +
        encodeURIComponent(
          "?utm_source=whatsapp_pwa&utm_medium=social&utm_campaign=socialsharebuttons"
        );
      // window.location.href = shareUrl;
      window.open(shareUrl, '_blank');
    }
    if (type == "fb") {
      const fbUrl =
        socialUrl.fb +
        "?u=" +
        encodeURIComponent(
          shareUrl +
            "?utm_source=facebook_pwa&utm_medium=social&utm_campaign=socialsharebuttons"
        ) +
        "&t=" +
        encodeURIComponent(shareTitle);
      console.log(fbUrl);
      openDialog({ url: fbUrl, name: socialUrl.openerName });
    } else if (type == "twt") {
      shareTitle =
        shareTitle.replace(" - The Economic Times", "") || "";
      shareTitle =
        shareTitle?.length <= 110
          ? shareTitle
          : shareTitle.substring(0, 107) + "...";

      const text = encodeURIComponent(
        removeBackSlash(shareTitle).replace("|", "-")
      );
      const url = encodeURIComponent(
        shareUrl +
          "?utm_source=twitter_web&utm_medium=social&utm_campaign=socialsharebuttons"
      );
      shareUrl =
        socialUrl.twt + "text=" + text + "&url=" + url + "&via=economictimes";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "lin") {
      shareUrl =
        socialUrl.lin +
        shareUrl +
        "?utm_source=linkedin_web&utm_medium=social&utm_campaign=socialsharebuttons";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "gp") {
      shareUrl =
        socialUrl.gp +
        shareUrl +
        "?utm_source=googleplus_web&utm_medium=social&utm_campaign=socialsharebuttons";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "email") {
      const urltoshare = shareUrl.replace("slideshow_new", "slideshow");
      const body = encodeURIComponent(
        urltoshare +
          "?utm_source=email_web&utm_medium=social&utm_campaign=socialsharebuttons"
      );
      shareUrl =
        "mailto:?subject=ET: " +
        encodeURIComponent(removeBackSlash(shareTitle));
      window.location.href = shareUrl + "&body=" + body;
    }
  } catch (e) {
    console.log("error in SocialShare::share::", e);
  }
};
const openDialog = config => {
  try {
    var settings = config.settings ? config.settings : socialUrl.popUpSettings;
    window.open(config.url, config.name, settings);
  } catch (e) {
    console.log("error in SocialShare::openDialog::" + e);
  }
};
const fireGAEventSocialShare = (network, action, url) => {
  try {
    let socialPayload = {
      hitType: "social",
      socialNetwork: network,
      socialAction: action,
      socialTarget: url
    };
    //ga("send", socialPayload);
    //grxEvent('socialshare', socialPayload);
  } catch (e) {
   console.log("error in SocialShare::fireGAEventSocialShare::" + e);
  }
};
const fireGAEvent = (e, type) => {
  try {
    let utm_source = "";
    let network = "";
    switch (type) {
      case "wa":
        utm_source = "Whatsapp_PWA";
        network = "Whatsapp";
        break;
      case "fb":
        utm_source = "Facebook_PWA";
        network = "Facebook";
        break;
      case "twt":
        utm_source = "Twitter_PWA";
        network = "Twitter";
        break;
      case "lin":
        utm_source = "Linkedin_PWA";
        network = "Linkedin";
        break;
      case "email":
        utm_source = "Email_PWA";
        network = "Email";
        break;
      default:
        utm_source = "";
        network = "";
    }
    let url =
      window.location.href +
      "?utm_source=" +
      utm_source +
      "&utm_medium=social&utm_campaign=socialsharebuttons";
    fireGAEventSocialShare(network, "Share", url);
  } catch (e) {
    console.log("error in SocialShare::fireGAEvent::" + e);
  }
};
export default { Share };
