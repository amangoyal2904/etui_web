// components/Layout.js
import { FC, ReactElement } from 'react';
import Headers from './Head';
import Header from './Header';

interface PageProps {
  page: string;
  dynamicFooterData: any;
  menuData: any;
  children: ReactElement;
}

const Layout:FC<PageProps> = ({ page, dynamicFooterData, menuData, children }) => {  
  return (
      <>
      <Headers />  
      <Header menuData={menuData} />
      <div className='layout'>
        {children}
      </div>
      </>
    );
}

export default Layout;