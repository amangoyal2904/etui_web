import { useEffect, useState } from "react";

import { checkLoggedinStatus, currPageType } from "utils";
import NudgeContainer from "./NudgeContainer";
import { grxEvent } from "utils/ga";

import styles from "./styles.module.scss";

export default function TopNudge({objVc}) {
  const [isPrime, setIsPrime] = useState(false);

  const intsCallback = () =>  {
    window?.objInts?.afterPermissionCall(() => {
      window.objInts.permissions.includes("subscribed") && setIsPrime(true);
      const isLoggedIn = checkLoggedinStatus();
      console.log(isLoggedIn, objVc.ads_primeuser_enable, '-----');
      if(isLoggedIn && !Number(objVc?.ads_primeuser_enable)) {
          fetchSubsc();
      }
    });
  }

  const fetchSubsc = () => {
    /* const isGroupUser = window.objInts.permissions.includes("group_subscription");
    const url = `https://${objVc.subscriptions}.economictimes.indiatimes.com/subscription/allUserSubscriptions?merchantCode=ET&isGroupUser=${isGroupUser}`;

    fetch(url , {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(nextCommentsData => {
          console.log(nextCommentsData, 'nextCommentsData');
          checkNudgeType();
        })
        .catch(err => {
          console.log('error: ', err);
        }) */
        const data = [{
            "merchantCode": "ET",
            "productCode": "ETPR",
            "productName": "ET Prime",
            "planName": "Annual Membership",
            "purchaseDate": "2023-01-18 15:14:48",
            "expiryDate": "2024-02-01 15:14:48",
            "paymentMode": "ETPAY",
            "recurring": 0,
            "price": 2499,
            "finalBillingAmount": 2499,
            "discount": 0,
            "currency": "INR",
            "userSubscriptionId": "63c7bf90cb571cfa97a1dc4e",
            "subscriptionStatus": "active",
            "trialExpiryDate": "2023-02-01 15:14:48",
            "trial": false,
            "refundable": false,
            "canRenew": true,
            "planPeriod": 1,
            "planPeriodUnit": "YEAR",
            "planId": 28,
            "userAcquisitionType": "REGULAR_PLAN_PURCHASE",
            "paymentMethod": "CC",
            "trialEndDate": "2023-02-01 15:14:48",
            "showRenew": true,
            "eligibleForUpgrade": false,
            "eligibleForExtension": false,
            "graceEndDate": "2024-02-17 15:14:48",
            "subscriptionStartDate": "2023-01-18 15:14:48",
            "planCode": "etprAnnualPlan",
            "daysLeft": 16,
            "eligibleForSiMandate": false,
            "siteAppCodeType": "ET",
            "planPriceCurrency": "INR",
            "planShortName": "Yearly"
        }]
        checkNudgeType(data);
  }

  const checkNudgeType = (data) => {
    if(data && data[0]) {
        const timestampNow = +new Date();
        const eu_benchmark = 15;
        const subStatus = data[0].subscriptionStatus;

        const daysSincePlanStart = Math.floor((timestampNow - +new Date(data[0].subscriptionStartDate)) / (1000 * 60 * 60 * 24));
        const expiryDaysLeft = Math.floor((+new Date(data[0].expiryDate) - timestampNow) / (1000 * 60 * 60 * 24));
        const isUserCancelled = subStatus === "cancelled";
        const isCancelledElgible = (expiryDaysLeft <= eu_benchmark) && isUserCancelled;
        const isCancelledNonRec = (expiryDaysLeft > eu_benchmark) && isUserCancelled;
        const istimesPrimeUser = data[0].userAcquisitionType === "GROUP_SUBSCRIPTION" && data[0].userAcquisitionCode === "times_internet" && data[0].planPeriod == 3 && data[0].planPeriodUnit == "MONTH";
        const isGracePeriodOn = timestampNow > +new Date(data[0].expiryDate) && timestampNow < +new Date(data[0].graceEndDate);
        const isExpired = subStatus === "expired" || window.objInts.permissions.includes("expired_subscription");
        const isB2CUser = (data[0].paymentMode.includes("OFFLINE") || data[0].paymentMode.includes("ETPAY")) && (subStatus === "cancelled" || subStatus === "active");
        const isVoucherUser = data[0].userAcquisitionType === "VOUCHER_CODE";
        const isGroupUser = window.objInts.permissions.includes("group_subscription");;
        const isRecurring = data[0].recurring;

        const isAboutToExpire = data[0].daysLeft <= eu_benchmark && expiryDaysLeft > 0;

        const bannerType = istimesPrimeUser ? "times_prime_users" : isGracePeriodOn ? 'grace_period' : isAboutToExpire ? 'about_to_expire' : isCancelledNonRec ? 'cancelled_nonrec' : isCancelledElgible ? 'cancelled' : (daysSincePlanStart > 30) ? "active_nonrec" : isB2CUser ? "b2c_users" : "";
        if(bannerType && !isRecurring) {
            appendBand(bannerType);
        }
    }
  }

  const appendBand = (bannerType) => {
    var nudgeSavedObj = window.e$.jStorage.get('topNudgeObj') && JSON.parse(window.e$.jStorage.get('topNudgeObj'));
    var reActivatedEnabled = nudgeSavedObj ? +new Date() > nudgeSavedObj.reActivatedOn : true;
    var topNudgeEnabled = objVc.top_nudge_enable && Number(objVc.top_nudge_enable) || 0;
    var accessPassData = window.e$.jStorage.get('accessPassData');
    var isOnBoardingeligibile = accessPassData && accessPassData.eligible;

    if(reActivatedEnabled && topNudgeEnabled && !isOnBoardingeligibile) {
        grxEvent('event', {'event_category': 'Platform Nudge - Web',  'event_action': 'User Eligible for Banner', 'event_label': bannerType + ' | Banner Location '+ currPageType()});
        fetch("https://etdev8243.indiatimes.com/reactfeed_mostpopular?bannertype=" + bannerType , {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(nextCommentsData => {
              console.log(nextCommentsData, 'nextCommentsData');
            })
            .catch(err => {
              console.log('error: ', err);
            })
        /* $.ajax({
            url: "/prime_campaign_nudge.cms?msid=98201998&bannertype=" + bannerType,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                if (data) {
                    $('.topUserInfoBand').remove();
                    $('body').prepend(data);
                    grxEvent('event', {'event_category': 'Platform Nudge - Web',  'event_action': 'Banner Viewed - True', 'event_label': bannerType + ' | Banner Location '+ currPageType()});
                    if(["about_to_expire", "access_pass_users", "grace_period", "b2c_users", "times_prime_users"].indexOf(bannerType) !== -1) {
                        $('.topUserInfoBand .info_text').html($('.topUserInfoBand .info_text').html().replace('[0]', dateFormat(new Date(objUserSub.subscriptionData.expiryDate), '%d %Mmm, %Y')));
                    } 
                    
                    objUserSub.bindEvents(bannerType);
                } else {
                    window.saveLogs && window.saveLogs({'type': 'top_nudge_band', 'data': data, 'bannerType': bannerType, 'TP_email': _tp_data.email, 'origin' : 'appendBand'});
                }
            }
        }); */
    } else {
        window.saveLogs && window.saveLogs({'type': 'top_nudge_skipped', 'bannerType': bannerType, 'TP_email': _tp_data.email, 'origin' : 'appendBand'});
        console.info('Nudge Skipped');
    }
  }

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(intsCallback);
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }

    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  return (
    <>      
      <div className={`${styles.breadCrumb} ${isPrime ? styles.pink_theme : ""}`}>
        <div className={styles.breadCrumbWrap}>
          <NudgeContainer />
        </div>
      </div>
    </>
  );
}
