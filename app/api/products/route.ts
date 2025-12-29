import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  try {
    if (id && id !== 'products') {
      const product = await prisma.product.findUnique({ where: { id: Number(id) }, include: { fabrics: true } })
      return NextResponse.json({ product })
    }

    const products = await prisma.product.findMany({ include: { fabrics: true } })
    return NextResponse.json({ products })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
