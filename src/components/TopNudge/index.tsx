import { useEffect, useState } from "react";
import APIS_CONFIG from "../../network/config.json";
import { currPageType, APP_ENV } from "utils";
import NudgeContainer from "./NudgeContainer";
import { grxEvent } from "utils/ga";
import Service from "network/service";

import styles from "./styles.module.scss";
import { fetchAllMetaInfo } from "utils/articleUtility";
import { useStateContext } from "../../store/StateContext";
import jStorage from "jstorage-react";

export default function TopNudge({objVc}) {
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, permissions } = state.login;
  const [metaInfo, setMetaInfo] = useState<any>({});

  const fetchSubsc = async () => {
    const url = APIS_CONFIG["AllUserSubscriptions"][APP_ENV];
    const isGroupUser = permissions?.includes("group_subscription") || false;
    const res = await Service.get({
      url,
      params: { merchantCode: "ET", isGroupUser },
    });
    const resData = res?.data || [];

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


        // const data = [{
        //     "merchantCode": "ET",
        //     "productCode": "ETPR",
        //     "productName": "ET Prime",
        //     "planName": "Annual Membership",
        //     "purchaseDate": "2023-01-18 15:14:48",
        //     "expiryDate": "2024-02-01 15:14:48",
        //     "paymentMode": "ETPAY",
        //     "recurring": 0,
        //     "price": 2499,
        //     "finalBillingAmount": 2499,
        //     "discount": 0,
        //     "currency": "INR",
        //     "userSubscriptionId": "63c7bf90cb571cfa97a1dc4e",
        //     "subscriptionStatus": "active",
        //     "trialExpiryDate": "2023-02-01 15:14:48",
        //     "trial": false,
        //     "refundable": false,
        //     "canRenew": true,
        //     "planPeriod": 1,
        //     "planPeriodUnit": "YEAR",
        //     "planId": 28,
        //     "userAcquisitionType": "REGULAR_PLAN_PURCHASE",
        //     "paymentMethod": "CC",
        //     "trialEndDate": "2023-02-01 15:14:48",
        //     "showRenew": true,
        //     "eligibleForUpgrade": false,
        //     "eligibleForExtension": false,
        //     "graceEndDate": "2024-02-17 15:14:48",
        //     "subscriptionStartDate": "2023-01-18 15:14:48",
        //     "planCode": "etprAnnualPlan",
        //     "daysLeft": 16,
        //     "eligibleForSiMandate": false,
        //     "siteAppCodeType": "ET",
        //     "planPriceCurrency": "INR",
        //     "planShortName": "Yearly"
        // }]
        checkNudgeType(resData);
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

  const appendBand = async(bannerType) => {
    var nudgeSavedObj = jStorage.get('topNudgeObj') && JSON.parse(jStorage.get('topNudgeObj'));
    var reActivatedEnabled = nudgeSavedObj ? +new Date() > nudgeSavedObj.reActivatedOn : true;
    var topNudgeEnabled = objVc.top_nudge_enable && Number(objVc.top_nudge_enable) || 0;
    var accessPassData = jStorage.get('accessPassData');
    var isOnBoardingeligibile = accessPassData && accessPassData.eligible;

    if(reActivatedEnabled && topNudgeEnabled && !isOnBoardingeligibile) {
        grxEvent('event', {'event_category': 'Platform Nudge - Web',  'event_action': 'User Eligible for Banner', 'event_label': bannerType + ' | Banner Location '+ currPageType()});
        const allMetaData = await fetchAllMetaInfo(98201998) || {};
        allMetaData['bannerType'] = bannerType;
        setNudgeDetails(allMetaData);
    } else {
        //window.saveLogs && window.saveLogs({'type': 'top_nudge_skipped', 'bannerType': bannerType, 'TP_email': _tp_data.email, 'origin' : 'appendBand'});
        console.info('Nudge Skipped');
    }
  }

  const setNudgeDetails = (data) => {
    if(data?.bannerType) {
        let dataDetails = {};
        switch(data?.bannerType) {
            case 'grace_period':
                dataDetails = {
                    "banner_enabled": data.ColumnLabel.toLowerCase(),
                    "banner_cross": data.Shoppingcarturl?.toLowerCase(),
                    "cross_frequency": data.ContentRulesInfoGraphicId,
                    "banner_subtext": data.CCIOnlineAuthorName,
                    "banner_bg": data.NewsletterEmail,
                    "button_link": data['5888Follow'],
                    "banner_text": data.NewsKeywords,
                    "button_text": data.Abbreviation,
                    "image_msid": data.Photographer,
                    "banner_type": data.bannerType,
                }
              break;
            case 'about_to_expire':
                dataDetails = {
                    "banner_enabled": data.TemplateBreadrumbs.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.Altdescription,
                    "image_msid": data.Sluglinebeforeheadline,
                    "banner_text": data.overridetemplate,
                    "banner_subtext": data.SpecialID,
                    "button_link": data.canonicalURL,
                    "button_text": data.Sluglineafterheadline,
                    "banner_cross": data.MetaKeywords?.toLowerCase(),
                    "cross_frequency": data.Matchid,
                }
              break;
            case 'cancelled':
                dataDetails = {
                    "banner_enabled": data.MovieReviewTrivia.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.MovieReviewSpoiler,
                    "image_msid": data.RelatedDefinitions,
                    "banner_text": data.MovieShortCode,
                    "banner_subtext": data.MovieReviewTwitterHandle,
                    "button_link": data.MovieBuzz,
                    "button_text": data.SpecialMovieRevID,
                    "banner_cross": data.MovieReviewHeadline?.toLowerCase(),
                    "cross_frequency": data.MovieReviewBoxOffice,
                }
              break;
            case 'adFree':
                dataDetails = {
                    "banner_enabled": data.POIMapIdentifier.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.GuideContinent,
                    "image_msid": data.BestTimeToVisit,
                    "banner_text": data.Currency,
                    "banner_subtext": data.IconClass,
                    "button_link": data.Timezone,
                    "button_text": data.Festivals,
                    "banner_cross": data.GuideCountry?.toLowerCase(),
                    "cross_frequency": data.MapCenter,
                }
              break;
            case 'active_nonrec':
                dataDetails = {
                    "banner_enabled": data.PriceRange.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.Checkout,
                    "image_msid": data.Address,
                    "banner_text": data.Phone,
                    "banner_subtext": data.FoodCategory,
                    "button_link": data.Website,
                    "button_text": data.Email,
                    "banner_cross": data.Checkin?.toLowerCase(),
                    "cross_frequency": data.NumberOfRooms,
                }
              break;
            case 'cancelled_nonrec':
                dataDetails = {
                    "banner_enabled": data.ETPersonDesignation.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.EventLocation,
                    "image_msid": data.PersonsFirstName,
                    "banner_text": data.PersonsLastName,
                    "banner_subtext": data.BeautyPageantCollege,
                    "button_link": data.Alttitle,
                    "button_text": data.Profession,
                    "banner_cross": data.EventName?.toLowerCase(),
                    "cross_frequency": data.BeautyPageantSchool,
                }
              break;
            case 'pgateway_dropped_users':
                dataDetails = {
                    "banner_enabled": data.POIMapIdentifier.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.AddVehicle,
                    "image_msid": data.BrouchureURL,
                    "banner_text": data.RelatedGadgets,
                    "banner_subtext": data.RelatedSlideshows,
                    "button_link": data.GadgetsWAPStreamingUrl,
                    "button_text": data.GadgetsWEBStreamingUrl,
                    "banner_cross": data.AmazonAffiliatesKeywords?.toLowerCase(),
                    "cross_frequency": data.GadgetsModelDisplayName,
                }
              break;
            case 'access_pass_users':
                dataDetails = {
                    "banner_enabled": data.AmazonProdLink.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.ContentRulesAmazonProductId,
                    "image_msid": data.BlogPost,
                    "banner_text": data.BlogsName,
                    "banner_subtext": data.BlogAuthorImageUrl,
                    "button_link": data.ContentRulesIndiatimesShoppingProductId,
                    "button_text": data.BlogAuthorName,
                    "banner_cross": data.AmazonProdTitle?.toLowerCase(),
                    "cross_frequency": data.productScore,
                }
              break;
            case 'b2c_users':
                dataDetails = {
                    "banner_enabled": data.AuthorName.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.RatingDecor,
                    "image_msid": data.VenueEmail,
                    "banner_text": data.VenueFacebookUrl,
                    "banner_subtext": data.RatingFood,
                    "button_link": data.RatingBuzz,
                    "button_text": data.VenuePricePer,
                    "banner_cross": data.RatingService?.toLowerCase(),
                    "cross_frequency": data.AuthorImageUrl,
                }
              break;
            case 'times_prime_users':
                dataDetails = {
                    "banner_enabled": data.VenueZonename.toLowerCase(),
                    "banner_type": data.bannerType,
                    "banner_bg": data.VenueCity,
                    "image_msid": data.WhatshotLandmark,
                    "banner_text": data.WhtshotVenueId,
                    "banner_subtext": data.WhtshotVenueName,
                    "button_link": data.VenueType,
                    "button_text": data.VenueUrl,
                    "banner_cross": data.VenueLocality?.toLowerCase(),
                    "cross_frequency": data.EventPhone,
                }
              break;
            default:
                dataDetails = {}
        }
        if(["about_to_expire", "access_pass_users", "grace_period", "b2c_users", "times_prime_users"].indexOf(data?.bannerType) !== -1) {
          // data.info_text.replace('[0]', dateFormat(new Date(objUserSub.subscriptionData.expiryDate), '%d %Mmm, %Y'));
        }
        if(!Object.keys(dataDetails).length) {
          // window.saveLogs && window.saveLogs({'type': 'top_nudge_band', 'data': data, 'bannerType': data.bannerType, 'TP_email': _tp_data.email, 'origin' : 'appendBand'});
        }
        setMetaInfo(dataDetails);
    }
  }

  useEffect(() => {
    if(isLogin && !Number(objVc?.ads_primeuser_enable)) {
      fetchSubsc();
    }
  }, [isLogin]);

  return (
    <>      
      <div className={`${styles.breadCrumb} ${isPrime ? styles.pink_theme : ""}`}>
        <div className={styles.breadCrumbWrap}>
          {metaInfo?.banner_enabled === "on" && <NudgeContainer data={metaInfo} />}
        </div>
      </div>
    </>
  );
}
