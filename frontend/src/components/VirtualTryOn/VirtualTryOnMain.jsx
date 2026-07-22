import React from 'react';
import { useVirtualTryOnContext } from '../../contexts/VirtualTryOnContext';
import VirtualTryOn3D from './VirtualTryOn3D';
import './VirtualTryOnMain.css';

const VirtualTryOnMain = () => {
  const { isActive, selectedProduct, stopTryOn } = useVirtualTryOnContext();

  if (!isActive || !selectedProduct) {
    return null;
  }

  // We only support necklaces for now, as per the refactored VirtualTryOn3D
  if (selectedProduct.category.toLowerCase() !== 'necklaces') {
      console.warn(`Virtual Try-On is only supported for necklaces. Product category is ${selectedProduct.category}.`);
      stopTryOn(); // Stop the session if the item is not a necklace
      return null;
  }

  return (
    <div className="virtual-tryon-overlay">
      <div className="virtual-tryon-container">
        <button 
          className="close-button"
          onClick={stopTryOn}
          aria-label="Close virtual try-on"
        >
          ✕
        </button>
        <VirtualTryOn3D selectedProduct={selectedProduct} onClose={stopTryOn} />
      </div>
    </div>
  );
};

export default VirtualTryOnMain;