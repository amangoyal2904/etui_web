import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../../../components/CarouselArrowBtn';
import { DotButton, useDotButton } from '../../../components/CarouselDotBtn';
import SchemesSlide from './SchemesSlide';
import Service from "../../../network/service";

const TopMF = () => {
    const OPTIONS = { loop: false, dragFree: false, watchDrag: false };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: false
    });

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi);

    const [tabList, setTabList] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<any>({});
    const [topMFSchemes, setTopMFScheme] = useState<any>([]);
    const [selectedYear, setSelectedYear] = useState("r3Year");
    const [childEmbla, setChildEmbla] = useState<any>("");

    const fetchTabs = useCallback(async () => {
        try{
            const res = await Service.get({
                url: `https://etmarketsapis.indiatimes.com/ET_MfScreeners/getCategoryList`,
                params: {},
            });
            const response = res?.data || [];
            setTabList(response);

        }catch(error){
            console.error('Error fetching top MF schemes:', error);
        }
        // const apiLink = `https://etmarketsapis.indiatimes.com/ET_MfScreeners/getCategoryList`;
        // fetch(apiLink)
        //     .then((response) => response.json())
        //     .then(setTabList)
        //     .catch(console.error);
    }, [tabList]);

    const fetchTopMfApi = useCallback(async (primaryObj, secondaryObj) => {
        try {
            const existingPrimaryObj:any = topMFSchemes.find((item:any) => item?.primaryObj === primaryObj);
            const checkExistingPrimaryObj:any = topMFSchemes.some((item:any) => item?.primaryObj === primaryObj);
            const existingScheme = existingPrimaryObj?.schemeData?.some((item) => item.secondaryObj === secondaryObj);

            //console.log("selectedSlideName", selectedTab, primaryObj, secondaryObj)

            if (!checkExistingPrimaryObj || !existingScheme) {
                setTopMFScheme((prev) => [
                    ...prev.filter((item) => item.primaryObj !== primaryObj),
                    {
                        primaryObj,
                        schemeData: existingPrimaryObj
                            ? [...existingPrimaryObj.schemeData, { secondaryObj, status: 'loading', response: [] }]
                            : [{ secondaryObj, status: 'loading', response: [] }]
                    },
                ]);
                const res = await Service.get({
                    url: `https://etdev8243.indiatimes.com/topmf_schemesjson.cms`,
                    params: { feedtype: "etjson", primaryObj, secondaryObj, year: selectedYear },
                });
                const response = res?.data || [];

                setTopMFScheme((prev) => [
                    ...prev.filter((item) => item.primaryObj !== primaryObj),
                    {
                        primaryObj,
                        schemeData: existingPrimaryObj
                            ? [...existingPrimaryObj.schemeData, { secondaryObj, status: 'success', response: [response] }]
                            : [{ secondaryObj, status: 'success', response: [response] }]
                    },
                ]);

                //console.log("selectedSlideName 23", topMFSchemes)
            }
        } catch (error) {
            console.error('Error fetching top MF schemes:', error);
        }
    }, [topMFSchemes, selectedYear]);

    useEffect(() => {
        fetchTabs();
    }, []);

    const selectedTabClick = (primaryObj, secondaryObj) => {

        if(typeof primaryObj != 'undefined' && typeof secondaryObj != 'undefined'){
            //console.log("selectedSlideName 2", primaryObj, secondaryObj, topMFSchemes)
            setSelectedTab({ primaryObj, secondaryObj });
        }
        
    }

    useEffect(() => {
        const primaryCat = (tabList as any)[0]?.primaryObj?.value;
        if (primaryCat) {
            selectedTabClick(primaryCat, tabList[0]?.primaryObj?.secondaryObj?.[0]?.value);
        }
    }, [tabList]);

    useEffect(() => {

        if(typeof selectedTab.primaryObj != 'undefined' && typeof selectedTab.secondaryObj != 'undefined'){
            //console.log("selectedSlideName 3", selectedTab);
            fetchTopMfApi(selectedTab.primaryObj, selectedTab.secondaryObj);
        }
        
    }, [selectedTab, fetchTopMfApi]);

    const getSecObj = useCallback((secObj) => secObj.slice(0, 6).map((item) => item.value).join(','), []);

    const onThumbClick = useCallback((index, primaryObj) => {
        const selectedSubSlide = document.querySelector(`.tmf_cat_wrap[data-cat="${primaryObj}"] .embla__slide--selected`);
        const selectedSubSlideName = selectedSubSlide?.getAttribute('data-type')
        // setSelectedTab(primaryObj, selectedSubSlideName);
        selectedTabClick(primaryObj, selectedSubSlideName);
        if (emblaApi && emblaThumbsApi) emblaApi.scrollTo(index);
    }, [emblaApi, emblaThumbsApi]);

    return (
        <section className="top_mf_wdgt">
            <div className="tmf_head">
                <h3>Top Mutual Funds</h3>
            </div>
            <div className="tmf_tabs">
                <ul ref={emblaThumbsRef} className="tmf_cat">
                    {tabList.map((value, index) => (
                        <li
                            key={index}
                            className={selectedTab?.primaryObj === value?.primaryObj.value ? 'active' : ''}
                            data-scat={getSecObj(value.primaryObj.secondaryObj)}
                            data-cat={value.primaryObj.value}
                            onClick={() => onThumbClick(index, value.primaryObj.value)}
                        >
                            {value.primaryObj.value}
                        </li>
                    ))}
                    <li data-scat="Featured" className={selectedTab?.primaryObj === "promotedFeatured" ? 'active' : ''} data-cat="promotedFeatured" onClick={() => onThumbClick(tabList.length, "promotedFeatured")}>Featured</li>
                </ul>
                <div className="tmf_drn_wrap">
                    <label htmlFor="tmf_duration">Return<br/> Duration:</label>
                    <select
                        id="tmf_duration"
                        value={selectedYear}
                        onChange={(e) => {
                            setTopMFScheme([])
                            setSelectedYear(e.target.value)
                        }}
                    >
                        <option disabled>Select Duration</option>
                        <option value="r1Month">1M</option>
                        <option value="r3Month">3M</option>
                        <option value="r6Month">6M</option>
                        <option value="r1Year">1Y</option>
                        <option value="r3Year">3Y</option>
                        <option value="r5Year">5Y</option>
                        <option value="sinceLaunch">Max</option>
                    </select>
                </div>
            </div>
            <div ref={emblaRef} className="tmf_scheme_wrap embla">
                <div className="embla__container">
                    {tabList.map((value, index) => (
                        <div className="embla__slide" key={`tmf_scheme_wrap_${index}`}>
                            <SchemesSlide
                                keyIndex={index}
                                selectedTab={selectedTab}
                                selectedTabClick={selectedTabClick}
                                primaryName={value.primaryObj.value}
                                secondaryObj={value.primaryObj.secondaryObj.slice(0, 6)}
                                topMFSchemes={topMFSchemes}
                                selectedYear={selectedYear}
                                mainEmblaApi={emblaApi}
                                primaryIndex={index}
                                setChildEmbla={setChildEmbla}
                            />
                        </div>
                    ))}

                    <div className="embla__slide" key={`tmf_scheme_wrap_${tabList.length}`}>
                        <SchemesSlide
                            keyIndex={tabList.length}
                            selectedTab={selectedTab}
                            selectedTabClick={selectedTabClick}
                            primaryName={`promotedFeatured`}
                            secondaryObj={[{
                                rank: 1,
                                value: "Featured"
                                }]}
                            topMFSchemes={topMFSchemes}
                            selectedYear={selectedYear}
                            mainEmblaApi={emblaApi}
                            primaryIndex={tabList.length}
                            setChildEmbla={setChildEmbla}
                        />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .top_mf_wdgt {
                    width: 540px;
                    box-sizing: border-box;

                    .tmf_head {
                        height: 25px;
                        position: relative;
                        line-height: 34px;

                        h3{
                            font-size: 20px;
                            width: 74%;
                            display: inline-block;
                            vertical-align: top;
                            font-weight: 700;
                            line-height: 22px;

                            &:after{
                                content: '';
                                display: inline-block;
                                width: 7px;
                                height: 7px;
                                top: -1px;
                                left: 2px;
                                border-top: 2px solid #ed193b;
                                border-left: 2px solid #ed193b;
                                position: relative;
                                cursor: pointer;
                                transform: rotate(135deg);
                            }
                        }
                    }

                    .tmf_tabs {
                        margin: 6px 0 10px;
                        display: flex;
                        justify-content: space-between;

                        .tmf_cat{
                            list-style:none;
                            display: flex;
                            align-items: center;
                            width: 75%;
                            justify-content: space-between;

                            li{
                                padding: 3px 8px;
                                font-size: 11px;
                                border: solid 1px #183651;
                                border-radius: 4px;
                                background-color: #fff6f2;
                                cursor: pointer;

                                &.active {
                                    background-color: #183651;
                                    color: #fff;
                                }
                            }
                        }

                        .tmf_drn_wrap{
                            label{
                                font-size: 11px;
                                font-weight: bold;
                                color: #4a4a4a;
                                line-height: 13px;
                                vertical-align: top;
                                display: inline-block;
                            }

                            select {
                                width: 55px;
                                height: 23.7px;
                                border-radius: 2px;
                                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.19);
                                border: 1px solid #9b9b9b;
                                vertical-align: top;
                                margin-left: 7px;
                                background-color: #fff6f2;
                            }
                        }
                    }

                    .tmf_scheme_wrap{
                        .tmf_cat_wrap{
                            
                        }
                    }
                    
                }
            `}</style>
        </section>
    );
};

export default React.memo(TopMF);
