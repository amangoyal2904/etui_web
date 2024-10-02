import React, { useEffect, useRef } from "react";
import styles from "./DashboardWidget.module.scss";
import { formatNumber, getStockUrl } from "../../../utils";
// import WatchlistAddition from "../../../components/WatchlistAddition";
const DashboardStockData = ({ item, highlightLtp, focusArea }: any) => {
  const colorCls = item?.percentChange > 0 ? "up" : "down";
  const prevStockCardRef = useRef<any>([]);
  const ltpRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className={styles.list}>
      <div className={styles.max}>
        <div className="dflex align-item-center space-between ">
          <div className={styles.compNameWrp}>
            <a
              href={getStockUrl(
                item?.companyId,
                item?.seoName,
                item?.companyType,
              )}
              target="_blank"
              className={styles.compName}
              title={`${item?.companyShortName} Share Price`}
            >
              {item?.companyShortName}
            </a>
            <span
              className={`numberFonts ${styles.volume}`}
            >{`(Vol: ${formatNumber(item?.volumeInThousand, 2)}k)`}</span>
          </div>
          {
            focusArea == "market" ? <div className="tar">
              <p
                ref={ltpRef}
                className={`${styles.ltp} numberFonts ${
                  !!highlightLtp && prevStockCard?.current
                    ? parseFloat(item?.current) > parseFloat(prevStockCard?.current)
                      ? "upBg"
                      : parseFloat(item?.current) <
                          parseFloat(prevStockCard?.current)
                        ? "downBg"
                        : ""
                    : ""
                }`}
              >
                {formatNumber(item?.current, 2)}
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
                {`${item?.absoluteChange} (${item?.percentChange}%)`}
              </p>
            </div>  : <p
                ref={ltpRef}
                className={`${styles.ltp} numberFonts ${
                  !!highlightLtp && prevStockCard?.current
                    ? parseFloat(item?.current) > parseFloat(prevStockCard?.current)
                      ? "upBg"
                      : parseFloat(item?.current) <
                          parseFloat(prevStockCard?.current)
                        ? "downBg"
                        : ""
                    : ""
                }`}
              >
                {formatNumber(item?.current, 2)}
              </p>
          }
          
        </div>
        {focusArea == "news" && <div className="dflex align-item-center space-between">
          <p></p>
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
            {`${item?.absoluteChange} (${item?.percentChange}%)`}
          </p>
        </div>}
      </div>
      {/* <WatchlistAddition
        companyName={item?.companyShortName}
        companyId={item?.companyId}
        companyType={item?.companyType}
      /> */}

      <style jsx>{`
        .tar{
          text-align: right;
        }
        .arrow_sprite{
          background-image: url("https://img.etimg.com/photo/109967743.cms");
          background-size: 500px 429px;
          display: inline-block;

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