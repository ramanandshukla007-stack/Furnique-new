import React from 'react'

export default function ChecklistCard({ items }: { items: string[] }) {
  return (
    <div className="card-luxury p-4">
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-luxury-gold mt-1" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.708L9 18l-5.285-5.293 1.414-1.414L9 15.172l9.871-9.878z"/></svg>
            <span className="text-sm text-luxury-deep-gray">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
