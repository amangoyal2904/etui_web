import { headers, cookies } from 'next/headers';
import Layout from '../../components/Layout';
import { getDevStatus } from 'utils/utils';
import NriList from 'containers/NriList';

export default async function Page({ params }: {
    params: { all: string[] }
    searchParams: { [key: string]: string | string[] | undefined }
  }){
    const headersList = headers();
  const domain = headersList.get("host") || "";
  const isDev = getDevStatus(domain);
  const APP_ENV = isDev ? "development" : "production";  
  const slugArr = params?.all || [];
  const isprimeuser = cookies().get('isprimeuser') || false;
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;

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
  return  <Layout page="nri" className="layout1260" dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV}>          
    <NriList {...response} objVc={versionControl} isprimeuser={isprimeuser} isDev={isDev} ssoid={ssoid} />
  </Layout>;

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