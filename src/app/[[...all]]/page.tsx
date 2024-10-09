import { headers, cookies } from 'next/headers';
import dynamic from "next/dynamic";
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';

const VideoShow = dynamic(() => import("../../containers/VideoShow"), { ssr: true });

export default async function Page({ params }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  console.log('catch all')
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);
  const APP_ENV = isDev ? "development" : "production";  
  const slugArr = params?.all || [];
  const isprimeuser = cookies().get('isprimeuser') || false;

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
    const baseUrl = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
    
    const extraParamsQuery = Object.keys(extraParams).map(key => `${key}=${extraParams[key]}`).join('&');
    const footerMenuApi = `${baseUrl}/reactfeed_footermenu.cms?platform=web&feedtype=etjson&template_name=${page}${extraParamsQuery ? `&${extraParamsQuery}` : ''}`;    
    const navBarApi = `${baseUrl}/reactfeed_menu.cms?platform=web&feedtype=etjson&msid=${extraParams?.subsec1}`
    const promiseApis = [footerMenuApi, navBarApi];
    const [footerMenuResult, navBarResult] = await Promise.all(promiseApis.map(api => fetch(api).then(res => res.json())));
    dynamicFooterData = footerMenuResult || {};
    menuData = navBarResult || {};
  }catch(error){
    console.log("Error: ", error)
  }
  const pageSeo = response?.seo || {};
  const versionControl = response?.version_control || {};
  return  <Layout page={page} dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV}>          
    <VideoShow {...response} objVc={versionControl} isprimeuser={isprimeuser}/>
  </Layout>;
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
  const m_actualURL = seo?.actualURL?.replace("https://economictimes.indiatimes.com/", "https://m.economictimes.com/");
  const amp_actualURL = m_actualURL?.replace("/videoshow/", "/amp_videoshow/");

  return {
    title: seo?.title || "",
    description: seo?.description || "",
    keywords: seo?.keywords || "",
    authors: seo?.authors || "",
    alternates: {
      canonical: seo?.actualURL || "",
      media: {
        'only screen and (max-width: 640px)': m_actualURL,
        'handheld': m_actualURL
      },
    },
    openGraph: {
      images: seo?.image,
      url: seo?.url,
      siteName: '@EconomicTimes',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || "",
      description: seo?.description || "",
      site: '@EconomicTimes',
      images: [seo?.image], // Must be an absolute URL
      url: seo?.url || "",
    },
    facebook: {
      appId: ['21540067693', '117787264903013'],
      admins: '556964827',
    },
    icons: {
      icon: "https://economictimes.indiatimes.com/icons/etfavicon.ico",
      other: [
        {
          rel: "amphtml",
          url: amp_actualURL || ""
        },
        {
          rel: "image_src",
          url: seo?.image
        }
      ]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      }
    }
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
  if (/\/videoshow\/[0-9]+\.cms$/.test(slug)) {
    return "videoshow";
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