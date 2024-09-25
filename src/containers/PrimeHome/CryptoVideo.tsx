import React, { useState } from "react";
const CryptoVideo = ({ data, title = "" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return (
    <>
      <div className="cryptovideo_widget">
        <h3>
          {title} - <span>Stay in the know</span>
        </h3>
        <iframe
          allowFullScreen
          height="195"
          width="255"
          data-threshold="300"
          src={`https://${
            window?.APP_ENV == "production" ? "economictimes" : "etdev8243"
          }.indiatimes.com/videodash.cms?msid=${
            data[0]?.msid
          }&rlvideo=87021446&fallBackMute=true&skipad=1&widget=subscriberhome&iswebpre=true`}
        ></iframe>
        <a target="_blank" href={data[0]?.url} title={data[0]?.title}>
          {data[0]?.title}{" "}
        </a>
      </div>
      <style jsx>{`
        .cryptovideo_widget iframe {
          border: none;
        }
        .cryptovideo_widget h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }
        .cryptovideo_widget h3 > span {
          font-size: 12px;
        }
        .cryptovideo_widget > a {
          font-size: 18px;
          font-family: Faustina;
          font-weight: 500;
          color: #000;
        }
      `}</style>
    </>
  );
};
export default CryptoVideo;
