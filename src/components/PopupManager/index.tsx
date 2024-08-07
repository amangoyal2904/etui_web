"use client";
// PopupManager.tsx
import React, { useState, useEffect } from 'react';
import IfrOnboarding from 'components/IfrOnboarding';
import PrimeLoginMap from 'components/PrimeLoginMap';

const PopupManager = () => {
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const popups = [
    'onboarding',
    'primeLoginMap',
  ];

  useEffect(() => {
    if (popups.length > 0) {
      setShowPopup(true);
    }

    const handleNextPopup = () => {
      setShowPopup(false);
      setTimeout(() => {
        setCurrentPopupIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < popups.length) {
            setShowPopup(true);
            return nextIndex;
          }
          return prevIndex;
        });
      }, 0); // Delay to ensure setState completes
    };

    window.addEventListener('nextPopup', handleNextPopup);

    return () => {
      window.removeEventListener('nextPopup', handleNextPopup);
    };
  }, [popups.length]);

  const handleClose = () => {
    setShowPopup(false);
    const event = new Event('nextPopup');
    window.dispatchEvent(event);
  };

  return (
    <>
      {console.log("popupContent --- popupManager", showPopup, currentPopupIndex, popups.length)}  
      {showPopup && currentPopupIndex < popups.length && (
        <div className={`popupManager ${popups[currentPopupIndex]}`}>
          {(() => {
            switch (popups[currentPopupIndex]) {
              case 'onboarding':
                return <IfrOnboarding onClose={handleClose} />;
              case 'primeLoginMap':
                return <PrimeLoginMap onClose={handleClose} />;
              default:
                return <div>No component found</div>;
            }
          })()}
        </div>
      )}
    </>
  );
};

export default PopupManager;
