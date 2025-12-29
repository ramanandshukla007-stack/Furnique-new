import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any)
  const id = Number(params.id)
  const project = await prisma.calculatorProject.findUnique({ where: { id } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (project.userId && session?.user?.id !== project.userId && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json({ project })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = Number(params.id)
  const body = await request.json()
  const project = await prisma.calculatorProject.findUnique({ where: { id } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (project.userId !== session.user.id && session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const updated = await prisma.calculatorProject.update({ where: { id }, data: { name: body.name ?? project.name, rooms: body.rooms ?? project.rooms } })
  return NextResponse.json({ project: updated })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = Number(params.id)
  const project = await prisma.calculatorProject.findUnique({ where: { id } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (project.userId !== session.user.id && session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await prisma.calculatorProject.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
