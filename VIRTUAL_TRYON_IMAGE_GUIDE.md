# Virtual Try-On Image Optimization Guide

## 📸 Image Requirements for Best Results

### General Requirements
- **Format**: PNG with transparent background (preferred) or JPG with clean background
- **Resolution**: 300x300px to 800x800px (higher resolution for better quality)
- **File Size**: Under 500KB for fast loading
- **Background**: Transparent or solid white background

### Category-Specific Guidelines

#### 🔘 Earrings
- **Orientation**: Show earring as it would hang naturally
- **Size**: 200x300px recommended
- **Background**: Transparent PNG preferred
- **Positioning**: Center the earring in the image
- **Style**: Show one earring (system will mirror for the other ear)

#### 📿 Necklaces
- **Orientation**: Show necklace laid flat or curved naturally
- **Size**: 400x200px recommended (wider than tall)
- **Background**: Transparent PNG preferred
- **Positioning**: Center the pendant/focal point
- **Style**: Show the full necklace design

#### 💍 Rings
- **Orientation**: Top-down view or slight angle
- **Size**: 150x150px recommended (square)
- **Background**: Transparent PNG preferred
- **Positioning**: Center the ring
- **Style**: Show the ring face clearly

#### ⌚ Bracelets
- **Orientation**: Show bracelet curved or laid flat
- **Size**: 300x100px recommended (wider than tall)
- **Background**: Transparent PNG preferred
- **Positioning**: Center the design elements
- **Style**: Show the bracelet's pattern/design

## 🎨 Image Preparation Tips

### 1. Remove Background
```bash
# Using online tools:
- remove.bg
- canva.com
- photoshop.com (free online)

# Or use photo editing software:
- Adobe Photoshop
- GIMP (free)
- Canva
```

### 2. Optimize Size
```bash
# Recommended tools:
- TinyPNG.com (compress without quality loss)
- ImageOptim (Mac)
- Squoosh.app (Google's image optimizer)
```

### 3. Format Conversion
```bash
# Convert to PNG with transparency:
- Use any image editor
- Save as PNG-24 with transparency
- Ensure background is truly transparent
```

## 🔧 Technical Implementation

### Current System Behavior
1. **Image Loading**: System loads your product image URL
2. **CORS Handling**: Images are loaded with `crossOrigin='anonymous'`
3. **Fallback**: If image fails to load, shows geometric shapes
4. **Scaling**: Images are automatically scaled to appropriate sizes
5. **Positioning**: Images are positioned based on detected landmarks

### Image Sizing in Code
```javascript
// Current sizes (adjustable):
- Earrings: 40x48px on screen
- Necklaces: 120x80px on screen  
- Rings: 25x25px on screen
- Bracelets: 80x20px on screen
```

## 📱 Testing Your Images

### 1. Upload Test Images
- Add your optimized images to your product database
- Ensure the `image` field contains the correct URL

### 2. Test Virtual Try-On
- Go to your product page
- Click "Try On Virtually"
- Test each jewelry category
- Check image quality and positioning

### 3. Adjust if Needed
- If images are too large/small, we can adjust the sizing in code
- If positioning is off, we can modify the landmark offsets
- If images don't load, check CORS settings

## 🚀 Advanced Tips

### For Better Realism
1. **Lighting**: Use consistent lighting in product photos
2. **Shadows**: Subtle shadows can add depth
3. **Reflections**: Metallic jewelry should show some reflection
4. **Multiple Angles**: Consider having different views for different face angles

### For Performance
1. **CDN**: Use a CDN for faster image loading
2. **Lazy Loading**: Images load only when needed
3. **Caching**: Browser caches images for repeat visits
4. **Compression**: Balance quality vs file size

## 🛠️ Troubleshooting

### Image Not Showing
- Check if image URL is accessible
- Verify CORS headers on your image server
- Ensure image format is supported (PNG, JPG, WebP)

### Image Quality Issues
- Increase source image resolution
- Use PNG format for better quality
- Check compression settings

### Positioning Problems
- Verify image is centered in source file
- Check if background is properly removed
- Consider adjusting landmark offsets in code

## 📊 Example Image Specifications

```
Earrings:
- Source: 400x600px PNG with transparency
- Display: 40x60px on face
- Position: Ear landmarks (234, 454)

Necklaces:
- Source: 600x400px PNG with transparency  
- Display: 120x80px on neck
- Position: Neck area below chin

Rings:
- Source: 300x300px PNG with transparency
- Display: 25x25px on finger
- Position: Ring finger tip (landmark 16)

Bracelets:
- Source: 400x150px PNG with transparency
- Display: 80x30px on wrist
- Position: Wrist area (landmark 0)
```

## 🎯 Quick Start Checklist

- [ ] Product images have transparent backgrounds
- [ ] Images are properly sized (not too large/small)
- [ ] Images are compressed for web
- [ ] Product categories are correctly set
- [ ] Image URLs are accessible
- [ ] CORS is configured if needed
- [ ] Test virtual try-on with real products

Your virtual try-on will work with any product images, but following these guidelines will give you the best results! 🎉