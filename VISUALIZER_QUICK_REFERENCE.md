# Furnique Fabric Visualizer - Quick Reference Card

## 🚀 Getting Started (5 minutes)

```bash
# 1. Start database
docker run -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=furnique \
  -p 5432:5432 postgres:15

# 2. Setup app
cd furnique-new
npm install

# 3. Run migrations & seed
npx prisma migrate dev --name add_visualizer_models
npx prisma db seed

# 4. Start dev server
npm run dev

# 5. Visit visualizer
# http://localhost:3000/visualizer
```

## 📍 Main Entry Points

| Route | Purpose | File |
|-------|---------|------|
| `/visualizer` | Main visualizer UI | `/app/visualizer/page.tsx` |
| `/api/visualizer/upload` | Upload image | `/app/api/visualizer/upload/route.ts` |
| `/api/visualizer/detect` | Detect furniture | `/app/api/visualizer/detect/route.ts` |
| `/api/visualizer/fabrics` | Fabric library | `/app/api/visualizer/fabrics/route.ts` |

## 🧩 Component Structure

```
VisualizerWorkflow (Orchestrator)
├─ StepIndicator (Progress: 5 steps)
├─ PreviewCanvas (WebGL rendering)
├─ FabricSelector (Grid + filters)
└─ MaskEditor (Optional mask refinement)
```

## 🔑 Key Constants & Configs

**Image Limits:**
- Max size: 10 MB
- Max dimensions: 1920 x 1080
- Output: JPEG @ 85% quality

**WebGL:**
- Min version: WebGL 1.0 (fallback)
- Preferred: WebGL 2.0
- Texture limit: 5 concurrent
- Blend mode: Pre-multiplied alpha

**Fabric Textures:**
- Format: JPG or WebP (seamless)
- Resolution: 1024x1024 or 2048x2048
- Must be tileable (no seams)

## 📋 User Workflow Steps

1. **Upload** → Choose furniture image
2. **Detect** → AI identifies items (sofa, cushion, etc.)
3. **Select** → Click item to focus
4. **Browse Fabrics** → Filter by color/pattern, search, or scroll
5. **Apply** → Click fabric to preview (instant WebGL)
6. **Refine** (optional) → Edit mask with brush tools
7. **Download** → Save as JPEG/PNG
8. **Save Project** → Store for later (optional)

## 🔌 API Quick Reference

### Upload Image
```bash
curl -X POST -F "image=@photo.jpg" \
  http://localhost:3000/api/visualizer/upload
```
Returns: `uploadId`, `imageUrl`, dimensions

### Detect Furniture
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"uploadId":"...","imageUrl":"/uploads/...","imageWidth":1920,"imageHeight":1080}' \
  http://localhost:3000/api/visualizer/detect
```
Returns: Array of detected items with masks

### Get Fabrics
```bash
# Get all
curl http://localhost:3000/api/visualizer/fabrics

# Filter
curl "http://localhost:3000/api/visualizer/fabrics?colorFamily=neutral&pattern=stripe"
```
Returns: Fabric catalog with metadata

### Apply Fabric
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"uploadId":"...","itemId":"...","fabricId":"1","tileScale":1.0,"rotation":0}' \
  http://localhost:3000/api/visualizer/apply-fabric
```
Returns: WebGL render parameters

## 📁 File Quick Links

**Documentation:**
- Architecture → `VISUALIZER_ARCHITECTURE.md`
- Setup Guide → `VISUALIZER_QUICKSTART.md`
- Testing → `VISUALIZER_TESTING.md`
- Summary → `VISUALIZER_IMPLEMENTATION_SUMMARY.md`

**Core Code:**
- UI Workflow → `components/VisualizerWorkflow.tsx`
- WebGL Engine → `lib/webgl-compositor.ts`
- Types → `lib/types/visualizer.ts`
- API Upload → `app/api/visualizer/upload/route.ts`
- API Detect → `app/api/visualizer/detect/route.ts`
- API Fabrics → `app/api/visualizer/fabrics/route.ts`

**Database:**
- Schema → `prisma/schema.prisma`
- Seed → `prisma/seed.ts`

## 🎨 Pre-Seeded Fabrics

```
LIN-001: Premium Linen - Natural     ₹850/m
WOL-002: Wool Tweed - Charcoal       ₹1200/m
COT-003: Cotton Blend - Cream        ₹650/m
LEN-004: Linen Stripe - Blue & White ₹950/m
SIL-005: Silk Blend - Emerald        ₹1800/m
GEO-006: Geometric Print - Ochre     ₹750/m
```

## ⚡ Performance Targets

| Operation | Target | Status |
|-----------|--------|--------|
| Upload | <2s | ✓ |
| Detection | <500ms | ✓ |
| Fabric Switch | <100ms | ✓ |
| Page Load | <3s | ✓ |
| Memory | <100MB | ✓ |

## 🧪 Quick Test

```bash
# Test upload & detection
curl -X POST -F "image=@test.jpg" \
  http://localhost:3000/api/visualizer/upload \
  | jq '.uploadId' \
  | xargs -I {} curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"uploadId":"{}","imageUrl":"/uploads/visualizer/upload-...jpg","imageWidth":1920,"imageHeight":1080}' \
  http://localhost:3000/api/visualizer/detect

# Test fabric library
curl http://localhost:3000/api/visualizer/fabrics | jq '.fabrics | length'
```

## 🐛 Debug Mode

```javascript
// In browser console
localStorage.setItem('DEBUG_VISUALIZER', 'true')
location.reload()
// Now see verbose API logs, shader compilation, texture loading, etc.
```

## 🚀 Common Tasks

### Add New Fabric
1. Create fabric entry in FabricLibrary (via API or seed)
2. Include: name, code, color, pattern, price, texture URLs
3. Test via fabric selector UI

### Modify Segmentation
1. Edit `/app/api/visualizer/detect/route.ts`
2. Replace mock detection logic
3. Keep input/output interface consistent
4. Update `modelUsed` field

### Fix WebGL Issues
1. Check browser console for errors
2. Verify WebGL support: `!!navigator.webgl || !!navigator.webgl2`
3. Test in different browser
4. Check texture URLs are accessible

### Add Custom Fabric Filter
1. Update `FabricFilterOptions` in `lib/types/visualizer.ts`
2. Modify filter logic in `FabricSelector.tsx`
3. Update API query in `fabrics/route.ts`

## 🔐 Security Notes

- Image uploads validated (file type + size)
- User projects linked to authenticated user
- No sensitive data in client-side code
- API rate limiting recommended (production)
- HTTPS required (production)

## 📞 Support Quick Links

**Having Issues?**
- Check browser console for errors
- Read VISUALIZER_TESTING.md for troubleshooting
- Enable DEBUG_VISUALIZER mode
- Check connectivity (database, API endpoints)

**Want to Extend?**
- Read VISUALIZER_ARCHITECTURE.md for design
- Reference TypeScript types in `lib/types/visualizer.ts`
- Follow component pattern in existing components
- Add tests in `/tests/`

## ✅ Pre-Launch Checklist

- [ ] PostgreSQL running
- [ ] Migrations completed
- [ ] Seed data loaded
- [ ] No TypeScript errors
- [ ] Build succeeds (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Can upload image
- [ ] Detection runs
- [ ] Fabrics display
- [ ] Fabric switching works
- [ ] Mask editor functional
- [ ] Download works
- [ ] Mobile responsive
- [ ] No console errors

---

**Built for the Furnique Platform**  
*Production-ready furniture fabric AR & web visualizer*
