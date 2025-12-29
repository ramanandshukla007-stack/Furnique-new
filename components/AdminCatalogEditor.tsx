"use client"

import React, { useEffect, useState } from 'react'

type Fabric = {
  id: string
  code?: string
  name?: string
  thumbnailUrl?: string | null
  textureUrl?: string | null
  tileScale?: number | null
}

export default function AdminCatalogEditor() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/fabrics')
      const data = await res.json()
      setFabrics(data.fabrics || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function saveFabric(id: string, updates: Partial<Fabric>) {
    try {
      const res = await fetch('/api/admin/fabrics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      })
      if (!res.ok) throw new Error('Save failed')
      const data = await res.json()
      setFabrics((prev) => prev.map((f) => (f.id === id ? data.fabric : f)))
    } catch (e) {
      console.error(e)
      alert('Failed to save fabric')
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Fabric Catalog (Admin)</h2>
        <div>
          <button className="btn" onClick={() => load()} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fabrics.map((f) => (
          <div key={f.id} className="border rounded p-3 bg-white">
            <div className="flex gap-3">
              <div style={{ width: 96, height: 64, background: '#f3f3f3' }}>
                {f.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.thumbnailUrl} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="text-xs text-gray-500 p-2">No thumbnail</div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{f.name || f.code}</div>
                <div className="text-sm text-gray-600">Code: {f.code}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs">Thumbnail URL</label>
                <input
                  className="input mt-1 w-full"
                  value={f.thumbnailUrl || ''}
                  onChange={(e) => setFabrics((prev) => prev.map((p) => (p.id === f.id ? { ...p, thumbnailUrl: e.target.value } : p)))}
                />
              </div>
              <div>
                <label className="text-xs">Tile Scale</label>
                <input
                  className="input mt-1 w-full"
                  type="number"
                  value={f.tileScale ?? 1}
                  onChange={(e) => setFabrics((prev) => prev.map((p) => (p.id === f.id ? { ...p, tileScale: Number(e.target.value) } : p)))}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="btn" onClick={() => saveFabric(f.id, { thumbnailUrl: f.thumbnailUrl, tileScale: f.tileScale })}>
                Save
              </button>
              <a className="btn-outline" href={`http://localhost:5555/`} target="_blank" rel="noreferrer">
                Open Prisma Studio
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
