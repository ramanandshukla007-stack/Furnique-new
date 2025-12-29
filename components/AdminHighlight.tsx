import React from 'react'

export default function AdminHighlight() {
  const bullets = [
    'Manage products and inventory with ease',
    'Track orders and shipments in one place',
    'Built-in analytics for sales and trends',
    'Control visibility, pricing and promotions'
  ]

  return (
    <div className="card-luxury p-8 bg-gradient-to-r from-luxury-deep-gray to-transparent">
      <div className="md:flex md:items-center md:justify-between">
        <div className="max-w-xl">
          <h3 className="font-serif text-3xl font-bold text-luxury-cream mb-2">Full control over products, orders & analytics</h3>
          <p className="text-luxury-sage">A single dashboard to manage your catalog, process orders and understand performance.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <ul className="space-y-2 text-luxury-cream">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="text-luxury-gold font-bold">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
