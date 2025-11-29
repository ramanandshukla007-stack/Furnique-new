"use client"
import React from 'react'
import { calculateProject } from '@/lib/calculator'
import type { Room } from '@/lib/calculator'
import { estimateCost } from '@/lib/calculator'

interface ProjectSummaryProps {
  rooms: Room[]
  fabricType?: string
}

export default function ProjectSummary({ rooms, fabricType = 'cotton' }: ProjectSummaryProps) {
  const { roomBreakdowns, grandTotal } = calculateProject({ rooms, fabricType: fabricType as any })

  // Rough estimate: ₹500/yard
  const { grandTotalMeters, grandTotalSqFt } = calculateProject({ rooms, fabricType: fabricType as any })
  const pricePerMeter = 1000
  const estimatedCost = estimateCost(grandTotalMeters || 0, fabricType as any, pricePerMeter)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Fabric */}
      <div className="card-luxury p-6">
        <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Total Fabric Required</div>
        <div className="text-3xl font-serif font-bold text-luxury-gold">{grandTotal} yd</div>
        <div className="text-sm text-luxury-sage mt-2">(~{grandTotalMeters} m · {grandTotalSqFt} sqft)</div>
      </div>

      {/* Estimated Cost */}
      <div className="card-luxury p-6">
        <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Estimated Cost</div>
        <div className="text-3xl font-serif font-bold text-luxury-gold">₹{estimatedCost.toLocaleString()}</div>
        <div className="text-sm text-luxury-sage mt-2">at ₹{pricePerMeter}/m ({fabricType})</div>
      </div>

      {/* Items & Rooms */}
      <div className="card-luxury p-6">
        <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Project Summary</div>
        <div className="text-3xl font-serif font-bold text-luxury-gold">{rooms.length}</div>
        <div className="text-sm text-luxury-sage mt-2">
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} • {rooms.reduce((acc, r) => acc + r.items.length, 0)} items
        </div>
      </div>

      {/* Detailed Breakdown by Room */}
      {roomBreakdowns.length > 0 && (
        <div className="md:col-span-3 bg-luxury-gold bg-opacity-5 border-2 border-luxury-gold border-opacity-20 rounded-lg p-4">
          <h3 className="font-semibold text-luxury-deep-gray mb-3">Breakdown by Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomBreakdowns.map((room, idx) => (
              <div key={idx} className="bg-white border border-luxury-gold border-opacity-30 rounded p-3">
                <div className="font-semibold text-luxury-deep-gray text-sm mb-2">{room.roomName}</div>
                <div className="space-y-1 mb-2">
                  {room.itemBreakdowns.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-luxury-sage">{item.name}</span>
                      <span className="font-medium text-luxury-gold">{item.totalYards} yd</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-luxury-gold border-opacity-20 flex justify-between font-semibold">
                  <span className="text-luxury-deep-gray text-sm">Total:</span>
                  <span className="text-luxury-gold">{room.roomTotal} yd • ~{room.roomMeters} m • {room.roomSqFt} sqft</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
