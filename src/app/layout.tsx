import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="ssoLoginWrap hide">
            <div id="ssoLogin" className="ssoLoginElm"/>
        </div>
      </body>
    </html>
  );
}