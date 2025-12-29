import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = Number(params.id)
  const body = await request.json()
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // allow owner or admin to update
  if (booking.userId !== session.user.id && session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const updated = await prisma.booking.update({ where: { id }, data: { status: body.status ?? booking.status, notes: body.notes ?? booking.notes } })
  return NextResponse.json({ booking: updated })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = Number(params.id)
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (booking.userId !== session.user.id && session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.booking.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
