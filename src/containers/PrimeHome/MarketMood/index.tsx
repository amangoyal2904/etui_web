import { useCallback, useEffect, useState } from 'react';
import HeadingWithRightArrow from '../HeadingWithRightArrow';
import ViewAllCta from '../ViewAllCta';
import styles from './styles.module.scss';
import StockFilterNifty from 'components/StockFilterNifty';
import { fetchFilters, fetchSelectedFilter, getOverviewData } from 'utils';

export default function MarketMood({ focusArea }) {
  const intFilter = 2371;
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState<any>({ selectedFilter: null, allFilters: [] });
  const [niftyFilterData, setNiftyFilterData] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const [selectedFilter, allFilters] = await Promise.all([
        fetchSelectedFilter(intFilter),
        fetchFilters({ all: true, marketcap: false }),
      ]);

      setData({ selectedFilter, allFilters });
      setNiftyFilterData(selectedFilter);

      const OverviewRes = await getOverviewData(selectedFilter.indexId, 1);
      setOverviewData(OverviewRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [intFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showFilterMenu = useCallback((value: boolean) => {
    setShowFilter(value);
  }, []);

  const filterDataChangeHandler = useCallback(async (id: any) => {
    const filter = id !== undefined && !isNaN(Number(id)) ? parseInt(id) : id || 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);

    const OverviewRes = await getOverviewData(selectedFilter.indexId, 1);
    setOverviewData(OverviewRes);
  }, []);

  const handleChangeData = useCallback((id: any) => {
    setShowFilter(false);
    filterDataChangeHandler(id);
    document.body.style.overflow = "";
  }, [filterDataChangeHandler]);

  return (
    <>
      <div className={`${styles.marketMoodContainer} ${styles[focusArea]}`}>
        <div className={styles.mmHeadWrap}>
          <div className={styles.dflex}>
            <img src="https://img.etimg.com/photo/114042208.cms" alt='Market Mood' className={styles.logo_mm} />
            <HeadingWithRightArrow title="Market Mood" />
          </div>
          <div>
            <span className={styles.filterNseBse} onClick={() => showFilterMenu(true)}>
              <img src="https://img.etimg.com/photo/114042416.cms" width={20} height={20} alt="Stock Filter" />
              <span>{niftyFilterData?.name || 'Select Filter'}</span>
            </span>
          </div>
        </div>
        <table className={styles.marketMoodTable}>
          <thead>
            <tr>
              <th></th>
              <th colSpan={5} className={styles.info}>No. of Stocks Trading Above</th>            
            </tr>
            <tr>
              <th>Date</th>
              <th>SMA <br/> 20</th>
              <th>SMA <br/> 50</th>
              <th>SMA <br/> 100</th>
              <th>SMA <br/> 200</th>
              <th>EMA <br/> 50</th>
            </tr>
          </thead>
          <tbody>
            {overviewData?.dataList?.slice(0, 5).map((value, index) => (
              <tr key={index}>
                <td className={styles.firstTd}>{value.date}</td>
                {value.others.map((item: any, itemIndex: number) => (
                  <td key={itemIndex} className={styles.withTiles}>
                    <span className={`${styles[item.color]} ${styles.tiles}`}>
                      {`${item.percent}%`}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ViewAllCta title="View All Stocks" url="/market-mood" isNoBorderRightArrow={focusArea === "market"} />
        {showFilter && (
          <StockFilterNifty
            data={data.allFilters}
            onclick={showFilterMenu}
            showFilter={showFilter}
            valuechange={handleChangeData}
            selectTab={niftyFilterData?.exchange}
            childMenuTabActive={niftyFilterData?.indexId}
          />
        )}
      </div>
    </>
  );
}