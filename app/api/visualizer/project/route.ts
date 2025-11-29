import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { VisualizerProjectData } from '@/lib/types/visualizer'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VisualizerProjectData

    const project = await prisma.visualizerProject.create({
      data: {
        uploadId: body.uploadId,
        projectName: body.projectName,
        notes: body.notes,
        detectionData: body.detectedItems as any,
        applications: body.applications as any,
        maskEdits: body.applications as any, // Store mask edits if any
      },
    })

    return NextResponse.json(
      {
        id: project.id,
        message: 'Project saved successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Project save error:', error)
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project ID' },
        { status: 400 }
      )
    }

    const project = await prisma.visualizerProject.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
