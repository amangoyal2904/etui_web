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
const {headerText} = commonMeta;
 console.log("commonMeta", commonMeta, headerText)
  return (
    <header>
      <HeaderLogo page={page} headertext={headerText} subsecnames={subsecnames} sectiondetail={sectiondetail} />
      <HeaderNav menuData={menuData} subsecnames={subsecnames}/>
      {/* <pre>{JSON.stringify(props.menuData, null, 2)}</pre> */}
    </header>
  )
}

export default HeaderMain