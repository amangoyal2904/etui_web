import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const ArticleList = dynamic(() => import('containers/ArticleList'))
const ArticleShow = dynamic(() => import('containers/ArticleShow'))
const VideoShow = dynamic(() => import('containers/VideoShow/VideoShow'))

interface Query {
  all: string[],
  apiData:any
}

export default function All(props:any) {

  const router = useRouter();
  const { all } = router.query;
  
  /**
   * check if articleshow
   * 
   * Articleshow pattern consists of:
   * a. 89622565.cms as last url comonent
   * b. articleshow as the second last url component
   */    
  const lastUrlComponent: string = all.slice(-1).toString();
  const secondLastUrlComponent: string = all.slice(-2, -1).toString();

  if(/^[0-9]+\.cms$/.test(lastUrlComponent) && secondLastUrlComponent==='articleshow') {
    return <ArticleShow query={all}  />;
  }else if(/^[0-9]+\.cms$/.test(lastUrlComponent) && secondLastUrlComponent==='videoshow'){
    return <VideoShow query={all} apiData={props.videoShowAPIData} />;
  } else {
    return <ArticleList query={all} />;
  }

}

export async function getServerSideProps({ params, req, res, query, preview, previewData, resolvedUrl, locale, locales, defaultLocale }) {
  //console.log('pageMsid')
  let url = 'https://etdev8243.indiatimes.com/reactfeed_videoshowweb.cms?feedtype=etjson&msid=90093673&showjcmserror=1&showxslterror=1';
  let  data = await fetch(url,{mode: 'no-cors'});
  let  _res =  await data.json();
  return {
    props:{
      videoShowAPIData: _res
    }
  }

  //return { props: {} }
}   