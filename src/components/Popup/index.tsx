// Popup.js
import React from 'react';
import PrimeLoginMap from 'components/PrimeLoginMap';
import IfrOnboarding from 'components/IfrOnboarding';

const Popup = ({ message, onClose }) => {
  let content;

  const popupContent = () => {
    console.log("popupContent 2 ---")
    switch (message) {
        case 'onboarding':
          return <IfrOnboarding onClose={onClose} />;
        case 'primeLoginMap':
          return <PrimeLoginMap onClose={onClose} />;
    }
  }

  console.log("popupContent 1 --- " ,popupContent(), message)

  return (
    <>
        <div className='popupManager'>
            {popupContent()}
        </div>
    </>
  );
};

export default Popup;
