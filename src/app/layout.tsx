import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next';
// import type { Viewport } from 'next'
import { StateProvider } from "../store/StateContext";
import dynamic from "next/dynamic";
import React from 'react';
import StyledJsxRegistry from "./registry";
import { Toaster } from "react-hot-toast";
import { headers, cookies } from "next/headers";
import { ET_WEB_URL } from "utils/common";

const DynamicPopupManager = dynamic(() => import('../components/PopupManager'), {
  ssr: true,
});

export const metadata: Metadata = {
  title: 'Home',
  description: '',
  icons: {
    icon: `${ET_WEB_URL}/icons/etfavicon.ico`,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const isDefaultPrime = pageUrl?.includes("/default_prime.cms");

  console.log("Current URL:", pageUrl); // Log the current URL (for debugging)
  return (
    <html lang="en" className={`${isDefaultPrime ? 'pg_hide' : ''}`}>
      <body className={`${isDefaultPrime ? 'isprimeuser' : ''}`}>
        <StateProvider>
          <StyledJsxRegistry>{children}</StyledJsxRegistry>
          <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
            <div id="ssoLogin" className="ssoLoginElm" />
          </div>
          <DynamicPopupManager />
          <Toaster position="bottom-right" reverseOrder={false} />
        </StateProvider>
      </body>
    </html>
  );
}

//viewport to not make responsive
export const viewport = {
  width: "device-width",
  initialScale: 1
}