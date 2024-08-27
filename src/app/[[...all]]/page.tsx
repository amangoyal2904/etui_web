import { headers, cookies } from 'next/headers';
import Service from "../../network/service";
import APIS_CONFIG from "../../network/config.json";
import { VideoShow } from '../../containers/';
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';

export default async function Page({ params, searchParams }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);
  
  const slugArr = params?.all || [];

  const isprimeuser = cookies().get('isprimeuser') || false,
  { all = [] } = params,
  lastUrlPart: string = all?.slice(-1).toString(),
  api = APIS_CONFIG.FEED,
  REQUEST = APIS_CONFIG.REQUEST;

  let page = getPageName(slugArr),
  extraParams: any = {},
  response: any = {},
  menuData: any = {},
  dynamicFooterData: any = {};

  try {
   
    if (page !== "notfound") {
      const msid = getMSID(slugArr);      

      //==== gets page data =====            
      response = await getData(isDev, page, msid);

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
  }catch(error){
    console.log("Error: ", error)
  }
  const pageSeo = response?.seo || {};
  const versionControl = response?.version_control || {};
  return  <Layout page={page} dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo}>          
      <VideoShow {...response} objVc={versionControl} isprimeuser={isprimeuser}/>
  </Layout>

  ;
}

export async function generateMetadata({ params }) {
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);

  const slugArr = params?.all || [];
  const msid = getMSID(slugArr);
  const page = getPageName(slugArr);

  if (page == "notfound") {
    return {
      title: "Not Found",
      description: "Could not find requested resource"
    };
  }

  const data = await getData(isDev, page, msid);
  let pageContent: any = {};
  
  pageContent = data;

  const seo = pageContent?.seo || {};

  return {
    title: seo?.title || "",
    description: seo?.description || "",
    keywords: seo?.keywords || "",
    authors: seo?.authors || "",
    // "geo.region": "uk",
    alternates: {
      canonical: seo?.actualURL || "",
    },
    openGraph: {
      images: seo?.image,
      url: seo?.url,
      siteName: ""
    },
    // icons: {
    //   other: [
    //     {
    //       rel: "amphtml",
    //       url: seo?.ampURL || ""
    //     },
    //     {
    //       rel: "alternate",
    //       url: seo?.actualURL?.replace(ET_WAP_URL, ET_WEB_URL)
    //     }
    //   ]
    // }
  };
}

async function getData(isDev, page, msid) {
  const baseUrl = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
  let apiEndPoint = "";

  if (page === "videoshow") {
    apiEndPoint = `${baseUrl}/reactfeed_videoshow.cms?platform=web&msid=${msid}&feedtype=etjson&type=videoshow`;
  }

  const res = await fetch(apiEndPoint);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

function getPageName(slugArr) {
  const slug = Array.isArray(slugArr) ? slugArr.join("/") : "";
  // console.log({ slug });
  if (/\/videoshow\/[0-9]+\.cms$/.test(slug)) {
    return "videoshow";
  }
  if (/\/articleshow\/[0-9]+\.cms$/.test(slug)) {
    return "articleshow";
  }
  // if url is like /topic/yogi or /topic/yogi/news or /topic/yogi/videos where yogi is dynamic keyword
  if (/^topic\/[a-zA-Z0-9-]+/.test(slug)) {
    return "topic";
  }
  // if url is like /quickreads or /quickreads/111083896
  if (/^quickreads/.test(slug)) {
    return "quickreads";
  }

  return "notfound";
}

function getMSID(slugArr) {
  try {
    return slugArr[slugArr.length - 1].slice(0, -4);
  } catch (err) {
    console.error(`msid determination error`);
    return 0;
  }
}