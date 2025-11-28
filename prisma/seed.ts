import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const db = new PrismaClient()

async function main() {
  await db.product.deleteMany()
  await db.fabric.deleteMany()
  await db.user.deleteMany()

  const product = await db.product.create({
    data: {
      name: 'Classic 3-seater Sofa',
      price: 129900,
      description: 'Comfortable 3-seater sofa with removable cushions',
      images: ['/images/sofa-1.jpg'],
      tags: ['sofa', 'living'],
      visible: true,
      fabrics: {
        create: [
          { name: 'Stone Linen', patternUrl: '/fabrics/linen.jpg' },
          { name: 'Striped Blue', patternUrl: '/fabrics/striped.jpg' }
        ]
      }
    },
    include: { fabrics: true }
  })

  console.log('Seeded product:', product.name)

    const hashed = await bcrypt.hash('changeme', 10)
    await db.user.create({ data: { email: 'demo@furnique.test', name: 'Demo User', password: hashed } })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
      await db.$disconnect()
  })
