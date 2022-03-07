import Link from "next/link"
import Image from "next/image"
import useRequest from "network/service";
import { FC } from "react";
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
        <div className="nav_block clr" id="topnavBlk">
            <nav id="topnav" className="level2 contentwrapper">
                <div className="sections" id="sideMenu">
                    <span className="menuIcon cSprite"/>
                    <nav id="sideBarNav" className="ddNav"/>
                </div>
                <div>
                    <Link href="/">
                        <a className="current">Home</a>
                    </Link>
                </div>
                {data && data.searchResult[0] && data.searchResult[0].sec.map(ele =>  {return (
                    <div key={ele.title}>
                        <Link href="/">
                            <a>{ele.title}</a>
                        </Link>
                    </div>)
                })}
            </nav>
        </div>
    )
}

export default HeaderNav