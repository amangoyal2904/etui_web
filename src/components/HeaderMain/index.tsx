import React from "react";
import HeaderLogo from "../HeaderLogo";
import HeaderNav from "../HeaderNav";
interface PageProps {
  page: string;
  subsecnames: any;
  menuData: any;
}

const HeaderMain = (props) => {
const { page, menuData, subsecnames, sectiondetail } = props;
// console.log("subsecnames", subsecnames)
  return (
    <header>
      <HeaderLogo page={page} subsecnames={subsecnames} sectiondetail={sectiondetail} />
      <HeaderNav menuData={menuData} subsecnames={subsecnames}/>
      {/* <pre>{JSON.stringify(props.menuData, null, 2)}</pre> */}
    </header>
  )
}

export default HeaderMain