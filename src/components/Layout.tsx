// components/Layout.js
import { FC, ReactElement } from 'react';
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
      </div>
    );
}

export default Layout;