import { headers, cookies } from 'next/headers';
import { getDevStatus } from 'utils/utils';
import NRIClientPage from "./clients";
import Layout from '../../components/Layout';

export async function generateMetadata({ params }) {
    const headersList = headers();
    const domain = headersList.get("host") || "";
   
    return {
      title: "Test NRI page",
      description:  "Test NRI page",
      keywords: "Test NRI page",
      alternates: {
        canonical: "",
        media: {
          'only screen and (max-width: 640px)': "",
          'handheld': ""
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


const getData = async (isDev:any)=> {
    const baseUrl = `https://etpwaapi${isDev ? "pre" : ""}.economictimes.com`;
    // const baseUrl = `http://localhost:1300`;
    let apiEndPoint = `${baseUrl}/request?type=web_primehome`;
  
    const res = await fetch(apiEndPoint);
  
    if (!res.ok) {
      throw new Error("Failed to fetch prime home web data");
    }
  
    return res.json();
  }

  const resData = async(msid:any)=>{
    const APIURL = `https://etpwaapi.economictimes.com/request?type=articlelist&msid=${msid}&top=12`
    const data = await fetch(APIURL)
    const response = await data.json();
    return response;
  }

const NRIPage =  async ()=>{

    
    const headersList = headers();
    const domain = headersList.get("host") || "";
    const isprimeuser = cookies().get('isprimeuser') || false;
    const cookieStore = cookies();
    const ssoid = cookieStore.get("ssoid")?.value;



    const isDev = getDevStatus(domain);
    const APP_ENV = isDev ? "development" : "production";  
    const response = await getData(isDev);
    const baseUrl = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
    const footerMenuApi = `${baseUrl}/reactfeed_footermenu.cms?platform=web&feedtype=etjson`;
    const navBarApi = `${baseUrl}/reactfeed_menu.cms?platform=web&feedtype=etjson`
    const promiseApis = [footerMenuApi, navBarApi];   
    const [footerMenuResult, navBarResult] = await Promise.all(promiseApis.map(api => fetch(api).then(res => res.json())));    
    const dynamicFooterData = footerMenuResult || {};
    const menuData = navBarResult || {};
    const pageSeo = response?.seo || {};
    const versionControl = response?.version_control || {};
    const tabsCanadaData = await fetchContent(110522920);
    const tabsUSData = await fetchContent(108463119);
  
    const investData = await resData(79038765);
    const visitData = await resData(79038785);
    const pageData = {
        investData,
        visitData
    }
    return (
    <Layout page="NRI" dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV}>          
        <NRIClientPage 
          dynamicFooterData={dynamicFooterData} 
          menuData={menuData} 
          versionControl={versionControl} 
          response={response} 
          pageSeo={pageSeo} 
          isDev={isDev} 
          isprimeuser={isprimeuser} 
          ssoid={ssoid} 
          APP_ENV={APP_ENV} 
          pageData={pageData}
          tabsCanadaData={tabsCanadaData}
          tabsUSData={tabsUSData}
          />
  </Layout>
    )
}

const fetchContent = async (plistId: any) => {
  const APIURL = `https://etpwaapi.economictimes.com/request?type=plist&msid=${plistId}&top=1`
  const response = await fetch(APIURL);
  const data = await response.json();
  return data;
};
export default NRIPage;