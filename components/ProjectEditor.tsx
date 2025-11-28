"use client"
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Item = { id: string; type: string; quantity: number; width?: number; height?: number }
type Room = { id: string; name?: string; width: number; height: number; depth?: number; items: Item[] }

export default function ProjectEditor({ initial, onSave }: { initial?: any; onSave?: (proj: any) => void }) {
  const initialRooms: Room[] = initial?.rooms ?? []
  const [name, setName] = useState(initial?.name ?? '')
  const [rooms, setRooms] = useState<Room[]>(initialRooms)

  function addRoom() {
    setRooms([...rooms, { id: uuidv4(), name: 'Room', width: 3, height: 3, depth: 1, items: [] }])
  }

  function removeRoom(id: string) {
    setRooms(rooms.filter((r) => r.id !== id))
  }

  function updateRoom(id: string, patch: Partial<Room>) {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function addItem(roomId: string) {
    const item: Item = { id: uuidv4(), type: 'sofa', quantity: 1 }
    updateRoom(roomId, { items: [...(rooms.find((r) => r.id === roomId)?.items ?? []), item] })
  }

  function removeItem(roomId: string, itemId: string) {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return
    updateRoom(roomId, { items: room.items.filter((i) => i.id !== itemId) })
  }

  async function save() {
    const payload = { name: name || 'Project', rooms }
    if (initial?.id) {
      const res = await fetch(`/api/calculator/${initial.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      onSave?.(data.project ?? data)
    } else {
      const res = await fetch('/api/calculator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      onSave?.(data.project ?? data)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm">Project name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Rooms</h3>
          <button onClick={addRoom} className="text-sm underline">Add room</button>
        </div>

        <div className="space-y-3 mt-2">
          {rooms.map((r) => (
            <div key={r.id} className="border p-3 rounded">
              <div className="flex items-center justify-between">
                <input value={r.name} onChange={(e) => updateRoom(r.id, { name: e.target.value })} className="border px-2 py-1 rounded" />
                <button onClick={() => removeRoom(r.id)} className="text-sm text-red-600">Remove</button>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <input value={String(r.width)} onChange={(e) => updateRoom(r.id, { width: Number(e.target.value) })} className="border px-2 py-1 rounded" placeholder="Width (m)" />
                <input value={String(r.height)} onChange={(e) => updateRoom(r.id, { height: Number(e.target.value) })} className="border px-2 py-1 rounded" placeholder="Height (m)" />
                <input value={String(r.depth ?? '')} onChange={(e) => updateRoom(r.id, { depth: Number(e.target.value) })} className="border px-2 py-1 rounded" placeholder="Depth (m)" />
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Items</div>
                  <button onClick={() => addItem(r.id)} className="text-sm underline">Add item</button>
                </div>
                <div className="mt-2 space-y-2">
                  {r.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between border rounded p-2">
                      <div className="flex-1">
                        <input value={it.type} onChange={(e) => updateRoom(r.id, { items: r.items.map((x) => (x.id === it.id ? { ...x, type: e.target.value } : x)) })} className="border px-2 py-1 rounded w-full" />
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          <input value={String(it.quantity)} onChange={(e) => updateRoom(r.id, { items: r.items.map((x) => (x.id === it.id ? { ...x, quantity: Number(e.target.value) } : x)) })} className="border px-2 py-1 rounded" />
                        </div>
                      </div>
                      <button onClick={() => removeItem(r.id, it.id)} className="ml-2 text-red-600">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button onClick={save} className="bg-indigo-600 text-white px-4 py-2 rounded">Save Project</button>
      </div>
    </div>
  )
}
