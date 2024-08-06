"use client";
// PopupManager.tsx
import React, { useState, useEffect, useRef } from 'react';
import Popup from '../Popup';

interface PopupManagerProps {
  popups: string[];
  interval: number;
}

const PopupManager: React.FC<PopupManagerProps> = ({ popups, interval }) => {
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (popups.length > 0) {
        console.log("popupContent 11", showPopup);
      setShowPopup(true);
      
      const showNextPopup = () => {
        setShowPopup(false);
        console.log("popupContent 12", showPopup);
        timerRef.current = setTimeout(() => {
          setCurrentPopupIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= popups.length) {
              return prevIndex;
            }
            console.log("popupContent 13", showPopup);
            setShowPopup(true);
            return nextIndex;
          });
        }, interval);
      };

      timerRef.current = setTimeout(showNextPopup, interval);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [popups, interval]);

  const handleClose = () => {
    setShowPopup(false);
    timerRef.current = setTimeout(() => {
      setShowPopup(true);
    }, interval);
  };

  return (
    <>
        {console.log("popupContent --", showPopup, currentPopupIndex, popups.length)}
      {showPopup && currentPopupIndex < popups.length && (
        <Popup
          message={popups[currentPopupIndex]}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default PopupManager;
