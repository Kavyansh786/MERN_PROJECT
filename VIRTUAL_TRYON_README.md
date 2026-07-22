# Virtual Try-On Feature Documentation

## Overview

The Virtual Try-On feature uses MediaPipe AI technology to provide real-time jewelry visualization on users through their camera feed. This feature supports earrings, necklaces, bracelets, and rings with accurate face and hand tracking.

## Features

- **Real-time AR Experience**: Live camera feed with jewelry overlay
- **Multi-category Support**: Earrings, necklaces, bracelets, and rings
- **AI-powered Tracking**: MediaPipe face mesh and hand detection
- **Photo Capture**: Save and share virtual try-on photos
- **Session Analytics**: Track user engagement and popular products
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technical Stack

### Frontend
- **React 19** - UI framework
- **MediaPipe** - AI/ML models for face and hand tracking
- **Canvas API** - Real-time rendering and overlay
- **WebRTC** - Camera access and video streaming

### Backend
- **Node.js/Express** - API server
- **MongoDB** - Session data storage
- **JWT Authentication** - User session management

## Installation

### 1. Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install @mediapipe/face_mesh @mediapipe/hands @mediapipe/camera_utils @mediapipe/drawing_utils

# Backend dependencies (already included)
cd ../backend
npm install
```

### 2. Environment Setup

Add to `backend/.env`:
```env
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
```



## Usage

### Basic Integration

```jsx
import { TryOnButton, VirtualTryOnWrapper } from './components/VirtualTryOn';

// Add try-on button to product pages
<TryOnButton product={productData} />

// Add wrapper to main app component
<VirtualTryOnWrapper />
```

### Advanced Usage

```jsx
import { useVirtualTryOn } from './hooks/useVirtualTryOn';

const MyComponent = () => {
  const { startTryOn, isActive, selectedProduct } = useVirtualTryOn();
  
  const handleTryOn = () => {
    startTryOn(product);
  };
  
  return (
    <button onClick={handleTryOn}>
      Try On Virtually
    </button>
  );
};
```

## API Endpoints

### Save Try-On Session
```http
POST /api/virtual-tryon/save-session
Authorization: Bearer <token>

{
  "productId": "product_id",
  "sessionData": {
    "mode": "earrings",
    "duration": 120,
    "capturedImages": [...],
    "interactions": [...]
  }
}
```

### Get Try-On History
```http
GET /api/virtual-tryon/history?page=1&limit=10&category=earrings
Authorization: Bearer <token>
```

### Get Product Analytics
```http
GET /api/virtual-tryon/analytics/:productId?startDate=2024-01-01&endDate=2024-12-31
```

### Get Popular Products
```http
GET /api/virtual-tryon/popular-products?limit=10&timeframe=30d
```

## Component Structure

```
frontend/src/components/VirtualTryOn/
├── VirtualTryOn.jsx          # Main try-on component
├── VirtualTryOn.css          # Styles
├── TryOnButton.jsx           # Try-on trigger button
├── VirtualTryOnWrapper.jsx   # State management wrapper
└── index.js                  # Export file

frontend/src/hooks/
└── useVirtualTryOn.js        # Custom hook for try-on state

backend/routes/
└── virtualTryOn.js           # API routes

backend/models/
└── VirtualTryOnSession.js    # MongoDB model

backend/middleware/
└── auth.js                   # Authentication middleware
```

## Supported Categories

| Category | Tracking Method | Landmarks Used |
|----------|----------------|----------------|
| Earrings | Face Mesh | Left ear (234), Right ear (454) |
| Necklaces | Face Mesh | Chin/neck area (172, 136, 365) |
| Bracelets | Hand Detection | Wrist (0) |
| Rings | Hand Detection | Ring finger tip (16) |

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ❌ Internet Explorer (not supported)

## Performance Optimization

### Frontend
- Lazy load MediaPipe models
- Optimize canvas rendering
- Implement frame rate limiting
- Use Web Workers for heavy computations

### Backend
- Index database queries
- Implement caching for popular products
- Compress session data
- Use CDN for model files

## Security Considerations

- Camera permissions required
- HTTPS mandatory for production
- User consent for data collection
- Secure session storage
- Rate limiting on API endpoints

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Check browser permissions
   - Ensure HTTPS in production
   - Verify camera hardware

2. **Poor tracking accuracy**
   - Improve lighting conditions
   - Ensure face/hands are clearly visible
   - Check camera resolution

3. **Performance issues**
   - Reduce canvas resolution
   - Limit frame rate
   - Close other applications



## Analytics & Metrics

Track the following metrics:
- Try-on session duration
- Popular products
- User engagement
- Conversion rates
- Device/browser usage

## Future Enhancements

- [ ] Multiple jewelry pieces simultaneously
- [ ] 3D jewelry models
- [ ] Skin tone matching
- [ ] Social sharing integration
- [ ] AR filters and effects
- [ ] Voice commands
- [ ] Gesture controls

## Support

For technical support or feature requests:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting guide

## License

This virtual try-on feature is part of the main application and follows the same licensing terms.