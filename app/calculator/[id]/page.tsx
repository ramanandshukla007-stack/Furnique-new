import React from 'react'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../lib/auth'
import ProjectEditor from '../../../components/ProjectEditor'

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any)
  const id = Number(params.id)
  const project = await prisma.calculatorProject.findUnique({ where: { id } })
  if (!project) return <div>Project not found</div>
  if (project.userId && session?.user?.id !== project.userId && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div>Forbidden</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Project</h1>
      <ProjectEditor initial={project} onSave={(p: any) => { /* client will handle redirect */ }} />
      <div className="mt-4">
        <form method="post" action={`/api/calculator/${id}?_method=delete`}>
          {/* Delete handled via client since HTML form method override not supported; provide button that calls DELETE via fetch */}
          <button type="button" onClick={async () => {
            if (!confirm('Delete project?')) return
            const res = await fetch(`/api/calculator/${id}`, { method: 'DELETE' })
            if (res.ok) window.location.href = '/calculator'
            else alert('Failed to delete')
          }} className="text-red-600">Delete Project</button>
        </form>
      </div>
    </div>
  )
}
