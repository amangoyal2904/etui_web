import React from "react";
import HeaderLogo from "../HeaderLogo";
import HeaderNav from "../HeaderNav";
interface PageProps {
  page: string;
  subsecnames: any;
  menuData: any;
}

const HeaderMain = (props) => {
const { page, menuData, subsecnames, sectiondetail, commonMeta } = props;
const {headerText = " "} = commonMeta || {};
 //console.log("commonMeta", commonMeta, headerText)
  return (
    <header>
      {headerText && <HeaderLogo page={page} headertext={headerText} subsecnames={subsecnames} sectiondetail={sectiondetail} APP_ENV={props.APP_ENV} />}
      <HeaderNav menuData={menuData} subsecnames={subsecnames} page={page} />
      {/* <pre>{JSON.stringify(props.menuData, null, 2)}</pre> */}
    </header>
  )
}

export default HeaderMain