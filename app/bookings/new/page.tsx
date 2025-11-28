"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBookingPage() {
  const [type, setType] = useState('showroom')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, date, notes }) })
    if (res.ok) router.push('/bookings')
    else alert('Failed to create booking')
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">New Booking</h1>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="showroom">Showroom Visit</option>
          <option value="home">Home Visit</option>
          <option value="sample">Sample Request</option>
          <option value="bulk">Bulk Quotation</option>
        </select>

        <label className="block">Preferred date/time</label>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border px-3 py-2 rounded" />

        <label className="block">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border px-3 py-2 rounded" />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Request</button>
      </form>
    </div>
  )
}
