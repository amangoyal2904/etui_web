import React from 'react';
import GLOBAL_CONFIG from "../../network/global_config.json";

const discoverList = [
    {
        link: "/mutual-fund-screener",
        iconClass: "icon_1",
        text: "All Mutual Funds"
    },
    {
        link: "/mutual-fund-screener/top-tax-saver-funds",
        iconClass: "icon_2",
        text: "Top Tax Saving Mutual Funds"
    },
    {
        link: "/mutual-fund-screener/better-than-fixed-deposits",
        iconClass: "icon_3",
        text: "Better Than Fixed Deposits"
    },
    {
        link: "/mutual-fund-screener/low-cost-high-return",
        iconClass: "icon_4",
        text: "Low Cost High Return Funds"
    },
    {
        link: "/mutual-fund-screener/best-hybrid-funds",
        iconClass: "icon_5",
        text: "Best Hybrid Funds"
    },
    {
        link: "/mutual-fund-screener/best-large-cap-funds",
        iconClass: "icon_6",
        text: "Best Large Cap Funds"
    },
    {
        link: "/mutual-fund-screener/top-performing-mid-cap-funds",
        iconClass: "icon_8",
        text: "Top Performing Mid Caps"
    },
    {
        link: "/mutual-fund-screener/promising-multi-cap-funds",
        iconClass: "icon_9",
        text: "Promising Multi Cap Funds"
    },
    {
        link: "/mutual-fund-screener/top-rated-funds",
        iconClass: "icon_10",
        text: "Top Rated Funds"
    }

]

const TopMFDiscover = ({isDev}) => {
    const etDomain = GLOBAL_CONFIG[isDev ? "development" : "production"]["ET_WEB_URL"];

  return (
    <>
        <div className="mf_screener_widget">
            <div className="discover_mftitle sm_arrow">Discover Mutual Funds</div>
            <ul className='mfWidgetWrap'>
                {
                    discoverList.map((value, index) => {
                        return (
                            <li className="item" key={`mf_screener_widget_${index}`}>
                                <a 
                                    target="_blank" 
                                    rel="sponsored" 
                                    href={`${etDomain}${value.link}`}
                                    data-ga-onclick={`Subscriber Homepage#Mutual Funds widget click#Discover Mutual Funds - ${value.text}`}
                                >
                                    <div className="icon">
                                        <i className={`subSprite ${value.iconClass}`}></i>
                                    </div>
                                    <p className="txt">{value.text}</p>
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>

        <style jsx>{`
            .mf_screener_widget{
                margin: 2px 0 0;
                padding-top: 12px;

                .subSprite{
                    background: url("https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg") no-repeat;
                    display: inline-block;
                    background-size: 475px;
                    width: 56px;
                    height: 55px;
                }

                .icon_1 {
                    background-position: -10px -72px;
                }

                .icon_2 {
                    background-position: -82px -72px;
                }

                .icon_3 {
                    background-position: -151px -72px;
                }

                .icon_4 {
                    background-position: -228px -72px;
                }

                .icon_5 {
                    background-position: -306px -72px;
                }

                .icon_6 {
                    background-position: -154px -146px;
                }

                .icon_7 {
                    background-position: -233px -146px;
                }

                .icon_8 {
                    background-position: -304px -147px;
                }

                .icon_9 {
                    background-position: -12px -148px;
                }

                .icon_10 {
                    background-position: -79px -146px;
                }   
                    
                .txt {
                    font-size: 10px;
                    margin-top: 11px;
                }

                .discover_mftitle {
                    font-size: 18px;
                    margin-bottom: 8px;
                    font-weight: 700;

                    &.sm_arrow:after{
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

                .mfWidgetWrap{
                    display: flex;
                    justify-content: space-between;

                    .item{
                        list-style: none;
                        padding: 14px 15px 9px;
                        border: solid 1px #ddc2bb;
                        background-color: #fff6f2;
                        box-sizing: border-box;
                        vertical-align: top;
                        width: 115px;
                        height: 115px;
                        text-align: center;
                    }
                }
            }
        `}</style>
    </>
  )
}

export default TopMFDiscover