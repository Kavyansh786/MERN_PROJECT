import React, { createContext, useContext, useState, useCallback } from 'react';

const VirtualTryOnContext = createContext();

export const useVirtualTryOnContext = () => {
  const context = useContext(VirtualTryOnContext);
  if (!context) {
    throw new Error('useVirtualTryOnContext must be used within VirtualTryOnProvider');
  }
  return context;
};

export const VirtualTryOnProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);

  const startTryOn = useCallback(async (product) => {
    try {
      setError(null);
      setSelectedProduct(product);
      setIsActive(true);
      console.log('Virtual try-on started for:', product.name);
    } catch (error) {
      console.error('Failed to start virtual try-on:', error);
      setError(error.message);
      throw error;
    }
  }, []);

  const stopTryOn = useCallback(() => {
    setIsActive(false);
    setSelectedProduct(null);
    setError(null);
    console.log('Virtual try-on stopped');
  }, []);

  const value = {
    isActive,
    selectedProduct,
    isSupported,
    error,
    startTryOn,
    stopTryOn,
    jewelryType: selectedProduct?.category?.toLowerCase(),
    modelUrl: selectedProduct?.model3d,
    productName: selectedProduct?.name
  };

  return (
    <VirtualTryOnContext.Provider value={value}>
      {children}
    </VirtualTryOnContext.Provider>
  );
};

export default VirtualTryOnContext;