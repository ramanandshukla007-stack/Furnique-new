# Furnique Visualizer - Testing & Demo Guide

## 🧪 Testing Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (running on localhost:5432)
- npm dependencies installed

### Setup

1. **Start PostgreSQL** (if not running):
   ```bash
   # Docker (recommended)
   docker run -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=furnique \
     -p 5432:5432 postgres:15

   # Or use local PostgreSQL
   ```

2. **Run migrations & seed**:
   ```bash
   npx prisma migrate dev --name add_visualizer_models
   npx prisma db seed
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

4. **Open visualizer**:
   - Navigate to http://localhost:3000/visualizer
   - Or use main app navigation

## 📸 Manual Testing Workflow

### Test 1: Upload & Detection

**Steps:**
1. Click "Choose File" button
2. Select any furniture image (JPEG/PNG)
3. Observe:
   - Image displays after optimization
   - Status badge shows "ALPHA MASKED"
   - Detection automatically runs
   - Items detected (Sofa, Cushion if large image)
   - Step indicator advances

**Expected Results:**
- Image loads within 2-3 seconds
- Detection completes in <500ms
- Multiple items shown with confidence scores
- No errors in browser console

### Test 2: Item Selection & Fabric Preview

**Steps:**
1. After detection, click different items (Sofa, Cushion)
2. Observe item selection changes (highlight color changes)
3. Fabric selector panel loads with 6 pre-seeded fabrics
4. Click different fabric thumbnails
5. Observe preview updates in real-time

**Expected Results:**
- Item selection works smoothly
- Fabric grid displays all 6 fabrics
- Clicking fabric applies instantly (<100ms)
- WebGL canvas updates without full reload
- Fabric metadata visible on hover

### Test 3: Fabric Filtering

**Steps:**
1. Click color family buttons (Neutral, Warm, Cool, etc.)
2. Click pattern buttons (Plain, Stripe, etc.)
3. Try search box (type "linen", "wool", etc.)
4. Observe fabric count changes

**Expected Results:**
- Filters work independently
- Combined filters work (color + pattern)
- Search finds fabrics by name/code
- Fabric count updates dynamically
- Previously selected fabric stays selected

### Test 4: Mask Editor

**Steps:**
1. After applying fabric, click "Edit Mask" button
2. Toggle between "Add" and "Erase" modes
3. Adjust brush size (slider)
4. Adjust opacity (slider)
5. Draw strokes on canvas
6. Click Undo to remove last stroke
7. Click Reset to clear all
8. Click "Save Changes"

**Expected Results:**
- Brush mode switching works
- Brush size affects drawing
- Opacity gradient visible
- Strokes appear immediately
- Undo removes last stroke
- Reset clears canvas
- Save completes without error

### Test 5: Mobile Responsiveness

**Steps:**
1. Open http://localhost:3000/visualizer on mobile (or DevTools)
2. Test at 375px width (iPhone SE)
3. Test at 768px width (iPad)
4. Test at 1024px width (iPad Pro)

**Expected Results:**
- Layout stacks vertically on mobile
- Canvas resizes responsively
- Buttons/inputs remain clickable
- No horizontal scroll
- Touch events work smoothly
- Fabric grid adjusts column count

### Test 6: Error Handling

**Steps:**
1. Try uploading non-image file
2. Try uploading >10MB file
3. Network error simulation (DevTools throttle to offline)
4. WebGL unsupported browser (test in Safari on older Mac)

**Expected Results:**
- Invalid file shows error message
- Large file shows error message
- Network errors caught gracefully
- Fallback canvas displays
- Error messages clear and actionable

## 🔍 API Testing (with cURL)

### Test Upload Endpoint

```bash
# Create test image (1x1 pixel JPEG)
echo -e '\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0C\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xFF\xC0\x00\x0B\x08\x00\x01\x00\x01\x01\x11\x00\xFF\xC4\x00\x1F\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0B\xFF\xDA\x00\x08\x01\x01\x00\x00?\x00\xFB\xD3\xFF\xD9' > /tmp/test.jpg

# Upload
curl -X POST -F "image=@/tmp/test.jpg" \
  http://localhost:3000/api/visualizer/upload
```

**Expected Response:**
```json
{
  "uploadId": "upload-1234567890",
  "imageUrl": "/uploads/visualizer/upload-1234567890.jpg",
  "width": 1,
  "height": 1,
  "createdAt": "2024-12-01T10:00:00Z"
}
```

### Test Detection Endpoint

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "uploadId": "upload-1234567890",
    "imageUrl": "/uploads/visualizer/upload-1234567890.jpg",
    "imageWidth": 1920,
    "imageHeight": 1080
  }' \
  http://localhost:3000/api/visualizer/detect
```

**Expected Response:**
```json
{
  "uploadId": "upload-1234567890",
  "items": [
    {
      "id": "upload-1234567890-sofa",
      "type": "sofa-3-seater",
      "label": "Sofa",
      "confidence": 0.92,
      "maskUrl": "/masks/visualizer/mask-upload-1234567890-sofa.png",
      "color": "#8B7355",
      "editable": true
    }
  ],
  "detectedAt": "2024-12-01T10:00:00Z",
  "modelUsed": "mock-segmentation-v1",
  "processingTimeMs": 245
}
```

### Test Fabrics Endpoint

```bash
curl "http://localhost:3000/api/visualizer/fabrics?colorFamily=neutral&pattern=stripe"
```

**Expected Response:**
```json
{
  "fabrics": [
    {
      "id": "1",
      "name": "Premium Linen - Natural",
      "code": "LIN-001",
      ...
    }
  ],
  "total": 6,
  "filters": { ... }
}
```

### Test Apply Fabric Endpoint

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "uploadId": "upload-1234567890",
    "itemId": "upload-1234567890-sofa",
    "fabricId": "1",
    "tileScale": 1.0,
    "rotation": 0
  }' \
  http://localhost:3000/api/visualizer/apply-fabric
```

**Expected Response:**
```json
{
  "uploadId": "upload-1234567890",
  "itemId": "upload-1234567890-sofa",
  "fabricId": "1",
  "renderParams": {
    "originalImageUrl": "...",
    "maskUrl": "...",
    "fabricTextureUrl": "...",
    "normalMapUrl": "...",
    "roughnessMapUrl": "...",
    "tileScale": 1.0,
    "rotation": 0,
    "blendMode": "overlay"
  }
}
```

## 📊 Performance Benchmarks

### Target Metrics

| Operation | Target | Target Range |
|-----------|--------|---------------|
| Image Upload | <2s | <3s acceptable |
| Detection | ~250ms | <500ms acceptable |
| Fabric Switch | <50ms | <100ms acceptable |
| Mask Edit (stroke) | <10ms | <50ms acceptable |
| Initial Render | <500ms | <1s acceptable |
| Page Load | <2s | <3s acceptable |

### Measuring Performance

**In Browser DevTools:**

1. **Network Tab:**
   - Open DevTools (F12)
   - Network tab
   - Upload image
   - Check timing breakdown
   - Expect: Upload <2s

2. **Performance Tab:**
   - Record performance
   - Switch fabrics multiple times
   - Stop recording
   - Check frame rate (should be 60 FPS)
   - Check main thread blocking (should be minimal)

3. **JavaScript Execution:**
   ```javascript
   // In console during fabric switch
   performance.mark('fabric-switch-start')
   // Click fabric
   performance.mark('fabric-switch-end')
   performance.measure('fabric-switch', 'fabric-switch-start', 'fabric-switch-end')
   performance.getEntriesByType('measure')[0].duration // ms
   ```

### Memory Usage

```javascript
// In console
performance.memory.usedJSHeapSize / 1048576 // MB

// Should be <100MB for typical session
```

## 🎬 Demo Scenarios

### Scenario 1: Luxury Living Room
1. Upload image of 3-seater sofa
2. Select sofa
3. Apply "Premium Linen - Natural" (₹850/m)
4. Apply "Silk Blend - Emerald" (₹1800/m) to cushion
5. Download result

**Expected Time:** <2 minutes

### Scenario 2: Pattern Mixing
1. Upload sofa image
2. Apply "Linen Stripe - Blue & White"
3. Rotate pattern 45° (future feature)
4. Adjust tile scale to 1.5x (future feature)
5. Apply "Geometric Print - Ochre" to cushion
6. Download result

**Expected Time:** <3 minutes

### Scenario 3: Budget-Conscious Selection
1. Upload image
2. Filter by price max ₹750/m
3. Try "Cotton Blend - Cream" (₹650/m)
4. Try "Geometric Print - Ochre" (₹750/m)
5. Compare side-by-side
6. Save project for later

**Expected Time:** <2 minutes

## 🔎 Debug Mode

Enable verbose logging:

```javascript
// In browser console
localStorage.setItem('DEBUG_VISUALIZER', 'true')
// Reload page
```

This enables:
- Detailed API request/response logging
- WebGL shader compilation logs
- Texture loading debug messages
- Render timing per frame

## ✅ Pre-Launch Checklist

- [ ] All tests pass (manual + API)
- [ ] No TypeScript errors on build
- [ ] Performance benchmarks met
- [ ] Mobile responsive (375px - 1920px)
- [ ] Error messages clear and helpful
- [ ] Loading states visible
- [ ] No console errors/warnings
- [ ] Database seeds successfully
- [ ] 6 sample fabrics seeded
- [ ] Fabric images/textures loading
- [ ] WebGL fallback works
- [ ] Mask editor functional
- [ ] Project save/load works
- [ ] Export (download) works

## 📝 Test Report Template

```markdown
## Test Report: Furnique Visualizer

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** [Browser, Device, OS]

### Test Results

#### Upload & Detection
- [ ] File upload works
- [ ] Detection runs automatically
- [ ] Multiple items detected
- Status: PASS / FAIL

#### Fabric Selection
- [ ] Fabric grid displays
- [ ] Filters work (color, pattern, search)
- [ ] Fabric switching smooth
- Status: PASS / FAIL

#### Mask Editor
- [ ] Brush draw/erase works
- [ ] Undo/reset functional
- [ ] Save persists changes
- Status: PASS / FAIL

#### Mobile
- [ ] Responsive layout
- [ ] Touch interactions work
- [ ] Performance acceptable
- Status: PASS / FAIL

#### Performance
- Upload: ___ms (target: <2s)
- Detection: ___ms (target: <500ms)
- Fabric switch: ___ms (target: <100ms)
- Page load: ___ms (target: <3s)

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
- [Recommendation]
- [Recommendation]
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data created
- [ ] Texture CDN URLs updated
- [ ] Image optimization verified
- [ ] WebGL fallback tested
- [ ] Rate limiting configured
- [ ] Error tracking (Sentry) set up
- [ ] Performance monitoring active
- [ ] User testing completed
- [ ] Security review passed
- [ ] Documentation updated

## 📞 Support

For issues or questions:
1. Check `VISUALIZER_ARCHITECTURE.md` for technical details
2. Check `VISUALIZER_QUICKSTART.md` for API reference
3. Review test cases above for common issues
4. Check browser console for errors
5. Enable DEBUG_VISUALIZER mode for verbose logs
