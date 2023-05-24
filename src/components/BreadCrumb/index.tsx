import { Fragment } from "react";
import styles from "./styles.module.scss";

interface BreadCrumbProps {
  data: { title: string; url?: string }[];
}

export default function BreadCrumb({ data }: BreadCrumbProps) {
  return (
    <>      
      <div className={styles.breadCrumb}>
        {data.map((item, i) => (
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
    </>
  );
}
