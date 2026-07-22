import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVirtualTryOnContext } from '../contexts/VirtualTryOnContext';

const VirtualTryOnPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startTryOn, stopTryOn, isActive } = useVirtualTryOnContext();

  useEffect(() => {
    const productId = searchParams.get('productId');
    const productName = searchParams.get('productName');
    const model3d = searchParams.get('model3d');
    const category = searchParams.get('category');

    if (productId && productName) {
      // Create product object from URL params
      const product = {
        _id: productId,
        name: decodeURIComponent(productName),
        model3d: model3d ? decodeURIComponent(model3d) : null,
        category: category ? decodeURIComponent(category) : 'necklace'
      };

      console.log('🚀 Starting virtual try-on from URL params:', product);
      startTryOn(product);
    } else {
      // Use the original product that was being tested
      const originalProduct = {
        _id: '676d123456789abcdef12345',
        name: 'Gold Chain Necklace',
        model3d: '/models/necklaces/Golden_Elegance_0815085203_texture.glb',
        category: 'necklace',
        price: 2500,
        description: 'Elegant gold chain necklace perfect for any occasion'
      };

      console.log('🚀 Starting virtual try-on with original product:', originalProduct);
      startTryOn(originalProduct);
    }

    // Cleanup on unmount
    return () => {
      if (isActive) {
        stopTryOn();
      }
    };
  }, [searchParams, startTryOn, stopTryOn, navigate, isActive]);

  // The actual virtual try-on UI is rendered by VirtualTryOnProvider
  // This page just activates the context and shows a loading state if needed
  if (!isActive) {
    return (
      <div className="virtual-tryon-page" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000'
      }}>
        <div className="virtual-tryon-loading" style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #333',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Initializing Virtual Try-On...</p>
        </div>
      </div>
    );
  }

  // When active, the VirtualTryOnProvider will render the UI
  return null;
};

export default VirtualTryOnPage;
