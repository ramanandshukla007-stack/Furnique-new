# Curtain Calculator Implementation – Inch-Based Rules

## Overview
Updated the Furnique curtain calculator to follow **exact INCH-based curtain calculation rules** with per-yard pricing and optional costing breakdowns.

---

## Changes Made

### 1. **lib/calculator.ts** – `calculateCurtainBreakdown` Function
Rewrote the function to follow the spec exactly:

#### **Inputs (in inches)**
- `rodWidth`: rod/track width in inches
- `finishedLength`: top-to-hem finished length in inches
- `fabricWidth`: usable fabric width in inches (default 48")
- `style`: curtain style (pencil, eyelet, wave, rod-pocket)
- `patternRepeat`: vertical pattern repeat in inches (0 if plain)
- `lining`: boolean whether lining is included
- `fabricPricePerYd`, `liningPricePerYd`: optional per-yard costs

#### **Calculation Steps**

1. **Fullness Factor by Style**
   - Pencil pleat / Eyelet / Standard: **2.5×**
   - Wave / Triple pleat: **3.0×**
   - Rod pocket / Tab top / Budget: **1.5×**

2. **Total Flat Width**
   - `totalFlatWidth = rodWidth × fullnessFactor`

3. **Number of Fabric Widths (Drops)**
   - `widthCount = ceil(totalFlatWidth / fabricWidth)` ← always round UP

4. **Cut Length per Drop**
   - Base: `finishedLength + 10"` (4" top + 6" bottom allowance)
   - If pattern repeat > 0: round UP to nearest full repeat
   - `cutLength = ceil(baseCutLength / patternRepeat) × patternRepeat`

5. **Total Fabric Length**
   - `totalFabricIn = cutLength × widthCount` (in inches)
   - `totalFabricYds = totalFabricIn / 36` (yards, rounded to 2 decimals)

6. **Lining**
   - Same width count: `liningWidths = widthCount`
   - Lining cut: `finishedLength + 8"` (shorter hem allowance)
   - `totalLiningYds = (finishedLength + 8) × widthCount / 36`

7. **Actual Fullness (for display)**
   - `actualFullness = (fabricWidth × widthCount) / rodWidth`

8. **Optional Costing**
   - `fabricCost = totalFabricYds × fabricPricePerYd` (if provided)
   - `liningCost = totalLiningYds × liningPricePerYd` (if provided)

#### **Output Object**
```typescript
{
  qty: number,
  rodWidthIn: number,
  finishedLengthIn: number,
  fabricWidthIn: number,
  patternRepeatIn: number,
  fullnessFactor: number,
  totalFlatWidthIn: number,
  rawWidths: number,
  widthCount: number,
  baseCutLengthIn: number,
  cutLengthIn: number,
  totalFabricIn: number,
  totalFabricYds: number,        // ← rounded to 2 decimals
  liningCutLengthIn: number,
  totalLiningIn: number,
  totalLiningYds: number,        // ← rounded to 2 decimals
  actualFullness: number,
  fabricCost: number | null,     // ← if pricePerYd provided
  liningCost: number | null,     // ← if pricePerYd provided
}
```

---

### 2. **components/CurtainCalculator.tsx** – Complete Rewrite
New UI component with **inch-based inputs** and **per-yard pricing**:

#### **Inputs**
- **Measurement Unit Toggle**: Metric (m) or Imperial (in)
- **Rod / Track Width**: in meters or inches (converted internally)
- **Finished Length**: in meters or inches
- **Number of Windows**: qty × window spec
- **Fabric Selection**: dropdown (cotton, silk, wool, linen, velvet, jacquard)
- **Curtain Style**: Pencil Pleat, Eyelet, Wave / Triple Pleat, Rod Pocket / Tab Top, Gathered
- **Usable Fabric Width**: inches (default 48")
- **Vertical Pattern Repeat**: inches (0 if none)
- **Rod/Channel**: checkbox to add to estimate
- **Lining Required**: None, Standard, or Thermal
- **Fabric Price / Yard**: ₹/yd (default 1000)
- **Lining Price / Yard**: ₹/yd (default 400)
- **Stitching Charges**: ₹/yd (default 120)
- **Accessories Cost**: ₹ (default 350)

#### **Calculation Breakdown Panel**
Shows live calculation steps for transparency:
- Rod Width, Finished Length (in inches)
- Fullness Factor (×)
- Total Flat Width (")
- Width Count (number of drops)
- Cut Length Per Drop (")
- Actual Fullness (×)
- Total Fabric (yd) & Total Lining (yd)

#### **Estimate Summary**
- **Fabric Required**: yardage
- **Fabric Cost**: ₹ (pricePerYd × yardage)
- **Lining Yards**: yardage
- **Lining Cost**: ₹
- **Stitching Charges**: ₹ (perYd × yardage)
- **Accessories**: ₹
- **Subtotal**: ₹
- **GST (18%)**: ₹
- **Total Estimate**: ₹ (in luxury dark-gray card)

#### **Metric to Inches Conversion**
If user selects "Metric", inputs are multiplied by **39.3700787** before passing to `calculateCurtainBreakdown`.

---

### 3. **components/ProjectEditor.tsx** – Integration
- Added **"+ Add Curtain"** button in each room's items section
- Opens `CurtainCalculator` inline for that room
- On "Add to Room/Project", appends curtain item to room with full option payload

---

### 4. **components/ARVisualizer.tsx** – Placeholder
- Added as a demo component for future AR/3D integration
- Mentions next steps: model-viewer or Three.js + WebXR

---

## How to Use

### Try it in the browser
1. **Start the dev server** (already running):
   ```bash
   npm run dev
   ```
2. Open **http://localhost:3000/calculator/new** (or create a new project)
3. Click **"+ Add Curtain"** in any room
4. Fill in the curtain details:
   - Select unit (Metric or Imperial)
   - Enter rod width and finished length
   - Set style, fabric, lining, pattern repeat
   - Adjust prices and charges as needed
5. See the **Calculation Breakdown** and **Estimate Summary** update live
6. Click **"+ Add to Room/Project"** to add the curtain to the room

### Example Inputs (Metric)
- Rod Width: **1.5 m** (59 inches)
- Finished Length: **2.1 m** (83 inches)
- Curtain Style: **Pencil Pleat** (2.5× fullness)
- Number of Windows: **1**
- Usable Fabric Width: **48"** (default)
- Lining: **Standard**
- Fabric Price / Yard: **₹1000**
- Stitching: **₹120/yd**
- Accessories: **₹350**

### Expected Calculation
- Rod 59" → 59 × 2.5 = **147.5" flat width**
- Drops = ceil(147.5 / 48) = **4 drops**
- Cut = 83 + 10 = **93" per drop** (no pattern repeat)
- Total fabric = 93 × 4 = **372 inches** = **10.33 yards**
- Lining = (83 + 8) × 4 / 36 = **10.08 yards**
- Fabric cost = 10.33 × 1000 = **₹10,330**
- Stitching = 10.33 × 120 = **₹1,240**
- Lining cost = 10.08 × 400 = **₹4,032**
- Accessories = **₹350**
- Subtotal = **₹15,952**
- GST = **₹2,871**
- **Total = ₹18,823**

---

## Key Features

✅ **Exact Inch-Based Rules**  
✅ **Fullness by Style** (pencil, eyelet, wave, rod-pocket)  
✅ **Pattern Repeat Rounding** (round cut length up to nearest repeat)  
✅ **Per-Yard Pricing** (not per-meter)  
✅ **Metric/Imperial Toggle** (automatic conversion)  
✅ **Live Calculation Breakdown** (transparent, educational)  
✅ **Full Cost Estimate** (fabric + lining + stitching + accessories + GST)  
✅ **Integrated into Project Editor** (add curtains per room)  

---

## Next Steps

### AR Visualization
User requested AR features (see reference: https://response-web-app.vercel.app/). To implement:
- Option 1: **model-viewer** library (easy, supports WebXR / AR Quick Look)
- Option 2: **Three.js + react-three-fiber** (flexible, custom compositing)
- Option 3: **Server-side masking + client canvas** (2D photo-based visualizer)

### Additional Enhancements
- Add pattern-matching rules (auto-suggest fullness/pattern based on fabric choice)
- Save curtain presets (favorite styles/options)
- Batch pricing (discount for multiple windows)
- Unit tests for `calculateCurtainBreakdown`
- Database persistence for saved curtain estimates

---

## Files Modified / Created

| File | Change |
|------|--------|
| `lib/calculator.ts` | Rewrote `calculateCurtainBreakdown` function with inch rules |
| `components/CurtainCalculator.tsx` | Complete rewrite for inch/yard pricing model |
| `components/ProjectEditor.tsx` | Added "+ Add Curtain" flow and curtain integration |
| `components/ARVisualizer.tsx` | New placeholder component |

---

## Testing

- ✅ **Build**: `npm run build` passes (no TS errors)
- ✅ **Dev server**: Running on http://localhost:3000
- ✅ **Calculator route**: http://localhost:3000/calculator/new accessible
- ✅ **Calculation logic**: Live breakdown and estimates update correctly

---

## References Used

- https://www.linkedin.com/pulse/how-calculate-yardage-window-coverings-drapes-curtains-%E9%A2%96%E5%B8%86-%E6%9D%8E
- https://www.onlinefabricstore.com/drapery-yardage-calculator.aspx
- https://www.thesewingdirectory.co.uk/measuring-windows-and-fabric-calculations/
- https://www.direct-fabrics.co.uk/understanding-curtain-fullness
- https://livingstonetextiles.com/blogs/tutorials/calculate-your-curtain-fabric

---

**Status**: ✅ Inch-based curtain calculator complete and ready for preview / AR integration work.
