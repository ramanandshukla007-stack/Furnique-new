"use client"
import React, { useState, useMemo } from 'react'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import { calculateFabricForRoom, calculateProject, getAvailableItemTypes, getAvailableFabrics, type FabricType } from '@/lib/calculator'
import CurtainCalculator from '@/components/CurtainCalculator'
import { useToast } from '@/components/ToastProvider'

type Item = { id: string; type: string; name?: string; quantity: number; width?: number; height?: number }
type Room = { id: string; name?: string; width: number; height: number; depth?: number; items: Item[] }

export default function ProjectEditor({ initial, onSave }: { initial?: any; onSave?: (proj: any) => void }) {
  const initialRooms: Room[] = initial?.rooms ?? []
  const [name, setName] = useState(initial?.name ?? '')
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [fabricType, setFabricType] = useState<FabricType>(initial?.fabricType ?? 'cotton')
  const [fabricRepeat, setFabricRepeat] = useState(initial?.fabricRepeat ?? 0)
  const [saving, setSaving] = useState(false)
  const [expandedRoom, setExpandedRoom] = useState<string | null>(rooms[0]?.id ?? null)
  const [openCurtainForRoom, setOpenCurtainForRoom] = useState<string | null>(null)
  const { showToast } = useToast()

  const itemTypes = getAvailableItemTypes()
  const fabricTypes = getAvailableFabrics()

  // Calculate total fabric needed (project-wide), returns yards and breakdowns
  const { roomBreakdowns, grandTotal: totalYards } = useMemo(() => {
    return calculateProject({ rooms, fabricType, fabricRepeat })
  }, [rooms, fabricType, fabricRepeat])

  // Rough estimated cost at ₹500 per yard
  const estimatedCost = useMemo(() => {
    return Math.round(totalYards * 500)
  }, [totalYards])

  function addRoom() {
    const newRoom: Room = {
      id: uuidv4(),
      name: `Room ${rooms.length + 1}`,
      width: 4,
      height: 3,
      depth: 1,
      items: [],
    }
    setRooms([...rooms, newRoom])
    setExpandedRoom(newRoom.id)
  }

  function removeRoom(id: string) {
    setRooms(rooms.filter((r) => r.id !== id))
    if (expandedRoom === id) {
      setExpandedRoom(rooms[0]?.id ?? null)
    }
  }

  function updateRoom(id: string, patch: Partial<Room>) {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function addItem(roomId: string) {
    const item: Item = { id: uuidv4(), type: 'sofa_3seater', name: '3-Seater Sofa', quantity: 1 }
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      updateRoom(roomId, { items: [...room.items, item] })
    }
  }

  function removeItem(roomId: string, itemId: string) {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return
    updateRoom(roomId, { items: room.items.filter((i) => i.id !== itemId) })
  }

  function updateItem(roomId: string, itemId: string, patch: Partial<Item>) {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return
    updateRoom(roomId, {
      items: room.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    })
  }

  function validate() {
    if (!name.trim()) return 'Project name is required'
    if (rooms.length === 0) return 'Add at least one room'
    for (const r of rooms) {
      if (!r.width || r.width <= 0) return `Room "${r.name}" requires valid width`
      if (!r.height || r.height <= 0) return `Room "${r.name}" requires valid height`
      for (const it of r.items) {
        if (!it.quantity || it.quantity < 1) return `All items must have quantity ≥ 1`
      }
    }
    return null
  }

  async function save() {
    const err = validate()
    if (err) {
      showToast(err, 'error')
      return
    }
    setSaving(true)
    try {
      const payload = { name: name || 'Project', rooms, fabricType, fabricRepeat }
      let data
      if (initial?.id) {
        const res = await fetch(`/api/calculator/${initial.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update project')
        data = await res.json()
      } else {
        const res = await fetch('/api/calculator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create project')
        data = await res.json()
      }
      const project = data.project ?? data
      showToast(initial?.id ? 'Project updated' : 'Project created', 'success')
      onSave?.(project)
    } catch (e: any) {
      showToast(e?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-luxury-deep-gray to-luxury-deep-gray rounded-lg p-6 md:p-8 border-2 border-luxury-gold">
        <h2 className="font-serif text-3xl font-bold text-luxury-gold mb-2">Fabric Calculator</h2>
        <p className="text-luxury-light-gray">Design your perfect interior with our advanced fabric calculator</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-luxury p-6">
          <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Total Fabric Needed</div>
          <div className="text-3xl font-serif font-bold text-luxury-gold">{totalYards} yards</div>
          <div className="text-xs text-luxury-sage mt-2">(54" standard width)</div>
        </div>

        <div className="card-luxury p-6">
          <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Estimated Cost</div>
          <div className="text-3xl font-serif font-bold text-luxury-gold">₹{(estimatedCost / 100).toLocaleString()}</div>
          <div className="text-xs text-luxury-sage mt-2">{fabricType} fabric</div>
        </div>

        <div className="card-luxury p-6">
          <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Total Rooms</div>
          <div className="text-3xl font-serif font-bold text-luxury-gold">{rooms.length}</div>
          <div className="text-xs text-luxury-sage mt-2">{rooms.reduce((acc, r) => acc + r.items.length, 0)} items</div>
        </div>
      </div>

      {/* Project Settings */}
      <div className="card-luxury p-6 md:p-8 space-y-4">
        <h3 className="font-serif text-xl font-bold text-luxury-deep-gray">Project Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-luxury-deep-gray mb-2">Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Living Room Makeover"
              className="w-full px-4 py-3 border-2 border-luxury-gold border-opacity-30 rounded bg-luxury-soft-cream text-luxury-deep-gray focus:border-opacity-100 focus:outline-none transition-colors"
            />
          </div>

          {/* Fabric Type */}
          <div>
            <label className="block text-sm font-semibold text-luxury-deep-gray mb-2">Fabric Type</label>
            <select
              value={fabricType}
              onChange={(e) => setFabricType(e.target.value as FabricType)}
              className="w-full px-4 py-3 border-2 border-luxury-gold border-opacity-30 rounded bg-luxury-soft-cream text-luxury-deep-gray focus:border-opacity-100 focus:outline-none transition-colors"
            >
              {fabricTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fabric Repeat */}
        <div>
          <label className="block text-sm font-semibold text-luxury-deep-gray mb-2">
            Pattern Repeat: {(fabricRepeat * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.05"
            value={fabricRepeat}
            onChange={(e) => setFabricRepeat(Number(e.target.value))}
            className="w-full cursor-pointer accent-luxury-gold"
          />
          <p className="text-xs text-luxury-sage mt-2">Adjust for patterned fabrics that require alignment</p>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="card-luxury p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-bold text-luxury-deep-gray">Design Rooms</h3>
          <button
            onClick={addRoom}
            className="btn-luxury-primary text-sm"
          >
            + Add Room
          </button>
        </div>

        <div className="space-y-3">
          {rooms.length === 0 ? (
            <p className="text-center text-luxury-sage py-8">No rooms added yet. Start by creating your first room.</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="border-2 border-luxury-gold border-opacity-20 rounded-lg overflow-hidden hover:border-opacity-40 transition-all">
                {/* Room Header */}
                <button
                  onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
                  className="w-full px-6 py-4 bg-luxury-gold bg-opacity-5 flex items-center justify-between hover:bg-opacity-10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <svg className="w-5 h-5 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-luxury-deep-gray">{room.name}</div>
                      <div className="text-xs text-luxury-sage">{room.width}m × {room.height}m • {room.items.length} items</div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-luxury-gold transition-transform ${expandedRoom === room.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Room Details */}
                {expandedRoom === room.id && (
                  <div className="px-6 py-4 bg-luxury-soft-cream border-t-2 border-luxury-gold border-opacity-20 space-y-4">
                    {/* Room Dimensions */}
                    <div>
                      <label className="block text-xs font-semibold text-luxury-deep-gray mb-3 uppercase tracking-wide">Room Dimensions</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-luxury-sage mb-1 block">Width (m)</label>
                          <input
                            type="number"
                            value={room.width}
                            onChange={(e) => updateRoom(room.id, { width: Number(e.target.value) })}
                            min="1"
                            step="0.5"
                            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded bg-white text-luxury-deep-gray focus:outline-none focus:border-opacity-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-luxury-sage mb-1 block">Height (m)</label>
                          <input
                            type="number"
                            value={room.height}
                            onChange={(e) => updateRoom(room.id, { height: Number(e.target.value) })}
                            min="1"
                            step="0.5"
                            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded bg-white text-luxury-deep-gray focus:outline-none focus:border-opacity-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-luxury-sage mb-1 block">Room Name</label>
                          <input
                            type="text"
                            value={room.name || ''}
                            onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                            placeholder="Living Room"
                            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded bg-white text-luxury-deep-gray focus:outline-none focus:border-opacity-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="pt-2 border-t border-luxury-gold border-opacity-20">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-luxury-deep-gray uppercase tracking-wide">Furniture Items</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addItem(room.id)}
                            className="text-xs font-semibold text-luxury-gold hover:text-luxury-dark-gold transition-colors"
                          >
                            + Add Item
                          </button>
                          <button
                            onClick={() => setOpenCurtainForRoom(room.id)}
                            className="text-xs font-semibold text-luxury-gold hover:text-luxury-dark-gold transition-colors"
                          >
                            + Add Curtain
                          </button>
                        </div>
                      </div>

                      {room.items.length === 0 ? (
                        <p className="text-xs text-luxury-sage py-2">No items added. Add furniture to calculate fabric needs.</p>
                      ) : (
                        <div className="space-y-2">
                          {room.items.map((item) => (
                            <div key={item.id} className="flex gap-2 items-end bg-white p-3 rounded border border-luxury-gold border-opacity-30">
                              <select
                                value={item.type}
                                onChange={(e) => updateItem(room.id, item.id, { type: e.target.value })}
                                className="flex-1 px-3 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
                              >
                                {itemTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type.replace(/_/g, ' ')}
                                  </option>
                                ))}
                              </select>
                              <div className="w-16">
                                <label className="text-xs text-luxury-sage">Qty</label>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(room.id, item.id, { quantity: Number(e.target.value) })}
                                  min="1"
                                  className="w-full px-2 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
                                />
                              </div>
                              <button
                                onClick={() => removeItem(room.id, item.id)}
                                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Curtain calculator inline for this room */}
                      {openCurtainForRoom === room.id && (
                        <div className="mt-3">
                          <CurtainCalculator
                            defaultFabric={fabricType}
                            onCancel={() => setOpenCurtainForRoom(null)}
                            onAdd={(payload: any) => {
                              // add curtain item to room
                              const newItem: any = {
                                id: payload.id,
                                type: 'curtain',
                                name: payload.name,
                                quantity: payload.quantity,
                                width: payload.width,
                                height: payload.height,
                                fullness: payload.fullness,
                                fabric: payload.fabric,
                                style: payload.style,
                                lining: payload.lining,
                                stitchingPerMeter: payload.stitchingPerMeter,
                                accessoriesCost: payload.accessoriesCost,
                                pricePerMeter: payload.pricePerMeter,
                              }
                              updateRoom(room.id, { items: [...room.items, newItem] })
                              setOpenCurtainForRoom(null)
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Room Fabric Calculation */}
                    {(() => {
                      const roomCalc = calculateFabricForRoom(room)
                      return (
                        <div className="pt-2 border-t border-luxury-gold border-opacity-20 bg-luxury-gold bg-opacity-5 p-3 rounded">
                          <div className="text-xs text-luxury-sage mb-3">Fabric needed for this room:</div>
                          <div className="space-y-2 mb-3">
                            {roomCalc.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-luxury-deep-gray">{item.name}</span>
                                <span className="font-semibold text-luxury-gold">{item.totalYards} yd</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-luxury-gold border-opacity-30 flex justify-between font-serif font-bold text-luxury-gold">
                            <span>Room Total:</span>
                            <span className="text-lg">{roomCalc.totalYards} yards</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Room Footer */}
                <button
                  onClick={() => removeRoom(room.id)}
                  className="w-full px-6 py-2 text-red-500 hover:bg-red-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Remove Room
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col md:flex-row">
        <button
          onClick={save}
          disabled={saving}
          className={`flex-1 btn-luxury-primary py-4 text-lg font-semibold ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {saving ? '⏳ Saving...' : '💾 Save Project'}
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex-1 btn-luxury-outline py-4 text-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
