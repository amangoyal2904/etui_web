import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { fetchAllWatchListData, saveStockInWatchList } from "../../utils";
import { initSSOWidget } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import APIS_CONFIG from "../../network/config.json";
import toast from "react-hot-toast";

const WatchlistAddition = ({
  companyName,
  companyId,
  companyType,
  customStyle,
  customeFun,
}: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoReady } = state.login;
  // const { watchlist } = state.watchlistStatus;
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isWatchListAdded, setIsWatchListAdded] = useState(false);

  const fetchWatchListStocks = async () => {
    if (typeof window.watchListApiHitStatus === 'undefined' || window.watchListApiRes === 'failed') {
      window.watchListApiHitStatus = 'hit';
      const data = await fetchAllWatchListData(2, 11);
      window.bookmarkApiHitStatus = 'success';
      let watchlistArr = [];
      if (data?.resData?.length > 0) {
        watchlistArr = data?.resData.map((entry: any) => {
          return (
            entry.companyType && {
              companyId: entry.prefDataVal,
              companyType: entry.id,
            }
          );
        });
      } else if (data?.length > 0) {
        watchlistArr = data.map((entry: any) => {
          return (
            entry.companyType && {
              companyId: entry.prefDataVal,
              companyType: entry.companyType,
            }
          );
        });
      }
      if (watchlistArr.length > 0) {
        // dispatch({
        //   type: "UPDATE_MSID",
        //   payload: {
        //     watchlist: watchlistArr,
        //   },
        // });
        window.watchListApiRes = watchlistArr;
        const watchListApiStatusForAll = new Event("watchListApiStatusForAll");
        document.dispatchEvent(watchListApiStatusForAll);
      }
    }
  };

  const addStockInWatchlistHandler = (action: any) => {
    // const companytType =
    //   companyData?.entityType === "company" && !companyData.subType
    //     ? "equity"
    //     : companyData.subType || "equity";
    //const { companyName, companyId, companyid } = companyData;

    const stockDetails = {
      companyName,
      companyType,
      companyId,
    };
    const type = 11;
    getMoreDetailsStockWatchList(action, stockDetails, type);
  };

  const getMoreDetailsStockWatchList = async (
    action: any,
    data: any,
    type: any,
  ) => {
    const API_URL = (APIS_CONFIG as any).GETCompanyShortData[window.APP_ENV];
    const ApiFullURL = `${API_URL}?companyid=${data.companyId}&companytype=${data.companyType}`;
    if (action == 1) {
      const apiRes = await fetch(ApiFullURL);
      const jsonRes = await apiRes.json();
      let ltp = "",
        exch: any = "";
      if (jsonRes.nse?.current) {
        ltp = jsonRes.nse.current;
        exch = 50;
      } else if (jsonRes.bse?.current) {
        ltp = jsonRes.bse.current;
        exch = 47;
      }
      data.ltp = ltp;
      data.exchange = exch;
    }
    saveStockInWatchListHandler(action, data, type);
  };

  const saveStockInWatchListHandler = async (
    action: any,
    data: any,
    type: any,
  ) => {
    const followData = {
      action,
      applicationname: 1,
      articletype: type || "11",
      position: 0,
      source: 0,
      stype: 2,
      ...(type == 22 || type == 23
        ? { msid: data.id }
        : {
            companytype: data.companyType,
            msid: data.companyId,
          }),
      ...(type == 11 &&
        action == 1 && {
          propertiesList: [
            { key: "companyName", value: data.companyName },
            { key: "priceOnDate", value: data.ltp },
            { key: "updatedPrice", value: data.ltp },
            { key: "exchange", value: data.exchange },
          ],
        }),
    };

    //console.log("data----", data, type);

    const addWathlistResAPI = await saveStockInWatchList(followData);
    if (addWathlistResAPI?.status === "success") {
      window.watchListApiRes =
        action == 1
          ? [
              ...window.watchListApiRes,
              {
                companyId: data?.companyId?.toString(),
                companyType: data?.companyType,
              },
            ]
          : window.watchListApiRes.filter(
              (item: any) =>
                item.companyId != data?.companyId?.toString() ||
                item.companyType != data?.companyType,
            );

      if (action == 1) {

        toast((t) => (
          <span className="errorToast">
            <span>
              <b>{data?.companyName}</b> added to Watchlist
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
              <i className="eticon_cross"></i>
            </button>
          </span>
        ));
      } else {

        toast((t) => (
          <span className="errorToast">
            <span>
              <b>{data?.companyName}</b> removed from Watchlist
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
              <i className="eticon_cross"></i>
            </button>
          </span>
        ));
      }

    } else if (addWathlistResAPI?.status === "failure") {
      toast((t) => (
        <span className="errorToast">
          <span>
            Oops! There is some error while updating watchlist. Please retry.
          </span>
          <button onClick={() => toast.dismiss(t.id)}>
            <i className="eticon_cross"></i>
          </button>
        </span>
      ));
    }

    setLoadingStatus(false);
    customeFun ? customeFun() : null;
  };

  const handleWatchListClick = () => {
    if (isLogin) {
      console.log("watchlist----------", window.watchListApiRes);
      const watchlistStatus =
        typeof companyId != "undefined" &&
        window.watchListApiRes.length > 0 &&
        window.watchListApiRes.length.some(
          (item: any) =>
            item.companyId === companyId?.toString() &&
            item.companyType === companyType,
        )
          ? 0
          : 1;
      setLoadingStatus(true);
      addStockInWatchlistHandler(watchlistStatus);
    } else {
      initSSOWidget();
    }
  };
  //console.log("companyId --- watchlist", companyId);
  const mergedStyle = { ...customStyle };

  const checkWatchListStatus = useCallback(() => {
      const apiRes = window.watchListApiRes || [];
      const checkWatchList =
      typeof companyId != "undefined" &&
      apiRes.length > 0 &&
      apiRes.some(
        (item: any) =>
          item?.companyId === companyId?.toString() &&
          item?.companyType === companyType,
      );

      if (checkWatchList) setIsWatchListAdded(true);
  }, [companyId, setIsWatchListAdded]);

  useEffect(() => {
      document.addEventListener("watchListApiStatusForAll", checkWatchListStatus);
      fetchWatchListStocks();

      return () => {
          document.removeEventListener("watchListApiStatusForAll", checkWatchListStatus);
      };
  }, [fetchWatchListStocks, checkWatchListStatus]);
    
  return (
    <>
      {ssoReady && companyId && (
        <span
          style={mergedStyle}
          onClick={handleWatchListClick}
          className={styles.watchlistPlusWrap}
          title={
            loadingStatus
              ? ""
              : isWatchListAdded
                ? "Added to watchlist"
                : "Add to watchlist"
          }
        >
          {loadingStatus ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : isWatchListAdded ? (
            <span className="tickIcon"></span>
          ) : (
            <span className="plusIcon"></span>
          )}
        </span>
      )}
    </>
  );
};

export default WatchlistAddition;
