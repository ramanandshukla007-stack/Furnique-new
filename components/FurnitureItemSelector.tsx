"use client"
import React, { useState } from 'react'
import { calculateFurnitureYardage, calculateItemTotalYardage, type Item } from '@/lib/calculator'

type ItemWithExtras = Item & {
  id: string
  headboardSize?: 'twin' | 'full' | 'queen' | 'king'
  bedSize?: 'twin' | 'full' | 'queen' | 'king'
}

interface FurnitureItemSelectorProps {
  item: ItemWithExtras
  onUpdate: (patch: Partial<ItemWithExtras>) => void
  onRemove: () => void
}

const FURNITURE_TYPES = [
  { key: 'sofa-2seater', label: '2-Seater Sofa (Love Seat)', category: 'Sofas' },
  { key: 'sofa-3seater', label: '3-Seater Sofa', category: 'Sofas' },
  { key: 'sofa-4seater', label: '4-Seater Sofa (Large)', category: 'Sofas' },
  { key: 'armchair', label: 'Armchair / Lounge Chair', category: 'Seating' },
  { key: 'ottoman', label: 'Ottoman', category: 'Seating' },
  { key: 'cushion-small', label: 'Small Cushion (16"-18")', category: 'Cushions' },
  { key: 'cushion-large', label: 'Large Cushion (20"-24")', category: 'Cushions' },
  { key: 'cushion-generic', label: 'Custom Cushion (by dimensions)', category: 'Cushions' },
  { key: 'chair-dining', label: 'Dining Chair (seat only)', category: 'Seating' },
  { key: 'bench', label: 'Bench / Window Seat', category: 'Seating' },
  { key: 'headboard-twin', label: 'Headboard - Twin', category: 'Bed' },
  { key: 'headboard-full', label: 'Headboard - Full', category: 'Bed' },
  { key: 'headboard-queen', label: 'Headboard - Queen', category: 'Bed' },
  { key: 'headboard-king', label: 'Headboard - King', category: 'Bed' },
  { key: 'bed-throw-twin', label: 'Bed Throw - Twin', category: 'Bed' },
  { key: 'bed-throw-full', label: 'Bed Throw - Full', category: 'Bed' },
  { key: 'bed-throw-queen', label: 'Bed Throw - Queen', category: 'Bed' },
  { key: 'bed-throw-king', label: 'Bed Throw - King', category: 'Bed' },
]

export default function FurnitureItemSelector({
  item,
  onUpdate,
  onRemove,
}: FurnitureItemSelectorProps) {
  const [showDimensions, setShowDimensions] = useState(
    item.type === 'cushion-generic' || item.type === 'bench'
  )

  const calc = calculateFurnitureYardage(item)
  const totalYards = calculateItemTotalYardage(item)

  const needsHeadboardSize = item.type?.includes('headboard')
  const needsBedSize = item.type?.includes('bed-throw')

  return (
    <div className="bg-white border-2 border-luxury-gold border-opacity-30 rounded-lg p-4 space-y-4">
      {/* Type and Quantity */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-luxury-deep-gray mb-2 block">Furniture Type</label>
          <select
            value={item.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
          >
            <option value="" disabled>Select furniture type...</option>
            {FURNITURE_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-luxury-deep-gray mb-2 block">Qty</label>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdate({ quantity: Math.max(1, Number(e.target.value)) })}
            min="1"
            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
          />
        </div>
      </div>

      {/* Optional Size Selections */}
      {needsHeadboardSize && (
        <div>
          <label className="text-xs font-semibold text-luxury-deep-gray mb-2 block">Headboard Size</label>
          <select
            value={item.headboardSize || 'queen'}
            onChange={(e) => onUpdate({ headboardSize: e.target.value as any })}
            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
          >
            <option value="twin">Twin</option>
            <option value="full">Full</option>
            <option value="queen">Queen</option>
            <option value="king">King</option>
          </select>
        </div>
      )}

      {needsBedSize && (
        <div>
          <label className="text-xs font-semibold text-luxury-deep-gray mb-2 block">Bed Size</label>
          <select
            value={item.bedSize || 'queen'}
            onChange={(e) => onUpdate({ bedSize: e.target.value as any })}
            className="w-full px-3 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
          >
            <option value="twin">Twin</option>
            <option value="full">Full</option>
            <option value="queen">Queen</option>
            <option value="king">King</option>
          </select>
        </div>
      )}

      {/* Dimension Toggle */}
      {(item.type === 'cushion-generic' || item.type === 'bench' || item.type === 'armchair' || item.type === 'ottoman') && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`show-dims-${item.id}`}
            checked={showDimensions}
            onChange={(e) => setShowDimensions(e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-luxury-gold"
          />
          <label htmlFor={`show-dims-${item.id}`} className="text-sm text-luxury-deep-gray cursor-pointer">
            Custom dimensions (optional)
          </label>
        </div>
      )}

      {/* Custom Dimensions */}
      {showDimensions && (item.type === 'cushion-generic' || item.type === 'bench' || item.type === 'armchair' || item.type === 'ottoman') && (
        <div className="grid grid-cols-3 gap-3 bg-luxury-soft-cream p-3 rounded border border-luxury-gold border-opacity-20">
          <div>
            <label className="text-xs text-luxury-sage mb-1 block">Width (in)</label>
            <input
              type="number"
              value={item.width || ''}
              onChange={(e) => onUpdate({ width: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 24"
              className="w-full px-2 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
            />
          </div>
          <div>
            <label className="text-xs text-luxury-sage mb-1 block">Height (in)</label>
            <input
              type="number"
              value={item.height || ''}
              onChange={(e) => onUpdate({ height: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 20"
              className="w-full px-2 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
            />
          </div>
          {item.type === 'bench' && (
            <div>
              <label className="text-xs text-luxury-sage mb-1 block">Length (in)</label>
              <input
                type="number"
                value={item.length || ''}
                onChange={(e) => onUpdate({ length: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g., 60"
                className="w-full px-2 py-2 border border-luxury-gold border-opacity-40 rounded text-sm focus:outline-none focus:border-opacity-100"
              />
            </div>
          )}
        </div>
      )}

      {/* Yardage Display */}
      <div className="bg-luxury-gold bg-opacity-10 p-3 rounded border-l-4 border-luxury-gold">
        <div className="text-xs text-luxury-sage mb-1">{calc.details}</div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-luxury-deep-gray">Per item:</span>
          <span className="text-lg font-serif font-bold text-luxury-gold">{calc.yardage} yd</span>
        </div>
        <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-luxury-gold border-opacity-30">
          <span className="text-sm font-semibold text-luxury-deep-gray">Total (qty {item.quantity}):</span>
          <span className="text-xl font-serif font-bold text-luxury-gold">{totalYards} yd</span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="w-full px-3 py-2 text-red-500 hover:bg-red-50 border border-red-300 rounded transition-colors text-sm font-semibold"
      >
        Remove Item
      </button>
    </div>
  )
}
