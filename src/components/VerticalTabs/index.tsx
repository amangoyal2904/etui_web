
import styles from "./styles.module.scss";

export default function VerticalTabs({
  tabs,
  activeTab,
  setActiveTab,
  idProp,
  valueProp,
  isCenter = false,
}: any) {
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
            setActiveTab(idProp === "key" ? tab : tab[idProp]);
          }}
          dangerouslySetInnerHTML={{ __html: tab[valueProp] }}
        ></div>
      ))}
    </div>
  );
}

