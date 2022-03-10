import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import {videoShowDataAPICall} from '../utils/apiCallFun';

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
  console.log('query', query)
  
  // if  videshow url  in param than call to this  function in server side props
  let checkVideoShowUrl = query.all.includes('videoshow');
  let videoShowData = '';
  if(checkVideoShowUrl){
    videoShowData = await videoShowDataAPICall(query.all)
  }
// end videoshow api function here 
  return {
    props:{
      videoShowAPIData: videoShowData
    }
  }

  //return { props: {} }
}   