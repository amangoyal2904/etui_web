import React, { useState, useEffect } from "react";
import API_CONFIG from "../../network/config.json";
const CryptoChart = () => {
  const [coin, setCoin] = useState("btc");
  const [coinsData, setCoinsData] = useState<any>([]);
  useEffect(() => {
    getData();
    let timer = setInterval(getData, 24e3);
    return () => clearInterval(timer);
  }, []);
  const getData = async () => {
    try {
      const API_URL = API_CONFIG.cryptoDomain["production"] + "/ET_Cryptocurrency/cryptocurrencydata?symbol=btc,eth";
      const response = await fetch(API_URL);
      const apiData = await response.json();
      setCoinsData(apiData);
    } catch (e) {
      console.error("Crypto Coins Api Failed", e);
    }
  };
  return (
    <>
      <div className="crypto_sprite crypto_icon"></div>
      <div className="mudrex_powered">
        Powered by <img height="15" width="60" loading="lazy" src="https://img.etimg.com/photo/105290479.cms"></img>
      </div>
      <div className="crypto_chart">
        <div className="coin_tabs_wrap">
          {coinsData?.map((ele, index) => {
            return (
              <div
                className={`${coin === ele?.symbol ? "active" : ""} ${
                  ele?.percentChange >= 0 ? "positive" : "negative"
                }`}
                onClick={() => {
                  if (coin != ele?.symbol) setCoin(ele?.symbol);
                }}
              >
                <p className="coin_name">{ele?.coinName}</p>
                <p className="price">
                  <span className="crypto_sprite diff_icon"></span>
                  {ele?.price.toLocaleString()}
                </p>
                <p className="change">{ele?.percentChange.toFixed(2)}%</p>
              </div>
            );
          })}
        </div>
        <iframe
          height="155"
          width="243"
          data-threshold="300"
          src={`https://${
            window?.APP_ENV != "production" ? "etdev8243" : "economictimes"
          }.indiatimes.com/renderchart.cms?type=crypto&symbol=${coin}&height=155&transparentBg=1`}
        ></iframe>
      </div>
      <style jsx>{`
        .crypto_sprite {
          background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
          display: inline-block;
          background-size: 475px;
        }
        .crypto_icon {
          width: 240px;
          height: 23px;
          background-position: -12px -286px;
          margin-bottom: 3px;
        }
        .mudrex_powered {
          font-size: 10px;
          font-weight: 500;
          color: #666;
          text-transform: initial;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mudrex_powered img {
          margin-left: 10px;
        }
        .crypto_chart {
          margin-top: 24px;
        }
        .crypto_chart iframe {
          border: none;
          margin-top: 18px;
        }
        .crypto_chart .coin_tabs_wrap {
          display: flex;
        }
        .coin_tabs_wrap > div {
          width: 100%;
          padding: 7px;
          cursor: pointer;
        }
        .coin_tabs_wrap > div.active {
          box-shadow: 0 2px 4px 0 rgb(0 0 0 / 4%);
          background-color: #ffebe4;
          position: relative;
        }
        .coin_tabs_wrap > div.active::after {
          content: "";
          border-color: #ffebe4 transparent transparent transparent;
          border-width: 10px 10px 0 10px;
          border-style: solid;
          height: 0;
          width: 0;
          position: absolute;
          bottom: -10px;
          left: 50%;
          margin-left: -5px;
        }
        .coin_name {
          font-size: 14px;
          font-weight: 600;
          display: block;
          color: #4a4a4a;
          margin-bottom: 7px;
        }
        .price {
          font-size: 19px;
        }
        .price .diff_icon {
          width: 9px;
          height: 17px;
          background-position: -285px -39px;
          vertical-align: top;
          margin-right: 4px;
        }
        .positive .diff_icon {
          background-position: -302px -39px;
        }
        .change {
          padding-left: 11px;
          font-size: 11px;
          color: #da2337;
        }
        .positive .change {
          color: #009060;
        }
        .negative .change {
          color: #da2337;
        }
      `}</style>
    </>
  );
};
export default CryptoChart;
