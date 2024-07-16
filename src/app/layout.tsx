import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next'
import { StateProvider } from "../store/StateContext";
 
export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StateProvider>
        {children}
          <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
            <div id="ssoLogin" className="ssoLoginElm" />
          </div>
        </StateProvider>
      </body>
    </html>
  );
}