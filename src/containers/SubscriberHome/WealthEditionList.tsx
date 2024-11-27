import React, { useEffect, useState } from 'react'
import HeadingWithRightArrow from './HeadingWithRightArrow';
import Separator from 'components/Separator';
import { ET_IMG_DOMAIN } from "utils/common";
import useEmblaCarousel from 'embla-carousel-react';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/CarouselArrowBtn'

const WealthEditionList = () => {
    const [wealthEditionList, setWealthEditionList] = useState<any>([]);
    const OPTIONS = {loop: true}
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const wealthEditionListApi = async () => {
        const apilink = `https://etdev8243.indiatimes.com/wealtheditionlist_api.cms?feedtype=etjson`;
    
        try {
            const response = await fetch(apilink);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWealthEditionList(data);
            // Handle the data as needed
            console.log("wealthEditionList--", data);
        } catch (error) {
            // Handle the error
            console.error('Fetch error:', error);
        }
        // ... existing code ...
    }

    useEffect(() => {
        wealthEditionListApi();
    }, []);
  return (
    <>
        <div className='wealthedition_list'>
            <Separator />
            <span className='title'></span>
            <HeadingWithRightArrow title={`Wealth Edition`} href="https://epaper.indiatimes.com/wealth_edition.cms"/>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} color={'white'} widget={`wealthEidtion`}  />
            <div ref={emblaRef} className={`embla wdListWrp `}>
                <ul className={`embla__container`}>
                    {
                        wealthEditionList?.map((value, index) => {
                            return (
                                <li  className={`embla__slide wdWrp`} key={`wealthEditionList_${index}`}>
                                    <a className='wdInfoWrp' target="_blank" href={`https://epaper.indiatimes.com/${value.seopath}/wealth_editionshow/${value.msid}.cms`}>
                                        <div className='editionHeading'>{index == 0 ? 'Latest Edition:' : 'Previous Edition:'}</div>
                                        <div className='editionDate'>{value?.editionDate}</div>
                                        <div className='editionImg'>
                                            <img width={`100%`}  src={`${ET_IMG_DOMAIN}thumb/msid-${value.msid},width-187,height-251/a.jpg`} />
                                        </div>
                                        <div className='editionTitle'>{value?.title}</div>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} color={'white'} widget={`wealthEidtion`}   />
        </div>
        <style jsx>{`
            .wealthedition_list{
                padding-left: 20px;
                border-left: 1px dotted #9b8680;
                position: relative;
                margin-top: -13px;
                padding-bottom: 25px;

                .title {
                    border-bottom: 1px solid#9b8680;
                    font-size: 20px;
                    font-weight: 800;
                    padding-bottom: 7px;
                    padding-top: 15px;
                    text-transform: uppercase;

                    &:before {
                    content: "";
                    left: -7px;
                    top: 22px;
                    position: absolute;
                    width: 16px;
                    height: 17px;
                    background: url("https://img.etimg.com/photo/109967743.cms");              
                    background-size: 500px;
                    background-position: -395px -135px;
                    }
                }


                .wdListWrp{
                    margin-top: 18px;
                }

                .wdWrp{
                    padding-left: 13px;
                    transform: translate3d(0, 0, 0);
                    flex: 0 0 243px;
                    min-width: 0;
                    list-style: none;
                    display: flex;
                    gap: 13px;

                    .wdInfoWrp{
                        border: 1px solid #C99F8E;
                        padding: 10px 14px 15px 14px;
                        gap: 13px;
                        border-radius: 9.31px;
                        background: #FFFFFF;
                        max-width: 230px;
                        // display: block;
                    }


                    .editionHeading{
                        font-weight: 400;
                        font-size: 16px;
                    }

                    .editionDate{
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 5px;
                    }

                    .editionTitle{
                        font-size: 12px;
                        font-weight: 700;
                        line-height: 14.63px;
                        margin-top: 10px;
                    }


                    .editionImg{
                        background: linear-gradient(180deg, #EEFBE9 0%, #EEFBE9 53%, #F8F1C4 100%);
                        padding: 10px 7.45px 10px 7.45px;
                        margin-bottom: 10px;
                    }
                }
            }
        `}</style>
    </>
  )
}

export default WealthEditionList