import { Fragment, useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface BreadCrumbProps {
  data: { title: string; url?: string }[];
}

export default function BreadCrumb({ data }: BreadCrumbProps) {
  const [isPrime, setIsPrime] = useState(false);

  const intsCallback = () =>  {
    window?.objInts?.afterPermissionCall(() => {
      window.objInts.permissions.includes("subscribed") && setIsPrime(true);
    });
  }

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(intsCallback);
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);
  return (
    <>      
      <div className={`${styles.breadCrumb} ${isPrime ? styles.pink_theme : ""}`}>
        <div className={styles.breadCrumbWrap}>
          {data?.map((item, i) => (
            <Fragment key={i}>
              {item.url ? (
                <span>
                  <a href={item.url} itemProp="item">
                    {item.title}
                  </a>
                </span>
              ) : (
                <>{item.title}</>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
