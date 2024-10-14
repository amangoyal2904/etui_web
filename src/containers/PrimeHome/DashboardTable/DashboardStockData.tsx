import React, { useEffect, useRef } from "react";
import styles from "./DashboardWidget.module.scss";
import { formatNumber, getStockUrl } from "../../../utils";
import { useStateContext } from "../../../store/StateContext";
import { gotoPlanPage } from '../../../utils/utils';
import WatchlistAddition from "components/WatchlistAddition";
// import WatchlistAddition from "../../../components/WatchlistAddition";
const DashboardStockData = ({ item, highlightLtp, focusArea, wdName }: any) => {
  const prevStockCardRef = useRef<any>([]);
  const ltpRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useStateContext();
  const { isLogin, isPrime } = state.login;

  useEffect(() => {
    prevStockCardRef.current = item;
    const timer = setTimeout(() => {
      const elem = ltpRef.current;
      if (elem) {
        elem.classList.remove("upBg", "downBg");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [item]);

  const prevStockCard = prevStockCardRef.current;
  const shortName = item?.data.find(item => item.keyId == "shortName")?.value;
  //const prevLastTradedPrice = prevStockCard?.data?.find(item => item.keyId == "lastTradedPrice").value;
  const lastTradedPrice = item?.data?.find(item => item.keyId == "lastTradedPrice")?.value;
  const volumeInThousand = item?.data?.find(item => item.keyId == "volume")?.value;
  const percentChange = item?.data?.find(item => item.keyId == "percentChange")?.value;
  const percentChange_trend = item?.data?.find(item => item.keyId == "percentChange")?.trend;
  const netChange = item?.data?.find(item => item.keyId == "netChange")?.value;
  const sr_targetVsCurrent = item?.data?.find(item => item.keyId == "sr_targetVsCurrent")?.value;
  const sr_targetVsCurrent_trend = item?.data?.find(item => item.keyId == "sr_targetVsCurrent")?.trend;
  const sr_avgScore = item?.data?.find(item => item.keyId == "sr_avgScore")?.value;
  const colorCls = percentChange_trend;

  return (
    <div className={styles.list}>
      <div className={styles.max}>
        <div className="dflex align-item-center space-between ">
          <div className={styles.compNameWrp}>
            <a
              href={getStockUrl(
                item?.assetId,
                item?.assetSeoName,
                item?.assetType
                ,
              )}
              target="_blank"
              className={styles.compName}
              title={`${shortName} Share Price`}
            >
              {shortName}
            </a>
            <span
              className={`numberFonts ${styles.volume}`}
            >{`(Vol: ${volumeInThousand}k)`}</span>
          </div>
          {
            focusArea == "news" ? <div className="tar">
              <p
                ref={ltpRef}
                className={`${styles.ltp} numberFonts ${
                  !!highlightLtp && prevStockCard.lastTradedPrice
                    ? parseFloat(lastTradedPrice) > parseFloat(prevStockCard.lastTradedPrice)
                      ? "upBg"
                      : parseFloat(lastTradedPrice) <
                          parseFloat(prevStockCard.lastTradedPrice)
                        ? "downBg"
                        : ""
                    : ""
                }`}
              >
                {lastTradedPrice}
              </p>
              <p className={`numberFonts ${colorCls} ${styles.change} dflex align-items-center`}>
                <span
                  className={`arrow_sprite ${
                    colorCls == "up"
                      ? "eticon_up_arrow"
                      : colorCls == "down"
                        ? "eticon_down_arrow"
                        : ""
                  }`}
                />
                {`${netChange ? netChange : ""} (${percentChange})`}
              </p>
            </div>  : <p
                ref={ltpRef}
                className={`${styles.ltp} numberFonts ${
                  !!highlightLtp && prevStockCard?.lastTradedPrice
                    ? parseFloat(lastTradedPrice) > parseFloat(prevStockCard?.lastTradedPrice)
                      ? "upBg"
                      : parseFloat(lastTradedPrice) <
                          parseFloat(prevStockCard?.lastTradedPrice)
                        ? "downBg"
                        : ""
                    : ""
                }`}
              >
                {lastTradedPrice}
              </p>
          }
          
        </div>
        {focusArea == "market" && <div className="dflex align-item-center space-between">
          <div className="dflex align-items-center">
            <p className="dflex align-items-center">{
                isPrime ? <>
                <span className="arrow_sprite pIcon"></span>
                <span className="s_line_text">Stock Score: {sr_avgScore}</span>
                </> :  <span className="s_line_text pointer" onClick={gotoPlanPage}>Upgrade to Prime</span>
            }</p>
            <div className="separator"></div>
            <div className={`s_line_text dflex align-item-center}`}>{isPrime ? <>
                Potential Upside: <span
                  className={` arrow_sprite ${
                    sr_targetVsCurrent_trend == "up"
                      ? "eticon_up_arrow"
                      : sr_targetVsCurrent_trend == "down"
                        ? "eticon_down_arrow"
                        : ""
                  }`}
                /><span className={`${sr_targetVsCurrent_trend == "up"
                    ? "green"
                    : sr_targetVsCurrent_trend == "down"
                      ? "red"
                      : ""}`}>{sr_targetVsCurrent}</span>
            </> : <span className="s_line_text pointer" onClick={gotoPlanPage}>Upgrade to Prime</span>}</div>
          </div>
          <p className={`numberFonts ${colorCls} ${styles.change} dflex align-items-center`}>
            <span
              className={`arrow_sprite ${
                colorCls == "up"
                  ? "eticon_up_arrow"
                  : colorCls == "down"
                    ? "eticon_down_arrow"
                    : ""
              }`}
            />
            {`${netChange ? netChange : ""} (${percentChange})`}
          </p>
        </div>}
      </div>
      {/* <WatchlistAddition
        companyName={item?.companyShortName}
        companyId={item?.companyId}
        companyType={item?.companyType}
      /> */}

      {wdName != "My Watchlist" && <WatchlistAddition
        companyName={item.assetName}
        companyId={item.assetId}
        companyType={item.assetType}
        customStyle={{
          width: "18px",
          height: "18px",
        }}
      />}

      <style jsx>{`
        .tar{
          text-align: right;
        }
        .separator {
            height: 10px;
            background-color: #c8c8c8;
            width: 1px;
            margin: 0 5px;
        }
        .s_line_text{
            font-size: 11px;
            color: #707070;
            font-weight: 500;
            line-height: 13.41px;
        }
        .pointer{
            cursor:pointer;
        }
        .red{
            color: red;
        }

        .green{
            color: #147014;
        }
        .arrow_sprite{
          background-image: url("https://img.etimg.com/photo/109967743.cms");
          background-size: 500px 429px;
          display: inline-block;

          &.pIcon{
            background-position: -426px -112px;
            width: 9px;
	        height: 9px;
            margin-right: 2px;
          }

          &.eticon_down_arrow{
            background-position: -317px -9px;
            width: 6px;
	          height: 11px;
            margin: 0 2px;
          }

          &.eticon_up_arrow{
            background-position: -327px -9px;
            width: 6px;
	          height: 11px;
            margin: 0 2px;
          }
        }
        .dflex{
          display:flex;

          &.space-between{
            justify-content: space-between;
          }

          &.align-items-center{
            align-items: center;
          }
        }

        .up {
            color: #147014 !important;
            background: #EDFFF9;
        }

        .down {
            color: #d51131 !important;
            background-color: #fff1f3;
        }
      `}</style>
    </div>
  );
};

export default DashboardStockData;