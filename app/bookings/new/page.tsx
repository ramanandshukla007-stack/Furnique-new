"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../components/ToastProvider'

export default function NewBookingPage() {
  const [type, setType] = useState('showroom')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  function validate() {
    if (!type) return 'Select a booking type'
    // for showroom/home visits date is recommended
    if ((type === 'showroom' || type === 'home') && !date) return 'Please select a preferred date/time'
    return null
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) return showToast(err, 'error')
    setSaving(true)
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, date, notes }) })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to create booking')
      }
      showToast('Booking created', 'success')
      router.push('/bookings')
    } catch (e: any) {
      showToast(e?.message || 'Failed to create booking', 'error')
    } finally {
      setSaving(false)
    }
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

        <button disabled={saving} className={`bg-indigo-600 text-white px-4 py-2 rounded ${saving ? 'opacity-60' : ''}`}>{saving ? 'Submitting...' : 'Request'}</button>
      </form>
    </div>
  )
}
