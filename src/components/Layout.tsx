// components/Layout.js
import { FC, ReactElement } from 'react';
import Footer from './Footer';
import Headers from './Head';
import Header from './Header';

interface PageProps {
  page: string;
  dynamicFooterData: any;
  children: ReactElement;
  isprimeuser:any
}

const Layout:FC<PageProps> = ({ page, dynamicFooterData,isprimeuser, children }) => {  
  return (
      <div className={isprimeuser ? "primeLayout" : "freeLayout"}>
      <Headers />  
      <Header />
      <div className='layout'>
        {children}
      </div>
      <Footer dynamicFooterData={dynamicFooterData} />
      </div>
    );
}

export default Layout;