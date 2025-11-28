import React from 'react'
import prisma from '../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../lib/auth'

export default async function BookingsPage() {
  const session = await getServerSession(authOptions as any)
  let bookings: any[] = []
  if (session?.user?.id) {
    bookings = await prisma.booking.findMany({ where: { userId: session.user.id } })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
      <div className="border rounded p-4">
        {bookings.length === 0 ? (
          <div>You have no bookings yet. Use the booking forms to request showroom or home visits.</div>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li key={b.id} className="p-3 border rounded">
                <div className="font-medium">{b.type}</div>
                <div className="text-sm text-slate-600">{b.status} — {b.date ? new Date(b.date).toLocaleString() : 'No date'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
