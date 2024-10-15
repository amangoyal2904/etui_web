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
  const { watchlist } = state.watchlistStatus;
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isWatchListAdded, setIsWatchListAdded] = useState(false);

  const fetchWatchListStocks = useCallback(async () => {
    try {
      if ((typeof window.watchListApiHitStatus === 'undefined' || window.watchListApiHitStatus === 'failed') && isLogin) {
        window.watchListApiHitStatus = 'hit';
        const data = await fetchAllWatchListData(2, 11);
        window.watchListApiHitStatus = 'success';
        const watchlistArr = (data?.resData || data || []).map((entry: any) => ({
          companyId: entry.prefDataVal,
          companyType: entry.companyType || entry.id,
        })).filter(Boolean);

        if (watchlistArr.length > 0) {
          dispatch({
            type: "UPDATE_MSID",
            payload: {
              watchlist: watchlistArr,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching watchlist stocks:", error);
      window.watchListApiHitStatus = 'failed';
      // toast((t) => (
      //   <span className="errorToast">
      //     <span>
      //       Oops! There is some error. Please retry.
      //     </span>
      //     <button onClick={() => toast.dismiss(t.id)}>
      //       <span>&#10005;</span>
      //     </button>
      //   </span>
      // ));
    }
  }, []);

  const addStockInWatchlistHandler = useCallback((action: any) => {
    const stockDetails = { companyName, companyType, companyId };
    const type = 11;
    getMoreDetailsStockWatchList(action, stockDetails, type);
  }, [companyName, companyId, companyType]);

  const getMoreDetailsStockWatchList = useCallback(async (action: any, data: any, type: any) => {
    try {
      const API_URL = (APIS_CONFIG as any).GETCompanyShortData[window.APP_ENV];
      const ApiFullURL = `${API_URL}?companyid=${data.companyId}&companytype=${data.companyType}`;
      if (action === 1) {
        const apiRes = await fetch(ApiFullURL);
        const jsonRes = await apiRes.json();
        data.ltp = jsonRes.nse?.current || jsonRes.bse?.current || "";
        data.exchange = jsonRes.nse ? 50 : jsonRes.bse ? 47 : "";
      }
      saveStockInWatchListHandler(action, data, type);
    } catch (error) {
      console.error("Error fetching stock details:", error);
    }
  }, []);

  const saveStockInWatchListHandler = useCallback(async (action: any, data: any, type: any) => {
    try {
      const followData = {
        action,
        applicationname: 1,
        articletype: type || "11",
        position: 0,
        source: 0,
        stype: 2,
        ...(type === 22 || type === 23
          ? { msid: data.id }
          : {
              companytype: data.companyType,
              msid: data.companyId,
            }),
        ...(type === 11 && action === 1 && {
          propertiesList: [
            { key: "companyName", value: data.companyName },
            { key: "priceOnDate", value: data.ltp },
            { key: "updatedPrice", value: data.ltp },
            { key: "exchange", value: data.exchange },
          ],
        }),
      };

      const addWatchlistResAPI = await saveStockInWatchList(followData);
      if (addWatchlistResAPI?.status === "success") {
        const newWatchList =
          action == 1
            ? [
                ...watchlist,
                {
                  companyId: data?.companyId?.toString(),
                  companyType: data?.companyType,
                },
              ]
            : watchlist.filter(
                (item: any) =>
                  item.companyId != data?.companyId?.toString() ||
                  item.companyType != data?.companyType,
              );

        toast((t) => (
          <span className="errorToast">
            <span>
              <b>{data?.companyName}</b> {action === 1 ? "added to" : "removed from"} Watchlist
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
              <span>&#10005;</span>
            </button>
          </span>
        ));
        dispatch({
          type: "UPDATE_MSID",
          payload: {
            watchlist: newWatchList,
          },
        });
      } else {
        throw new Error("Failed to update watchlist");
      }
    } catch (error) {
      console.error("Error saving stock in watchlist:", error);
      toast((t) => (
        <span className="errorToast">
          <span>
            Oops! There is some error while updating watchlist. Please retry.
          </span>
          <button onClick={() => toast.dismiss(t.id)}>
            <span>&#10005;</span>
          </button>
        </span>
      ));
    } finally {
      setLoadingStatus(false);
      if (customeFun) customeFun();
    }
  }, [customeFun]);

  const handleWatchListClick = useCallback(() => {
    if (isLogin) {
      const watchlistStatus =
        typeof companyId != "undefined" &&
        !!watchlist &&
        watchlist.some(
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
  }, [addStockInWatchlistHandler, companyId, companyType, isLogin]);

  

  useEffect(() => {
    fetchWatchListStocks();
  }, [isLogin]);

  const watchlistCheck =
  typeof companyId != "undefined" &&
  !!watchlist &&
  watchlist.some(
    (item: any) =>
      item?.companyId === companyId?.toString() &&
      item?.companyType === companyType,
  );

  return (
    <>
      {ssoReady && companyId && (
        <span
          style={customStyle}
          onClick={handleWatchListClick}
          className={styles.watchlistPlusWrap}
          title={
            loadingStatus
              ? ""
              : watchlistCheck
              ? "Added to watchlist"
              : "Add to watchlist"
          }
        >
          {loadingStatus ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : watchlistCheck ? (
            <span className={styles.tickIcon}></span>
          ) : (
            <span className={styles.plusIcon}></span>
          )}
        </span>
      )}
    </>
  );
};

export default WatchlistAddition;