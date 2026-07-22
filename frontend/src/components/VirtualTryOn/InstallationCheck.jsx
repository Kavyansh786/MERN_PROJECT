import React, { useState, useEffect } from 'react';

const InstallationCheck = () => {
  const [status, setStatus] = useState({
    mediapipe: false,
    threejs: false,
    webgl: false,
    camera: false
  });

  useEffect(() => {
    const checkInstallation = async () => {
      // Check MediaPipe
      try {
        const { FaceMesh } = await import('@mediapipe/face_mesh');
        setStatus(prev => ({ ...prev, mediapipe: true }));
      } catch (error) {
        console.warn('MediaPipe not installed:', error);
      }

      // Check Three.js
      try {
        await import('three');
        await import('@react-three/fiber');
        setStatus(prev => ({ ...prev, threejs: true }));
      } catch (error) {
        console.warn('Three.js not installed:', error);
      }

      // Check WebGL
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setStatus(prev => ({ ...prev, webgl: !!gl }));
      } catch (error) {
        console.warn('WebGL not supported:', error);
      }

      // Check Camera
      try {
        const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        setStatus(prev => ({ ...prev, camera: hasCamera }));
      } catch (error) {
        console.warn('Camera not available:', error);
      }
    };

    checkInstallation();
  }, []);

  const allReady = Object.values(status).every(Boolean);

  if (allReady) {
    return null; // Don't show if everything is working
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#fff',
      border: '2px solid #f59e0b',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>
        Virtual Try-On Setup Required
      </h4>
      <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
        <div style={{ color: status.mediapipe ? '#22c55e' : '#ef4444' }}>
          {status.mediapipe ? '✅' : '❌'} MediaPipe
        </div>
        <div style={{ color: status.threejs ? '#22c55e' : '#ef4444' }}>
          {status.threejs ? '✅' : '❌'} Three.js
        </div>
        <div style={{ color: status.webgl ? '#22c55e' : '#ef4444' }}>
          {status.webgl ? '✅' : '❌'} WebGL
        </div>
        <div style={{ color: status.camera ? '#22c55e' : '#ef4444' }}>
          {status.camera ? '✅' : '❌'} Camera
        </div>
      </div>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
        See VIRTUAL_TRYON_SETUP.md for installation instructions.
      </p>
    </div>
  );
};

export default InstallationCheck;