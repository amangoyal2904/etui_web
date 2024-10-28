"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./DashboardWidget.module.scss";
import StockFilterNifty from "../../../components/StockFilterNifty";
import refeshConfig from "../../../utils/refreshConfig.json";
import { fetchSelectedFilter } from "../../../utils";
import { getCustomViewTable } from "./DashboadFetch";
import { useStateContext } from "../../../store/StateContext";
import VerticalTabs from "../../../components/VerticalTabs";
import DashboardStockData from "./DashboardStockData";
import Loading from "../../../components/Loading";
import Blocker from "../../../components/Blocker";
import ViewAllLink from "../../../components/ViewAllLink";
import useIntervalApiCall from "../../../utils/useIntervalApiCall";
import HeadingWithRightArrow from "../HeadingWithRightArrow";
import DayFilter from "./DayFilter";
import { ET_WEB_URL } from "../../../utils/common";

const DashBoardTable = ({
  selectedFilter = {},
  allFilters = {},
  bodyParams = {},
  defaultTab = {},
  tabs = [],
  data = [],
  shortUrlMapping = [],
  focusArea,
  ssoid = "",
  APP_ENV = "",
  wdName = "",
  wdHref = ""
}: any) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const { isPrime, isLogin } = state.login;
  const [showFilter, setShowFilter] = useState(false);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [payload, setPayload] = useState(bodyParams);
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [activeTab, setActiveTab] = useState(defaultTab?.key);
  const [tableData, setTableData] = useState(data?.tableData);
  const [processingLoader, setProcessingLoader] = useState(false);
  const filterMenuData = useMemo(() => allFilters, [allFilters]);
  const [dayFilterShow, setDayFilterShow] = useState(false);
  const [dayFilterData, setDayFilterData] = useState({
    value: "1D",
    label: "1 Day",
  });

  const dayList = [
    { value: "1D", label: "1 Day" },
    { value: "1W", label: "1 Week" },
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "3Y", label: "3 Years" },
    { value: "5Y", label: "5 Years" }
  ];

  const filterDataChangeHandler = async (id: any) => {
    setProcessingLoader(true);
    const filter = id !== undefined && !isNaN(Number(id)) ? parseInt(id) : id || 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    setPayload({
      ...payload,
      filterValue: !!filter ? [filter] : [],
      filterType: filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
    });
  };

  const handleChangeData = (id: any) => {
    setShowFilter(false);
    filterDataChangeHandler(id);
    document.body.style.overflow = "";
  };

  const onTabClick = (item: any) => {
    setProcessingLoader(true);
    setActiveTab(item?.key);
    setSelectedTab(item);
  };

  const updateTableData = async () => {
    const filter = !!niftyFilterData.indexId ? [niftyFilterData.indexId] : [];
    const bodyParams = {
      viewId: selectedTab.viewId,
      apiType: activeTab,
      ...( dayFilterData.value ? { duration: dayFilterData.value } : {}),
      filterValue: wdName == "My Watchlist" ? [] : filter,
      filterType: wdName == "My Watchlist" ? "watchlist" : filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
      sort: [],
      pagesize: 6,
      pageno: 1,
    };
    const { tableData } = await getCustomViewTable(bodyParams, true, ssoid, "MARKETSTATS_INTRADAY", APP_ENV);
    if (Array.isArray(tableData)) {
      setTableData(tableData);
    }
    setProcessingLoader(false);
  };

  useIntervalApiCall(
    () => {
      if (currentMarketStatus === "LIVE") updateTableData();
    },
    refeshConfig.marketstats,
    [payload, selectedTab, currentMarketStatus],
    dashboardRef,
  );

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [payload, selectedTab, dayFilterData]);

  useEffect(() => {
    setNiftyFilterData(selectedFilter);
  }, [selectedFilter]);

  const viewAll = `/stocks/marketstats?type=${selectedTab.key}${selectedTab.key == "gainers" || selectedTab.key == "losers" ? "&duration=1D" : ""}&filter=${niftyFilterData.indexId}`;
  const isExist = shortUrlMapping?.find((item: any) => item.longURL == viewAll);
  const linkHref = isExist ? isExist.shortUrl : viewAll;

  const showFilterMenu = useCallback((value: boolean) => {
    setShowFilter(value);
  }, []);

  return (
    <>      
      <div className={`wrapper ${styles.wrapper} ${focusArea} ${styles[focusArea]}`} ref={dashboardRef} data-ga-impression={`Subscriber Homepage#Market Dashboard widget impression#`}>
        <div className="dflex space-between head_dashboard">
          <div>
            <HeadingWithRightArrow title={wdName} href={wdHref} data-ga-onclick={`Subscriber Homepage#$Market Dashboard Title click #href`}/>
          </div>
          {wdName != "My Watchlist" && <div className="filterBtnWrp">
            <span className={styles.filterNseBse} onClick={() => showFilterMenu(true)} data-ga-onclick={`Subscriber Homepage#Market Dashboard click#Filter`}>
              <img src="https://img.etimg.com/photo/114042416.cms" width={20} height={20} alt="Stock Filter" />
              <span>{niftyFilterData?.name}</span>
            </span>
            {(selectedTab.viewId == 6925 || selectedTab.viewId == 6926) && focusArea == "market" && (
              <div className={`prel dayflWrp`}>
                <span className="roundBtn" onClick={() => setDayFilterShow(!dayFilterShow)}>
                  {dayFilterData.label}
                  <img src="https://img.etimg.com/photo/114042583.cms" width={20} height={20} alt="Stock Filter" />
                </span>
                {dayFilterShow && <DayFilter setDayFilterShow={setDayFilterShow} dayList={dayList} dayFilterData={dayFilterData} setDayFilterData={setDayFilterData} />}
              </div>
            )}
          </div>}
        </div>
        <div className={`dflex ${styles.fullWidth}`}>
          {!!processingLoader && <Loading />}
          <VerticalTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={onTabClick}
            idProp="key"
            valueProp="label"
            isCenter="true"
          />
          <div className={styles.stockData}>
            {isLogin != null && !isLogin && wdName == "My Watchlist" ? <Blocker type={"loginBlocker"} /> : (tableData?.length ? (
              tableData.map((item: any, index: any) => (
                <DashboardStockData
                  key={index}
                  item={item}
                  highlightLtp={!!currentMarketStatus && currentMarketStatus != "CLOSED"}
                  focusArea={focusArea}
                  wdName={wdName}
                />
              ))
            ) : (
              <Blocker type={wdName == "My Watchlist" ? "noStocks" : "noDataFound"} />
            ))}
            <ViewAllLink text={selectedTab.cta} link={`${ET_WEB_URL}${linkHref}`} />
          </div>
        </div>
      </div>
      {wdName != "My Watchlist" && showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChangeData}
          selectTab={niftyFilterData.exchange}
          childMenuTabActive={niftyFilterData.indexId}
          widget="Market Dashboard"
        />
      )}
      <style jsx>{`
        .dflex {
          display: flex;
        }
        .news{
          .head_dashboard{
            h2{
              font-size: 15px;
            }
          }  
        }
        .head_dashboard {
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .filterBtnWrp {
          display: flex;
          justify-content: flex-end;
          min-width: 180px;
        }
        .dayflWrp {
          margin-left: 10px;
        }
        .wrapper.news .dayflWrp {
          display: none;
        }
        .wrapper.news .filterBtnWrp {
          min-width: 140px;
        }
        .roundBtn {
          display: flex;
          cursor: pointer;
          border-radius: 100px;
          border: 1px solid #000;
          font-size: 12px;
          line-height: 18px;
          font-weight: 600;
          padding: 3px 10px;
          white-space: nowrap;
          align-items: center;
          background-color: #fff;
        }
      `}</style>
    </>
  );
};

export default DashBoardTable;