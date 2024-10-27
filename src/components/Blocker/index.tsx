"use client";
import React, { useState } from "react";
import styles from "./Blocker.module.scss";
import { initSSOWidget } from "../../utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import AddStockComponent from "components/StockAdd";

interface propsType {
  type: any;
  updateTableHander?: any;
}

const handleLoginToggle = (): void => {
  initSSOWidget();
};

const blockerList: any = {
  loginBlocker: {
    id: 1,
    message:
      "Track your favorite stocks in one place. <br /> Login & manage your Watchlist.",
    cta: "Login",
    action: handleLoginToggle,
    icon: 107522568,
  },
  noDataFound: {
    id: 2,
    message:
      "We couldn't find any matching records based on the current selection",
    cta: "",
    action: "",
    icon: 107522565,
  },
  noStocks: {
    id: 3,
    message: "Looks like your watchlist is empty",
    submessage: "Add stocks to get personalised alerts",
    cta: "Add Stocks Now",
    action: "",
    icon: 114656418,
  },
  notFound: {
    id: 4,
    message: "Page not Found!",
    cta: "",
    action: "",
    icon: 107522565,
  },
  noDataMinimal: {
    id: 5,
    message: "No Data Found",
    cta: "",
    action: "",
    icon: 107522570,
  },
  noRecentDeals: {
    id: 6,
    message: "No recent deals have been made by the investor",
    cta: "",
    action: "",
    icon: 107522565,
  },
};
const Blocker = (props: propsType) => {
  const { type, updateTableHander } = props;
  const { message, submessage, cta, action, icon, id } = blockerList[type] || {};
  const [addStockShow, setAddStockShow] = useState(false);
  const handleAddStocks = () => {
    setAddStockShow(true);
  };

  return (
    <>
      <div className={styles.blockerContainer}>
        {icon && (
          <img
            width={icon == "114656418" ? "auto" : 150}
            height={150}
            alt={message}
            title={message}
            src={(GLOBAL_CONFIG as any).ET_IMG_DOMAIN + `/photo/${icon}.cms`}
            loading="lazy"
          />
        )}
        {message && <p dangerouslySetInnerHTML={{ __html: message }} />}
        {submessage && <p className={styles.submessage} dangerouslySetInnerHTML={{ __html: submessage }} />}
        {type == "notFound" && (
          <a
            className="linkUnderline"
            href={(GLOBAL_CONFIG as any)[window.APP_ENV]["ET_WAP_URL"]}
          >
            Go to Economictimes.com
          </a>
        )}
        {cta && <button onClick={id == 3 ? handleAddStocks : action} className={`${id == 3 ? styles.bgred : ''}`}>{id == 3 && <span className={styles.plusIcon} />}<span>{cta}</span></button>}
      </div>
      {addStockShow ? (
        <AddStockComponent
          moduelClose={setAddStockShow}
          updateTableHandler={updateTableHander}
        />
      ) : null}
    </>
  );
};
export default Blocker;
