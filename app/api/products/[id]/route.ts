import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = Number(params.id)
  const body = await request.json()
  const updated = await prisma.product.update({ where: { id }, data: { visible: body.visible ?? undefined } })
  return NextResponse.json({ product: updated })
}
