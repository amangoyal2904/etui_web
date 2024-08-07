import React from 'react';
import PrimeLoginMap from 'components/PrimeLoginMap';
import IfrOnboarding from 'components/IfrOnboarding';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div className={`popupManager ${message}`}>
      {console.log("popupContent -- ", message)}
      {
        (() => {
          switch (message) {
            case 'onboarding':
              return <IfrOnboarding onClose={onClose} />;
            case 'primeLoginMap':
              return <PrimeLoginMap onClose={onClose} />;
            default:
              return <div>No component found</div>;
          }
        })()
      }
    </div>
  );
};

export default Popup;
