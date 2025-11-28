import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.email || !body.password) return NextResponse.json({ error: 'Missing' }, { status: 400 })
  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 })
  const hashed = await bcrypt.hash(body.password, 10)
  const user = await prisma.user.create({ data: { email: body.email, name: body.name || null, password: hashed } })
  return NextResponse.json({ user })
}
