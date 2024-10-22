import NriPagenav from "components/NriPagenav";
import NriUnivRanking from "components/NriUnivRanking";
import React from "react";

const NriList = () => {
  return (
    <>
      <div className="banner">
        <img width="994" height="107" alt="top banner" src="https://img.etimg.com/photo/114221839.cms" />
      </div>
      <NriPagenav />
      <div>NriList</div>
      <NriUnivRanking />
    </>
  );
};

export default NriList;
