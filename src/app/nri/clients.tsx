"use client"
import Layout from '../../components/Layout';
import NriList from 'containers/NriList';
import NriSecWidget from "components/NriSecWidget";
import NriUnivRanking from 'components/NriUnivRanking';

const NRIClientPage = ({dynamicFooterData, menuData, versionControl, response, pageSeo, isDev, ssoid, isprimeuser, APP_ENV, pageData, univDataResp, tabsCanadaData, tabsUSData, addata}:any)=>{
    //console.log('fhsdfhgds---ncdsnvds',response);
    const investData = pageData?.investData?.searchResult?.find(item => item.name === "articlelist")?.data?.news;
    const visitData = pageData?.visitData?.searchResult?.find(item => item.name === "articlelist")?.data?.news;
    //console.log("@@@@-->NRI",tabsCanadaData.searchResult, tabsUSData.searchResult)
    return (              
            <section>
                <NriList {...response} objVc={versionControl} tabsCanadaData={tabsCanadaData} tabsUSData={tabsUSData} isprimeuser={isprimeuser} isDev={isDev} ssoid={ssoid} addata={addata} />
                <NriUnivRanking univDataResp={univDataResp?.response?.data}/>
                <NriSecWidget title="Invest" data={investData} widgetId={7771310} titleurl="/nri/invest"/>
                {/* <NriSecWidget title="Visit" data={visitData} widgetId={79038785} titleurl="/nri/visit"/> */}
            </section>
            
    )
}

export default NRIClientPage;
