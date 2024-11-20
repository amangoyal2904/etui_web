import { headers, cookies } from 'next/headers';
import dynamic from "next/dynamic";
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';

const VideoShow = dynamic(() => import("../../containers/VideoShow"), { ssr: true });
const ArticleShow = dynamic(() => import("../../containers/ArticleShow"), { ssr: true });
const SlideShow = dynamic(() => import("../../containers/SlideShow"), { ssr: true });

export default async function Page({ params }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {  
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);
  const APP_ENV = isDev ? "development" : "production";  
  const slugArr = params?.all || [];
  const isprimeuser = cookies().get('isprimeuser') || false;
  const siteCurrentTime = new Date().toISOString();

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

      if(page === 'videoshow') {
        const { subsecnames = {} } = response.seo;
        extraParams = subsecnames
          ? {
              subsec1: subsecnames.subsec1,
              subsec2: subsecnames.subsec2,
            }
          : {};

        if (response && response.error) page = "notfound";
      } else {
        const articleData = response?.searchResult?.find((item) => item.name === "article")?.data;
        if(articleData && articleData.responseStatus === 404) page = "notfound";

        const { subsecnames = {} } = articleData || {};
        extraParams = subsecnames
          ? {
              subsec1: subsecnames.subsec1,
              subsec2: subsecnames.subsec2,
            }
          : {};
      }
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
  const Container: any = getContainer(page);

  return  <Layout page={page} dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV} siteCurrentTime={siteCurrentTime}>          
    <Container {...response} objVc={versionControl} isprimeuser={isprimeuser}/>
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
  
  pageContent = page === "videoshow" ? data : data?.searchResult?.find((item) => item.name === "article")?.data;
  const seo = pageContent?.seo || {};
  const m_actualURL = seo?.actualURL?.replace("https://economictimes.indiatimes.com/", "https://m.economictimes.com/");
  
  const amp_actualURL = m_actualURL?.replace(`/${page}/`, `/amp_${page}/`);

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
      images: seo?.image || seo?.img || "",
      url: seo?.url || seo?.actualURL || "",
      siteName: '@EconomicTimes',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || "",
      description: seo?.description || "",
      site: '@EconomicTimes',
      images: [seo?.image || seo?.img || ""], // Must be an absolute URL
      // url: seo?.url || "",
    },
    facebook: {
      // appId: [21540067693, 117787264903013],
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
          url: seo?.image || seo?.img || ""
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
  const baseUrl1 = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
  const baseUrl2 = `https://${isDev ? "etpwaapipre" : "etpwaapi"}.economictimes.com`;
  let apiEndPoint = "";

  if (page === "videoshow") {
    apiEndPoint = `${baseUrl1}/reactfeed_videoshow.cms?platform=web&msid=${msid}&feedtype=etjson&type=videoshow`;
  }

  if (page === "articleshow") {
    apiEndPoint = `${baseUrl2}/request?type=article&msid=${msid}`;
  }

  if (page === "slideshow") {
    apiEndPoint = `${baseUrl2}/request?type=article&msid=${msid}`; // TODO: need to change type when api is ready
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
  } else if (/\/articleshow\/[0-9]+\.cms$/.test(slug)) {
    return "articleshow";
  } else if (/\/slideshow\/[0-9]+\.cms$/.test(slug)) {
    return "slideshow";
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

function getContainer(page) {
  if (page === "videoshow") {
    return VideoShow;
  }
  if (page === "articleshow") {
    return ArticleShow;
  }
  if (page === "slideshow") {
    return SlideShow;
  }
  return null;
}