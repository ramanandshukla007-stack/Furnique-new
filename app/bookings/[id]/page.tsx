import React from 'react'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../lib/auth'

export default async function BookingDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  const id = Number(params.id)
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return <div>Booking not found</div>
  if (booking.userId && session?.user?.id !== booking.userId && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div>Forbidden</div>
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-2">Booking — {booking.type}</h1>
      <div className="border rounded p-4">
        <div className="mb-2">Status: <strong>{booking.status}</strong></div>
        <div className="mb-2">Date: {booking.date ? new Date(booking.date).toLocaleString() : '—'}</div>
        <div className="mb-2">Notes: {booking.notes ?? '—'}</div>
      </div>
      <div className="mt-3">
        {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
          <div>
            <button onClick={async () => {
              const res = await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'confirmed' }) })
              if (res.ok) window.location.reload()
            }} className="mr-2 bg-green-600 text-white px-3 py-1 rounded">Mark Confirmed</button>
            <button onClick={async () => {
              const res = await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) })
              if (res.ok) window.location.reload()
            }} className="bg-red-600 text-white px-3 py-1 rounded">Cancel</button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
