"use client"
import Layout from '../../components/Layout';
import NriList from 'containers/NriList';
import NriSecWidget from "components/NriSecWidget";
import NriUnivRanking from 'components/NriUnivRanking';



const NRIClientPage = ({dynamicFooterData, menuData, versionControl, response, pageSeo, isDev, ssoid, isprimeuser, APP_ENV, pageData, univDataResp}:any)=>{
    
    
    const investData = pageData?.investData?.searchResult?.find(item => item.name === "articlelist")?.data?.news;
    
    const visitData = pageData?.visitData?.searchResult?.find(item => item.name === "articlelist")?.data?.news;
 
    return (
        <>
            <Layout page="nri" className="layout1260" dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response} isprimeuser={isprimeuser} pageSeo={pageSeo} APP_ENV={APP_ENV}>    
              <>
                <NriList {...response} objVc={versionControl} isprimeuser={isprimeuser} isDev={isDev} ssoid={ssoid} />
                <NriUnivRanking univDataResp={univDataResp?.response?.data}/>
                <NriSecWidget title="Invest" data={investData} widgetId={79038765} titleurl="/nri/invest"/>
                <NriSecWidget title="Visit" data={visitData} widgetId={79038785} titleurl="/nri/visit"/>
                
              </>
            </Layout>
        </>
    )
}

export default NRIClientPage;
