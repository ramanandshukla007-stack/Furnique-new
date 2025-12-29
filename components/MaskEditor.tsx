'use client'

import React, { useRef, useState, useEffect } from 'react'
import type { BrushStroke } from '@/lib/types/visualizer'

interface MaskEditorProps {
  itemId: string
  uploadId: string | null
}

export default function MaskEditor({ itemId, uploadId }: MaskEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushMode, setBrushMode] = useState<'add' | 'erase'>('add')
  const [brushSize, setBrushSize] = useState(20)
  const [opacity, setOpacity] = useState(1)
  const [strokes, setStrokes] = useState<BrushStroke[]>([])
  const [canUndo, setCanUndo] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    drawStroke(x, y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    drawStroke(x, y)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const drawStroke = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create a stroke record
    const stroke: BrushStroke = {
      type: brushMode,
      x,
      y,
      radius: brushSize,
      opacity,
    }

    // Draw on canvas
    ctx.globalAlpha = opacity
    ctx.fillStyle = brushMode === 'add' ? '#FFFFFF' : '#000000'
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // Record stroke for persistence
    setStrokes((prev) => [...prev, stroke])
    setCanUndo(true)
  }

  const handleUndo = () => {
    if (strokes.length === 0) return

    const newStrokes = strokes.slice(0, -1)
    setStrokes(newStrokes)
    setCanUndo(newStrokes.length > 0)

    // Redraw
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    newStrokes.forEach((stroke) => {
      ctx.globalAlpha = stroke.opacity || 1
      ctx.fillStyle = stroke.type === 'add' ? '#FFFFFF' : '#000000'
      ctx.beginPath()
      ctx.arc(stroke.x, stroke.y, stroke.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    })
  }

  const handleReset = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setStrokes([])
    setCanUndo(false)
  }

  const handleSave = async () => {
    if (!uploadId) return

    // Send strokes to API for persistence
    try {
      const response = await fetch('/api/visualizer/mask-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          itemId,
          brushStrokes: strokes,
        }),
      })

      if (response.ok) {
        console.log('Mask edits saved')
      }
    } catch (error) {
      console.error('Failed to save mask edits:', error)
    }
  }

  return (
    <div className="card-luxury p-6 rounded-lg mt-6">
      <h3 className="font-serif text-xl font-bold text-luxury-cream mb-4">
        Refine Mask
      </h3>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Brush Mode */}
        <div>
          <p className="text-sm font-semibold text-luxury-gold mb-2">MODE</p>
          <div className="flex gap-2">
            <button
              onClick={() => setBrushMode('add')}
              className={`px-3 py-1 rounded text-sm font-semibold transition ${
                brushMode === 'add'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-luxury-sage hover:bg-gray-600'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => setBrushMode('erase')}
              className={`px-3 py-1 rounded text-sm font-semibold transition ${
                brushMode === 'erase'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-luxury-sage hover:bg-gray-600'
              }`}
            >
              Erase
            </button>
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <p className="text-sm font-semibold text-luxury-gold mb-2">
            SIZE: {brushSize}px
          </p>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div className="col-span-2">
          <p className="text-sm font-semibold text-luxury-gold mb-2">
            OPACITY: {Math.round(opacity * 100)}%
          </p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full border border-luxury-gold/30 rounded bg-black/20 cursor-crosshair mb-4"
        style={{ display: 'block' }}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="flex-1 px-3 py-2 bg-gray-700 text-luxury-sage rounded font-semibold hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-2 bg-gray-700 text-luxury-sage rounded font-semibold hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-2 bg-luxury-gold text-luxury-deep-gray rounded font-semibold hover:bg-yellow-500 transition"
        >
          Save Changes
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        White = fabric area, Black = background. Drag to refine the mask.
      </p>
    </div>
  )
}
