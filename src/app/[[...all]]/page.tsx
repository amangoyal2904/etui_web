import { headers, cookies } from 'next/headers';
import { pageType, getMSID, prepareMoreParams } from "../../utils";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import { VideoShow } from '../../containers/';
import Layout from '../../components/Layout';
import React, { Suspense } from 'react';

export default async function Page({ params, searchParams }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = headers()
  console.log({ headersList });
  
  const isprimeuser = cookies().get('isprimeuser') || false,
  { all = [] } = params,
  lastUrlPart: string = all?.slice(-1).toString(),
  api = APIS_CONFIG.FEED,
  REQUEST = APIS_CONFIG.REQUEST;

  console.log({isprimeuser});
  

  let page = pageType(all.join('/')),
  extraParams: any = {},
  response: any = {},
  menuData: any = {},
  dynamicFooterData: any = {};

  try {
    if (page !== "notfound") {
      const msid = getMSID(lastUrlPart);
      const moreParams = prepareMoreParams({ all, page, msid });

      //==== gets page data =====
      const apiType = page === "videoshownew" ? "videoshow" : page;
      const result = await Service.get({
        api,
        params: { type: apiType, platform: "web", feedtype: "etjson", ...moreParams },
      });
      response = result?.data || {}; 
      const { subsecnames = {} } = response.seo;
      extraParams = subsecnames
        ? {
            subsec1: subsecnames.subsec1,
            subsec2: subsecnames.subsec2,
          }
        : {};

      if (response && response.error) page = "notfound";
    }

    //==== gets dyanmic footer data =====
    const footerMenuPromise = Service.get({
      api,
      params: { type: "footermenu", feedtype: "etjson", ...extraParams, template_name: page , platform:'web'},
    });
    //==== gets menu data =====
    const navBarPromise = Service.get({
      api,
      params: { type: "menu", feedtype: "etjson", msid: extraParams?.subsec1 },
    });

    const [footerMenuResult, navBarResult] = await Promise.all([footerMenuPromise, navBarPromise]);

    dynamicFooterData = footerMenuResult?.data || {};
    menuData = navBarResult?.data;

    //==== sets response headers =====
    //res.setHeader("Cache-Control", `public, s-maxage=${expiryTime}, stale-while-revalidate=${expiryTime * 2}`);
    //res.setHeader("Expires", new Date(new Date().getTime() + expiryTime * 1000).toUTCString());
  }catch(error){
    console.log("Error: ", error)
  }
  
  const versionControl = response?.version_control || {};
  return <Layout page={page} dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser}>      
    <Suspense fallback={<p>Loading...</p>}>
      <VideoShow {...response} objVc={versionControl} isprimeuser={isprimeuser}/>
    </Suspense>
  </Layout>
  ;
}