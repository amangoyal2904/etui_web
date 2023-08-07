'use client';

import React, {FC, ReactElement, useEffect } from 'react';
import Headers from './Head';
import HeaderMain from './HeaderMain';
import Scripts from './Scripts';
import Footer from './Footer';
import BreadCrumb from "components/BreadCrumb";
import DfpAds from './Ad/DfpAds';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { callJsOnRouteChange } from 'utils/priority';

interface Props {
  page?: string;
  dynamicFooterData?: any;
  menuData?: any;
  objVc?: any;
  isprimeuser?: boolean | number;
  data: any;
  children?: ReactElement;
}

interface ChildProps {
  objVc: any;
  isprimeuser: any;
  data: any;
}

const Layout:FC<Props> = ({ page, dynamicFooterData, menuData, objVc, data, isprimeuser, children }) => { 
  
  if (!data?.seo?.subsecnames || !data?.seo?.sectionDetail) {
    data.seo = {};
    data.seo.subsecnames = {};
    //throw new Error('Invalid data passed to Layout component');
  }

  if(typeof window !== 'undefined') {
    window.objVc = objVc;
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('rrrr');
    
    callJsOnRouteChange();
  }, [pathname, searchParams]);

  return (
      <>
        <div className="topAdContainer">
          <DfpAds adInfo={{key: "topad"}} objVc={objVc}/>
        </div>
        <Headers />
        <main className={`pageHolder container`}>
          <HeaderMain
            page={page}
            menuData={menuData}
            subsecnames={data?.seo?.subsecnames}
            sectiondetail={data?.seo?.sectionDetail}
          />
          <BreadCrumb data={data?.seo?.breadcrumb} />
          <div className="layout">{children}</div>
          <Scripts objVc={objVc} isprimeuser={isprimeuser} />
          <DfpAds adInfo={{key: "btf728"}} objVc={objVc}/>
          <Footer dynamicFooterData={dynamicFooterData} />
        </main>        
        
        <DfpAds adInfo={{key: "skinleft"}} objVc={objVc}/>
      </>
    );
}

export default Layout;