
import { trackingEvent } from "utils/ga";
import styles from "./styles.module.scss";

export default function VerticalTabs({
  tabs,
  activeTab,
  setActiveTab,
  idProp,
  valueProp,
  isCenter = false,
}: any) {
  const handleOnTabClick = (value, name) => {
    setActiveTab(value);
    trackingEvent("et_push_event", {
      event_category: 'Subscriber Homepage', 
      event_action: `Market Dashboard click`, 
      event_label: name,
    });
  }
  return (
    <div className={`${styles.vtabs} ${!!isCenter ? styles.center : ""}`}>
      {tabs?.map((tab: any, i: number) => (
        <div
          key={i}
          className={
            tab[idProp] == activeTab
              ? `${styles.vtab} ${styles.active}`
              : styles.vtab
          }
          onClick={() => {
            handleOnTabClick(idProp === "key" ? tab : tab[idProp], tab[valueProp]);
          }}
          dangerouslySetInnerHTML={{ __html: tab[valueProp] }}
        ></div>
      ))}
    </div>
  );
}

