"use client";
import { trackingEvent } from "utils/ga";
import styles from "./ViewAll.module.scss";
import RightArrow from 'components/Icons/RightArrow'

const ViewAllLink = (props: any) => {
  const { text, link } = props || {};
  const fireTracking = () => {
    trackingEvent("et_push_event", {
      event_category: 'Subscriber Homepage', 
      event_action: `View All click`, 
      event_label: text,
    });
  }
  return (
    <div className={styles.moreWrap}>
      <a
        className={styles.more}
        href={link}
        target="_blank"
        onClick={fireTracking}
      >
        {text}
        <RightArrow />
      </a>
    </div>
  );
};
export default ViewAllLink;
