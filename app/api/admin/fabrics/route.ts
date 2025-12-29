import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const fabrics = await prisma.fabricLibrary.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ fabrics }, { status: 200 })
  } catch (error) {
    console.error('Admin fabrics GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch fabrics' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, updates } = body
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 })
    }

    const fabric = await prisma.fabricLibrary.update({ where: { id }, data: updates })
    return NextResponse.json({ fabric }, { status: 200 })
  } catch (error) {
    console.error('Admin fabrics PUT error:', error)
    return NextResponse.json({ error: 'Failed to update fabric' }, { status: 500 })
  }
}
