import LiveStreamPlay from "components/LiveStreamPlay";
import React from "react";

export default function LiveStream({isDev}) {
  const APP_ENV = isDev ? "development" : "production";  
  return (
    <>
      <LiveStreamPlay APP_ENV={APP_ENV} />
    </>
  );
}
