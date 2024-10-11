import React, { Fragment, useState } from "react";
import Loading from "../../components/Loading";

const IndustryTabsJSON = [
    {
        tabName: "FEATURED",
        msid: 13352306,
        link: "/industry"
    },{
        tabName: "AUTO",
        msid: 13359412,
        link: "/industry/auto"
    },{
        tabName: "BANKING / FINANCE",
        msid: 13358259,
        link: "/industry/banking/finance"
    },{
        tabName: "CONS. PRODUCTS",
        msid: 13358759,
        link: "/industry/cons-products"
    },{
        tabName: "ENERGY",
        msid: 13358350,
        link: "/industry/energy"
    },{
        tabName: "RENEWABLES",
        msid: 81585238,
        link: "/industry/renewables"
    },{
        tabName: "IND'L GOODS / SVS",
        msid: 13357688,
        link: "/industry/indl-goods/svs"
    },{
        tabName: "INTERNET",
        msid: 13357549,
        link: "/tech/technology"
    },{
        tabName: "HEALTHCARE",
        msid: 13358050,
        link: "/industry/healthcare/biotech"
    },{
        tabName: "JOBS",
        msid: 107115,
        link: "/jobs"
    },{
        tabName: "RETAIL",
        msid: 13356992,
        link: "/industry/services/retail"
    },{
        tabName: "SERVICES",
        msid: 13354120,
        link: "/industry/services"
    },{
        tabName: "RISE",
        msid: 18606290,
        link: "/small-biz"
    },{
        tabName: "MEDIA",
        msid: 13357212,
        link: "/industry/media/entertainment"
    },{
        tabName: "TECH",
        msid: 78404305,
        link: "/tech"
    },{
        tabName: "TELECOM",
        msid: 13354103,
        link: "/industry/telecom"
    },{
        tabName: "TRANSPORTATION",
        msid: 13353990,
        link: "/industry/transportation"
    }
];

const NewsByIndustry = ({data, title}) => {
    const [articleData, setArticleData] = useState([
        {
            msid: '13352306',
            articleList: data
        }
    ]);

    const [showTab, setShowTab] = useState('13352306');
    const [showLoading, setShowLoading] = useState(false);
    const selectedObj = IndustryTabsJSON.find(item => Number(item?.msid) == Number(showTab));

    const articleListApiHit = (listMsid) => {
        // console.log("test ---- ", articleData?.some(article => console.log("article test", Number(article.msid), listMsid)))
        setShowTab(listMsid);
        if(!articleData?.some(article => Number(article.msid) == Number(listMsid))){
            // console.log("articleData --- ", articleData);
            const pllistArr = [13352306, 107115, 81585238, 78404305, 18606290];
            const typeVal = pllistArr.includes(listMsid) ? "plist" : "articlelist";
            const apiLink = `https://etpwaapipre.economictimes.com/request?type=${typeVal}&msid=${listMsid}`;
            setShowLoading(true);

            fetch(apiLink)
            .then(response => response.json())
            .then(res => {
                const resData = typeVal == "plist" ? res?.searchResult[0]?.data : res?.searchResult?.find(item => item?.name === "articlelist")?.data?.news;
                setArticleData(prev => [...prev, { msid:res?.parameters?.msid , articleList: resData }]);
                setShowLoading(false);
            })
            .catch(error => {
            console.error('Error:', error);
            })
            .finally(() => {
            console.log('finally');
            });
        }
    }

    const articleHtml = (articleList, apiMsid) => {
        return (
            <>
                <style jsx>{`
                    .tabContentView{
                        list-style: none;
                        display:none;

                        &.active{
                            display:block;
                        }
                        .first{
                            display: flex;
    
                            .firstData{
                                width: 400px;
                                margin-left: 19px;
                                margin-right: 0;
    
                                .hl{
                                    font-size: 34px;
                                    line-height: 1.09;
                                    font-weight: 600;
                                }
                            }
    
                            .desc {
                                font-size: 14px;
                                color: #4a4a4a;
                                line-height: 1.43;
                                margin-top: 12px;
                            }
                        }

                        .others{
                            &.mt20{
                                margin-top:20px;
                            }
                            .otherDiv{
                                display: inline-flex;
                                width: 315px;
                                border-top: 1px solid #e8d2cb;
                                padding: 11px 0 15px 0;
                                vertical-align: top;

                                &:nth-child(even) {
                                    margin-left: 20px;
                                }

                                &:nth-child(1),  &:nth-child(2){
                                    border-top: 0;
                                }

                                .data {
                                    width: 245px;
                                    margin-right: 0;
                                    margin-left: 10px;
                                }

                                .otherDivH{
                                    font-size: 17px;
                                    font-weight: 500;
                                }
                            }
                        }
                    }

                    .wrapLines.l3 {
                        -webkit-line-clamp: 3;
                    }

                    .wrapLines {
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }
                `}</style>
                <li data-msid={apiMsid} className={`tabContentView ${showTab == apiMsid ? 'active' : ''}`}>
                    {
                        articleList?.map((value, index) => {
                            return (                                                                    
                                index == 0 && <div className="first" key={index}>
                                    <a target="_blank" href={value.url}>
                                        <img 
                                            width="293" 
                                            height="226" 
                                            title={value.title}
                                            alt={value.title} 
                                            src={value.img}
                                            loading="lazy" 
                                        />
                                    </a>
                                    <div className="firstData">
                                        <h4>
                                            <a 
                                                className="hl" 
                                                target="_blank" 
                                                href={value.url}
                                            >{value.title}</a>
                                        </h4>
                                        <p className="desc wrapLines l3">
                                            {value.synopsis}
                                        </p>
                                    </div>
                                </div>                        
                            )
                        })  
                    }
                    <div className=" others mt20">
                        {
                            articleList?.map((value, index) => {
                                return (                                    
                                    index > 0 && index < 8 && value.type != "colombia" && value.type != "mrec"  ? <div className="otherDiv" key={index}>
                                        <a target="_blank" className="flt" href={value.url}>
                                            <img 
                                                width="88" 
                                                height="66" 
                                                title={value.title}
                                                alt={value.title} 
                                                src={value.img}
                                                loading="lazy" 
                                            />
                                        </a>
                                        <div className=" data">
                                            <h4 className="otherDivH">
                                                <a target="_blank" href={value.url} className="font_faus">
                                                    {value.title}
                                                </a>
                                            </h4>
                                        </div>
                                    </div> : ""                                
                                )
                            })  
                        }
                    </div>                              
                </li>
            </>  
        )
    }

  return (
    <>
        <style jsx>{`
            .loadingLiWrp{
                height: 612px;
                position:relative;
                list-style:none;
            }
            .secBox {
                padding-top: 1px;
                position: relative;
                border-top: 1px solid #9b8680;
                box-sizing: border-box;
                padding-bottom: 50px;
            }

            .heading_box {
                padding: 50px 0 0;
                position: relative;
                border-top: 3px solid #9b8680;
            }

            .heading_box .secname {
                font-size: 23px;
                font-weight: 800;
                line-height: .89;
                max-width: 200px;
                display: inline-block;
            }

            .heading_box .sec_heading {
                font-size: 38px;
            }

            .heading_box .semi_oval {
                background-color: #e6cdc4;
                width: 159px;
                height: 80px;
                border-radius: 50% / 100%;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                display: inline-block;
                position: absolute;
                top: 40px;
                z-index: 0;
            }

            .curr_secname {
                font-size: 40px;
                font-weight: 500;
                position: relative;
                letter-spacing: 10px;
                margin-left: 22px;
                display: inline-block;
                padding-bottom: 10px;
            }

            #newsInds a.curr_secname:after {
                content: '';
                display: inline-block;
                width: 15px;
                height: 15px;
                top: -4px;
                left: 3px;
                border-top: 2px solid #000;
                border-left: 2px solid #000;
                position: relative;
                cursor: pointer;
                transform: rotate(135deg);
            }
            
            .tabsView{
                display: table;
                box-shadow: -2px 1px 4px 0 rgba(0, 0, 0, 0.11);

                .tabs{
                    list-style: none;
                    width: 215px;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 19%);
                    background-color: #fff;
                    display: table-cell;
                    vertical-align: top;

                    .tabLi{
                        font-size: 13px;
                        padding: 8px;
                        height: 36px;
                        box-sizing: border-box;
                        line-height: 20px;
                        cursor: pointer;
                        border: 0;
                        position: relative;

                        &.active, &:hover{
                            background: #ffe9e2;
                            color: #ed193b;
                            width: 101%;
                            font-weight: normal;
                            border: solid 1px #e6cdc4;
                            border-right: 0;
                            .tabIcon{
                                [data-msid='13352306']{
                                    background-position: -57px -331px;
                                }
                                &[data-msid='13359412']{
                                    background-position: -56px -367px;
                                }
                                &[data-msid='13358259']{
                                    background-position: -57px -403px;
                                }
                                &[data-msid='13358759']{
                                    background-position: -57px -438px;
                                }
                                &[data-msid='13358350']{
                                    background-position: -135px -332px;
                                }
                                &[data-msid='81585238']{
                                    background-position: -135px -332px;
                                }
                                &[data-msid='13357688']{
                                    background-position: -136px -368px;
                                }
                                &[data-msid='13357549']{
                                    background-position: -136px -368px;
                                }
                                &[data-msid='13358050']{
                                    background-position: -137px -403px;
                                }
                                &[data-msid='107115']{
                                    background-position: -97px -330px;
                                }
                                &[data-msid='13356992']{
                                    background-position: -98px -366px;
                                }
                                &[data-msid='13354120']{
                                    background-position: -98px -403px;
                                }
                                &[data-msid='18606290']{
                                    background-position: -98px -439px;
                                }
                                &[data-msid='13357212']{
                                    background-position: -12px -332px;
                                }
                                &[data-msid='78404305']{
                                    background-position: -11px -366px;
                                }
                                &[data-msid='13354103']{
                                    background-position: -15px -403px;
                                }
                                &[data-msid='13353990']{
                                    background-position: -11px -440px;
                                }
                            }

                            .nav_arw {
                                float: right;
                                background-position: -404px -488px;
                                margin: 2px 0;
                                display: block;
                                height: 15px;
                                width: 15px;
                            }
                        }

                        .tabIcon{
                            min-height: 25px;
                            min-width: 25px;
                            float: left;
                            margin-right: 6px;
            
                            &[data-msid='13352306']{
                                background-position: -237px -331px;
                            }
                            &[data-msid='13359412']{
                                background-position: -236px -367px;
                            }
                            &[data-msid='13358259']{
                                background-position: -237px -403px;
                            }
                            &[data-msid='13358759']{
                                background-position: -237px -438px;
                            }
                            &[data-msid='13358350']{
                                background-position: -315px -332px;
                            }
                            &[data-msid='81585238']{
                                background-position: -315px -332px;
                            }
                            &[data-msid='13357688']{
                                background-position: -316px -368px;
                            }
                            &[data-msid='13357549']{
                                background-position: -316px -368px;
                            }
                            &[data-msid='13358050']{
                                background-position: -317px -403px;
                            }
                            &[data-msid='107115']{
                                background-position: -277px -330px;
                            }
                            &[data-msid='13356992']{
                                background-position: -278px -366px;
                            }
                            &[data-msid='13354120']{
                                background-position: -278px -403px;
                            }
                            &[data-msid='18606290']{
                                background-position: -278px -439px;
                            }
                            &[data-msid='13357212']{
                                background-position: -192px -332px;
                            }
                            &[data-msid='78404305']{
                                background-position: -191px -366px;
                            }
                            &[data-msid='13354103']{
                                background-position: -194px -403px;
                            }
                            &[data-msid='13353990']{
                                background-position: -191px -440px;
                            }
                        }
                    }
                }

                .tabsContent{
                    width: 710px;
                    padding: 17px 19px 0 21px;
                    border: solid 1px #e6cdc4;
                    display: table-cell;
                    vertical-align: top;
                    box-shadow: -2px 1px 4px 0 rgba(0,0,0,0.11)
                }
            }


            .subSprite {
                background: url('https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg') no-repeat;
                display: inline-block;
                background-size: 475px;
            }

            #newsInds{
                border-top: 1px solid #9b8680;
                padding-top: 1px;
                margin-top: 40px;
                padding-bottom: 50px;    
            }
        `}</style>
        <section id="newsInds" data-ga-impression={`Subscriber Homepage#Industry widget impression#`} >
            <div className="heading_box">
                <a href="/industry" target="_blank" className="secname">
                    News by <span className="sec_heading">Industry</span>
                </a>
                <span className="semi_oval"></span>
                <a className="curr_secname font_faus" target="_blank" href={selectedObj?.link}>{selectedObj?.tabName}</a>
            </div>
            <div className="news_menu tabsView tabVertical">
                <ul className="tabs">
                    {
                        IndustryTabsJSON?.map((value: any, key: any) => {
                            return (                                
                                <li className={`tabLi ${showTab == value?.msid ? 'active' : ''}`} data-msid={value?.msid} data-href={value?.link} onClick={() => articleListApiHit(value?.msid)} key={key}>
                                    <span data-msid={value?.msid} className="subSprite tabIcon"></span>
                                    <span>{value?.tabName}</span>
                                    <span className="subSprite nav_arw"></span>
                                </li>                                
                            )    
                        })
                    }
                </ul>
                <div className="stories_sec content tabsContent">
                    <ul className="font_faus">
                        {
                            showLoading ? <li className="loadingLiWrp"><Loading /></li> : articleData?.map((value, key) => {
                                return (
                                    <Fragment key={key}>
                                         {articleHtml(value.articleList, value.msid)} 
                                    </Fragment>
                                )
                            })
                        }    
                    </ul>
                </div>
            </div>
        </section>
    </>
  )
}

export default NewsByIndustry;
