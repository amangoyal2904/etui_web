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
import { usePathname, useSearchParams } from "next/navigation";
import { callJsOnRouteChange } from "utils/priority";
import TopNudge from "./TopNudge";
import BreakingNews from "./BreakingNews";
import { useStateContext } from "../store/StateContext";

const RotatingCube = dynamic(() => import("./RotatingCube"), {
  ssr: false
});

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
  
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime, isPink } = state.login;

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
      <TopNudge objVc={objVc} />
      <Headers />
      <main className={`pageHolder container`}>
        {!isPink && (
          <div className="topAdContainer">
            <DfpAds adInfo={{ key: "atf" }} objVc={objVc} />
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
        <Scripts objVc={objVc} isprimeuser={isPink} />
        {!isPink && <DfpAds adInfo={{ key: "btf728" }} objVc={objVc} />}
        <Footer dynamicFooterData={dynamicFooterData} page={page} />
        <RedeemVoucher />
      </main>

      {!isPink && <DfpAds adInfo={{ key: "skinning" }} objVc={objVc} />}
      {!isPink && <RotatingCube objVc={objVc} />}
    </>
  );
};

export default Layout;
