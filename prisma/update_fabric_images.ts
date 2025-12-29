import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const mapping: { code: string; thumb: string; texture: string }[] = [
    { code: 'LIN-001', thumb: '/fabrics/thumbs/linen-natural.jpg', texture: '/textures/linen-natural.jpg' },
    { code: 'WOL-002', thumb: '/fabrics/thumbs/wool-charcoal.jpg', texture: '/textures/wool-charcoal.jpg' },
    { code: 'COT-003', thumb: '/fabrics/thumbs/cotton-cream.jpg', texture: '/textures/cotton-cream.jpg' },
    { code: 'LEN-004', thumb: '/fabrics/thumbs/linen-stripe-blue.jpg', texture: '/textures/linen-stripe-blue.jpg' },
    { code: 'SIL-005', thumb: '/fabrics/thumbs/silk-emerald.jpg', texture: '/textures/silk-emerald.jpg' },
    { code: 'GEO-006', thumb: '/fabrics/thumbs/geo-ochre.jpg', texture: '/textures/geo-ochre.jpg' },
    { code: 'DEC-101', thumb: '/fabrics/thumbs/dec-velvet-rust.svg', texture: '/textures/dec-velvet-rust.svg' },
    { code: 'FAB-202', thumb: '/fabrics/thumbs/fab-khadi.svg', texture: '/textures/fab-khadi.svg' },
  ]

  for (const m of mapping) {
    const f = await db.fabricLibrary.findUnique({ where: { code: m.code } })
    if (f) {
      await db.fabricLibrary.update({ where: { code: m.code }, data: { thumbnailUrl: m.thumb, seamlessTextureUrl: m.texture } })
      console.log('Updated', m.code)
    } else {
      console.log('Not found', m.code)
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await (await import('@prisma/client')).PrismaClient.prototype.$disconnect?.call(await new (await import('@prisma/client')).PrismaClient()) })
