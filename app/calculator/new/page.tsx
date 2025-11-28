"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import ProjectEditor from '../../../components/ProjectEditor'

export default function NewProjectPage() {
  const router = useRouter()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">New Calculator Project</h1>
      <ProjectEditor onSave={(proj: any) => {
        const id = proj?.id
        if (id) router.push(`/calculator/${id}`)
        else router.push('/calculator')
      }} />
    </div>
  )
}
