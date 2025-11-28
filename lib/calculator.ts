export type Item = {
  id?: string;
  type: string;
  name?: string;
  quantity: number;
  width?: number; // meters
  height?: number; // meters
  description?: string;
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

// Item type to average fabric consumption (in sq meters)
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
 * Calculate fabric needed for a single room
 * Considers item types, fabric characteristics, and waste factors
 */
export function calculateFabricForRoom(
  room: Room,
  fabricType: FabricType = 'cotton',
  fabricRepeat = 0.0
) {
  const fabricChar = fabricCharacteristics[fabricType]
  const wasteMultiplier = fabricChar.wasteMultiplier

  let totalArea = 0

  // If items are defined with proper types
  if (room.items && room.items.length > 0) {
    for (const item of room.items) {
      let itemArea = 0

      // Special handling for curtains: use curtain-specific calculation
      if (item.type && item.type.toLowerCase().includes('curtain')) {
        const curtainMeters = calculateCurtainForItem(item, fabricChar, fabricRepeat)
        totalArea += curtainMeters
        continue
      }

      // Use preset consumption if available
      if (itemFabricConsumption[item.type]) {
        itemArea = itemFabricConsumption[item.type] * item.quantity
      } else if (item.width && item.height) {
        // Calculate custom dimensions
        itemArea = item.width * item.height * item.quantity
      } else {
        // Fallback: estimate based on item type keywords
        if (item.type.includes('sofa') || item.type.includes('couch')) {
          itemArea = 4.0 * item.quantity
        } else if (item.type.includes('chair')) {
          itemArea = 1.5 * item.quantity
        } else if (item.type.includes('cushion')) {
          itemArea = 0.4 * item.quantity
        } else if (item.type.includes('curtain')) {
          itemArea = 2.0 * item.quantity
        } else {
          itemArea = 1.0 * item.quantity
        }
      }

      totalArea += itemArea
    }
  } else {
    // Fallback: use room area
    const roomArea = Math.max(0, room.width * room.height)
    totalArea = Math.max(fabricChar.minYardage, roomArea * 0.15)
  }

  // Apply waste multiplier and fabric repeat
  const repeatMultiplier = 1 + Math.max(0, fabricRepeat)
  const fabricRequired = totalArea * wasteMultiplier * repeatMultiplier

  return Math.ceil(fabricRequired * 100) / 100
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

  // Step 5: lining
  const liningCutLengthIn = finishedLengthIn + 8
  const totalLiningIn = liningCutLengthIn * widthCount
  const totalLiningYds = Math.round((totalLiningIn / 36) * 100) / 100

  // Step 6: actual fullness for display
  const actualFullness = (fabricWidthIn * widthCount) / Math.max(1, rodWidthIn)

  // Optional costing
  const fabricPricePerYd = (item as any).fabricPricePerYd ?? null
  const liningPricePerYd = (item as any).liningPricePerYd ?? null
  const fabricCost = fabricPricePerYd != null ? Math.round(totalFabricYds * fabricPricePerYd) : null
  const liningCost = liningPricePerYd != null ? Math.round(totalLiningYds * liningPricePerYd) : null

  return {
    qty,
    rodWidthIn: Math.round(rodWidthIn * 100) / 100,
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
    liningCutLengthIn: Math.round(liningCutLengthIn * 100) / 100,
    totalLiningIn: Math.round(totalLiningIn * 100) / 100,
    totalLiningYds,
    actualFullness: Math.round(actualFullness * 100) / 100,
    fabricCost,
    liningCost,
  }
}

/**
 * Calculate total fabric for entire project
 */
export function calculateProject(project: {
  rooms: Room[]
  fabricType?: FabricType
  fabricRepeat?: number
}) {
  const fabricType = project.fabricType || 'cotton'
  const repeat = Math.max(0, project.fabricRepeat ?? 0)

  let total = 0
  for (const room of project.rooms || []) {
    total += calculateFabricForRoom(room, fabricType, repeat)
  }

  return Math.ceil(total * 100) / 100
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
