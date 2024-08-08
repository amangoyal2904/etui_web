"use client";

import React, { FC, ReactElement, useEffect } from "react";
import dynamic from "next/dynamic";
import Headers from "./Head";
import HeaderMain from "./HeaderMain";
import Scripts from "./Scripts";
import Footer from "./Footer";
import BreadCrumb from "components/BreadCrumb";
import RedeemVoucher from "./RedeemVoucher";
import DfpAds from "./Ad/DfpAds";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { callJsOnRouteChange } from "utils/priority";
import TopNudge from "./TopNudge";
import BreakingNews from "./BreakingNews";

const RotatingCube = dynamic(() => import("./RotatingCube"), {
  ssr: false
});
import { AnyListenerPredicate } from '@reduxjs/toolkit';

interface Props {
  page?: string;
  dynamicFooterData?: any;
  menuData?: any;
  objVc?: any;
  isprimeuser?: any;
  data: any;
  children?: ReactElement;
  pageSeo: any;
}

interface ChildProps {
  objVc: any;
  isprimeuser: any;
  data: any;
}

const Layout:FC<Props> = ({ page, dynamicFooterData, menuData, objVc, data, isprimeuser, children, pageSeo }) => { 
  
  if (!data?.seo?.subsecnames || !data?.seo?.sectionDetail) {
    data.seo = {};
    data.seo.subsecnames = {};
    //throw new Error('Invalid data passed to Layout component');
  }

  if (typeof window !== "undefined") {
    window.objVc = objVc;
    window.pageSeo = pageSeo; 
    window.tpName = page;
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    callJsOnRouteChange();
  }, [pathname, searchParams]);

  return (
    <>
      {!isprimeuser && (
        <div className="topAdContainer">
          <DfpAds adInfo={{ key: "topad" }} objVc={objVc} />
        </div>
      )}
      <TopNudge objVc={objVc} />
      <Headers />
      <main className={`pageHolder container`}>
        {!isprimeuser && (
          <div className="topAdContainer">
            <DfpAds adInfo={{ key: "topad" }} objVc={objVc} />
          </div>
        )}
        <HeaderMain
          page={page}
          menuData={menuData}
          subsecnames={data?.seo?.subsecnames}
          sectiondetail={data?.seo?.sectionDetail}
          commonMeta={data?.commonMeta || {}}
        />
        <BreadCrumb data={data?.seo?.breadcrumb} />
        <BreakingNews />
        <div className="layout">{children}</div>
        <Scripts objVc={objVc} isprimeuser={isprimeuser} />
        {!isprimeuser && <DfpAds adInfo={{ key: "btf728" }} objVc={objVc} />}
        <Footer dynamicFooterData={dynamicFooterData} page={page} />
        <RedeemVoucher />
      </main>

      {!isprimeuser && <DfpAds adInfo={{ key: "skinleft" }} objVc={objVc} />}
      {!isprimeuser && <RotatingCube objVc={objVc} />}
    </>
  );
};

export default Layout;
