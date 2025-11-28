import React from 'react'
import Link from 'next/link'

export default function CalculatorPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Fabric Calculator</h1>
        <Link href="/calculator/new" className="text-indigo-600">New Project</Link>
      </div>

      <div className="border rounded p-4">
        <p>Create multi-room projects and calculate fabric requirements.</p>
        <div className="mt-4">
          <Link href="/calculator/new" className="bg-indigo-600 text-white px-4 py-2 rounded">Create Project</Link>
        </div>
      </div>
    </div>
  )
}
