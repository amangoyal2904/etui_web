import { notFound } from "next/navigation";
import RenderInterstitialAds from "./clients";
import { cookies, headers } from "next/headers"
import Script from "next/script";



const Interstitial = async ({ params }: any) => {
  let value = true ;  

  return (
    <>
    <head>
      <title>Interstitial Ad</title>
     <Script
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js?network-code=7176"
        />
      </head>  
    <RenderInterstitialAds userType={value} />
    </>
  );
};

export {  Interstitial as default };
