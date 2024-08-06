"use client";
// PopupManager.js
import React, { useState, useEffect } from 'react';
import Popup from '../Popup';

const PopupManager = ({ popups, interval }) => {
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (popups.length > 0) {
      setShowPopup(true);

      const initialTimeout = setTimeout(() => {
        setShowPopup(false);
        setCurrentPopupIndex((prevIndex) => prevIndex + 1);

        const timer = setInterval(() => {
          setCurrentPopupIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= popups.length) {
              clearInterval(timer);
              return prevIndex;
            }
            setShowPopup(false);
            setTimeout(() => setShowPopup(true), interval);
            return nextIndex;
          });
        }, interval);
      }, interval);

      return () => {
        clearTimeout(initialTimeout);
      };
    }
  }, [popups, interval]);

  const handleClose = () => {
    setShowPopup(false);
    setTimeout(() => {
      setShowPopup(true);
    }, interval);
  };

  return (
    <>
    {/* {console.log("popupContent 0 --- ", showPopup, currentPopupIndex)} */}
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
