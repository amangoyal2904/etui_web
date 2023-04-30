// components/Layout.js
import React, {FC, ReactElement } from 'react';
import Headers from './Head';
import HeaderMain from './HeaderMain';
import { useRouter } from 'next/router';
import Scripts from './Scripts';
import '../styles/common.scss';
import { useSelector } from 'react-redux';
import Footer from './Footer';

interface Props {
  page: string;
  dynamicFooterData: any;
  menuData: any;
  children: ReactElement;
}

interface ChildProps {
  objVc: any;
  isprimeuser: any;
  data: any;
}

const Layout:FC<Props> = ({ page, dynamicFooterData, menuData, children }) => { 
  const { objVc, isprimeuser, data }: ChildProps = children.props;

  const router = useRouter();
  const reqData = router.query;

  const loginState = useSelector((state: any) => state.login);
  const isPrimeUserCls = loginState.login && loginState.isprimeuser ? 'prime_user' : '';

  if (!data?.seo?.subsecnames || !data?.seo?.sectionDetail) {
    throw new Error('Invalid data passed to Layout component');
  }

  return (
      <>
        <Headers />
        <main className={`pageHolder ${isPrimeUserCls}`}>
          <HeaderMain
            page={page}
            menuData={menuData}
            subsecnames={data.seo.subsecnames}
            sectiondetail={data.seo.sectionDetail}
          />
          <div className="layout">{children}</div>
          <Scripts objVc={objVc} isprimeuser={isprimeuser} />
        </main>
        <Footer dynamicFooterData={dynamicFooterData} />
      </>
    );
}

export default Layout;