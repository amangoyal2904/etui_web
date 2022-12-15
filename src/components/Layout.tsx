// components/Layout.js
import { FC, ReactElement } from 'react';
import Footer from './Footer';
import Headers from './Head';
import Header from './Header';

interface PageProps {
  page: string;
  dynamicFooterData: any;
  children: ReactElement;
}

const Layout:FC<PageProps> = ({ page, dynamicFooterData, children }) => {  
  return (
      <>
      <Headers />  
      <Header />
      <div className='layout'>
        {children}
      </div>
      <Footer dynamicFooterData={dynamicFooterData} />
      </>
    );
}

export default Layout;