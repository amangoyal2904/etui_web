import { useState } from 'react';
import { getCookie, setCookieToSpecificTime } from 'utils';
import { useStateContext } from "../../store/StateContext";

// Define request headers
const reqHeader: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

// Function to map sid to specific IDs
const mapingSid = (sid: string | number): string => {
  switch (sid) {
    case "110":
    case 110:
      return "5f5a31db80f79664e95679d1";
    case "3125":
    case 3125:
      return "5f5a31db80f79664e95679e4";
    case "3128":
    case 3128:
      return "5f5a31db80f79664e95679e7";
    case "3124":
    case 3124:
      return "5f5a31db80f79664e95679e3";
    case "1722":
    case 1722:
      return "5f5a31db80f79664e95679d6";
    default:
      return sid.toString();
  }
};

// Endpoint and channel ID for newsletter subscription
const nlSubEndPoint = `https://etmailstg.indiatimes.com/et-mailing-subscription/ok`;
const nlChannelId = '5f5a00075651d4e45e1b67d6';

// Hook for managing newsletter subscription actions
const useNewsletterSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;

  // Function to initialize newsletter subscription
  const initSubscription = async (config: any, callback: (cbData: any) => void) => {
    if (config && !isLoading) {
      setIsLoading(true);
      config.sid = mapingSid(config.sid);

      try {
        const response = await fetch(`${nlSubEndPoint}/subscription/${nlChannelId}`, {
          method: 'POST',
          headers: reqHeader,
          body: JSON.stringify({
            userId: config.email || '',
            userName: '',
            serviceIds: config.sid || '',
            ssoCheck: !!(userInfo?.primaryEmail || userInfo?.Verified.mobile || getCookie('wv_ssoid')),
            nlName: '',
            limit: '',
            sourcePage: '',
            src: 0,
            acq_type: config.utm === 'CPC' ? 'paid' : '',
            referralCode: config.referralCode || ''
          })
        });

        const data = await response.json();
        setIsLoading(false);

        const cbData = {
          success: false,
          failure: true,
          message: data.message || 'We are facing some issues, Please try again later.',
          data,
          config
        };

        if (data.status === 200) {
          setCookieToSpecificTime("_widget", "", 0, 0, 0);
          cbData.success = true;
          cbData.failure = false;
          cbData.message = data.message || 'Subscribed successfully.';
        }

        callback(cbData);
      } catch (error) {
        setIsLoading(false);
        callback({
          success: false,
          failure: true,
          message: error.message || 'We are facing some issues, Please try again later.',
          data: error
        });
      }
    }
  };

  // Function to get newsletter suggestions
  const getNewsLtrSuggestion = async (config: any, callback: (cbData: any) => void) => {
    const secName = "Homepage";

    if (config) {
      setIsLoading(true);
      try {
        const response = await fetch(`${nlSubEndPoint}/getnewssuggest/${nlChannelId}`, {
          method: 'POST',
          headers: reqHeader,
          body: JSON.stringify({
            userId: userInfo?.primaryEmail || '',
            serviceId: '',
            sectionId: process.env.NEXT_PUBLIC_SUBSEC1_VALUE || "",
            secname: secName.split('-').join(' '),
            limit: config.limit || 1,
            src: 0
          })
        });

        const result = await response.json();
        setIsLoading(false);

        const data = result && result.newsFeedList || {};
        const cbData = {
          success: false,
          failure: true,
          message: result.message,
          data,
          config
        };

        if (result.status === 200) {
          cbData.success = true;
          cbData.failure = false;
        }

        callback(cbData);
      } catch (error) {
        setIsLoading(false);
        callback({
          success: false,
          failure: true,
          message: error.message || 'Not Subscribed',
          data: error
        });
      }
    }
  };

  // Function to check newsletter subscription status
  const checkNewsLtrSubsc = async (config: any, callback: (cbData: any) => void) => {
    if (config) {
      setIsLoading(true);
      try {
        const response = await fetch(`${nlSubEndPoint}/chkStatus/${nlChannelId}`, {
          method: 'POST',
          headers: reqHeader,
          body: JSON.stringify({
            ssoId: config.email || userInfo?.primaryEmail,
            key: config.key || ""
          })
        });

        const result = await response.json();
        setIsLoading(false);

        const cbData = {
          success: false,
          failure: true,
          message: result.message,
          data: result,
          config
        };

        if (result.status === 200) {
          cbData.success = true;
          cbData.failure = false;

          const subscribed_nwsltr: string[] = [];
          result.subscriptionStatus.subscriptions.forEach((item: { serviceId: string }) => {
            if ((item as any).subscriptionStatus !== "INACTIVE") {
              subscribed_nwsltr.push(item.serviceId);
            }
          });

          const date = new Date();
          date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
          const expires = "; expires=" + (date as any).toGMTString();
          document.cookie = `_widget=${subscribed_nwsltr}${expires}; path=/`;

          if (result.subscriptionStatus.referralCode) {
            sessionStorage.setItem('referralCode', result.subscriptionStatus.referralCode);
          } else {
            sessionStorage.removeItem('referralCode');
          }
        }

        callback(cbData);
      } catch (error) {
        setIsLoading(false);
        callback({
          success: false,
          failure: true,
          message: error.message || 'Not found Subscriptions data',
          data: error
        });
      }
    }
  };

  // Function to unsubscribe from newsletter
  const unsubsNews = async (config: any, callback: (cbData: any) => void) => {
    if (config) {
      setIsLoading(true);
      const userEmail = userInfo?.primaryEmail || config.email || sessionStorage.getItem("tempEmail");

      try {
        const response = await fetch(`${nlSubEndPoint}/unsub/${nlChannelId}`, {
          method: 'POST',
          headers: reqHeader,
          body: JSON.stringify({
            userId: userEmail,
            serviceId: config.sid,
            src: 0
          })
        });

        const data = await response.json();
        setIsLoading(false);

        const cbData = {
          success: false,
          failure: true,
          message: data.message || 'We are facing some issues, Please try again later.',
          data,
          config
        };

        if (data.status === 200) {
          setCookieToSpecificTime("_widget", "", 0, 0, 0);
          cbData.success = true;
          cbData.failure = false;
          cbData.message = data.message || 'Unsubscribed successfully.';
        }

        callback(cbData);
      } catch (error) {
        setIsLoading(false);
        callback({
          success: false,
          failure: true,
          message: error.message || 'We are facing some issues, Please try again later.',
          data: error
        });
      }
    }
  };

  return {
    initSubscription,
    getNewsLtrSuggestion,
    checkNewsLtrSubsc,
    unsubsNews,
    isLoading
  };
};

export default useNewsletterSubscription;
