import { useEffect, useState } from 'react';
import { getCustomViewTable } from "../DashboardTable/DashboadFetch";
import {
  fetchFilters,
  fetchSelectedFilter,
  getAllShortUrls
} from "../../../utils";

import DashBoardTable from "../DashboardTable/DashboardTable";
import { useStateContext } from 'store/StateContext';


const MyWatchListDashboard = (props) => {
    const {isDev, focusArea} = props;
    const [data, setData] = useState<any>(null);
    const intFilter = 2371;
    const filter = !!intFilter ? [intFilter] : [];
    const pagesize = 6;
    const pageno = 1;
    const sort: any = [];
    const duration = "1D";
    const APP_ENV = isDev ? "development" : "production";
    const { state } = useStateContext();
    const { isPrime, ssoid, isLogin } = state.login;
    const { watchlist } = state.watchlistStatus;

    const tabsData = [
        {
          label: "Top<br />Gainers",
          key: "gainers",
          api: "https://etmarketsapis.indiatimes.com/ET_Stats/gainers",
          cta: "View All Top Gainers",
          viewId: isDev ? 239 : 6925
        },
        {
          label: "Top<br />Losers",
          key: "losers",
          api: "https://etmarketsapis.indiatimes.com/ET_Stats/losers",
          cta: "View All Top Losers",
          viewId: isDev ? 239 : 6925,
        },
        {
          label: "Active by<br />Volume",
          key: "most-active-volume",
          api: "https://etmarketsapis.indiatimes.com/ET_Stats/moversvolume",
          cta: "View All Active by Volume",
          viewId: isDev ? 239 : 6925,
        },
        {
          label: "Active by<br />Value",
          key: "most-active-value",
          api: "https://etmarketsapis.indiatimes.com/ET_Stats/moversvalue",
          cta: "View All Active by Value",
          viewId: isDev ? 239 : 6925,
        },
        {
          label: "52 Week<br />High",
          key: "new-52-week-high",
          api: "https://etmarketsapis.indiatimes.com/ET_Stats/new52weekshigh",
          cta: "View All 52 Week High",
          viewId: isDev ? 239 : 6925,
        },
        {
          label: "52 Week<br />Low",
          key: "new-52-week-low",
          api: "https://etmarketsapis.indiatimes.com/ET_Stats/new52weekslow",
          cta: "View All 52 Week Low",
          viewId: isDev ? 239 : 6925,
          
        },
      ];

    const bodyParams = {
        viewId: tabsData[0].viewId,
        apiType: "gainers",
        ...(duration ? { duration } : {}),
        filterValue: [],
        filterType: 'watchlist',
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
    
        if(isLogin) fetchData();
    }, [isLogin]);
    
    if (!data) {
        return <div>Loading...</div>; // Or any loading component
    }  

    return (
        <>
          <DashBoardTable
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
            wdName={"My Watchlist"}
            wdHref="/watchlist"
          />
        </>
    )
}

export default MyWatchListDashboard;