import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next'
import { StateProvider } from "../store/StateContext";
import PopupManager from "../components/PopupManager";
 
export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const popups = [
    'onboarding',
    'primeLoginMap',
  ];
  const interval = 1000; // 3 seconds

  return (
    <html lang="en">
      <body>
        <StateProvider>
        {children}
          <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
            <div id="ssoLogin" className="ssoLoginElm" />
          </div>
          <PopupManager popups={popups} interval={interval} />
        </StateProvider>
      </body>
    </html>
  );
}