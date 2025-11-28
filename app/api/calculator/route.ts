import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions as any)
  const where = session?.user?.email ? { where: { userId: session.user.id } } : {}
  const projects = await prisma.calculatorProject.findMany(where)
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const created = await prisma.calculatorProject.create({ data: { name: body.name || 'Project', rooms: body.rooms || [], userId: session.user.id } })
  return NextResponse.json({ project: created })
}
