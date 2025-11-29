export type Item = {
  id?: string;
  type: string;
  name?: string;
  quantity: number;
  width?: number; // meters or inches depending on context
  height?: number; // meters or inches depending on context
  depth?: number; // for sofas/benches
  length?: number; // for cushions/benches
  thickness?: number; // for cushions/benches
  description?: string;
  // Furniture-specific options
  sizeOption?: 'small' | 'medium' | 'large' | 'twin' | 'full' | 'queen' | 'king'; // for headboards, bed throws
  headboardSize?: 'twin' | 'full' | 'queen' | 'king';
  bedSize?: 'twin' | 'full' | 'queen' | 'king';
  dropSize?: 'small' | 'medium' | 'large';
  cushionSize?: 'small' | 'large';
  // Curtain-specific
  rodWidth?: number;
  finishedLength?: number;
  fabricWidthIn?: number;
  patternRepeat?: number;
  style?: string;
  fabricPricePerYd?: number;
  liningPricePerYd?: number;
}

export type Room = {
  id: string;
  name?: string;
  width: number; // meters
  height: number; // meters
  depth?: number; // meters (optional - for sofas/chairs footprint)
  items: Item[];
}

export type FabricType = 'cotton' | 'silk' | 'wool' | 'linen' | 'velvet' | 'jacquard'

// Fabric characteristics for waste calculation
const fabricCharacteristics: Record<FabricType, { wasteMultiplier: number; minYardage: number }> = {
  cotton: { wasteMultiplier: 1.12, minYardage: 0.5 },
  silk: { wasteMultiplier: 1.2, minYardage: 0.75 },
  wool: { wasteMultiplier: 1.15, minYardage: 0.6 },
  linen: { wasteMultiplier: 1.18, minYardage: 0.7 },
  velvet: { wasteMultiplier: 1.25, minYardage: 0.8 }, // higher waste due to pile direction
  jacquard: { wasteMultiplier: 1.22, minYardage: 0.75 },
}

// FURNITURE YARDAGE DEFAULTS (54" usable width, no large pattern match)
// All values in yards, rounded up to nearest 0.25 yd

const FURNITURE_YARDAGE_DEFAULTS: Record<string, number> = {
  'sofa-2seater': 14,      // 2-cushion sofa/love seat
  'sofa-3seater': 18,      // 3-cushion sofa
  'sofa-4seater': 22,      // 4-seater large sofa
  'armchair': 7,           // standard armchair/lounge chair
  'ottoman': 3,            // ottoman
  'cushion-small': 0.75,   // small cushion (16"-18")
  'cushion-large': 1.0,    // large cushion (20"-24")
  'chair-dining': 0.75,    // dining chair seat only
  'bench': 2,              // bench cushion (fallback when no dims)
  'headboard-twin': 2,
  'headboard-full': 4,
  'headboard-queen': 4.5,
  'headboard-king': 5.5,
  'bed-throw-twin': 3,
  'bed-throw-full': 3.5,
  'bed-throw-queen': 4,
  'bed-throw-king': 4.5,
}

// Item type to average fabric consumption (in sq meters) - legacy
const itemFabricConsumption: Record<string, number> = {
  sofa_2seater: 3.5,
  sofa_3seater: 5.0,
  sofa_4seater: 6.5,
  armchair: 2.0,
  ottoman: 1.0,
  cushion_small: 0.3,
  cushion_large: 0.6,
  curtains_per_window: 2.5,
  cushion_generic: 0.4,
  chair_dining: 0.5,
  bench: 2.0,
  headboard: 3.0,
  bed_throw: 2.5,
}

/**
 * Round up to nearest 0.25 yard
 */
function roundToNearestQuarterYard(yards: number): number {
  return Math.ceil(yards * 4) / 4
}

// Fabric width constants
const FABRIC_WIDTH_IN = 54
const FABRIC_WIDTH_M = FABRIC_WIDTH_IN * 0.0254 // 1 inch = 0.0254 m

/**
 * Calculate yardage for a single furniture item
 * All dimension inputs are in inches; output is in yards
 */
export function calculateFurnitureYardage(item: Item): {
  yardage: number
  meters?: number
  areaSqFt?: number
  details: string
} {
  const type = (item.type || '').toLowerCase().trim()

  // SOFAS
  if (type.includes('sofa-2') || type.includes('2-seater') || type.includes('love seat')) {
    const base = FURNITURE_YARDAGE_DEFAULTS['sofa-2seater']
    const meters = Math.round(base * 0.9144 * 100) / 100
    const areaM2 = meters * FABRIC_WIDTH_M
    const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
    return {
      yardage: base,
      meters,
      areaSqFt,
      details: `2-seater sofa: ${base} yd (chart default for 2-cushion sofas)`
    }
  }
  if (type.includes('sofa-3') || type.includes('3-seater')) {
    const base = FURNITURE_YARDAGE_DEFAULTS['sofa-3seater']
    const meters = Math.round(base * 0.9144 * 100) / 100
    const areaM2 = meters * FABRIC_WIDTH_M
    const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
    return {
      yardage: base,
      meters,
      areaSqFt,
      details: `3-seater sofa: ${base} yd (chart default for 3-cushion sofas)`
    }
  }
  if (type.includes('sofa-4') || type.includes('4-seater') || type.includes('large sofa')) {
    const base = FURNITURE_YARDAGE_DEFAULTS['sofa-4seater']
    const meters = Math.round(base * 0.9144 * 100) / 100
    const areaM2 = meters * FABRIC_WIDTH_M
    const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
    return {
      yardage: base,
      meters,
      areaSqFt,
      details: `4-seater sofa: ${base} yd (chart default for large sofas)`
    }
  }

  // If generic "sofa" without size, default to 3-seater
  if (type.includes('sofa') && !type.includes('seater')) {
    const base = FURNITURE_YARDAGE_DEFAULTS['sofa-3seater']
    return {
      yardage: base,
      details: `Sofa (default 3-seater): ${base} yd`
    }
  }

  // ARMCHAIR / LOUNGE CHAIR
  if (type.includes('armchair') || type.includes('lounge chair') || (type.includes('chair') && !type.includes('dining'))) {
    if (item.width && item.height) {
      // Dimension-based calculation for custom armchair
      const panelWidth = (item.width + 2 * 1) // 1" seam allowance each side
      const panelHeight = (item.height + 2 * 1)
      const piecesPerRow = Math.max(1, Math.floor(54 / panelWidth))
      const rows = Math.ceil(2 / piecesPerRow) // front + back
      const totalLengthIn = rows * panelHeight
      const yardage = roundToNearestQuarterYard(Math.max(7, totalLengthIn / 36))
      const meters = Math.round(yardage * 0.9144 * 100) / 100
      const areaM2 = meters * FABRIC_WIDTH_M
      const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
      return {
        yardage,
        meters,
        areaSqFt,
        details: `Armchair (dimension-based): ${yardage} yd`
      }
    }
    const base = FURNITURE_YARDAGE_DEFAULTS['armchair']
    const meters = Math.round(base * 0.9144 * 100) / 100
    const areaM2 = meters * FABRIC_WIDTH_M
    const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
    return {
      yardage: base,
      meters,
      areaSqFt,
      details: `Armchair: ${base} yd (standard default)`
    }
  }

  // OTTOMAN
  if (type.includes('ottoman')) {
    if (item.width && item.height) {
      // Dimension-based
      const panelWidth = (item.width + 2 * 1)
      const panelHeight = (item.height + 2 * 1)
      const piecesPerRow = Math.max(1, Math.floor(54 / panelWidth))
      const rows = Math.ceil(2 / piecesPerRow) // front + back
      const totalLengthIn = rows * panelHeight
      const yardage = roundToNearestQuarterYard(Math.max(3, totalLengthIn / 36))
      const meters = Math.round(yardage * 0.9144 * 100) / 100
      const areaM2 = meters * FABRIC_WIDTH_M
      const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
      return {
        yardage,
        meters,
        areaSqFt,
        details: `Ottoman (dimension-based): ${yardage} yd`
      }
    }
    const base = FURNITURE_YARDAGE_DEFAULTS['ottoman']
    const meters = Math.round(base * 0.9144 * 100) / 100
    const areaM2 = meters * FABRIC_WIDTH_M
    const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
    return {
      yardage: base,
      meters,
      areaSqFt,
      details: `Ottoman: ${base} yd (standard default)`
    }
  }

  // CUSHIONS
  if (type.includes('cushion-small') || type.includes('small cushion')) {
    const base = FURNITURE_YARDAGE_DEFAULTS['cushion-small']
      const meters = Math.round(base * 0.9144 * 100) / 100
      const areaM2 = meters * FABRIC_WIDTH_M
      const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
      return {
        yardage: base,
        meters,
        areaSqFt,
        details: `Small cushion (16"-18"): ${base} yd`
      }
  }
  if (type.includes('cushion-large') || type.includes('large cushion')) {
      const base = FURNITURE_YARDAGE_DEFAULTS['cushion-large']
      const meters = Math.round(base * 0.9144 * 100) / 100
      const areaM2 = meters * FABRIC_WIDTH_M
      const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
      return {
        yardage: base,
        meters,
        areaSqFt,
        details: `Large cushion (20"-24"): ${base} yd`
      }
  }
  if (type.includes('cushion')) {
    // Generic cushion with dimensions: width, height, thickness
    if (item.width && item.height) {
      const seamAllowance = 1
      const panelHeight = (item.height ?? 0) + 2 * seamAllowance
      const panelWidth = (item.width ?? 0) + 2 * seamAllowance
      const piecesPerRow = Math.max(1, Math.floor(54 / panelWidth))
      const rows = Math.ceil(2 / piecesPerRow) // front + back
      const totalLengthIn = rows * panelHeight
      const yardage = roundToNearestQuarterYard(totalLengthIn / 36)
      const finalYd = Math.max(0.75, yardage)
      const meters = Math.round(finalYd * 0.9144 * 100) / 100
      const areaM2 = meters * FABRIC_WIDTH_M
      const areaSqFt = Math.round(areaM2 * 10.7639 * 100) / 100
      return {
        yardage: finalYd,
        meters,
        areaSqFt,
        details: `Cushion (${item.width}"×${item.height}"): ${finalYd} yd`
      }
    }
    // Fallback to small cushion if no dimensions
    const base = FURNITURE_YARDAGE_DEFAULTS['cushion-small']
    return {
      yardage: base,
      details: `Cushion (generic): ${base} yd`
    }
  }

  // DINING CHAIRS
  if (type.includes('chair-dining') || type.includes('dining chair')) {
    const base = FURNITURE_YARDAGE_DEFAULTS['chair-dining']
    return {
      yardage: base,
      details: `Dining chair (seat only): ${base} yd`
    }
  }

  // BENCH (cushion)
  if (type.includes('bench')) {
    if (item.length && item.width && item.thickness) {
      // Dimension-based: treat as rectangular cushion
      const seamAllowance = 1
      const panelHeight = (item.length ?? 0) + 2 * seamAllowance
      const panelWidth = (item.width ?? 0) + 2 * seamAllowance
      const piecesPerRow = Math.max(1, Math.floor(54 / panelWidth))
      const rows = Math.ceil(2 / piecesPerRow) // top + bottom only (one set)
      const totalLengthIn = rows * panelHeight
      const yardage = roundToNearestQuarterYard(totalLengthIn / 36)
      return {
        yardage: Math.max(2, yardage),
        details: `Bench (${item.length}"×${item.width}"): ${Math.max(2, yardage)} yd`
      }
    }
    const base = FURNITURE_YARDAGE_DEFAULTS['bench']
    return {
      yardage: base,
      details: `Bench cushion: ${base} yd (typical 4-5 ft bench)`
    }
  }

  // HEADBOARD (upholstered)
  if (type.includes('headboard')) {
    const size = (item.headboardSize || item.sizeOption || 'queen').toLowerCase()
    const key = `headboard-${size}`
    const yardage = FURNITURE_YARDAGE_DEFAULTS[key] || FURNITURE_YARDAGE_DEFAULTS['headboard-queen']
    return {
      yardage,
      details: `${size.charAt(0).toUpperCase() + size.slice(1)} headboard: ${yardage} yd`
    }
  }

  // BED THROW / BED RUNNER
  if (type.includes('bed-throw') || type.includes('bed throw') || type.includes('bed runner')) {
    const size = (item.bedSize || item.sizeOption || 'queen').toLowerCase()
    const key = `bed-throw-${size}`
    const yardage = FURNITURE_YARDAGE_DEFAULTS[key] || FURNITURE_YARDAGE_DEFAULTS['bed-throw-queen']
    return {
      yardage,
      details: `${size.charAt(0).toUpperCase() + size.slice(1)} bed throw: ${yardage} yd`
    }
  }

  // Default fallback
  return {
    yardage: 1,
    details: `${type}: 1 yd (default fallback)`
  }
}

/**
 * Calculate total yardage for an item (quantity * per-item yardage)
 */
export function calculateItemTotalYardage(item: Item): number {
  const { yardage } = calculateFurnitureYardage(item)
  return roundToNearestQuarterYard(yardage * (item.quantity || 1))
}

/**
 * Calculate fabric needed for a single room
 * Uses furniture-specific yardage rules for all item types
 * Returns both breakdown by item and total for the room
 */
export function calculateFabricForRoom(room: Room): {
  items: Array<{ name: string; type: string; quantity: number; perItemYards: number; totalYards: number; perItemMeters?: number; totalMeters?: number; perItemSqFt?: number; totalSqFt?: number; details: string }>
  totalYards: number
  totalMeters: number
  totalSqFt: number
} {
  const items: Array<{ name: string; type: string; quantity: number; perItemYards: number; totalYards: number; perItemMeters?: number; totalMeters?: number; perItemSqFt?: number; totalSqFt?: number; details: string }> = []
  let totalYards = 0
  let totalMeters = 0
  let totalSqFt = 0

  if (room.items && room.items.length > 0) {
    for (const item of room.items) {
      let itemYardage = 0
      let details = ''

      // Special handling for curtains: use curtain-specific breakdown
      if (item.type && item.type.toLowerCase().includes('curtain')) {
        const breakdown = calculateCurtainBreakdown(item, { wasteMultiplier: 1.0, minYardage: 0.5 }, 0)
        const itemYards = (breakdown.totalFabricYds || 0) + (breakdown.totalLiningYds || 0)
        const itemMeters = (breakdown.totalFabricMeters || 0) + (breakdown.totalLiningMeters || 0)
        const itemSqFt = (breakdown.totalFabricSqFt || 0) + (breakdown.totalLiningSqFt || 0)
        itemYardage = roundToNearestQuarterYard(itemYards)
        details = `Rod ${breakdown.rodWidthIn}" × ${breakdown.finishedLengthIn}" (${breakdown.fullnessFactor}× fullness)`

        items.push({
          name: item.name || `${item.type} × ${item.quantity}`,
          type: item.type,
          quantity: item.quantity || 1,
          perItemYards: Math.round(itemYards / Math.max(1, item.quantity || 1) * 100) / 100,
          totalYards: Math.round(itemYardage * 100) / 100,
          perItemMeters: Math.round(itemMeters / Math.max(1, item.quantity || 1) * 100) / 100,
          totalMeters: Math.round(itemMeters * 100) / 100,
          perItemSqFt: Math.round(itemSqFt / Math.max(1, item.quantity || 1) * 100) / 100,
          totalSqFt: Math.round(itemSqFt * 100) / 100,
          details,
        })

        totalYards += itemYardage
        totalMeters += itemMeters
        totalSqFt += itemSqFt
        continue
      } else {
        // Use furniture yardage rules
        const calc = calculateFurnitureYardage(item)
        const perItemYds = calc.yardage
        const perItemMeters = calc.meters ?? Math.round(perItemYds * 0.9144 * 100) / 100
        const perItemAreaSqFt = calc.areaSqFt ?? Math.round((perItemMeters * FABRIC_WIDTH_M) * 10.7639 * 100) / 100
        itemYardage = roundToNearestQuarterYard(perItemYds * (item.quantity || 1))
        details = calc.details

        items.push({
          name: item.name || `${item.type} × ${item.quantity}`,
          type: item.type,
          quantity: item.quantity || 1,
          perItemYards: Math.round(perItemYds * 100) / 100,
          totalYards: itemYardage,
          perItemMeters: Math.round(perItemMeters * 100) / 100,
          totalMeters: Math.round(perItemMeters * (item.quantity || 1) * 100) / 100,
          perItemSqFt: Math.round(perItemAreaSqFt * 100) / 100,
          totalSqFt: Math.round(perItemAreaSqFt * (item.quantity || 1) * 100) / 100,
          details,
        })

        totalYards += itemYardage
        totalMeters += perItemMeters * (item.quantity || 1)
        totalSqFt += perItemAreaSqFt * (item.quantity || 1)
      }
    }
  }

  return {
    items,
    totalYards: roundToNearestQuarterYard(totalYards),
    totalMeters: Math.round(totalMeters * 100) / 100,
    totalSqFt: Math.round(totalSqFt * 100) / 100,
  }
}

/**
 * Calculate curtain fabric required for a single curtain-type item.
 * Accepts convention-over-configuration values from the `Item` object:
 * - `width` : window width in meters (required fallback 1.5)
 * - `height`: drop / curtain length in meters (required fallback 2.0)
 * - `fullness`: fullness multiplier (1.5-2.5, default 2.0)
 * - `fabricWidth`: usable fabric width in meters (default 1.4)
 * - `hem`: hem allowance in meters (default 0.2)
 * - `header`: heading allowance in meters (default 0.15)
 * - `patternRepeat`: vertical pattern repeat in meters (default 0)
 * - `lining`: boolean whether lining is included (adds multiplier, default false)
 */
export function calculateCurtainForItem(
  item: Item,
  fabricChar: { wasteMultiplier: number; minYardage: number },
  fabricRepeat = 0
) {
  const qty = item.quantity || 1
  const windowWidth = item.width ?? 1.5 // meters
  const drop = item.height ?? 2.0 // meters
  const fullness = (item as any).fullness ?? 2.0
  const fabricWidth = (item as any).fabricWidth ?? 1.4 // meters
  const hem = (item as any).hem ?? 0.2
  const header = (item as any).header ?? 0.15
  const patternRepeat = (item as any).patternRepeat ?? 0
  const lining = (item as any).lining ? 1.5 : 1 // rough multiplier for lining

  // Total running width required across the pelmet/track
  const requiredRunningWidth = windowWidth * fullness

  // Number of fabric widths (panels) required per curtain
  const numberOfWidths = Math.max(1, Math.ceil(requiredRunningWidth / fabricWidth))

  // Length per width including hems and header
  let lengthPerWidth = drop + hem + header

  // If a vertical pattern repeat exists, round each length up to nearest repeat
  if (patternRepeat > 0) {
    lengthPerWidth = Math.ceil(lengthPerWidth / patternRepeat) * patternRepeat
  }

  // Apply fabric repeat factor (repeat on fabric direction if requested)
  const repeatMultiplier = 1 + Math.max(0, fabricRepeat)

  // Total meters for this item (all panels * length per panel * qty)
  const rawMeters = numberOfWidths * lengthPerWidth * qty * lining * repeatMultiplier

  // Apply waste multiplier from fabric characteristics
  const metersWithWaste = rawMeters * fabricChar.wasteMultiplier

  // Respect minimum yardage per item (convert to meters where minYardage may represent meters)
  const min = fabricChar.minYardage
  const final = Math.max(min * qty, metersWithWaste)

  return Math.ceil(final * 100) / 100
}

/**
 * Return a detailed breakdown for curtain calculation so the UI can show separate
 * fabric meters, lining meters, and final meters after waste.
 */
export function calculateCurtainBreakdown(
  item: Item,
  fabricChar: { wasteMultiplier: number; minYardage: number },
  fabricRepeat = 0
) {
  // Implements the INCH-based rules exactly.
  // Accepts `item` dimensions in inches. If `item._unit === 'm'` or `item.unit === 'metric'` the values are converted to inches.
  const qty = item.quantity || 1

  const toInches = (v?: number) => {
    if (!v) return 0
    if ((item as any)._unit === 'm' || (item as any).unit === 'm' || (item as any).unit === 'metric') {
      return v * 39.3700787
    }
    return v
  }

  const rodWidthIn = toInches((item as any).rodWidth ?? item.width) || 0
  const finishedLengthIn = toInches((item as any).finishedLength ?? (item as any).height ?? item.height) || 0
  const fabricWidthIn = (item as any).fabricWidthIn ?? (item as any).fabricWidth ?? 48
  const patternRepeatIn = (item as any).patternRepeat ?? 0
  const style = ((item as any).style || '').toString().toLowerCase()

  // Fullness factor by style
  let fullnessFactor = 2.5
  if (['eyelet', 'pencil', 'pencil pleat', 'standard', 'standard pleat'].some(s => style.includes(s))) {
    fullnessFactor = 2.5
  } else if (['wave', 'triple', 'very full'].some(s => style.includes(s))) {
    fullnessFactor = 3.0
  } else if (['rod pocket', 'tab top', 'tab-top', 'budget'].some(s => style.includes(s))) {
    fullnessFactor = 1.5
  }

  // Step 1: total flat width needed
  const totalFlatWidthIn = rodWidthIn * fullnessFactor

  // Step 2: number of fabric widths (drops), always round up
  const rawWidths = totalFlatWidthIn / fabricWidthIn
  const widthCount = Math.max(1, Math.ceil(rawWidths))

  // Step 3: cut length per drop
  const baseCutLengthIn = finishedLengthIn + 10 // 4" top + 6" bottom
  let cutLengthIn = baseCutLengthIn
  if (patternRepeatIn > 0) {
    const repeatCount = Math.ceil(baseCutLengthIn / patternRepeatIn)
    cutLengthIn = repeatCount * patternRepeatIn
  }

  // Step 4: total fabric length required
  const totalFabricIn = cutLengthIn * widthCount
  const totalFabricYds = Math.round((totalFabricIn / 36) * 100) / 100
  const totalFabricMeters = Math.round(totalFabricIn * 0.0254 * 100) / 100
  // area in square feet = (total linear inches * fabric width in inches) / 144
  const totalFabricSqFt = Math.round((totalFabricIn * fabricWidthIn / 144) * 100) / 100

  // Step 5: lining
  const liningCutLengthIn = finishedLengthIn + 8
  const totalLiningIn = liningCutLengthIn * widthCount
  const totalLiningYds = Math.round((totalLiningIn / 36) * 100) / 100
  const totalLiningMeters = Math.round(totalLiningIn * 0.0254 * 100) / 100
  const totalLiningSqFt = Math.round((totalLiningIn * fabricWidthIn / 144) * 100) / 100

  // Step 6: actual fullness for display
  const actualFullness = (fabricWidthIn * widthCount) / Math.max(1, rodWidthIn)

  // Optional costing (use meters for cost calculations)
  const fabricPricePerYd = (item as any).fabricPricePerYd ?? null
  const fabricPricePerM = (item as any).fabricPricePerM ?? (fabricPricePerYd != null ? fabricPricePerYd / 0.9144 : null)
  const liningPricePerYd = (item as any).liningPricePerYd ?? null
  const liningPricePerM = (item as any).liningPricePerM ?? (liningPricePerYd != null ? liningPricePerYd / 0.9144 : null)
  const fabricCost = fabricPricePerM != null ? Math.round(totalFabricMeters * fabricPricePerM) : null
  const liningCost = liningPricePerM != null ? Math.round(totalLiningMeters * liningPricePerM) : null

  // Track/tube length in feet
  const rodWidthFt = Math.round((rodWidthIn / 12) * 100) / 100
  const totalTrackLengthFt = Math.round((rodWidthFt * qty) * 100) / 100

  return {
    qty,
    rodWidthIn: Math.round(rodWidthIn * 100) / 100,
    rodWidthFt,
    finishedLengthIn: Math.round(finishedLengthIn * 100) / 100,
    fabricWidthIn: Math.round(fabricWidthIn * 100) / 100,
    patternRepeatIn: Math.round(patternRepeatIn * 100) / 100,
    fullnessFactor,
    totalFlatWidthIn: Math.round(totalFlatWidthIn * 100) / 100,
    rawWidths: Math.round(rawWidths * 100) / 100,
    widthCount,
    baseCutLengthIn: Math.round(baseCutLengthIn * 100) / 100,
    cutLengthIn: Math.round(cutLengthIn * 100) / 100,
    totalFabricIn: Math.round(totalFabricIn * 100) / 100,
    totalFabricYds,
    totalFabricMeters,
    totalFabricSqFt,
    liningCutLengthIn: Math.round(liningCutLengthIn * 100) / 100,
    totalLiningIn: Math.round(totalLiningIn * 100) / 100,
    totalLiningYds,
    totalLiningMeters,
    totalLiningSqFt,
    actualFullness: Math.round(actualFullness * 100) / 100,
    fabricCost,
    liningCost,
    totalTrackLengthFt,
  }
}

/**
 * Calculate total fabric for entire project (all rooms)
 * Returns breakdown by room and overall totals
 */
export function calculateProject(project: {
  rooms: Room[]
  fabricType?: FabricType
  fabricRepeat?: number
}): {
  roomBreakdowns: Array<{
    roomName: string
    itemBreakdowns: Array<{ name: string; type: string; quantity: number; perItemYards: number; totalYards: number; details: string; totalMeters?: number; totalSqFt?: number }>
    roomTotal: number
    roomMeters?: number
    roomSqFt?: number
  }>
  grandTotal: number
  grandTotalMeters: number
  grandTotalSqFt: number
} {
  const roomBreakdowns: Array<{
    roomName: string
    itemBreakdowns: Array<{ name: string; type: string; quantity: number; perItemYards: number; totalYards: number; details: string; totalMeters?: number; totalSqFt?: number }>
    roomTotal: number
    roomMeters?: number
    roomSqFt?: number
  }> = []
  let grandTotal = 0
  let grandTotalMeters = 0
  let grandTotalSqFt = 0

  for (const room of project.rooms || []) {
    const calc = calculateFabricForRoom(room)
    roomBreakdowns.push({
      roomName: room.name || 'Unnamed Room',
      itemBreakdowns: calc.items,
      roomTotal: calc.totalYards,
      roomMeters: calc.totalMeters,
      roomSqFt: calc.totalSqFt,
    })
    grandTotal += calc.totalYards
    grandTotalMeters += calc.totalMeters || 0
    grandTotalSqFt += calc.totalSqFt || 0
  }

  return {
    roomBreakdowns,
    grandTotal: roundToNearestQuarterYard(grandTotal),
    grandTotalMeters: Math.round(grandTotalMeters * 100) / 100,
    grandTotalSqFt: Math.round(grandTotalSqFt * 100) / 100,
  }
}

/**
 * Estimate cost based on fabric type and quantity
 */
export function estimateCost(
  fabricMeters: number,
  fabricType: FabricType = 'cotton',
  pricePerMeter: number = 1000
): number {
  // Adjusted pricing for different fabric types
  const pricingMultiplier: Record<FabricType, number> = {
    cotton: 1.0,
    silk: 3.5,
    wool: 2.0,
    linen: 1.8,
    velvet: 2.5,
    jacquard: 2.2,
  }

  return Math.round(fabricMeters * pricePerMeter * pricingMultiplier[fabricType])
}

/**
 * Get fabric consumption guidelines
 */
export function getFabricGuidelines(fabricType: FabricType) {
  return fabricCharacteristics[fabricType]
}

/**
 * Get all available fabric types
 */
export function getAvailableFabrics() {
  return Object.keys(fabricCharacteristics) as FabricType[]
}

/**
 * Get all available item types for suggestions
 */
export function getAvailableItemTypes() {
  return Object.keys(itemFabricConsumption)
}
