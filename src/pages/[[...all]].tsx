import { pageType, getMSID, prepareMoreParams } from "../utils";
import Service from "../network/service";
import APIS_CONFIG from "../network/config.json";

interface Props {
page: string;
response: any;
isprimeuser: number;
dynamicFooterData: any;
menuData: any;
}

const All = () => null;
const expiryTime = 10 * 60;

export async function getServerSideProps({ req, res, params, resolvedUrl }): Promise<{ props: Props }> {
  const isprimeuser = req.headers?.primetemplate ? 1 : 0,
  { all = [] } = params,
  lastUrlPart: string = all?.slice(-1).toString(),
  api = APIS_CONFIG.FEED,
  REQUEST = APIS_CONFIG.REQUEST;

  let page = pageType(resolvedUrl),
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
      params: { type: "footermenu", feedtype: "etjson", ...extraParams, template_name: page },
    });
    //==== gets menu data =====
    const navBarPromise = Service.get({
      api,
      params: { type: "menu", feedtype: "etjson", msid: extraParams?.subsec1 },
    });

    const [footerMenuResult, navBarResult] = await Promise.all([footerMenuPromise, navBarPromise]);

    dynamicFooterData = footerMenuResult?.data || {};
    menuData = navBarResult?.data;

    // console.log("menuData---", menuData);

    //==== sets response headers =====
    res.setHeader("Cache-Control", `public, s-maxage=${expiryTime}, stale-while-revalidate=${expiryTime * 2}`);
    res.setHeader("Expires", new Date(new Date().getTime() + expiryTime * 1000).toUTCString());
  }catch(error){
    console.log("Error: ", error)
  }

  return {
    props: {
      page,
      response,
      isprimeuser,
      dynamicFooterData,
      menuData,
    },
  };
}
export default All;
