import React from "react";
import styles from "./styles.module.scss"; // Import SCSS module for styling

// Declare global variables
declare const geoinfo: any;
declare global {
  interface Window {
    objMarketBand: any;
  }
}

interface CubeFaceProps {
  faceData: {
    template: string;
    topAdCode: string;
    bgColor: string;
    detail: string;
    dl: string;
    // Add more properties as needed
  };
  index: number;
  onClose: () => void; // Function to close the cube face
}

const CubeFace: React.FC<CubeFaceProps> = ({ faceData, index, onClose }) => {
  const { template, topAdCode, bgColor, detail, dl } = faceData;

  const getTextDataHtml = (
    template: string,
    dl: string,
    topAdCode: string,
    detail: string,
    bgColor: string,
    index: number
  ) => (
    <div className={`${styles.budgetCubeItem}`} data-template={template} style={{ background: bgColor }}>
      <button className={`${styles.closebtn}`} type="button"></button>
      <div className={styles.etads1}>
        <div
          id={`div-gpt-ad-1561446352758-${index}`}
          data-adsSlot={topAdCode}
          data-size="[145, 30]"
          data-loc="All"
        ></div>
      </div>
      <div className={`${styles.etcontent} ${styles.smAds}`}>
        <a href={dl}>{detail}</a>
      </div>
    </div>
  );

  const getMarketFeedDataHtml = (template: string, topAdCode: string, bgColor: string, index: number) => {
    const data =
      template === "sensex" ? window.objMarketBand.bandData["S1"][1] : window.objMarketBand.bandData["S1"][0];
    const url = template === "sensex" ? "/markets/indices/bse-sensex" : "/markets/indices/nifty-50";
    const cls = data.netChange > 0 ? styles.green : styles.red;
    const status = window.objMarketBand.bandData.common.currentMarketStatus;

    return (
      <div className={`${styles.budgetCubeItem}`} data-template={template} style={{ background: bgColor }}>
        <button className={`${styles.closebtn}`} type="button" onClick={onClose}></button>
        <div className={styles.etads1}>
          <div
            id={`div-gpt-ad-1561446352758-${index}-${template}`}
            data-adsSlot={topAdCode}
            data-size="[145, 30]"
            data-loc="All"
          ></div>
        </div>
        <div className={`${styles.etcontent} ${styles.feeds}`}>
          <a href={url} target="_blank">
            <div className={`${styles.title}`}>
              <span className={`${styles.name}`}>{data.serviceName}</span>
              <span className={`${styles.status} ${styles[status]}`}>{status}</span>
            </div>
            <div className={`${styles.values}`}>
              <span className={`${styles.num}`}>{data.currentIndexValue.toFixed(2)}</span>
              <span className={`${styles.per} ${cls}`}>{data.netChange.toFixed(2)}</span>
            </div>
          </a>
        </div>
      </div>
    );
  };

  const getSmallAdHtml = (template: string, topAdCode: string, detail: string, bgColor: string, index: number) => (
    <div className={`${styles.budgetCubeItem}`} data-template={template} style={{ background: bgColor }}>
      <button className={`${styles.closebtn}`} type="button"></button>
      <div className={styles.etads1}>
        <div
          id={`div-gpt-ad-1561446352758-${index}`}
          data-adsSlot={topAdCode}
          data-size="[145, 30]"
          data-loc="All"
        ></div>
      </div>
      <div className={styles.etads2}>
        <div id={`div-gpt-ad-1561446417010-${index}`} data-adsSlot={detail} data-size="[145, 95]" data-loc="All"></div>
      </div>
    </div>
  );

  const getFullAdHtml = (template: string, detail: string, bgColor: string, index: number) => (
    <div className={`${styles.budgetCubeItem}`} data-template={template} style={{ background: bgColor }}>
      <button className={`${styles.closebtn}`} type="button"></button>
      <div className={styles.etads2}>
        <div id={`div-gpt-ad-1561446417010-${index}`} data-adsSlot={detail} data-size="[145, 145]" data-loc="All"></div>
      </div>
    </div>
  );

  return (
    <div className={styles["cube-face"]} style={{ backgroundColor: bgColor }}>
      {(template === "sensex" || template === "nifty") && getMarketFeedDataHtml(template, topAdCode, bgColor, index)}
      {template === "ad" && getSmallAdHtml(template, topAdCode, detail, bgColor, index)}
      {template === "fullad" && getFullAdHtml(template, detail, bgColor, index)}
      {template === "text" && getTextDataHtml(template, dl, topAdCode, detail, bgColor, index)}
    </div>
  );
};

export default CubeFace;
