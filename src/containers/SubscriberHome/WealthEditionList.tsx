//@ts-nocheck

import React, { useEffect, useState, useRef } from 'react'
import HeadingWithRightArrow from './HeadingWithRightArrow';
import Separator from 'components/Separator';
import { ET_IMG_DOMAIN } from "utils/common";

const WealthEditionList = () => {
    const [wealthEditionList, setWealthEditionList] = useState<any>([]);
    const sliderRef = useRef(null);
    const innerRef = useRef(null);
    const [x, setX] = useState(0);
    const [isPrevDisabled, setPrevDisabled] = useState(true);
    const [isNextDisabled, setNextDisabled] = useState(false);

    function onNextPrevButtonClick(type) {  
        let scrollBy = 250; 
        if(innerRef.current && sliderRef.current) {       
          const viewportWidth = sliderRef.current.offsetWidth;
          const innerWidth = innerRef.current.offsetWidth;          
    
          const scrollableWidth = innerWidth - viewportWidth;          
          let scrollAmount = 0;
    
          if(type == "next"){
            let remaingScrollableWidth = scrollableWidth + x;
    
            if(remaingScrollableWidth < scrollBy) {
              scrollBy = remaingScrollableWidth;
            }
          }
    
          if(type == "prev") {
            if(-x < scrollBy) {
              scrollBy = -x;
            }
          }
          
          // debugger
          if(type === "prev") {
            scrollAmount = x + scrollBy;
            setX(scrollAmount);
          } else {
            scrollAmount = x - scrollBy;
            setX(scrollAmount);
          }          
    
          if(scrollAmount < 0) {
            setPrevDisabled(false);
          } else {
            setPrevDisabled(true);
          }
    
          // debugger;
          if(-scrollAmount + viewportWidth == innerWidth) {
            setNextDisabled(true);
          } else {
            setNextDisabled(false);
          }
    
        }
      }

    useEffect(() => {
        if(innerRef.current) {
          innerRef.current.style.transform = `translate3d(${x}px, 0px, 0px)`;      
          innerRef.current.style.transition = `transform 0.5s ease 0s`;
        }
    }, [x]);

    const wealthEditionListApi = async () => {
        const apilink = `https://${window.isDev ? 'etdev8243' : 'economictimes'}.indiatimes.com/wealtheditionlist_api.cms?feedtype=etjson`;
    
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
            <div ref={sliderRef} className={`slider wdListWrp `}>
                <ul ref={innerRef} className={`itemWrap`}>
                    {
                        wealthEditionList?.map((value, index) => {
                            return (
                                <li  className={`wdWrp`} key={`wealthEditionList_${index}`}>
                                    <a className='wdInfoWrp' target="_blank" href={`https://epaper.indiatimes.com/${value.seopath}/wealth_editionshow/${value.msid}.cms`}>
                                        <div className='editionHeading'>{index == 0 ? 'Latest Edition:' : 'Previous Edition:'}</div>
                                        <div className='editionDate'>{value?.editionDate}</div>
                                        <div className='editionImg'>
                                            <img width={`100%`}  src={`${ET_IMG_DOMAIN}thumb/msid-${value.msid},width-187,height-251/a.jpg`} loading="lazy"  />
                                        </div>
                                        <div className='editionTitle'>{value?.title}</div>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <span className={`prev arr ${isPrevDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("prev")}></span>
            <span className={`next arr ${isNextDisabled ? 'disabled' : ''}`} onClick={() => onNextPrevButtonClick("next")}></span>
        </div>
        <style jsx>{`
            .wealthedition_list{
                padding-left: 20px;
                border-left: 1px dotted #9b8680;
                position: relative;
                margin-top: -13px;
                padding-bottom: 25px;

                .slider {
                    overflow: hidden;
                    margin-top: 10px;
                    min-height: 400px;
                }

                .itemWrap {
                    display: inline-flex;
                    gap: 13px;
                }

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

                .arr {
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    background: #DA4617CC;
                    border-radius: 50%;
                    position: absolute;            
                    cursor: pointer;
                    pointer-events: all;
                    top: calc(50% + 18px);   

                    &.disabled {
                        opacity: 0.4;              
                        cursor: no-drop;
                        pointer-events: none;
                    }

                    &:after {
                        content: '';
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        border-top: 1px solid #fff;
                        border-left: 1px solid #fff;
                        transform: rotate(-45deg);
                        position: absolute;                        
                        left: 7px;
                        top: 6px;                        
                    }

                    &.prev {
                        left: 3px;                    
                    }

                    &.next {
                        right: -7px;                    
                        transform: rotate(180deg);
                    }
                }

                .wdWrp{                    
                    transform: translate3d(0, 0, 0);                    
                    min-width: 0;
                    list-style: none;
                    display: flex;
                    gap: 13px;
                    width: 243px;

                    .wdInfoWrp{
                        border: 1px solid #C99F8E;
                        padding: 10px 14px 15px 14px;
                        gap: 13px;
                        border-radius: 9.31px;
                        background: #FFFFFF;
                        max-width: 230px;                        
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