import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  // Add a few sample fabric library entries (if missing)
  const fabrics = [
    {
      code: 'DEC-101',
      name: 'D Decor Velvet - Rust',
      collection: 'D Decor Inspired',
      colorFamily: 'warm',
      pattern: 'plain',
      composition: '100% Polyester',
      gsm: 320,
      width: 140,
      pricePerMeter: 2200,
      thumbnailUrl: '/fabrics/thumbs/dec-velvet-rust.svg',
      seamlessTextureUrl: '/textures/dec-velvet-rust.svg',
      normalMapUrl: null,
      roughnessMapUrl: null,
      textureScale: 1.0,
      tags: ['velvet', 'luxury'],
    },
    {
      code: 'FAB-202',
      name: 'FabIndia Khadi - Natural',
      collection: 'FabIndia Style',
      colorFamily: 'neutral',
      pattern: 'textured',
      composition: '100% Cotton',
      gsm: 170,
      width: 140,
      pricePerMeter: 950,
      thumbnailUrl: '/fabrics/thumbs/fab-khadi.svg',
      seamlessTextureUrl: '/textures/fab-khadi.svg',
      normalMapUrl: null,
      roughnessMapUrl: null,
      textureScale: 1.0,
      tags: ['khadi', 'indian', 'handloom'],
    },
  ]

  for (const f of fabrics) {
    const exists = await db.fabricLibrary.findUnique({ where: { code: f.code } })
    if (!exists) {
      await db.fabricLibrary.create({ data: f })
      console.log('Created fabric catalog:', f.name)
    }
  }

  // Add accessory products
  const accessories = [
    {
      name: 'Curtain Track - Aluminium 3m',
      price: 1299,
      description: 'Sturdy aluminium curtain track, 3 meters, easy-mount',
      images: ['/catalogs/accessories/track.svg'],
      tags: ['track', 'curtain', 'hardware'],
      visible: true,
    },
    {
      name: 'Steel Tube - 25mm (1.5m)',
      price: 399,
      description: 'Galvanized steel tube for curtain rods',
      images: ['/catalogs/accessories/tube.svg'],
      tags: ['tube', 'rod', 'hardware'],
      visible: true,
    },
    {
      name: 'Mounting Bracket (pair)',
      price: 249,
      description: 'Heavy duty mounting brackets for tracks and rods',
      images: ['/catalogs/accessories/bracket.svg'],
      tags: ['bracket', 'mount', 'hardware'],
      visible: true,
    },
    {
      name: 'Electrical Socket - 2 Gang',
      price: 199,
      description: 'Modern 2 gang socket with earth',
      images: ['/catalogs/accessories/socket.svg'],
      tags: ['socket', 'electrical', 'accessory'],
      visible: true,
    },
  ]

  for (const a of accessories) {
    const exists = await db.product.findFirst({ where: { name: a.name } })
    if (!exists) {
      await db.product.create({ data: a })
      console.log('Created accessory product:', a.name)
    }
  }

  // Update product sample image if needed
  const product = await db.product.findFirst()
  if (product) {
    if (!product.images || product.images.length === 0 || !product.images[0].includes('sofa')) {
      await db.product.update({ where: { id: product.id }, data: { images: ['/images/sofa-1.svg'] } })
      console.log('Updated product sample image')
    }
  }

  console.log('Sample catalogs script completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
