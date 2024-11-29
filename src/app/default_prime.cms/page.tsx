import { headers, cookies } from 'next/headers';
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';
import SubscriberHome from 'containers/SubscriberHome';


export default async function Page({ params }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);
  const APP_ENV = isDev ? "development" : "production";  
  const slugArr = params?.all || [];
  const isprimeuser = cookies().get('isprimeuser')?.value || false;
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const siteCurrentTime = new Date().toISOString();

  console.log("ssoid --- ", ssoid);

  let extraParams: any = {},
  response: any = {},
  menuData: any = {},
  dynamicFooterData: any = {};

  try {     
    //==== gets page data =====            
    response = await getData(isDev);
  
    //==== gets dyanmic footer data =====    
    const baseUrl = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
    
    const extraParamsQuery = Object.keys(extraParams).map(key => `${key}=${extraParams[key]}`).join('&');
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

  const slugArr = params?.all || [];

  const data = await getData(isDev);  


  const seo = data?.searchResult?.find(item => item?.name === "seo")?.data || {};
  // console.log("seo", seo);
  if(seo.title === undefined || seo.title === null || seo.title === ""){
    return {
      title: "Economic Times"
    }
  }

  const m_actualURL = seo?.actualURL?.replace("https://economictimes.indiatimes.com/", "https://m.economictimes.com/") || "";
  const amp_actualURL = m_actualURL?.replace("/videoshow/", "/amp_videoshow/") || "";

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

async function getData(isDev) {
  const baseUrl = `https://etpwaapi${isDev ? "pre" : ""}.economictimes.com`;
  // const baseUrl = `http://localhost:1300`;
  let apiEndPoint = `${baseUrl}/request?type=web_subscriberhome`;

  const res = await fetch(apiEndPoint);

  if (!res.ok) {
    throw new Error("Failed to fetch prime home web data");
  }

  return res.json();
}