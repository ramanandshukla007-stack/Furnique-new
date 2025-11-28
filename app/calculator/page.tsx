import React from 'react'
import Link from 'next/link'
import prisma from '../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../lib/auth'

export default async function CalculatorPage() {
  const session = await getServerSession(authOptions as any)
  let projects: any[] = []
  if (session?.user?.id) {
    projects = await prisma.calculatorProject.findMany({ where: { userId: session.user.id } })
  }

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

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Your Projects</h2>
        {projects.length === 0 ? (
          <div className="text-slate-600">No projects yet.</div>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.id} className="border p-3 rounded">{p.name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
