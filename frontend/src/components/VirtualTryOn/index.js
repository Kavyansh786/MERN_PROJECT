// Virtual Try-On Components Export
export { default as TryOnButton } from './TryOnButton';
export { default as VirtualTryOnProvider } from './VirtualTryOnProvider';
export { default as VirtualTryOnMain } from './VirtualTryOnMain';
export { default as InstallationCheck } from './InstallationCheck';

// Create placeholder components for missing files to prevent 404 errors
const PlaceholderComponent = () => null;

// Legacy exports for compatibility
export const VirtualTryOnSelector = PlaceholderComponent;
export const VirtualTryOnWrapper = PlaceholderComponent;
export const ModelGenerator = PlaceholderComponent;