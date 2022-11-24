import { pageType, getMSID, prepareMoreParams } from "utils";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";

const All = () => null;
const expiryTime = 10 * 60;

export async function getServerSideProps({ req, res, params, resolvedUrl }) {
  const isprimeuser = req.headers?.primetemplate ? 1 : 0;
  const { all = [] } = params;
  const lastUrlPart: string = all?.slice(-1).toString();
  let page = pageType(resolvedUrl);
  const api = APIS_CONFIG.FEED,
  REQUEST = APIS_CONFIG.REQUEST;

  let extraParams = {},
    response: any = {};

  if (page !== "notfound") {
    const msid = getMSID(lastUrlPart);
    const moreParams = prepareMoreParams({ all, page, msid });

    //==== gets page data =====
    const apiType = page === "videoshownew" ? "videoshow" : page;
    const result = await Service.get({
      api,
      params: { type: apiType, platform: "wap", feedtype: "etjson", ...moreParams }
    });
    response = result.data;
    const { subsecnames = {} } = response.seo;
    extraParams = subsecnames
      ? {
          subsec1: subsecnames.subsec1,
          subsec2: subsecnames.subsec2
        }
      : {};

    if (response && response.error) page = "notfound";
  }

  //==== gets dyanmic footer data =====
  const footerMenu = await Service.get({
    api,
    params: { type: "footermenu", feedtype: "etjson", ...extraParams, template_name: page }
  });
  const dynamicFooterData = footerMenu.data || {};

  //==== gets meuu data =====
  const navBar = await Service.get({
    api: REQUEST,
    params: { type: "menu" }
  });
  const {data} = navBar,
  menuData  = (data.searchResult && data.searchResult[0]) || {};

 

  //==== sets response headers =====
  res.setHeader("Cache-Control", `public, s-maxage=${expiryTime}, stale-while-revalidate=${expiryTime * 2}`);
  res.setHeader("Expires", new Date(new Date().getTime() + expiryTime * 1000).toUTCString());

  return {
    props: {
      page,
      response,
      isprimeuser,
      dynamicFooterData,
      menuData
    }
  };
}
export default All;
