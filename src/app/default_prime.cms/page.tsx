import { headers, cookies } from 'next/headers';
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';
import PrimeHome from 'containers/PrimeHome';


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
    const footerMenuApi = `${baseUrl}/reactfeed_footermenu.cms?platform=web&feedtype=etjson`;
    const navBarApi = `${baseUrl}/reactfeed_menu.cms?platform=web&feedtype=etjson`
    const promiseApis = [footerMenuApi, navBarApi];    
    const [footerMenuResult, navBarResult] = await Promise.all(promiseApis.map(api => fetch(api).then(res => res.json())));    
    dynamicFooterData = footerMenuResult || {};
    menuData = navBarResult || {};
  }catch(error){
    console.log("Error: ", error)
  }
  const pageSeo = response?.seo || {};
  const versionControl = response?.version_control || {};
  return  <Layout page="primehome" className="layout1260" dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV}>          
    <PrimeHome {...response} objVc={versionControl} isprimeuser={isprimeuser} isDev={isDev} />
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
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      }
    }
  };
}

async function getData(isDev) {
  const baseUrl = `https://etpwaapi${isDev ? "pre" : ""}.economictimes.com`;
  // const baseUrl = `http://localhost:1300`;
  let apiEndPoint = `${baseUrl}/request?type=web_primehome`;

  const res = await fetch(apiEndPoint);

  if (!res.ok) {
    throw new Error("Failed to fetch prime home web data");
  }

  return res.json();
}