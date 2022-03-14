import Link from "next/link"
import Image from "next/image"
import useRequest from "network/service";
import { FC, useState } from "react";
import Loading from "components/Loading";

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
    const { data, isLoading, error } = useRequest<{
        searchResult: MenuProps,
        parameters: Object
      }>({
        url: "request",
        params: { type: "menu1" }
      });
      if (isLoading) return <Loading />
      if (error) return <div>Please try again!</div>
      console.log(data.searchResult[0].sec, 'Menu Data');

    return (
        <div>
            <div className="nav_block clr" id="topnavBlk">
                <nav id="topnav" className="level2 contentwrapper">
                    <div className="sections" id="sideMenu">
                        <span className="menuIcon cSprite"/>
                        <nav id="sideBarNav" className="ddNav"/>
                    </div>
                    <div>
                        <Link href="/">
                            <a className={activeNav == "home" ? 'current': ""} >Home</a>
                        </Link>
                    </div>
                    {data && data.searchResult[0] && data.searchResult[0].sec.map((ele,i) =>  {
                        if (i<15) {
                            return (
                                <div  onClick={() => handleNavClick(ele?.sec, ele?.title)} key={ele.title}>
                                    <Link href="/">
                                        <a className={activeNav == ele.title ? 'current': null}>{ele.title}</a>
                                    </Link>
                                </div>
                            )
                        }
                    })}
                    <div>
                        <Link href="/">
                            <a>
                                More
                                <span className="downArw"></span>
                            </a>
                        </Link>
                    </div>
                    <div id="searchBar" className="flr sections"><span className="searchIcon cSprite"></span></div>
                </nav>
            </div>
            <div className="sbnv_wrapper w1">
                <nav id="subnav" className="clr contentwrapper">
                    {subNavData.length && subNavData.map((ele,i) =>  {
                        if (i<12) {
                            return (
                                <div>
                                    <Link href="/" key={ele.title}>
                                        <a>{ele.title}</a>
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