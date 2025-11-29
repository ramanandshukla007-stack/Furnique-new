'use client'

import React from 'react'

type VisualizerStep = 'upload' | 'detect' | 'select' | 'fabric' | 'preview'

interface StepIndicatorProps {
  currentStep: VisualizerStep
}

const STEPS: Array<{
  id: VisualizerStep
  label: string
  description: string
}> = [
  { id: 'upload', label: 'Upload', description: 'Choose a photo' },
  { id: 'detect', label: 'Detect', description: 'AI finds furniture' },
  { id: 'select', label: 'Select', description: 'Pick an item' },
  { id: 'fabric', label: 'Choose Fabric', description: 'Pick a texture' },
  { id: 'preview', label: 'Preview', description: 'View result' },
]

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    isComplete
                      ? 'bg-luxury-gold text-luxury-deep-gray'
                      : isCurrent
                      ? 'bg-luxury-gold text-luxury-deep-gray ring-2 ring-luxury-gold/50'
                      : 'bg-gray-700 text-luxury-sage'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </div>

                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 ml-2 mr-2 transition ${
                      isComplete || (isCurrent && index === currentIndex)
                        ? 'bg-luxury-gold'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>

              {/* Step label */}
              <div className="text-center mt-2">
                <p
                  className={`text-sm font-semibold ${
                    isCurrent
                      ? 'text-luxury-gold'
                      : isComplete
                      ? 'text-luxury-sage'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
