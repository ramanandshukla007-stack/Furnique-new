import React from 'react'

export default function WorkflowSteps() {
  const steps = [
    { title: 'Upload', desc: 'Add a photo of your room or furniture' },
    { title: 'Detect Furniture', desc: 'AI segments furniture and fabric areas' },
    { title: 'Apply Fabric', desc: 'Choose fabric and see it applied' },
    { title: 'Preview / Save', desc: 'Adjust masks, save results or export' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {steps.map((s, idx) => (
        <div key={s.title} className="card-luxury p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-luxury-cream flex items-center justify-center text-luxury-gold font-serif font-bold">{idx+1}</div>
          <h5 className="font-semibold text-luxury-deep-gray">{s.title}</h5>
          <p className="text-xs text-luxury-sage mt-2">{s.desc}</p>
        </div>
      ))}
    </div>
  )
}
