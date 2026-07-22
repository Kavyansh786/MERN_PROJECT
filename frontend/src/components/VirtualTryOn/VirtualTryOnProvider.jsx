import React from 'react';
import VirtualTryOnMain from './VirtualTryOnMain';
import { useVirtualTryOnContext } from '../../contexts/VirtualTryOnContext';

const VirtualTryOnProvider = () => {
  const { isActive } = useVirtualTryOnContext();

  // Only render the virtual try-on interface when active
  if (!isActive) {
    return null;
  }

  return <VirtualTryOnMain />;
};

export default VirtualTryOnProvider;