// components/Layout.js
import { FC, ReactElement } from 'react';
import Footer from './Footer';
import Headers from './Head';
import Header from './Header';
import { useRouter } from "next/router";

interface PageProps {
  page: string;
  dynamicFooterData: any;
  menuData: any;
  children: ReactElement;
  isprimeuser:any
}

const Layout:FC<PageProps> = ({ page, dynamicFooterData, menuData, children }) => {  
  const { props } = children;
  const { objVc, isprimeuser, data } = props;

  const router = useRouter();
  const reqData = router.query;

  return (
      <div className={isprimeuser ? "primeLayout" : "freeLayout"}>
      <Headers />  
      <Header page={page} menuData={menuData} subsecnames={data.seo.subsecnames} />
      <div className='layout'>
        {children}
      </div>
      <Footer dynamicFooterData={dynamicFooterData} />
      </div>
    );
}

export default Layout;