// Popup.tsx
import React from 'react';
import PrimeLoginMap from 'components/PrimeLoginMap';
import IfrOnboarding from 'components/IfrOnboarding';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  let content;

  switch (message) {
    case 'onboarding':
      content = <IfrOnboarding onClose={onClose} />;
      break;
    case 'primeLoginMap':
      content = <PrimeLoginMap onClose={onClose} />;
      break;
    default:
      content = <div>No component found</div>;
  }

  return (
    <div className={`popupManager ${message}`}>
        {console.log("popupContent -- ", content)}
      {content}
    </div>
  );
};

export default Popup;
