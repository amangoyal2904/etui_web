import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next'
import Headers from './../components/Head';
import HeaderMain from './../components/HeaderMain';
import Scripts from './../components/Scripts';
import Footer from './../components/Footer';
import BreadCrumb from "components/BreadCrumb";
import DfpAds from './../components/Ad/DfpAds';
 
export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}