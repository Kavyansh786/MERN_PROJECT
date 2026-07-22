import { useState, useCallback, useEffect } from 'react';
import { useVirtualTryOnContext } from '../contexts/VirtualTryOnContext';

const useVirtualTryOn = () => {
  // Try to use context first, fallback to local state
  let contextValue = null;
  try {
    contextValue = useVirtualTryOnContext();
  } catch (error) {
    // Context not available, use local state
  }

  const [localIsActive, setLocalIsActive] = useState(false);
  const [localSelectedProduct, setLocalSelectedProduct] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  // Use context values if available, otherwise use local state
  const isActive = contextValue?.isActive ?? localIsActive;
  const selectedProduct = contextValue?.selectedProduct ?? localSelectedProduct;
  const setIsActive = contextValue?.setIsActive ?? setLocalIsActive;
  const setSelectedProduct = contextValue?.setSelectedProduct ?? setLocalSelectedProduct;

  // Check browser support on mount
  useEffect(() => {
    const checkSupport = () => {
      const hasWebGL = (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
          return false;
        }
      })();

      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasSecureContext = window.isSecureContext || window.location.hostname === 'localhost';

      const supported = hasWebGL && hasCamera && hasSecureContext;
      
      console.log('Virtual Try-On Support Check:', {
        hasWebGL,
        hasCamera,
        hasSecureContext,
        supported
      });

      setIsSupported(supported);

      if (!supported) {
        if (!hasWebGL) setError('WebGL not supported');
        else if (!hasCamera) setError('Camera not available');
        else if (!hasSecureContext) setError('HTTPS required for camera access');
      }
    };

    checkSupport();
  }, []);

  const startTryOn = useCallback(async (product) => {
    // Use context method if available
    if (contextValue?.startTryOn) {
      return contextValue.startTryOn(product);
    }

    // Fallback to local implementation
    if (!isSupported) {
      throw new Error('Virtual try-on not supported on this device');
    }

    if (!product) {
      throw new Error('No product selected');
    }

    // Validate product has required fields
    if (!product.model3d) {
      throw new Error('Product does not have a 3D model');
    }

    const supportedCategories = ['necklace', 'earrings', 'rings', 'bracelets'];
    if (!supportedCategories.includes(product.category?.toLowerCase())) {
      throw new Error('Product category not supported for virtual try-on');
    }

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
  }, [isSupported, contextValue]);

  const stopTryOn = useCallback(() => {
    // Use context method if available
    if (contextValue?.stopTryOn) {
      return contextValue.stopTryOn();
    }

    // Fallback to local implementation
    setIsActive(false);
    setSelectedProduct(null);
    setError(null);
    console.log('Virtual try-on stopped');
  }, [contextValue]);

  const switchProduct = useCallback(async (newProduct) => {
    if (!isActive) {
      return startTryOn(newProduct);
    }

    try {
      setError(null);
      setSelectedProduct(newProduct);
      console.log('Switched to product:', newProduct.name);
    } catch (error) {
      console.error('Failed to switch product:', error);
      setError(error.message);
      throw error;
    }
  }, [isActive, startTryOn]);

  const capturePhoto = useCallback(() => {
    if (!isActive) {
      throw new Error('Virtual try-on not active');
    }

    // This will be implemented to capture the current try-on state
    console.log('Photo capture requested');
    
    // Return a promise that resolves with the captured image
    return new Promise((resolve, reject) => {
      try {
        // Implementation will capture both video and 3D overlay
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // This is a placeholder - actual implementation will composite
        // the video feed with the 3D jewelry overlay
        canvas.width = 1280;
        canvas.height = 720;
        
        // For now, return a data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    });
  }, [isActive]);

  return {
    // State
    isActive,
    selectedProduct,
    isSupported,
    error,
    
    // Actions
    startTryOn,
    stopTryOn,
    switchProduct,
    capturePhoto,
    
    // Computed
    jewelryType: selectedProduct?.category?.toLowerCase(),
    modelUrl: selectedProduct?.model3d,
    productName: selectedProduct?.name
  };
};

export default useVirtualTryOn;