import { FC } from "react";
import DynamicFooter from "components/DynamicFooter";
import StickyFooter from "components/StickyFooter";
const allPageTypes = [{page:"home", bannerType:"type3", bannerWidth : "short", hideCloseBtn:true}, 
{page:"articleShow", bannerType:"type1", bannerWidth : "short", hideCloseBtn:true},
{page:"videoshow", bannerType:"type1", bannerWidth : "short", hideCloseBtn:false, contentCmsId:"81429572"}]

function findBannerType(page) {
  const pageObject = allPageTypes.find(obj => obj.page === page);
  return pageObject;
}
const Footer = async ({dynamicFooterData, page }) => {
  const bandObj = findBannerType(page);
  return (
    <>
      <footer id="webFooter">
        <DynamicFooter dynamicFooterData={dynamicFooterData} page={page} />
        <StickyFooter bandObj={bandObj}/>
      </footer>
    </>
  );
};

export default Footer;
