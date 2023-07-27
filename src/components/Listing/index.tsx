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
                  <div>
                    <a href={item.url}>                    
                      <img src={item.img} alt={item.title} width={80} height={60} />
                    </a>
                    <span className={styles.duration}>{item.duration }</span>
                  </div>
                  <div>
                      <a href={item.url}>{item.title}</a>
                      <span className={styles.views}>Views: {item.views}</span>                   
                  </div>
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
