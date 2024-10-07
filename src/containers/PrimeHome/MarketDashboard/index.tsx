import { useEffect, useState } from 'react';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import { getCustomViewTable } from "./MarketDashboadFetch";
import styles from './styles.module.scss';
import {
  fetchFilters,
  fetchSelectedFilter,
  getAllShortUrls
} from "../../../utils";

import MarketDashBoardTable from "./MarketDashboardTable";



export default function MarketDashboard({isDev, ssoid, focusArea}) {
  const [data, setData] = useState<any>(null);
  const intFilter = 2371;
  const filter = !!intFilter ? [intFilter] : [];
  const pagesize = 6;
  const pageno = 1;
  const sort: any = [];
  const duration = "1D";
  const APP_ENV = isDev ? "development" : "production";

  const tabsData = [
    {
      label: "Top<br />Gainers",
      key: "gainers",
      api: "https://etmarketsapis.indiatimes.com/ET_Stats/gainers",
      cta: "View All Top Gainers",
      viewId: 6925
    },
    {
      label: "Top<br />Losers",
      key: "losers",
      api: "https://etmarketsapis.indiatimes.com/ET_Stats/losers",
      cta: "View All Top Losers",
      viewId: 6926,
    },
    {
      label: "Active by<br />Volume",
      key: "most-active-volume",
      api: "https://etmarketsapis.indiatimes.com/ET_Stats/moversvolume",
      cta: "View All Active by Volume",
      viewId: 6927,
    },
    {
      label: "Active by<br />Value",
      key: "most-active-value",
      api: "https://etmarketsapis.indiatimes.com/ET_Stats/moversvalue",
      cta: "View All Active by Value",
      viewId: 6928,
    },
    {
      label: "52 Week<br />High",
      key: "new-52-week-high",
      api: "https://etmarketsapis.indiatimes.com/ET_Stats/new52weekshigh",
      cta: "View All 52 Week High",
      viewId: 6931,
    },
    {
      label: "52 Week<br />Low",
      key: "new-52-week-low",
      api: "https://etmarketsapis.indiatimes.com/ET_Stats/new52weekslow",
      cta: "View All 52 Week Low",
      viewId: 6932,
      
    },
  ];

  const bodyParams = {
    viewId: tabsData[0].viewId,
    apiType: "gainers",
    ...(duration ? { duration } : {}),
    filterValue: filter,
    filterType:
      filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
    sort,
    pagesize,
    pageno,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [selectedFilter, allFilters, tableData, shortUrlMapping] =
          await Promise.all([
            fetchSelectedFilter(intFilter),
            fetchFilters({ all: true, marketcap: false }),
            getCustomViewTable(
              bodyParams,
              true,
              ssoid,
              "MARKETSTATS_INTRADAY",
              APP_ENV
            ),
            getAllShortUrls(),
          ]);

        setData({
          selectedFilter,
          allFilters,
          tableData,
          shortUrlMapping
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data?.tableData
      , "niftyFilterData");
  }, [data]);

  if (!data) {
    return <div>Loading...</div>; // Or any loading component
  }

  return (
    <>
      <MarketDashBoardTable
        selectedFilter={data.selectedFilter}
        allFilters={data.allFilters}
        bodyParams={bodyParams}
        defaultTab={tabsData[0]}
        tabs={tabsData}
        data={data.tableData}
        shortUrlMapping={data.shortUrlMapping}
        focusArea={focusArea}
        ssoid={ssoid}
        APP_ENV={APP_ENV}
      />
    </>
  )
}