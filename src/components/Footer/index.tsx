import { FC } from "react";
import DynamicFooter from "components/DynamicFooter";

const Footer: FC<{ dynamicFooterData: any }> = ({ dynamicFooterData }) => {
  return (
    <>
      <footer id="webFooter">
        <DynamicFooter dynamicFooterData={dynamicFooterData} />
      </footer>
    </>
  );
};

export default Footer;
