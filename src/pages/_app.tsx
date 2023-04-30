import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Router, { useRouter } from "next/router";
import { callJsOnRouteChange, InitialJsOnAppLoad } from "../utils/priority";
import ProgressBar from "components/PageTransition";
import NotFound from "containers/NotFound";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "app/store";

const VideoShow = dynamic(() => import("containers/VideoShow"));
const Home = dynamic(() => import("containers/Home"));

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: string;
  }
}

const progress = new ProgressBar({
  size: 2,
  className: "bar-of-progress",
  delay: 10
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

declare global {
  interface Window {
    initalJsCalled: boolean;
    objVc: any;
    __APP: {
      env?: string;
      login?: any;
    };
    objUser: any;
    objInts: any;
    isprimeuser: number;
    dataLayer: [];
  }
}

interface PageProps {
  page?: string;
  isprimeuser?: number;
  response?: any;
  dynamicFooterData?: any;
}

const Container = (props) => {
  // eslint-disable-next-line prefer-const
  const { page, data } = props;
  let container = <NotFound {...data} />;

  switch (page) {
    case "home":
      container = <Home {...data} />;
      break;
    case "videoshow":
      container = <VideoShow {...data} />;
      break;    
    default:
      container = <NotFound {...data} />;
      break;
  }
  return container;
};

const MyApp = ({ pageProps }: AppProps) => {
  const { response, page, isprimeuser, dynamicFooterData }: PageProps = pageProps;

  const data = response || {};
  const versionControl = data?.version_control || {};

  const router = useRouter();

  if (typeof window != "undefined") {
    window.objVc = versionControl || {};
    window.isprimeuser = isprimeuser;
    if (!window.initalJsCalled) {
      window.initalJsCalled = true;
      InitialJsOnAppLoad();
    }
  }

  useEffect(() => {
    // event registered on every route change
    router.events.on("routeChangeComplete", callJsOnRouteChange);
    // eslint-disable-next-line
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <link
          href="https://m.economictimes.com/et_fonts.cms?minify=1&amp;v=6&amp;type=3"
          type="text/css"
          rel="stylesheet"
          media="all"
          fetchpriority="low"
        />
      </Head>
      <Layout page={page} dynamicFooterData={dynamicFooterData} menuData={menuData}>
        <Container objVc={versionControl} isprimeuser={isprimeuser} page={page} data={data} />
      </Layout>
    </Provider>
  );
};

export default MyApp;
