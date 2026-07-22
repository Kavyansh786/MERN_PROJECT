# Virtual Try-On Dependencies

## Core Dependencies to Install:

```bash
# MediaPipe for AI tracking
npm install @mediapipe/face_mesh@0.4.1633559619
npm install @mediapipe/hands@0.4.1646424915
npm install @mediapipe/camera_utils@0.3.1620248257

# Three.js ecosystem
npm install three@0.158.0
npm install @react-three/fiber@8.15.12
npm install @react-three/drei@9.92.7

# Utilities
npm install @react-three/postprocessing@2.15.11
npm install leva@0.9.35
```

## Version Compatibility Matrix:
- React: 18.x ✅
- Three.js: 0.158.x ✅  
- MediaPipe: 0.4.x ✅
- React-Three-Fiber: 8.15.x ✅

## Bundle Size Impact:
- MediaPipe: ~2.1MB
- Three.js: ~600KB
- React-Three-Fiber: ~100KB
- Total: ~2.8MB additional