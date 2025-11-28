import React from 'react'
import FeatureCards from '@/components/FeatureCards'
import WorkflowSteps from '@/components/WorkflowSteps'
import ChecklistCard from '@/components/ChecklistCard'
import FabricVisualizer from '@/components/FabricVisualizer'

export default function VisualizerPage() {
  const checklist = [
    'Fabric applied only to masked furniture areas.',
    'Background preserved 100%.',
    'Real-time preview rendering.'
  ]

  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-r from-luxury-deep-gray to-transparent rounded-lg p-8 text-luxury-cream">
        <h1 className="font-serif text-4xl font-bold mb-2">No drawing needed — AI detects fabric areas</h1>
        <p className="max-w-prose text-luxury-sage">Upload a photo and our AI identifies furniture and fabric surfaces for instant visualization.</p>
      </div>

      <FeatureCards />

      <div className="card-luxury p-6">
        <h3 className="font-serif text-2xl font-bold mb-4">Workflow</h3>
        <WorkflowSteps />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="font-serif text-lg font-bold">Step 4: Adjust with Alpha Masking</div>
            <span className="text-xs font-semibold bg-luxury-gold text-luxury-deep-gray px-3 py-1 rounded">ALPHA MASKED</span>
          </div>

          <div className="card-luxury p-4">
            <FabricVisualizer baseSrc="/images/sofa-1.jpg" maskSrc="/images/mask-1.png" fabricSrc="/images/fabric-sample.jpg" />
          </div>

          <div className="mt-4">
            <ChecklistCard items={checklist} />
          </div>
        </div>

        <div>
          <div className="card-luxury p-6">
            <h4 className="font-serif text-xl font-bold mb-2">AI & Models</h4>
            <ul className="text-sm text-luxury-sage space-y-2">
              <li>YOLOv8-Seg for quick furniture localization</li>
              <li>Mask R-CNN for fine segmentation</li>
              <li>Alpha Masking to prevent fabric overflow</li>
              <li>Background preservation for realistic previews</li>
              <li>Result: professional visualization with no fabric overflow</li>
            </ul>
          </div>

          <div className="mt-6">
            <div className="card-luxury p-6">
              <h4 className="font-serif text-lg font-bold mb-2">Adjustments</h4>
              <p className="text-sm text-luxury-sage">Fine-tune mask opacity, blend, and pattern repeat to match real-world results.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-2xl font-bold mb-4">Admin & Business</h3>
        <div className="card-luxury p-6">
          <p className="text-luxury-sage">Full control over products, orders and analytics with easy export, product visibility flags and sales reports.</p>
        </div>
      </div>
    </div>
  )
}
