import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const db = new PrismaClient()

async function main() {
  // Don't delete existing data; just ensure products exist
  const existingProduct = await db.product.findFirst()
  
  if (!existingProduct) {
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
  }

  // Seed fabric library for visualizer
  const sampleFabrics = [
    {
      code: 'LIN-001',
      name: 'Premium Linen - Natural',
      collection: 'Natural Weaves',
      colorFamily: 'neutral',
      pattern: 'textured',
      composition: '100% Linen',
      gsm: 180,
      width: 140,
      pricePerMeter: 850,
      thumbnailUrl: '/fabrics/thumbs/linen-natural.jpg',
      seamlessTextureUrl: '/textures/linen-natural.jpg',
      normalMapUrl: '/textures/linen-natural-normal.jpg',
      roughnessMapUrl: '/textures/linen-natural-roughness.jpg',
      textureScale: 1.0,
      tags: ['linen', 'natural', 'breathable'],
    },
    {
      code: 'WOL-002',
      name: 'Wool Tweed - Charcoal',
      collection: 'Wool Collection',
      colorFamily: 'gray',
      pattern: 'plain',
      composition: '100% Wool',
      gsm: 220,
      width: 140,
      pricePerMeter: 1200,
      thumbnailUrl: '/fabrics/thumbs/wool-charcoal.jpg',
      seamlessTextureUrl: '/textures/wool-charcoal.jpg',
      normalMapUrl: '/textures/wool-charcoal-normal.jpg',
      roughnessMapUrl: '/textures/wool-charcoal-roughness.jpg',
      textureScale: 1.2,
      tags: ['wool', 'warm', 'durable'],
    },
    {
      code: 'COT-003',
      name: 'Cotton Blend - Cream',
      collection: 'Comfort Range',
      colorFamily: 'warm',
      pattern: 'plain',
      composition: '80% Cotton, 20% Polyester',
      gsm: 150,
      width: 140,
      pricePerMeter: 650,
      thumbnailUrl: '/fabrics/thumbs/cotton-cream.jpg',
      seamlessTextureUrl: '/textures/cotton-cream.jpg',
      normalMapUrl: '/textures/cotton-cream-normal.jpg',
      roughnessMapUrl: '/textures/cotton-cream-roughness.jpg',
      textureScale: 0.9,
      tags: ['cotton', 'soft', 'affordable'],
    },
    {
      code: 'LEN-004',
      name: 'Linen Stripe - Blue & White',
      collection: 'Pattern Play',
      colorFamily: 'cool',
      pattern: 'stripe',
      composition: '100% Linen',
      gsm: 180,
      width: 140,
      pricePerMeter: 950,
      thumbnailUrl: '/fabrics/thumbs/linen-stripe-blue.jpg',
      seamlessTextureUrl: '/textures/linen-stripe-blue.jpg',
      normalMapUrl: '/textures/linen-stripe-blue-normal.jpg',
      roughnessMapUrl: '/textures/linen-stripe-blue-roughness.jpg',
      textureScale: 1.5,
      tags: ['striped', 'linen', 'nautical'],
    },
    {
      code: 'SIL-005',
      name: 'Silk Blend - Emerald',
      collection: 'Luxury Range',
      colorFamily: 'jewel-tone',
      pattern: 'plain',
      composition: '70% Silk, 30% Cotton',
      gsm: 140,
      width: 140,
      pricePerMeter: 1800,
      thumbnailUrl: '/fabrics/thumbs/silk-emerald.jpg',
      seamlessTextureUrl: '/textures/silk-emerald.jpg',
      normalMapUrl: '/textures/silk-emerald-normal.jpg',
      roughnessMapUrl: '/textures/silk-emerald-roughness.jpg',
      textureScale: 0.8,
      tags: ['silk', 'luxury', 'shiny', 'elegant'],
    },
    {
      code: 'GEO-006',
      name: 'Geometric Print - Ochre',
      collection: 'Pattern Play',
      colorFamily: 'earth',
      pattern: 'geometric',
      composition: '100% Cotton',
      gsm: 160,
      width: 140,
      pricePerMeter: 750,
      thumbnailUrl: '/fabrics/thumbs/geo-ochre.jpg',
      seamlessTextureUrl: '/textures/geo-ochre.jpg',
      normalMapUrl: '/textures/geo-ochre-normal.jpg',
      roughnessMapUrl: '/textures/geo-ochre-roughness.jpg',
      textureScale: 1.3,
      tags: ['geometric', 'bold', 'modern'],
    },
  ]

  for (const fabric of sampleFabrics) {
    const exists = await db.fabricLibrary.findUnique({
      where: { code: fabric.code },
    })

    if (!exists) {
      await db.fabricLibrary.create({
        data: fabric,
      })
      console.log(`Created fabric: ${fabric.name}`)
    }
  }

  // Ensure demo user exists
  const existingUser = await db.user.findUnique({
    where: { email: 'demo@furnique.test' },
  })

  if (!existingUser) {
    const hashed = await bcrypt.hash('changeme', 10)
    await db.user.create({
      data: {
        email: 'demo@furnique.test',
        name: 'Demo User',
        password: hashed,
      },
    })
    console.log('Created demo user')
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
