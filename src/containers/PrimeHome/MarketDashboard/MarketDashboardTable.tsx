"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./DashboardWidget.module.scss";
import StockFilterNifty from "../../../components/StockFilterNifty";
import refeshConfig from "../../../utils/refreshConfig.json";
import { fetchSelectedFilter } from "../../../utils";
import { getCustomViewTable } from "./MarketDashboadFetch";
import { useStateContext } from "../../../store/StateContext";
import VerticalTabs from "../../../components/VerticalTabs";
import DashboardStockData from "./DashboardStockData";
import Loading from "../../../components/Loading";
import Blocker from "../../../components/Blocker";
import ViewAllLink from "../../../components/ViewAllLink";
import Separator from "../../../components/Separator";
import useIntervalApiCall from "../../../utils/useIntervalApiCall";
import HeadingWithRightArrow from "../HeadingWithRightArrow";
const MarketDashBoardTable = ({
  selectedFilter = {},
  allFilters = {},
  bodyParams = {},
  defaultTab = {},
  tabs = [],
  data = [],
  shortUrlMapping = [],
  focusArea,
  ssoid = "",
  APP_ENV = ""
}: any) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const { isPrime } = state.login;
  const { pagesummary, searchresult } = data;
  const [showFilter, setShowFilter] = useState(false);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [payload, setPayload] = useState(bodyParams);
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [activeTab, setActiveTab] = useState(defaultTab?.key);
  const [tableData, setTableData] = useState(searchresult);
  const [formedOnDate, setFormedOnDate] = useState(pagesummary?.lasttradeddate);
  const [processingLoader, setProcessingLoader] = useState(false);
  const filterMenuData = useMemo(() => allFilters, [allFilters]);
  const [dayFilterShow, setDayFilterShow] = useState(false);
  const [dayFilterData, setDayFilterData] = useState({
    value: "1D",
    label: "1 Day",
  });

  const filterDataChangeHander = async (id: any) => {
    setProcessingLoader(true);
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    setPayload({
      ...payload,
      filterValue: !!filter ? [filter] : [],
      filterType:
        filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
    });
  };
  
  const handleChangeData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    filterDataChangeHander(id);
    document.body.style.overflow = "";
  };
  const onTabClick = (item: any) => {
    setProcessingLoader(true);
    setActiveTab(item?.key);
    setSelectedTab(item);
  };
  const updateTableData = async () => {
    // const { pagesummary, searchresult } = await getMarketDashboard(
    //   selectedTab?.api,
    //   payload,
    // );
    const duration = "1D";
    const filter = !!niftyFilterData.indexId ? [niftyFilterData.indexId] : [];
    const pagesize = 10;
    const pageno = 1;
    const sort: any = [];
    const bodyParams = {
        viewId: selectedTab.viewId,
        apiType: "gainers",
        ...(duration ? { duration } : {}), // Conditional inclusion of duration
        filterValue: !!niftyFilterData.indexId ? [niftyFilterData.indexId] : [],
        filterType:
          filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
        sort,
        pagesize,
        pageno,
      };
    const { tableHeaderData, tableData, payload } = await getCustomViewTable(
        bodyParams,
        true,
        ssoid,
        "MARKETSTATS_INTRADAY",
        APP_ENV
      );
    if (!!searchresult && Array.isArray(searchresult)) {
      setTableData(searchresult);
      setFormedOnDate(pagesummary?.lasttradeddate);
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
  }, [payload, selectedTab]);
  const viewAll = `/stocks/marketstats?type=${selectedTab.key}${selectedTab.key == "gainers" || selectedTab.key == "losers" ? "&duration=1D" : ""}&filter=${niftyFilterData.indexId}`;
  const isExist: any = shortUrlMapping?.find(
    (item: any) => item.longURL == viewAll,
  );
  const linkHref = isExist ? isExist.shortUrl : viewAll;
  const showFilterMenu = useCallback((value: boolean) => {
    setShowFilter(value);
  }, []);

  useEffect(() => {
    setNiftyFilterData(selectedFilter)
  }, [])
  console.log(JSON.stringify(niftyFilterData), selectedFilter,"niftyFilterData")
  return (
    <>
      <div className={`${styles.wrapper} ${styles[focusArea]}`} ref={dashboardRef}>
        <div className="dflex space-between head_dashboard">
          <div>
            <HeadingWithRightArrow title={`Stocks Dashboard`} />
          </div>
          <span
            className={styles.filterNseBse}
            onClick={() => showFilterMenu(true)}
          >
            <i className="eticon_filter"></i>
            <span>{niftyFilterData?.name}</span>
          </span>
        </div>
        <div className={`dflex ${styles.fullWidth}`}>
          {!!processingLoader && <Loading  />}
          <VerticalTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={onTabClick}
            idProp="key"
            valueProp="label"
            isCenter="true"
          />
          <div className={styles.stockData}>
            {tableData?.length ? (
              tableData?.map((item: any, index: any) => (
                <DashboardStockData
                  key={index}
                  item={item}
                  highlightLtp={
                    !!currentMarketStatus && currentMarketStatus != "CLOSED"
                  }
                  focusArea={focusArea}
                />
              ))
            ) : (
              <Blocker type={"noDataMinimal"} />
            )}
            <ViewAllLink text={selectedTab.cta} link={linkHref} />
          </div>
        </div>
        
      </div>
      {showFilter && (
        <StockFilterNifty
            data={filterMenuData}
            onclick={showFilterMenu}
            showFilter={showFilter}
            valuechange={handleChangeData}
            selectTab={niftyFilterData.exchange}
            childMenuTabActive={niftyFilterData.indexId}
        />
      )}
      {!isPrime && <Separator />}
      <style jsx>{`
        .dflex{
          display: flex;
        }
        .head_dashboard{
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
      `}</style>
    </>
  );
};
export default MarketDashBoardTable;