"use client"
import React, { useState } from 'react'
import { calculateFurnitureYardage, calculateItemTotalYardage, calculateFabricForRoom, calculateProject } from '@/lib/calculator'

export default function CalculatorDemo() {
  const [showDetails, setShowDetails] = useState(false)

  // Demo project data
  const demoProject = {
    rooms: [
      {
        id: 'living',
        name: 'Living Room',
        width: 5,
        height: 4,
        items: [
          { id: '1', type: 'sofa-3seater', name: '3-Seater Sofa', quantity: 1 },
          { id: '2', type: 'armchair', name: 'Armchair', quantity: 2 },
          { id: '3', type: 'ottoman', name: 'Ottoman', quantity: 1 },
          { id: '4', type: 'cushion-large', name: 'Large Cushions', quantity: 3 },
        ]
      },
      {
        id: 'dining',
        name: 'Dining Room',
        width: 4,
        height: 3.5,
        items: [
          { id: '5', type: 'chair-dining', name: 'Dining Chairs', quantity: 6 },
          { id: '6', type: 'bench', name: 'Bench Seat', quantity: 1 },
        ]
      },
      {
        id: 'bedroom',
        name: 'Master Bedroom',
        width: 4,
        height: 3,
        items: [
          { id: '7', type: 'headboard-queen', name: 'Headboard', quantity: 1, headboardSize: 'queen' },
          { id: '8', type: 'bed-throw-queen', name: 'Bed Throw', quantity: 1, bedSize: 'queen' },
          { id: '9', type: 'cushion-small', name: 'Decorative Cushions', quantity: 2 },
        ]
      }
    ],
    fabricType: 'cotton',
    fabricRepeat: 0
  }

  const projectCalc = calculateProject(demoProject as any)
  const totalCost = Math.round(projectCalc.grandTotal * 500)

  return (
    <div className="min-h-screen bg-luxury-cream py-12">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl font-bold text-luxury-deep-gray">Furniture Yardage Calculator Demo</h1>
          <p className="text-luxury-sage max-w-2xl mx-auto">
            Advanced fabric calculation system with per-item yardage rules for sofas, chairs, cushions, headboards, and more
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-luxury p-6">
            <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Total Yards</div>
            <div className="text-4xl font-serif font-bold text-luxury-gold">{projectCalc.grandTotal}</div>
            <div className="text-sm text-luxury-sage mt-2">54" standard width</div>
          </div>

          <div className="card-luxury p-6">
            <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Estimated Cost</div>
            <div className="text-4xl font-serif font-bold text-luxury-gold">₹{(totalCost / 100).toLocaleString()}</div>
            <div className="text-sm text-luxury-sage mt-2">@ ₹500/yard average</div>
          </div>

          <div className="card-luxury p-6">
            <div className="text-luxury-sage text-sm font-semibold uppercase tracking-wide mb-2">Project Scope</div>
            <div className="text-4xl font-serif font-bold text-luxury-gold">{demoProject.rooms.length}</div>
            <div className="text-sm text-luxury-sage mt-2">
              {demoProject.rooms.reduce((acc, r) => acc + r.items.length, 0)} items
            </div>
          </div>
        </div>

        {/* Room Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-luxury-deep-gray">Room Breakdown</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-semibold text-luxury-gold border-2 border-luxury-gold rounded hover:bg-luxury-gold hover:bg-opacity-10 transition-colors"
            >
              {showDetails ? '▼ Hide Details' : '▶ Show Details'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectCalc.roomBreakdowns.map((room, idx) => (
              <div key={idx} className="card-luxury p-6 space-y-4">
                <div className="border-b-2 border-luxury-gold pb-3">
                  <h3 className="font-serif text-xl font-bold text-luxury-deep-gray">{room.roomName}</h3>
                </div>

                <div className="space-y-2">
                  {room.itemBreakdowns.map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-luxury-deep-gray">{item.name}</div>
                        {showDetails && (
                          <div className="text-xs text-luxury-sage mt-1">{item.details}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-luxury-gold">{item.totalYards} yd</div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-luxury-sage">({item.perItemYards} ea)</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-luxury-gold flex justify-between font-serif font-bold text-luxury-gold text-lg">
                  <span>Total</span>
                  <span>{room.roomTotal} yd</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-luxury-gold bg-opacity-10 border-2 border-luxury-gold border-opacity-30 rounded-lg p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-luxury-deep-gray mb-6">Calculation Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-luxury-deep-gray flex items-center gap-2">
                <span className="text-lg text-luxury-gold">✓</span> Furniture-Specific Rules
              </h3>
              <p className="text-sm text-luxury-sage">
                Each furniture type has optimized yardage calculations based on industry standards and fabric width assumptions
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-luxury-deep-gray flex items-center gap-2">
                <span className="text-lg text-luxury-gold">✓</span> Size Options
              </h3>
              <p className="text-sm text-luxury-sage">
                Headboards and bed throws support size selection (Twin/Full/Queen/King) with accurate yardage per size
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-luxury-deep-gray flex items-center gap-2">
                <span className="text-lg text-luxury-gold">✓</span> Dimension-Based Calc
              </h3>
              <p className="text-sm text-luxury-sage">
                Cushions, benches, and custom items can use entered dimensions to calculate exact yardage requirements
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-luxury-deep-gray flex items-center gap-2">
                <span className="text-lg text-luxury-gold">✓</span> Quarter-Yard Rounding
              </h3>
              <p className="text-sm text-luxury-sage">
                All calculations round up to the nearest 0.25 yard for practical ordering and minimal waste
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-luxury-deep-gray flex items-center gap-2">
                <span className="text-lg text-luxury-gold">✓</span> Per-Item Breakdown
              </h3>
              <p className="text-sm text-luxury-sage">
                See exactly how many yards each furniture piece requires, both individually and across quantities
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-luxury-deep-gray flex items-center gap-2">
                <span className="text-lg text-luxury-gold">✓</span> Project Totals
              </h3>
              <p className="text-sm text-luxury-sage">
                Automatic calculation of total fabric needed across entire project with per-room itemization
              </p>
            </div>
          </div>
        </div>

        {/* Default Yardage Reference */}
        <div className="bg-luxury-soft-cream border-2 border-luxury-gold border-opacity-20 rounded-lg p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-luxury-deep-gray mb-6">Default Yardage Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-luxury-deep-gray mb-3">Sofas</h3>
              <div className="space-y-2 text-sm text-luxury-sage">
                <div className="flex justify-between"><span>2-Seater</span><span className="font-semibold text-luxury-gold">14 yd</span></div>
                <div className="flex justify-between"><span>3-Seater</span><span className="font-semibold text-luxury-gold">18 yd</span></div>
                <div className="flex justify-between"><span>4-Seater</span><span className="font-semibold text-luxury-gold">22 yd</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-deep-gray mb-3">Seating</h3>
              <div className="space-y-2 text-sm text-luxury-sage">
                <div className="flex justify-between"><span>Armchair</span><span className="font-semibold text-luxury-gold">7 yd</span></div>
                <div className="flex justify-between"><span>Ottoman</span><span className="font-semibold text-luxury-gold">3 yd</span></div>
                <div className="flex justify-between"><span>Dining Chair</span><span className="font-semibold text-luxury-gold">0.75 yd</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-deep-gray mb-3">Cushions</h3>
              <div className="space-y-2 text-sm text-luxury-sage">
                <div className="flex justify-between"><span>Small (16"-18")</span><span className="font-semibold text-luxury-gold">0.75 yd</span></div>
                <div className="flex justify-between"><span>Large (20"-24")</span><span className="font-semibold text-luxury-gold">1 yd</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-deep-gray mb-3">Headboards</h3>
              <div className="space-y-2 text-sm text-luxury-sage">
                <div className="flex justify-between"><span>Twin</span><span className="font-semibold text-luxury-gold">2 yd</span></div>
                <div className="flex justify-between"><span>Full</span><span className="font-semibold text-luxury-gold">4 yd</span></div>
                <div className="flex justify-between"><span>Queen</span><span className="font-semibold text-luxury-gold">4.5 yd</span></div>
                <div className="flex justify-between"><span>King</span><span className="font-semibold text-luxury-gold">5.5 yd</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-deep-gray mb-3">Bed Throws</h3>
              <div className="space-y-2 text-sm text-luxury-sage">
                <div className="flex justify-between"><span>Twin</span><span className="font-semibold text-luxury-gold">3 yd</span></div>
                <div className="flex justify-between"><span>Full</span><span className="font-semibold text-luxury-gold">3.5 yd</span></div>
                <div className="flex justify-between"><span>Queen</span><span className="font-semibold text-luxury-gold">4 yd</span></div>
                <div className="flex justify-between"><span>King</span><span className="font-semibold text-luxury-gold">4.5 yd</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-deep-gray mb-3">Special</h3>
              <div className="space-y-2 text-sm text-luxury-sage">
                <div className="flex justify-between"><span>Bench</span><span className="font-semibold text-luxury-gold">2 yd</span></div>
                <div className="text-xs mt-3 p-2 bg-luxury-gold bg-opacity-10 rounded">All values assume 54" usable fabric width</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-luxury-deep-gray to-luxury-deep-gray rounded-lg p-8 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-luxury-gold">Ready to Create Your Project?</h2>
          <p className="text-luxury-light-gray max-w-2xl mx-auto">
            Use the advanced fabric calculator to design your interior with precise yardage requirements
          </p>
          <a
            href="/calculator/new"
            className="inline-block px-8 py-3 bg-luxury-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
          >
            Go to Calculator
          </a>
        </div>
      </div>
    </div>
  )
}
