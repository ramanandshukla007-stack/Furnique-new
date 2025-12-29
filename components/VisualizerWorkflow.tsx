'use client'

import React, { useState, useRef, useEffect } from 'react'
import type {
  ImageUploadResponse,
  FurnitureDetectionResponse,
  FabricCatalog,
  DetectedFurnitureItem,
  ApplyFabricResponse,
  WebGLRenderParams,
} from '@/lib/types/visualizer'
import { WebGLCompositor } from '@/lib/webgl-compositor'
import StepIndicator from './StepIndicator'
import FabricSelector from './FabricSelector'
import PreviewCanvas from './PreviewCanvas'
import MaskEditor from './MaskEditor'

type VisualizerStep = 'upload' | 'detect' | 'select' | 'fabric' | 'preview'

interface VisualizerState {
  uploadId: string | null
  imageUrl: string | null
  imageWidth: number
  imageHeight: number
  detectedItems: DetectedFurnitureItem[]
  selectedItemId: string | null
  selectedFabricId: string | null
  fabrics: FabricCatalog | null
  loading: boolean
  error: string | null
  step: VisualizerStep
  masksVisible: boolean
  editMode: boolean
}

export default function VisualizerWorkflow() {
  const [state, setState] = useState<VisualizerState>({
    uploadId: null,
    imageUrl: null,
    imageWidth: 1920,
    imageHeight: 1080,
    detectedItems: [],
    selectedItemId: null,
    selectedFabricId: null,
    fabrics: null,
    loading: false,
    error: null,
    step: 'upload',
    masksVisible: false,
    editMode: false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const compositorRef = useRef<WebGLCompositor | null>(null)

  // Fetch fabric library
  useEffect(() => {
    fetchFabrics()
  }, [])

  const fetchFabrics = async () => {
    try {
      const response = await fetch('/api/visualizer/fabrics')
      if (!response.ok) throw new Error('Failed to fetch fabrics')
      const data = await response.json()
      setState((prev) => ({ ...prev, fabrics: data }))
    } catch (error) {
      console.error('Fabric fetch error:', error)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/visualizer/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const uploadData: ImageUploadResponse = await response.json()
      setState((prev) => ({
        ...prev,
        uploadId: uploadData.uploadId,
        imageUrl: uploadData.imageUrl,
        imageWidth: uploadData.width,
        imageHeight: uploadData.height,
        step: 'detect',
        loading: false,
      }))

      // Auto-trigger detection
      await runDetection(uploadData.uploadId, uploadData.imageUrl, uploadData.width, uploadData.height)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }))
    }
  }

  const runDetection = async (
    uploadId: string,
    imageUrl: string,
    width: number,
    height: number
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true }))

      const response = await fetch('/api/visualizer/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          imageUrl,
          imageWidth: width,
          imageHeight: height,
        }),
      })

      if (!response.ok) throw new Error('Detection failed')

      const detectionData: FurnitureDetectionResponse = await response.json()
      const firstItemId = detectionData.items[0]?.id || null

      setState((prev) => ({
        ...prev,
        detectedItems: detectionData.items,
        selectedItemId: firstItemId,
        step: 'fabric',
        loading: false,
      }))

      // Initialize WebGL if needed
      if (canvasRef.current && !compositorRef.current) {
        compositorRef.current = new WebGLCompositor({
          canvas: canvasRef.current,
          width,
          height,
        })
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Detection failed',
      }))
    }
  }

  const handleFabricSelect = async (fabricId: string) => {
    setState((prev) => ({
      ...prev,
      selectedFabricId: fabricId,
      loading: true,
    }))

    try {
      if (!state.uploadId || !state.selectedItemId) {
        throw new Error('Missing upload or item ID')
      }

      const response = await fetch('/api/visualizer/apply-fabric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: state.uploadId,
          itemId: state.selectedItemId,
          fabricId,
          tileScale: 1.0,
          rotation: 0,
        }),
      })

      if (!response.ok) throw new Error('Apply fabric failed')

      const applyData: ApplyFabricResponse = await response.json()

      // Render with WebGL
      if (compositorRef.current && applyData.renderParams) {
        await compositorRef.current.render(applyData.renderParams)
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        step: 'preview',
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to apply fabric',
      }))
    }
  }

  const handleItemSelect = (itemId: string) => {
    setState((prev) => ({
      ...prev,
      selectedItemId: itemId,
    }))
  }

  const handleToggleMaskEdit = () => {
    setState((prev) => ({
      ...prev,
      editMode: !prev.editMode,
    }))
  }

  return (
    <div className="min-h-screen bg-luxury-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-luxury-cream mb-2">
            Fabric Visualizer
          </h1>
          <p className="text-luxury-sage">
            Upload a furniture photo to preview different fabrics in real-time
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={state.step} />

        {/* Error Display */}
        {state.error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {state.error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="card-luxury p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold text-luxury-cream">
                  Preview
                </h2>
                {state.detectedItems.length > 0 && (
                  <button
                    onClick={handleToggleMaskEdit}
                    className={`px-3 py-1 rounded text-sm font-semibold transition ${
                      state.editMode
                        ? 'bg-luxury-gold text-luxury-deep-gray'
                        : 'bg-gray-700 text-luxury-sage hover:bg-gray-600'
                    }`}
                  >
                    {state.editMode ? 'Editing' : 'Edit Mask'}
                  </button>
                )}
              </div>

              {state.step === 'upload' ? (
                <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded border-2 border-dashed border-luxury-gold/30">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-luxury-sage mb-4"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-14-8l-4 4m4-4v8m0-8l4 4"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-luxury-cream font-semibold mb-2">
                      Upload a furniture photo
                    </p>
                    <p className="text-luxury-sage text-sm mb-4">
                      JPG, PNG up to 10MB
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-luxury-gold text-luxury-deep-gray rounded font-semibold hover:bg-yellow-500 transition"
                    >
                      Choose File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <PreviewCanvas
                  ref={canvasRef}
                  imageUrl={state.imageUrl}
                  width={state.imageWidth}
                  height={state.imageHeight}
                  loading={state.loading}
                />
              )}

              {/* Detected Items */}
              {state.detectedItems.length > 0 && state.step !== 'upload' && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-luxury-gold mb-3">
                    Detected Furniture Items
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {state.detectedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemSelect(item.id)}
                        className={`px-3 py-1 rounded text-sm font-semibold transition ${
                          state.selectedItemId === item.id
                            ? 'bg-luxury-gold text-luxury-deep-gray'
                            : 'bg-gray-700 text-luxury-sage hover:bg-gray-600'
                        }`}
                      >
                        {item.label} ({Math.round(item.confidence * 100)}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mask Editor (if in edit mode) */}
            {state.editMode && state.selectedItemId && (
              <MaskEditor itemId={state.selectedItemId} uploadId={state.uploadId} />
            )}
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-1">
            {/* Fabric Selector */}
            {state.step !== 'upload' && state.fabrics && (
              <FabricSelector
                fabrics={state.fabrics}
                selectedFabricId={state.selectedFabricId}
                onFabricSelect={handleFabricSelect}
                loading={state.loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
