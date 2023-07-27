import React from "react";
import styles from "./styles.module.scss";
import { FC } from 'react';

const GreyDivider:FC = () => {
  return <div className={styles.divider} data-testid="divider"></div>;
}

export default GreyDivider;