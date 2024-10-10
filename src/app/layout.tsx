import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next';
import { StateProvider } from "../store/StateContext";
import dynamic from "next/dynamic";
import React from 'react';
import StyledJsxRegistry from "./registry";
import { Toaster } from "react-hot-toast";

const DynamicPopupManager = dynamic(() => import('../components/PopupManager'), {
  ssr: true,
});

export const metadata: Metadata = {
  title: 'Home',
  description: '',
  icons: {
    icon: "/icons/etfavicon.ico",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
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
