import React from 'react'

export default function FeatureCards() {
  const features = [
    {
      title: 'AI Fabric Detection',
      icon: (
        <svg className="w-8 h-8 text-luxury-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      bullets: ['Auto-detects furniture surfaces', 'Pixel-accurate masks', 'Works on photos without drawing']
    },
    {
      title: 'Alpha Masking',
      icon: (
        <svg className="w-8 h-8 text-luxury-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      bullets: ['Soft edges to prevent fabric overflow', 'Control opacity and blend', 'Preserve fine details']
    },
    {
      title: 'Background Preservation',
      icon: (
        <svg className="w-8 h-8 text-luxury-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/></svg>
      ),
      bullets: ['Keep original room context', 'No haloing or artifacts', 'Fast real-time preview']
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f) => (
        <div key={f.title} className="card-luxury p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center">{f.icon}</div>
            <h4 className="font-serif text-lg font-bold text-luxury-deep-gray">{f.title}</h4>
          </div>
          <ul className="text-sm text-luxury-sage space-y-2">
            {f.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-luxury-gold mt-1" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.708L9 18l-5.285-5.293 1.414-1.414L9 15.172l9.871-9.878z"/></svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
