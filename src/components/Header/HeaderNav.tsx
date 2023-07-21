'use client';

import Link from "next/link"
import { useState, useEffect } from "react";
import APIS_CONFIG from "network/config.json";
import Service from 'network/service';

interface MenuSecProps {
    title: string;
    logo?: string;
    msid?: number;
    url?: string;
    sec?: MenuSecProps[];
  }
  interface MenuProps {
    logo: string;
    sec: MenuSecProps[];
  }

const HeaderNav = () => {
    const [subNavData, setSubNavData] = useState([]);
    const [activeNav, setActiveNav] = useState('home');

    const handleNavClick = (subNav, eleTitle) => {
        setActiveNav(eleTitle || 'home');
        setSubNavData(subNav || []);
        console.log(this);
    }

    let [data, setData]:any = useState({});
    useEffect(() => {
        // let url = APIS_CONFIG.REQUEST;
        //     let params = {
        //         type: "menu",
        //     };
        //     Service.get(url, params)
        //     .then(res => {
        //         setData(res.data || {});
        //         console.log(res.data,"Data");
        //     })
    }, []);

    return (
        <div>
            <div className="nav_block clr" id="topnavBlk">
                <nav id="topnav" className="level2 contentwrapper">
                    <div className="sections" id="sideMenu">
                        <span className="menuIcon cSprite"/>
                        <nav id="sideBarNav" className="ddNav"/>
                    </div>
                    <div>
                        <Link href="/" className={activeNav == "home" ? 'current': ""} >Home</Link>
                    </div>
                    {data && data.searchResult && data.searchResult[0] && data.searchResult[0]?.sec?.map((ele,i) =>  {
                        if (i<15) {
                            return (
                                <div  onClick={() => handleNavClick(ele?.sec, ele?.title)} key={ele.title}>
                                    <Link href="/" className={activeNav == ele.title ? 'current': null}>{ele.title}</Link>
                                </div>
                            )
                        }
                    })}
                    <div>
                        <Link href="/">                            
                                More
                                <span className="downArw"></span>                            
                        </Link>
                    </div>
                    <div id="searchBar" className="flr sections"><span className="searchIcon cSprite"></span></div>
                </nav>
            </div>
            <div className="sbnv_wrapper w1">
                <nav id="subnav" className="clr contentwrapper">
                    {subNavData?.length && subNavData?.map((ele,i) =>  {
                        if (i<12) {
                            return (
                                <div key={`ele_${i}`}>
                                    <Link href="/" key={ele.title}>
                                        {ele.title}
                                    </Link>
                                </div>
                            )
                        }
                    })}
                </nav>
            </div>
        </div>
    )
}

export default HeaderNav