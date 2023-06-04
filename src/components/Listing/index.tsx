import Link from "next/link";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import { OtherVidsProps } from "types/videoshow";

interface ListProps {
  type: string;
  title: string;
  data: OtherVidsProps | any;
}

export default function Listing({ type, title, data }: ListProps) {
  const grid = () => {
    return (
      <Fragment>
        <div className={styles.listing}>
          <h2>{title}</h2>
          <div>
            <ul>
              {data.data.map((item, index) => (
                <li key={type + index}>
                  <Link href={item.url}>                    
                      <img src={item.img} alt={item.title} width={135} height={100} />
                      <p>{item.title}</p>
                      {item.type === "videoshow" && <span className={styles.slideVidIcon}></span>}                    
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  };

  if (type === "grid") {
    return grid();
  }
}
