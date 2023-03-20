import React, { useState, MouseEvent } from 'react';
import styles from "./styles.module.scss";

// Define the type for the props passed to CommoditiesNav component
interface CommoditiesNavProps {
  sec: {
    nm: string;
    link: string;
  }[];
}

const CommoditiesNav: React.FC<CommoditiesNavProps> = ({ sec }) => {
  return (
    <div className={`${styles.miniMenu} ${styles.comnav}`}>

    </div>
  );
};

export default CommoditiesNav;