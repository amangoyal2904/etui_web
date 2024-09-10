"use client";

import Explainers from "./Explainers";
import MoreFromEconomicTimes from "./MoreFromEconomicTimes";

function PrimeHome({ searchResult }) {
  const explainers = searchResult?.find(item => item?.name === "explainers") || {};
  const moreFromeEconomicTimes = searchResult?.find(item => item?.name === "more_from_economictimes")?.data || [];

  console.log("explainers", explainers);

  return (
    <>
      <Explainers data={explainers?.data || []} title={explainers?.title || ""} />
      <MoreFromEconomicTimes data={moreFromeEconomicTimes} />
      <style jsx global>{`
        body {
          background: #ffe9e2;
        }
        .secBox {
          padding-top: 1px;
          position: relative;
          border-top: 1px solid #9b8680;
          box-sizing: border-box;
          padding-bottom: 50px;
        }
      `}</style>
    </>
  )
}

export default PrimeHome;