export type Room = {
  id: string;
  name?: string;
  width: number; // meters
  height: number; // meters
  depth?: number; // meters (optional - for sofas/chairs footprint)
  items: Array<{ type: string; quantity: number; width?: number; height?: number }>;
}

export function calculateFabricForRoom(room: Room, fabricRepeat = 0.0) {
  // Very simple heuristic:
  // For each item, estimate area = width * height * quantity.
  // Fallback: use room area if no items.
  const roomArea = Math.max(0, room.width * room.height)

  let itemsArea = 0
  for (const it of room.items || []) {
    if (it.width && it.height) {
      itemsArea += it.width * it.height * (it.quantity || 1)
    }
  }

  const base = Math.max(itemsArea, roomArea * 0.2) // assume upholstery covers 20% of room area at minimum

  // Add waste and repeat
  const wasteMultiplier = 1.15
  const repeatMultiplier = 1 + fabricRepeat

  const metersRequired = base * wasteMultiplier * repeatMultiplier
  // Return meters (rounded to two decimals)
  return Math.ceil(metersRequired * 100) / 100
}

export function calculateProject(project: { rooms: Room[]; fabricRepeat?: number }) {
  const repeat = project.fabricRepeat ?? 0
  let total = 0
  for (const room of project.rooms || []) {
    total += calculateFabricForRoom(room, repeat)
  }
  return Math.ceil(total * 100) / 100
}
