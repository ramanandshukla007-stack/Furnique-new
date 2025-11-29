# Furnique Fabric Visualizer - Quick Start Guide

## 🚀 Quick Start

### Installation

1. **Install dependencies** (already done if you ran `npm install`):
   ```bash
   npm install three canvas sharp axios formidable
   ```

2. **Set up Prisma** (when database is available):
   ```bash
   npx prisma migrate dev --name add_visualizer_models
   npx prisma db seed
   ```

   This will:
   - Create visualizer tables in Postgres
   - Seed 6 sample fabrics with metadata
   - Set up demo user

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Visit the visualizer**:
   - Open http://localhost:3000/visualizer
   - Or navigate via main app menu

### Database Setup (If Starting Fresh)

The visualizer requires PostgreSQL. New tables created:
- `FabricLibrary` - Fabric definitions & metadata
- `VisualizerUpload` - Uploaded images & detection results
- `VisualizerProject` - Saved user projects
- `VisualizerAlphaMask` - Generated & edited masks

Relations:
- User ← (Many) VisualizerUpload
- User ← (Many) VisualizerProject
- VisualizerProject → (Many) FabricLibrary

## 📋 API Overview

All endpoints are prefixed with `/api/visualizer/`:

### 1. Upload Image
```
POST /upload
Content-Type: multipart/form-data

File: image (JPG, PNG, max 10MB)

Response:
{
  "uploadId": "upload-1234567890",
  "imageUrl": "/uploads/visualizer/upload-1234567890.jpg",
  "width": 1920,
  "height": 1080,
  "createdAt": "2024-12-01T10:00:00Z"
}
```

### 2. Detect Furniture
```
POST /detect
Content-Type: application/json

{
  "uploadId": "upload-1234567890",
  "imageUrl": "/uploads/visualizer/upload-1234567890.jpg",
  "imageWidth": 1920,
  "imageHeight": 1080
}

Response:
{
  "uploadId": "...",
  "items": [
    {
      "id": "upload-1234567890-sofa",
      "type": "sofa-3-seater",
      "label": "Sofa",
      "confidence": 0.92,
      "maskUrl": "/masks/visualizer/mask-upload-1234567890-sofa.png",
      "editable": true
    }
  ],
  "modelUsed": "mock-segmentation-v1",
  "processingTimeMs": 245
}
```

### 3. Get Fabrics
```
GET /fabrics?colorFamily=neutral&pattern=stripe&search=linen

Response:
{
  "fabrics": [
    {
      "id": "1",
      "name": "Premium Linen - Natural",
      "code": "LIN-001",
      "pricePerMeter": 850,
      "thumbnailUrl": "...",
      "texture": {
        "seamlessTextureUrl": "...",
        "normalMapUrl": "...",
        "roughnessMapUrl": "...",
        "textureScale": 1.0
      }
    }
  ],
  "total": 6,
  "filters": { ... }
}
```

**Query Parameters:**
- `colorFamily` (repeatable): neutral, warm, cool, jewel-tone, earth, gray, black, white
- `pattern` (repeatable): plain, stripe, floral, geometric, textured, print
- `search`: Text search
- `minPrice`, `maxPrice`: Price range in ₹/m
- `sortBy`: name, price, newest (default: name)
- `sortOrder`: asc, desc (default: asc)

### 4. Apply Fabric (Get Render Params)
```
POST /apply-fabric
{
  "uploadId": "upload-1234567890",
  "itemId": "upload-1234567890-sofa",
  "fabricId": "1",
  "tileScale": 1.0,
  "rotation": 0
}

Response:
{
  "uploadId": "...",
  "itemId": "...",
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

### 5. Edit Mask
```
POST /mask-edit
{
  "uploadId": "upload-1234567890",
  "itemId": "upload-1234567890-sofa",
  "brushStrokes": [
    {
      "type": "add",
      "x": 100,
      "y": 200,
      "radius": 20,
      "opacity": 1.0
    }
  ]
}

Response:
{
  "success": true,
  "message": "Mask edits saved",
  "strokeCount": 1
}
```

### 6. Save/Get Project
```
POST /project
{
  "uploadId": "...",
  "projectName": "My Living Room",
  "notes": "Testing blue linen",
  "detectedItems": [...],
  "applications": [...]
}

GET /project?id=project-id
```

## 🎨 UI Workflow

### Step 1: Upload
- User clicks "Choose File"
- Selects furniture image (JPG/PNG)
- Image optimized and uploaded
- UI advances to Step 2

### Step 2: Detect
- API detects furniture automatically
- Shows detected items as buttons
- Each item shows confidence score
- Multiple items can be detected (sofa + cushion)

### Step 3: Select
- User clicks on item to select
- Selected item highlighted
- Proceed to fabric selection

### Step 4: Choose Fabric
- Right panel shows fabric grid
- Filter by color or pattern
- Click fabric to apply instantly
- WebGL renders preview in real-time

### Step 5: Preview & Refine
- Large preview shows composited result
- Optional: Click "Edit Mask" to refine
- Brush tool: Add/erase fabric area
- Undo/reset/save mask changes
- Click "Download" to save as JPEG/PNG

## 📁 File Structure

```
/app/visualizer
  └─ page.tsx                    # Main visualizer page

/app/api/visualizer
  ├─ upload/route.ts             # Image upload endpoint
  ├─ detect/route.ts             # Furniture detection
  ├─ fabrics/route.ts            # Fabric library (GET/POST)
  ├─ apply-fabric/route.ts        # Compositing params
  ├─ mask-edit/route.ts           # Mask refinement
  └─ project/route.ts             # Project save/load

/components
  ├─ VisualizerWorkflow.tsx       # Main orchestrator
  ├─ StepIndicator.tsx            # Step progress
  ├─ FabricSelector.tsx           # Fabric browser
  ├─ PreviewCanvas.tsx            # Canvas wrapper
  └─ MaskEditor.tsx               # Mask editor

/lib
  ├─ types/visualizer.ts          # TypeScript definitions
  ├─ webgl-compositor.ts          # WebGL engine
  └─ prisma.ts                    # Prisma client

/prisma
  ├─ schema.prisma                # Updated with visualizer models
  └─ seed.ts                      # Fabric seeding script

/public
  ├─ /uploads/visualizer/         # Uploaded images
  ├─ /masks/visualizer/           # Generated masks
  └─ /textures/                   # Fabric textures (mock)
```

## 🎯 Sample Fabrics (Pre-Seeded)

| Code | Name | Collection | Color | Pattern | Price |
|------|------|-----------|-------|---------|-------|
| LIN-001 | Premium Linen - Natural | Natural Weaves | Neutral | Textured | ₹850/m |
| WOL-002 | Wool Tweed - Charcoal | Wool Collection | Gray | Plain | ₹1200/m |
| COT-003 | Cotton Blend - Cream | Comfort Range | Warm | Plain | ₹650/m |
| LEN-004 | Linen Stripe - Blue & White | Pattern Play | Cool | Stripe | ₹950/m |
| SIL-005 | Silk Blend - Emerald | Luxury Range | Jewel Tone | Plain | ₹1800/m |
| GEO-006 | Geometric Print - Ochre | Pattern Play | Earth | Geometric | ₹750/m |

## 🔧 Configuration

### Image Upload Limits
- Max file size: 10 MB
- Max dimensions: 1920 x 1080 (auto-resized)
- JPEG quality: 85 (optimized)
- Output format: JPEG

### WebGL Settings
- Version: WebGL 2.0 (falls back to 1.0)
- Texture filtering: Linear with mipmaps
- Blend mode: Pre-multiplied alpha overlay
- Max concurrent textures: 5 per render

### Fabric Texture Requirements
- Format: JPG or WebP (seamless)
- Size: 1024x1024 or 2048x2048 recommended
- Must be tileable (no seams visible)
- Normal maps: 8-bit grayscale
- Roughness maps: 8-bit grayscale (0=glossy, 255=matte)

## 🚀 Performance Tips

1. **Optimize Textures**
   - Use WebP format (smaller than JPG)
   - Compress to 1-2MB per texture
   - Generate mipmaps for smooth downsampling

2. **Cache Strategy**
   - Fabric catalog cached 1 hour
   - Upload images cached by browser
   - Masks cached indefinitely

3. **Client-Side Rendering**
   - WebGL handles all compositing (GPU accelerated)
   - Texture switching: <50ms
   - No full re-render needed

4. **Mobile Optimization**
   - Responsive canvas sizing
   - Touch support in mask editor
   - Graceful degradation for low-end phones

## 🔮 Future Enhancements

### Phase 2: Real Segmentation
- Replace mock detection with SAM or YOLOv8-Seg
- Train custom models on furniture dataset
- Better edge detection & mask quality
- Multi-model ensemble for robustness

### Phase 3: 3D/AR Pipeline
- GLB furniture models with PBR materials
- WebXR for mobile AR (phone camera)
- Same fabric textures on 3D meshes
- Real-time furniture placement

### Phase 4: Advanced Features
- Collaborative editing (real-time sync)
- Fabric recommendations (ML-based)
- A/B testing (multiple fabric combinations)
- Project versioning & history
- E-commerce integration (add to cart)

## 🐛 Troubleshooting

### Upload Fails
- Check file size (<10MB)
- Ensure JPEG/PNG format
- Check `/public/uploads/visualizer/` exists

### Detection Returns No Items
- Using mock segmentation; real models will be better
- Image must contain clearly visible furniture
- Try adjusting mock detection logic in `/api/visualizer/detect`

### WebGL Not Working
- Check browser console for errors
- Ensure WebGL is enabled (usually is)
- Falls back to canvas rendering (slower)
- Mobile: Use latest Chrome/Safari

### Mask Editor Not Saving
- Check mask-edit API response
- Currently stores in memory; persist to DB needed
- Reload page to lose edits (future: auto-save)

## 📚 API Documentation

Full API docs available in: `VISUALIZER_ARCHITECTURE.md`

## 🤝 Contributing

When adding new features:
1. Update TypeScript types in `lib/types/visualizer.ts`
2. Add Prisma models if storing data
3. Create API route in `/app/api/visualizer/`
4. Add React component in `/components/`
5. Update this README with new endpoints

## 📝 License

Part of Furnique ecommerce platform. See main repository for license.
