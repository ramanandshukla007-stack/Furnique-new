'use client'

import React, { useState, useMemo } from 'react'
import type { FabricCatalog, FabricFilterOptions, ColorFamily, FabricPattern } from '@/lib/types/visualizer'

interface FabricSelectorProps {
  fabrics: FabricCatalog
  selectedFabricId: string | null
  onFabricSelect: (fabricId: string) => void
  loading?: boolean
}

export default function FabricSelector({
  fabrics,
  selectedFabricId,
  onFabricSelect,
  loading = false,
}: FabricSelectorProps) {
  const [filters, setFilters] = useState<FabricFilterOptions>({
    colorFamilies: [],
    patterns: [],
    search: '',
    sortBy: 'name',
  })

  const [searchTerm, setSearchTerm] = useState('')

  // Filter fabrics
  const filteredFabrics = useMemo(() => {
    let result = fabrics.fabrics

    // Color filter
    if (filters.colorFamilies && filters.colorFamilies.length > 0) {
      result = result.filter((f) =>
        filters.colorFamilies!.includes(f.colorFamily)
      )
    }

    // Pattern filter
    if (filters.patterns && filters.patterns.length > 0) {
      result = result.filter((f) => filters.patterns!.includes(f.pattern))
    }

    // Search
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.code?.toLowerCase().includes(query)
      )
    }

    return result
  }, [fabrics.fabrics, filters, searchTerm])

  const toggleColorFilter = (color: ColorFamily) => {
    setFilters((prev) => {
      const colors = prev.colorFamilies || []
      return {
        ...prev,
        colorFamilies: colors.includes(color)
          ? colors.filter((c) => c !== color)
          : [...colors, color],
      }
    })
  }

  const togglePatternFilter = (pattern: FabricPattern) => {
    setFilters((prev) => {
      const patterns = prev.patterns || []
      return {
        ...prev,
        patterns: patterns.includes(pattern)
          ? patterns.filter((p) => p !== pattern)
          : [...patterns, pattern],
      }
    })
  }

  return (
    <div className="card-luxury p-6 rounded-lg space-y-4 sticky top-4">
      <h2 className="font-serif text-2xl font-bold text-luxury-cream">
        Fabrics
      </h2>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search fabrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-luxury-cream placeholder-gray-500 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-luxury-gold"
        />
      </div>

      {/* Color Filter */}
      <div>
        <p className="text-xs font-semibold text-luxury-gold mb-2">
          COLOR FAMILY
        </p>
        <div className="grid grid-cols-2 gap-2">
          {fabrics.filters?.colorFamilies.map((color) => (
            <button
              key={color}
              onClick={() => toggleColorFilter(color)}
              className={`px-2 py-1 text-xs rounded font-semibold transition ${
                filters.colorFamilies?.includes(color)
                  ? 'bg-luxury-gold text-luxury-deep-gray'
                  : 'bg-gray-700 text-luxury-sage hover:bg-gray-600'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Filter */}
      <div>
        <p className="text-xs font-semibold text-luxury-gold mb-2">
          PATTERN
        </p>
        <div className="grid grid-cols-2 gap-2">
          {fabrics.filters?.patterns.map((pattern) => (
            <button
              key={pattern}
              onClick={() => togglePatternFilter(pattern)}
              className={`px-2 py-1 text-xs rounded font-semibold transition ${
                filters.patterns?.includes(pattern)
                  ? 'bg-luxury-gold text-luxury-deep-gray'
                  : 'bg-gray-700 text-luxury-sage hover:bg-gray-600'
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Grid */}
      <div>
        <p className="text-xs font-semibold text-luxury-gold mb-3">
          LIBRARY ({filteredFabrics.length})
        </p>
        <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
          {filteredFabrics.map((fabric) => (
            <button
              key={fabric.id}
              onClick={() => {
                onFabricSelect(fabric.id)
              }}
              disabled={loading}
              className={`group relative overflow-hidden rounded transition ${
                selectedFabricId === fabric.id
                  ? 'ring-2 ring-luxury-gold'
                  : 'hover:ring-1 hover:ring-luxury-gold/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Thumbnail */}
              <img
                src={fabric.thumbnailUrl}
                alt={fabric.name}
                className="w-full h-32 object-cover"
              />

              {/* Overlay with name */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition p-2 flex items-end">
                <div className="bg-black/70 p-2 rounded w-full opacity-0 group-hover:opacity-100 transition">
                  <p className="text-xs font-semibold text-white line-clamp-2">
                    {fabric.name}
                  </p>
                  {fabric.code && (
                    <p className="text-xs text-gray-300">{fabric.code}</p>
                  )}
                  {fabric.pricePerMeter && (
                    <p className="text-xs text-luxury-gold">
                      ₹{fabric.pricePerMeter}/m
                    </p>
                  )}
                </div>
              </div>

              {/* Selection indicator */}
              {selectedFabricId === fabric.id && (
                <div className="absolute top-1 right-1 bg-luxury-gold rounded-full p-1">
                  <svg
                    className="w-3 h-3 text-luxury-deep-gray"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredFabrics.length === 0 && (
          <div className="text-center py-8 text-luxury-sage">
            <p className="text-sm">No fabrics match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
