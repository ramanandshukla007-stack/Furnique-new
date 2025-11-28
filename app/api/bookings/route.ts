import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../lib/auth'

export async function GET() {
  const session: any = await getServerSession(authOptions as any)
  const bookings = session?.user?.id
    ? await prisma.booking.findMany({ where: { userId: session.user.id } })
    : await prisma.booking.findMany()
  return NextResponse.json({ bookings })
}

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const created = await prisma.booking.create({ data: { type: body.type || 'visit', notes: body.notes || '', date: body.date ? new Date(body.date) : null, userId: session.user.id } })
  return NextResponse.json({ booking: created })
}
