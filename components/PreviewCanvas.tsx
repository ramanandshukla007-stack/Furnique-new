'use client'

import React, { forwardRef, CSSProperties } from 'react'

interface PreviewCanvasProps {
  imageUrl?: string | null
  width: number
  height: number
  loading?: boolean
}

const PreviewCanvas = forwardRef<HTMLCanvasElement, PreviewCanvasProps>(
  ({ imageUrl, width, height, loading = false }, ref) => {
    // Calculate aspect ratio and responsive size
    const aspectRatio = width / height
    const maxWidth = 600
    const displayWidth = Math.min(maxWidth, 100)
    const displayHeight = displayWidth / aspectRatio

    const canvasStyle: CSSProperties = {
      width: '100%',
      height: 'auto',
      maxWidth: `${maxWidth}px`,
      border: '1px solid rgba(215, 174, 112, 0.2)',
      borderRadius: '0.5rem',
      backgroundColor: '#1a1a1a',
    }

    return (
      <div className="relative">
        <canvas
          ref={ref}
          width={width}
          height={height}
          style={canvasStyle}
          className={`${loading ? 'opacity-50' : ''} transition-opacity`}
        />

        {/* Fallback image display (if canvas fails) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            style={canvasStyle}
            className="hidden"
          />
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
            <div className="animate-spin">
              <svg
                className="w-8 h-8 text-luxury-gold"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-4 right-4 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs font-semibold px-3 py-1 rounded">
          ALPHA MASKED
        </div>
      </div>
    )
  }
)

PreviewCanvas.displayName = 'PreviewCanvas'

export default PreviewCanvas
