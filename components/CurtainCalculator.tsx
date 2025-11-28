"use client"
import React, { useState, useMemo } from 'react'
import { calculateCurtainBreakdown, getAvailableFabrics } from '@/lib/calculator'
import type { Item } from '@/lib/calculator'

export default function CurtainCalculator({
  onAdd,
  onCancel,
  defaultFabric = 'cotton',
}: {
  onAdd: (item: any) => void
  onCancel: () => void
  defaultFabric?: string
}) {
  const fabrics = getAvailableFabrics()
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [rodWidth, setRodWidth] = useState<number>(1.5)
  const [finishedLength, setFinishedLength] = useState<number>(2.1)
  const [quantity, setQuantity] = useState<number>(1)
  const [fabric, setFabric] = useState<string>(defaultFabric)
  const [style, setStyle] = useState<string>('pencil')
  const [useRod, setUseRod] = useState(false)
  const [lining, setLining] = useState<'none' | 'standard' | 'thermal'>('none')
  const [stitchingPerYd, setStitchingPerYd] = useState<number>(120)
  const [accessoriesCost, setAccessoriesCost] = useState<number>(350)
  const [pricePerYd, setPricePerYd] = useState<number>(1000)
  const [fabricWidthIn, setFabricWidthIn] = useState<number>(48)
  const [liningPricePerYd, setLiningPricePerYd] = useState<number>(400)
  const [patternRepeat, setPatternRepeat] = useState<number>(0)

  // Build item for calculation
  const item: any = useMemo(() => ({
    type: 'curtain',
    quantity,
    width: rodWidth,
    height: finishedLength,
    rodWidth,
    finishedLength,
    fabricWidth: fabricWidthIn,
    patternRepeat,
    lining: lining !== 'none',
    style,
    fabricPricePerYd: pricePerYd,
    liningPricePerYd,
  }), [quantity, rodWidth, finishedLength, fabricWidthIn, patternRepeat, lining, style, pricePerYd, liningPricePerYd])

  // Convert inputs to inches if metric selected
  const itemForCalc = useMemo(() => {
    const clone = { ...item } as any
    if (unit === 'metric') {
      // Convert meters to inches
      clone.width = (item.width ?? 0) * 39.3700787
      clone.height = (item.height ?? 0) * 39.3700787
      clone.rodWidth = (item.rodWidth ?? 0) * 39.3700787
      clone.finishedLength = (item.finishedLength ?? 0) * 39.3700787
    }
    clone.fabricWidth = fabricWidthIn
    clone.patternRepeat = patternRepeat
    return clone
  }, [item, unit, fabricWidthIn, patternRepeat])

  const breakdown = useMemo(() => calculateCurtainBreakdown(itemForCalc, { wasteMultiplier: 1.12, minYardage: 0.5 }, 0), [itemForCalc])
  const fabricYds = breakdown.totalFabricYds
  const liningYds = breakdown.totalLiningYds
  const fabricCost = breakdown.fabricCost != null ? breakdown.fabricCost : Math.round((fabricYds * pricePerYd))
  const liningCost = breakdown.liningCost != null ? breakdown.liningCost : (lining === 'none' ? 0 : Math.round(liningYds * liningPricePerYd))
  const stitchingCharges = Math.round(stitchingPerYd * fabricYds)
  const subtotal = Math.round(fabricCost + liningCost + stitchingCharges + accessoriesCost)
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + gst

  function handleAdd() {
    const payload = {
      id: `curtain-${Date.now()}`,
      type: 'curtain',
      name: `Curtain ${quantity}x ${rodWidth}${unit === 'metric' ? 'm' : 'in'}`,
      quantity,
      rodWidth,
      finishedLength,
      fabric,
      style,
      useRod,
      lining,
      stitchingPerYd,
      accessoriesCost,
      pricePerYd,
      fabricWidthIn,
      patternRepeat,
      liningPricePerYd,
    }
    onAdd(payload)
  }

  return (
    <div className="bg-white p-4 rounded border border-luxury-gold">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm font-semibold">Measurement Unit</div>
        <div className="ml-4 flex gap-2">
          <button className={`px-3 py-1 rounded ${unit === 'metric' ? 'bg-luxury-deep-gray text-white' : 'bg-gray-100'}`} onClick={() => setUnit('metric')}>Metric (m)</button>
          <button className={`px-3 py-1 rounded ${unit === 'imperial' ? 'bg-luxury-deep-gray text-white' : 'bg-gray-100'}`} onClick={() => setUnit('imperial')}>Imperial (ft/in)</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold">Rod / Track Width ({unit === 'metric' ? 'meters' : 'inches'})</label>
          <input className="w-full px-3 py-2 border rounded" type="number" value={rodWidth} onChange={(e) => setRodWidth(Number(e.target.value))} step="0.1" />
        </div>
        <div>
          <label className="block text-xs font-semibold">Finished Length ({unit === 'metric' ? 'meters' : 'inches'})</label>
          <input className="w-full px-3 py-2 border rounded" type="number" value={finishedLength} onChange={(e) => setFinishedLength(Number(e.target.value))} step="0.1" />
        </div>
        <div>
          <label className="block text-xs font-semibold">Number of Windows</label>
          <input className="w-full px-3 py-2 border rounded" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
        </div>
        <div>
          <label className="block text-xs font-semibold">Fabric Selection</label>
          <select className="w-full px-3 py-2 border rounded" value={fabric} onChange={(e) => setFabric(e.target.value)}>
            {fabrics.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold">Curtain Style</label>
          <select className="w-full px-3 py-2 border rounded" value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="pencil">Pencil Pleat</option>
            <option value="eyelet">Eyelet</option>
            <option value="wave">Wave / Triple Pleat</option>
            <option value="rod-pocket">Rod Pocket / Tab Top</option>
            <option value="gathered">Gathered</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold">Usable Fabric Width (inches)</label>
          <input className="w-full px-3 py-2 border rounded" type="number" value={fabricWidthIn} onChange={(e) => setFabricWidthIn(Number(e.target.value))} step="0.1" placeholder="48" />
        </div>
        <div>
          <label className="block text-xs font-semibold">Vertical Pattern Repeat (inches, 0 if none)</label>
          <input className="w-full px-3 py-2 border rounded" type="number" value={patternRepeat} onChange={(e) => setPatternRepeat(Number(e.target.value))} step="0.1" />
        </div>
        <div>
          <label className="block text-xs font-semibold">Rod/Channel System</label>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={useRod} onChange={(e) => setUseRod(e.target.checked)} /> <span className="text-sm">Add Rod/Channel</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded mb-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold">Lining Required</label>
            <select className="w-full px-3 py-2 border rounded" value={lining} onChange={(e) => setLining(e.target.value as any)}>
              <option value="none">No Lining</option>
              <option value="standard">Standard Lining</option>
              <option value="thermal">Thermal Lining</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold">Fabric Price / Yard (₹)</label>
            <input className="w-full px-3 py-2 border rounded" type="number" value={pricePerYd} onChange={(e) => setPricePerYd(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold">Lining Price / Yard (₹)</label>
            <input className="w-full px-3 py-2 border rounded" type="number" value={liningPricePerYd} onChange={(e) => setLiningPricePerYd(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold">Stitching Charges (₹/yd)</label>
            <input className="w-full px-3 py-2 border rounded" type="number" value={stitchingPerYd} onChange={(e) => setStitchingPerYd(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold">Accessories Cost (₹)</label>
            <input className="w-full px-3 py-2 border rounded" type="number" value={accessoriesCost} onChange={(e) => setAccessoriesCost(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold mb-2">Calculation Breakdown</div>
        <div className="bg-gray-50 p-3 rounded text-xs space-y-1 mb-3">
          <div className="flex justify-between"><span>Rod Width:</span><span>{breakdown.rodWidthIn.toFixed(2)}"</span></div>
          <div className="flex justify-between"><span>Finished Length:</span><span>{breakdown.finishedLengthIn.toFixed(2)}"</span></div>
          <div className="flex justify-between"><span>Fullness Factor:</span><span>{breakdown.fullnessFactor}×</span></div>
          <div className="flex justify-between"><span>Total Flat Width:</span><span>{breakdown.totalFlatWidthIn.toFixed(2)}"</span></div>
          <div className="flex justify-between"><span>Width Count (drops):</span><span>{breakdown.widthCount}</span></div>
          <div className="flex justify-between"><span>Cut Length Per Drop:</span><span>{breakdown.cutLengthIn.toFixed(2)}"</span></div>
          <div className="flex justify-between"><span>Actual Fullness:</span><span>{breakdown.actualFullness.toFixed(2)}×</span></div>
          <hr className="my-1" />
          <div className="flex justify-between font-semibold"><span>Total Fabric:</span><span>{fabricYds} yd</span></div>
          <div className="flex justify-between font-semibold"><span>Total Lining:</span><span>{liningYds} yd</span></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold mb-2">Estimate Summary</div>
        <div className="bg-luxury-deep-gray text-white p-3 rounded space-y-1">
          <div className="flex justify-between text-sm"><span>Fabric Required:</span><span>{fabricYds} yd</span></div>
          <div className="flex justify-between text-sm"><span>Fabric Cost:</span><span>₹{fabricCost.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Lining Yards:</span><span>{liningYds} yd</span></div>
          <div className="flex justify-between text-sm"><span>Lining Cost:</span><span>₹{liningCost.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Stitching Charges:</span><span>₹{stitchingCharges.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Accessories:</span><span>₹{accessoriesCost.toLocaleString()}</span></div>
          <hr className="my-2 border-gray-300" />
          <div className="flex justify-between font-semibold text-lg"><span>Subtotal:</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>GST (18%):</span><span>₹{gst.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-xl mt-2"><span>Total Estimate:</span><span>₹{total.toLocaleString()}</span></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-luxury-primary flex-1" onClick={handleAdd}>+ Add to Room/Project</button>
        <button className="btn-luxury-outline" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
