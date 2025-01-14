export const ET_WEB_URL = "https://economictimes.indiatimes.com";
export const ET_WAP_URL = "https://m.economictimes.com";
export const ET_IMG_DOMAIN = "https://img.etimg.com/";
export const ePaper_URL = {
  'development': 'https://etdev8243.indiatimes.com',
  'production': 'https://epaper.indiatimes.com'
}
export const TEST_ID_CTN_HOME = "358376"; // 335965
export const TEST_COLOMBIA_DFP_HOME = "/7176/ET_MWeb/ET_Mweb_Bid_Experiment/ET_Mweb_HP_Bid_Experiment_300";
export const TEST_COLOMBIA_DFP_ARTICLESHOW = "/7176/ET_MWeb/ET_Mweb_Bid_Experiment/ET_Mweb_ROS_Bid_Experiment_300";

export const PAGE_TYPE = {
  articleshow: "articleshow",
  articlelist: "articlelist",
  breadcrumb: "breadcrumb",
  home: "home"
};

export const SiteConfig = {
  wapsitename: "The Economic Times",
  wapsiteregionalname: "The Economic Times",
  language: "en",
  languagefullName: "english",
  weburl: "https://economictimes.indiatimes.com",
  domain: "indiatimes.com",
  purpose: "Business News",
  image:
    "https://m.economictimes.com/thumb/msid-65498029,width-640,resizemode-4/et-logo.jpg",
  description:
    "Business News - Read Latest Financial news, Stock/Share Market News, Economy News, Business News on The Economic Times.  Find IPO Analysis, Mutual Funds Trends & Analysis, Gold Rate, Real Estate & more.",
  keywords:
    "business news, personal finance, nse, bse, financial news,share market news india,stock market news",
  title:
    "Business News Live, Share Market News - Read Latest Finance News, IPO, Mutual Funds News",
  publisherLogo: "https://img.etimg.com/photo/msid-76191298/76191298.jpg",
  imgDomain: "https://img.etimg.com"
};

export function getSubsecString(subsecNames) {
  if (!subsecNames) return "";
  const names: string[] = [],
    ids: string[] = [];
  Object.values(subsecNames).forEach((item: string) => {
    if (item) {
      /^[0-9]+$/.test(item) ? ids.push(item) : names.push(item);
    }
  });
  return names.length > 0 ? names.join("|") : ids.join("|");
}

export const GA = {
  GTM_KEY: 'AW-1012951608',
  GTM_ID: "GTM-WV452H7",
  GA_ID: "UA-198011-5",
  GRX_ID: "gc2744074"
}

export const X_CLIENT_ID = {
  'development': 'w2a8e883ec676f417520f422068a4741',
  'production': 'b2a8e883ec676f417520f422068a4742'
}

export const SITE_APP_CODE = {
  'development': 'd8bf11298a038d8f20be2c4486c3c728',
  'production': 'c21b937c35b0d7cc7c6659d3b57e3d4a'
}