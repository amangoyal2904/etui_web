import React, { ReactElement } from "react";
import styles from "./styles.module.scss";

interface Section {
  link: string;
  nm: string;
  msid: string;
  sec?: Section[];
}

interface Element {
  secType: string;
  elm: ReactElement;
}

interface Props {
  sec: Section[];
  count: number;
  msid: string;
}

const HandleHoverSecHtml = ({ sec, count, msid }: Props): ReactElement => {
  // Define color arrays and sub-section arrays
  const colArr_4 = ["13352306", "2147477890"];
  const colArr_3 = ["1715249553"];
  const subSecArr: Element[] = [];
  const L1: ReactElement[] = [];
  const L2: ReactElement[] = [];
  const L3: ReactElement[] = [];
  const L4: ReactElement[] = [];

  // Determine the number of elements per column based on the number of sections
  let perCol: number;
  if (colArr_4.includes(msid)) {
    perCol = Math.ceil(count / 4);
  } else if (colArr_3.includes(msid)) {
    perCol = Math.ceil(count / 3);
  } else if (msid === "837555174") {
    perCol = 16;
  } else if (msid === "359241701") {
    perCol = 9;
  } else if (msid === "94909228") {
    perCol = 6;
  } else {
    perCol = Math.ceil(count / 2);
  }

  // Loop through the first level of sections
  sec.forEach((l1, index) => {
    // Add sub-section 1 element to sub-section array
    subSecArr.push({
      secType: "subsec1",
      elm: (
        <div key={`subsec1_${l1.msid}_${index}`}>
          <a href={l1.link} className={styles.subsec1}>
            {l1.nm}
          </a>
        </div>
      ),
    });

    // Loop through the second level of sections
    if (l1.sec) {
      l1.sec.forEach((l2, index) => {
        // Add sub-section 3 elements to sub-section 2 array
        const subSecArr_3: ReactElement[] = [];
        if (l2.sec) {
          l2.sec.forEach((l3, index) => {
            subSecArr_3.push(
              <div key={`subsec3_${l3.msid}_${index}`}>
                <a href={l3.link} className={styles.subsec3}>
                  {l3.nm}
                </a>
              </div>
            );
          });
        }
        // Add sub-section 2 element with sub-section 3 elements to sub-section array
        subSecArr.push({
          secType: "subsec2",
          elm: (
            <div>
              <div key={`subsec2_${l2.msid}_${index}`}>
                <a href={l2.link} className={styles.subsec2}>
                  {l2.nm}
                </a>
              </div>
              {subSecArr_3}
            </div>
          ),
        });
      });
    }
  });

  // Initialize the flags to indicate which column the section belongs to
  let isL1 = 0;
  let isL2 = 0;
  let isL3 = 0;

  // Loop through the sub-section array and populate the lists based on their types
  subSecArr.forEach((sec, index) => {

    if (index < perCol) {
      L1.push(sec.elm);
    } else if ((index >= perCol) && index < (perCol * 2)) {
      if (sec.secType == "subsec1") {
        isL1 = 1;
      }
      if (isL1 == 0) {
        L1.push(sec.elm);
      } else {
        L2.push(sec.elm);
      }
    } else if ((index >= (perCol * 2)) && index < (perCol * 3)) {
      if (sec.secType == "subsec1") {
        isL2 = 1;
      }
      if (isL2 == 0) {
        L2.push(sec.elm);
      } else {
        L3.push(sec.elm);
      }
    } else {
      if (sec.secType == "subsec1") {
        isL3 = 1;
      }
      if (isL3 == 0) {
        L3.push(sec.elm);
      } else {
        L4.push(sec.elm);
      }
    }
  });

  return (
    <>
      <div className={styles.flt}>{L1}</div>
      <div className={styles.flt}>{L2}</div>
      {((msid == "359241701") || (msid == "13352306") || (msid == "2147477890") || (msid == "837555174") || (msid == "1715249553")) && <div className={styles.flt}>{L3}</div>}
      {((msid == "13352306") || (msid == "2147477890") || (msid == "837555174") || (msid == "1715249553")) && <div className={styles.flt}>{L4}</div>}
      <div className="clr"></div>
    </>
  )

} 

export default HandleHoverSecHtml;
