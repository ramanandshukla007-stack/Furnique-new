import React from 'react'
import prisma from '../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../lib/auth'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div>Forbidden</div>
  }

  const products = await prisma.product.findMany()
  const projects = await prisma.calculatorProject.findMany()
  const bookings = await prisma.booking.findMany()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Products</h2>
        <ul className="space-y-2 mt-2">
          {products.map((p) => (
            <li key={p.id} className="border p-2 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-slate-600">₹{(p.price/100).toFixed(2)}</div>
              </div>
              <div>
                <button onClick={async () => {
                  const res = await fetch(`/api/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !p.visible }) })
                  if (res.ok) window.location.reload()
                }} className="px-3 py-1 border rounded">{p.visible ? 'Hide' : 'Show'}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Calculator Projects</h2>
        <ul className="space-y-2 mt-2">
          {projects.map((pr) => (
            <li key={pr.id} className="border p-2 rounded">
              <div className="font-medium">{pr.name}</div>
              <div className="text-sm text-slate-600">User: {String(pr.userId)}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold">Bookings</h2>
        <ul className="space-y-2 mt-2">
          {bookings.map((b) => (
            <li key={b.id} className="border p-2 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{b.type}</div>
                <div className="text-sm text-slate-600">User: {String(b.userId)} — {b.status}</div>
              </div>
              <div className="space-x-2">
                <Link href={`/bookings/${b.id}`} className="text-sm underline">View</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
