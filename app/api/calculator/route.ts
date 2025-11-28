import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const projects = await prisma.calculatorProject.findMany()
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const body = await request.json()
  const created = await prisma.calculatorProject.create({ data: { name: body.name || 'Project', rooms: body.rooms || [] } })
  return NextResponse.json({ project: created })
}
