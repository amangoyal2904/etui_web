import { headers, cookies } from 'next/headers';
import { getDevStatus } from 'utils/utils';
import NRIClientPage from "./clients";
import Layout from '../../components/Layout';

export async function generateMetadata({ params }) {
    const headersList = headers();
    const domain = headersList.get("host") || "";
   
    return {
      title: "NRI: NRI news today. NRI updates, immigration news | The Economic Times",
      description:  "NRI: Latest NRI news today. NRI recent updates, immigration rues, latest visa announcements, visa process, visa fees, visa new rules, work visa requirements, visa policies, NRI investment options, Non resident Indian latest news and more on The Economic Times",
      keywords: "nri, nri news, nri latest updates, non resident indians, nri latest news, nri updates",
      alternates: {
        canonical: "",
        media: {
          'only screen and (max-width: 640px)': "https://m.economictimes.com/nri/country",
          'handheld': "https://economictimes.indiatimes.com/nri/country"
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

  const fetchContent = async (plistId: any) => {
    const APIURL = `https://etpwaapi.economictimes.com/request?type=plist&msid=${plistId}&top=1`
    const response = await fetch(APIURL);
    const data = await response.json();
    return data;
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
  const getAdData = async (isDev:any, msid='7771250')=> {
    const baseUrl = `https://${isDev ? "etdev8243" : "economictimes"}.indiatimes.com`;
    let apiEndPoint = "";
      apiEndPoint = `${baseUrl}/reactfeed_nri_ads.cms?platform=web&msid=${msid}&feedtype=etjson&type=nri`;
    const res = await fetch(apiEndPoint);
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
   // console.log("baseUrl-------", apiEndPoint);
   // console.log("----------------------------------AD DATA___________________",data);

    return data
  }
    //  Start University Rankings Slider data Fatching--------------------
    const univRankData = async(msid:any)=>{
      const url= `https://cloudservices.indiatimes.com/cms-api/liveblog/content/${msid}?hostid=153&amp;perpage=60&amp;format=xml`;
      const data = await fetch(url);
      const univData = await data.json();
      return univData;
    }
    //  End University Rankings Slider data Fatching--------------------
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
    const adResponse = await getAdData(isDev,'7771250');
    //console.log("----------------------------------AD DATA___________________",adResponse);
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
    const siteCurrentTime = new Date().toISOString();
  
    const investData = await resData(79038765);
    const visitData = await resData(79038785);
    const pageData = {
        investData,
        visitData
    }

    //  Start University Rankings Slider data and Msid--------------------
    const univMsid = '111687226, 111685145, 111109482, 108465738, 108465315';
    const univDataResp = await univRankData(univMsid);
    //  End University Rankings Slider data and Msid--------------------

    return (
    <Layout page="NRI" dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV} siteCurrentTime={siteCurrentTime}>          
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
          addata={adResponse}
          univDataResp={univDataResp}
          />
  </Layout>
    )
}


export default NRIPage;