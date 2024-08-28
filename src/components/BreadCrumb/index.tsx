import { Fragment, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useStateContext } from "../../store/StateContext";

interface BreadCrumbProps {
  data: { title: string; url?: string }[];
}

export default function BreadCrumb({ data }: BreadCrumbProps) {
  const { state, dispatch } = useStateContext();
  const { isPrime, isPink } = state.login;
  
  return (
    <>      
      <div className={`${styles.breadCrumb} ${isPink ? styles.pink_theme : ""}`} >
        <div className={styles.breadCrumbWrap} itemType="https://schema.org/BreadcrumbList" itemScope>
          {data?.map((item, i) => (
            <Fragment key={i}>
              {item.url ? (
                <span itemType="https://schema.org/ListItem" itemScope itemProp="itemListElement">
                  <meta content={`${i+1}`} itemProp="position" />
                  <a href={item.url} itemProp="item">
                    <meta content={item.title} itemProp="name" />
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
