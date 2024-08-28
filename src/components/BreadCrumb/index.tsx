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
      <div className={`${styles.breadCrumb} ${isPink ? styles.pink_theme : ""}`}>
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
