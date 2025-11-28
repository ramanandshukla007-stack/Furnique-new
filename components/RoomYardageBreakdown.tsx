"use client"
import React from 'react'
import { calculateFabricForRoom } from '@/lib/calculator'
import type { Room } from '@/lib/calculator'

interface RoomYardageBreakdownProps {
  room: Room
}

export default function RoomYardageBreakdown({ room }: RoomYardageBreakdownProps) {
  const { items, totalYards } = calculateFabricForRoom(room)

  return (
    <div className="bg-luxury-gold bg-opacity-5 border-2 border-luxury-gold border-opacity-30 rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-luxury-deep-gray text-sm">Fabric Breakdown</h4>
      
      {items.length === 0 ? (
        <p className="text-xs text-luxury-sage">No items added to this room yet.</p>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-3 pb-2 border-b border-luxury-gold border-opacity-20">
                <div className="flex-1">
                  <div className="text-sm font-medium text-luxury-deep-gray">{item.name}</div>
                  <div className="text-xs text-luxury-sage mt-0.5">{item.details}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-luxury-gold">{item.totalYards} yd</div>
                  <div className="text-xs text-luxury-sage">({item.perItemYards} each)</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t-2 border-luxury-gold flex justify-between items-center">
            <span className="font-semibold text-luxury-deep-gray">Room Total:</span>
            <span className="text-lg font-serif font-bold text-luxury-gold">{totalYards} yards</span>
          </div>
        </>
      )}
    </div>
  )
}
