import { Fragment, useEffect, useRef, useState } from "react";
import API_CONFIG from "../../network/config.json"
import { SITE_APP_CODE, X_CLIENT_ID } from "utils/common";
import { fetchAdaptiveData } from "utils/ga";

export default function LessonsFromGrandmasters({ focusArea, isDev }) {
  const APP_ENV = isDev ? "development" : "production";
  const [series, setSeries]: any = useState([]);
  const [leaders, setLeaders]: any = useState([]);
  const [ticketID, setTicketId] = useState("");
  const [token, setToken] = useState("");
  const [isPrimeUser, setIsPrimeUser] = useState(false);
  const formRefs: any = useRef([]);
  const grandMasterActionURL = {
      development: "https://masterclass.economictimes.indiatimes.com/p/r",
      production: "https://masterclass.economictimes.indiatimes.com/p/r"
    };

  function fetchData(endPoint) {
    try {
    const url = `${API_CONFIG.grandMasters[APP_ENV]}/${endPoint}`;

    fetch(url, {
      headers: {
        "portal": "masterclass"
      }
    })
      .then((response) => response.json())
      .then((data) => {                
        if (endPoint === "series") {
          setSeries(data);
        } else {
          setLeaders(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function isFirstSlot() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return true;
    } else {
      return false;
    }
  }

  const formData = (id, url) => {
    return(
      <form ref={(el: any) => (formRefs.current[id] = el)} action={grandMasterActionURL[APP_ENV]} method="POST" style={{ display: "none" }}>
        <input type="hidden" name="token-id" value={token} />
        <input type="hidden" name="ticket-id" value={ticketID} />
        <input type="hidden" name="ru" value={url} />
        <input
          type="hidden"
          name="client-id"
          value={X_CLIENT_ID[APP_ENV]}
        />
        <input
          type="hidden"
          name="site-app-code"
          value={SITE_APP_CODE[APP_ENV]}
        />
      </form>
    )
  }

  const handleLinkClick = (e, id, name) => {
    e.preventDefault();
    let { lastClick } = fetchAdaptiveData();
    window.customDimension = { url: window.location.href, title: document.title, referral_url: document.referrer, platform: 'pwa' };
    window.customDimension["last_click_source"] = lastClick || "";
    window.customDimension["method"] = window.objInts.readCookie("LoginType") || '',
    window.customDimension["login_status"] = window.objUser && window.objUser.info && window.objUser.info.isLogged ? 'y' : 'n',
    window.customDimension["subscription_status"] = 'paid'; 
    // grxEvent('event', {
    //   'event_category': 'HP Clicks', 
    //   'event_action': `Prime Widget - Grandmaster - ${name}`, 
    //   'event_label': `https://${__APP.isLive ? 'm' : 'etnext'}.economictimes.com/etgrandmasters/${id}`,
    //   "et_product":"Grandmaster"
    // },
    //    1);
   const formRef = formRefs.current[id];
    if (isPrimeUser && ticketID && token && formRef) {
      formRef?.submit();
    } else {
      window.location.href = `https://${window?.isDev ? 'm' : 'etnext'}.economictimes.com/etgrandmasters/${id}`;
    }
  };


  useEffect(() => {
    const endPoint = isFirstSlot() ? "series" : "leaders?slug=all";
    fetchData(endPoint);
  }, [])

  return (
    <>
      <div className={`grandmaster ${focusArea}`}>
        <h2 className="title">Lessons From the Grandmasters</h2>
        <div className="seriesWrapper">
        {isFirstSlot()
          ? series?.data?.length && series?.data?.map((series, index) => (
              <div key={`seriesCard${index}`}>
                {formData(series.id, series.slug_url)}
                <div className="seriesCard" onClick={(e) => handleLinkClick(e, series.id, series.name)}>
                  <img src={series.feature_image_url} width={240} loading="lazy" decoding="async" />
                </div>
              </div>
            ))
          : leaders?.data?.speakers?.length &&
            leaders?.data?.speakers?.map((leader, index) => (
              <Fragment key={`leadersData_${index}`}>
              {formData(leader.leader_id,leader.slug)}
                <div className="leaderCard" key={`leaderCard${index}`}>
                  <img src={leader.picture_url} width={175} loading="lazy" decoding="async" />
                  <div className="leaderContent">
                    <p className="leaderName">
                      {leader.user_name}
                      <span className="nameBorder" />
                    </p>
                    <p className="leaderInfo">
                      {leader.designation}, {leader.company}
                    </p>
                    <a href={leader.slug} className="btnPreview" style={{color:"#fff !important"}} onClick={(e) => handleLinkClick(e, leader.leader_id, leader.user_name)}>Watch Now </a>
                  </div>
                </div>
              </Fragment>
            ))}
      </div>
      </div>
      <style jsx>{`
        .grandmaster{
          padding-left: 20px;          
          margin-top: 1px;
          position: relative;

          &.news {
            border-left: 1px dotted #9b8680;
          }

          .title {
            border-bottom: 1px solid#9b8680;
            font-size: 20px;
            font-weight: 800;
            padding-bottom: 7px;
            padding-top: 15px;
            text-transform: uppercase;

            &:before {
              content: "";
              left: -7px;
              top: 19px;
              position: absolute;
              width: 16px;
              height: 17px;
              background: url("https://img.etimg.com/photo/109967743.cms");              
              background-size: 500px;
              background-position: -395px -135px;
            }
          }
        }
      `}</style>
    </>
  )
}
