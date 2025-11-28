import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const bookings = await prisma.booking.findMany()
  return NextResponse.json({ bookings })
}

export async function POST(request: Request) {
  const body = await request.json()
  const created = await prisma.booking.create({ data: { type: body.type || 'visit', notes: body.notes || '', date: body.date ? new Date(body.date) : null } })
  return NextResponse.json({ booking: created })
}
