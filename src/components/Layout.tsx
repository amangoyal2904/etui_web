// components/Layout.js
import { FC } from 'react';
import Headers from './Head';
import Header from './Header';

const Layout:FC = (props) => {
  const { children } = props;
  return (
      <>
      <Headers />  
      <Header />
      <div className='layout'>
        {children}
      </div>
      </>
    );
}

export default Layout;