import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions as any)
  const where = session?.user?.id ? { where: { userId: session.user.id } } : {}
  const bookings = await prisma.booking.findMany(where)
  return NextResponse.json({ bookings })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const created = await prisma.booking.create({ data: { type: body.type || 'visit', notes: body.notes || '', date: body.date ? new Date(body.date) : null, userId: session.user.id } })
  return NextResponse.json({ booking: created })
}
