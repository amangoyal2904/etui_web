import React, { useState, MouseEvent } from 'react';
import styles from "./styles.module.scss";

// Define the type for the props passed to TechNav component
interface TechNavProps {
  sec: {
    nm: string;
    msid: number;
    link: string;
  }[];
  count: number;
  msid: number;
}

const TechNav: React.FC<TechNavProps> = ({ sec, count, msid }) => {
  // Use the useState hook to manage the component state
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HTMLAnchorElement | null>(null);

  // Define the handleMouseOver function to handle mouseover event on the links
  const handleMouseOver = (event: MouseEvent<HTMLAnchorElement>) => {
    const targetElement = event.currentTarget;
    const activeClass = styles["active"];

    // Add active class to the hovered element
    targetElement.classList.add(activeClass);

    // Remove active class from all the siblings of the hovered element
    const siblings = targetElement.parentNode?.querySelectorAll(`.${activeClass}`);

    siblings?.forEach((sibling) => {
      if (sibling !== targetElement) {
        sibling.classList.remove(activeClass);
      }
    });

    
  };

  // Render the component
  return (
    <>
      <div className={styles.techNav1st}>
        <a
          title="Tech"
          data-ga-onclick="/tech"
          onMouseOver={(event) => handleMouseOver(event)}
          href="/tech"
          className={styles.active}
        >
          TECH
        </a>
        {/* Render the sub-section links */}
        {sec.map((seclist, index) => {
          return (
            <React.Fragment key={`tech_nav_${seclist.msid}_${index}`}>
              <a
                href={seclist.link}
                data-rel-id={seclist.msid}
                onMouseOver={(event) => handleMouseOver(event)}
                className={styles.subsec1}
              >
                {seclist.nm}
              </a>
            </React.Fragment>
          )
        })}
      </div>
      {/* Render the data elements */}
      <div className={styles.mLast}>
        <div data-rel-id="78404305"></div>
        {sec.map((seclist, index) => {
          return (
            <React.Fragment key={`tech_nav_${seclist.msid}_${index}`}>
              <div data-rel-id={seclist.msid}></div>
            </React.Fragment>
          )
        })}
      </div>
    </>
  );
}

export default TechNav;
