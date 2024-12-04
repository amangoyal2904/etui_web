import { headers, cookies } from 'next/headers';
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';
import SubscriberHome from 'containers/SubscriberHome';
import { ET_WEB_URL } from 'utils/common';


export default async function Page({ searchParams }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);
  const APP_ENV = isDev ? "development" : "production";  
  const isprimeuser = cookies().get('isprimeuser')?.value || false;
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const siteCurrentTime = new Date().toISOString();  

  let response: any = {},
  menuData: any = {},
  dynamicFooterData: any = {};

  try {     
    //==== gets page data =====      
    // if query parameter has upcache=2, send it to getData
    const isUpcache2 = searchParams?.upcache === "2" ? true : false;
    response = await getData(isDev, isUpcache2);
  
    //==== gets dyanmic footer data =====    
    const baseUrl = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
    
    const footerMenuApi = `${baseUrl}/reactfeed_footermenu.cms?platform=web&feedtype=etjson&subsec1=0&subsec2=0&quicklink=1&pageType=&pageName=default_prime&section_id=0&template_name=articlelist&sub_type=0`;
    const navBarApi = `${baseUrl}/reactfeed_menu.cms?platform=web&feedtype=etjson`
    const promiseApis = [footerMenuApi, navBarApi];    
    const [footerMenuResult, navBarResult] = await Promise.all(promiseApis.map(api => fetch(api).then(res => res.json())));    
    dynamicFooterData = footerMenuResult || {};
    menuData = navBarResult || {};
  }catch(error){
    console.log("Error: ", error)
  }
  const pageSeo = response?.seo || {};
  const versionControl = response?.searchResult?.find(item => item?.name === "common_config")?.data || {};
  return  <Layout page="subscriberhome" className="layout1260" dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV} siteCurrentTime={siteCurrentTime}>          
    <SubscriberHome {...response} objVc={versionControl} isprimeuser={isprimeuser} isDev={isDev} ssoid={ssoid} />
  </Layout>;
}

export async function generateMetadata({ params }) {
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);

  const data = await getData(isDev, false, true);

  const seo = data?.searchResult?.find(item => item?.name === "seo")?.data || {};
  
  if(seo.title === undefined || seo.title === null || seo.title === ""){
    return {
      title: "Economic Times"
    }
  }

  const m_actualURL = seo?.actualURL?.replace("https://economictimes.indiatimes.com/", "https://m.economictimes.com/") || "";

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
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      }
    }
  };
}

async function getData(isDev, isUpcache2 = false,  isSEOCall = false) {
  const baseUrl = `https://etpwaapi${isDev ? "pre" : ""}.economictimes.com`;  
  let apiEndPoint = `${baseUrl}/request?type=web_subscriberhome`;

  if(isUpcache2){
    apiEndPoint += "&upcache=2";
  }

  const res = await fetch(apiEndPoint);

  if (!res.ok) {
    throw new Error("Failed to fetch prime home web data");
  }

  if(isUpcache2 && !isSEOCall){     
    const clearCacheUrl = `${baseUrl}/cache/clear`;
    const clearCacheBody = {
      fullurl: ET_WEB_URL + "/default_prime.cms"
    };

    await fetch(clearCacheUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clearCacheBody)
    });
  }
  
  return res.json();
}