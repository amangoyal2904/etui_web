import { FC } from "react";
import DynamicFooter from "components/DynamicFooter";

const Footer: FC<{ dynamicFooterData: any, page: any }> = ({dynamicFooterData, page }) => {
  return (
    <>
      <footer id="webFooter">
        <DynamicFooter dynamicFooterData={dynamicFooterData} page={page} />
      </footer>
    </>
  );
};

export default Footer;
