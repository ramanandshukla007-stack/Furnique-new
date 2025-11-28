"use client"
import React from 'react'

export default function ARVisualizer({ previewImage }: { previewImage?: string }) {
  return (
    <div className="p-4 border rounded bg-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">AR Visualizer (Alpha)</h4>
        <span className="text-xs text-luxury-sage">Demo / placeholder</span>
      </div>
      <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {previewImage ? (
          // simple image placeholder for masked preview
          <img src={previewImage} alt="visualizer preview" className="object-contain h-full" />
        ) : (
          <div className="text-center text-sm text-gray-500">3D / AR preview will appear here. Integrate WebXR / model-viewer or Three.js for full AR.</div>
        )}
      </div>
      <p className="text-xs text-luxury-sage mt-3">Next: integrate model-viewer or Three.js; compositing via CSS/canvas masks.</p>
    </div>
  )
}
