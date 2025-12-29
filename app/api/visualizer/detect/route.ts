import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import type {
  FurnitureDetectionResponse,
  DetectedFurnitureItem,
  FurnitureType,
} from '@/lib/types/visualizer'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads/visualizer')
const MASK_DIR = join(process.cwd(), 'public/masks/visualizer')

async function ensureDirs() {
  for (const dir of [UPLOAD_DIR, MASK_DIR]) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
  }
}

/**
 * Mock segmentation function
 * In production, this would use YOLOv8-Seg, SAM, or Mask R-CNN
 * For now, we simulate detection by creating mock masks
 */
async function mockFurnitureDetection(
  imageUrl: string,
  uploadId: string,
  imageWidth: number,
  imageHeight: number
): Promise<DetectedFurnitureItem[]> {
  const items: DetectedFurnitureItem[] = []

  // Load the image to analyze color distribution
  const imagePath = join(process.cwd(), 'public', imageUrl.replace(/^\//, ''))
  
  try {
    const metadata = await sharp(imagePath).metadata()
    const width = metadata.width || imageWidth
    const height = metadata.height || imageHeight

    // Mock detection: Create a simulated sofa mask
    // In real implementation, use actual ML model

    // Create a simple mask: bottom 40% of image as "fabric area"
    const maskHeight = Math.floor(height * 0.5)
    const maskY = Math.floor(height * 0.3)

    // Create a white mask for the fabric area
    const maskBuffer = Buffer.alloc(width * height * 4, 0) // Fully transparent
    
    // Fill the fabric region (simple rectangular detection)
    for (let y = maskY; y < maskY + maskHeight; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4
        // White with full alpha (opaque)
        maskBuffer[pixelIndex] = 255 // R
        maskBuffer[pixelIndex + 1] = 255 // G
        maskBuffer[pixelIndex + 2] = 255 // B
        maskBuffer[pixelIndex + 3] = 200 // A (slightly transparent at edges for soft transition)
      }
    }

    // Save mask as PNG
    const maskFilename = `mask-${uploadId}-sofa.png`
    const maskPath = join(MASK_DIR, maskFilename)

    await sharp(maskBuffer, {
      raw: {
        width,
        height,
        channels: 4,
      },
    })
      .png()
      .toFile(maskPath)

    items.push({
      id: `${uploadId}-sofa`,
      type: 'sofa-3-seater' as FurnitureType,
      label: 'Sofa',
      confidence: 0.92,
      maskUrl: `/masks/visualizer/${maskFilename}`,
      color: '#8B7355',
      editable: true,
      boundingBox: {
        x: 0,
        y: maskY,
        width,
        height: maskHeight,
      },
    })

    // Mock detection: Add a cushion if image is large enough
    if (width > 800 && height > 600) {
      const cushionMaskBuffer = Buffer.alloc(width * height * 4, 0)
      const cushionWidth = Math.floor(width * 0.25)
      const cushionHeight = Math.floor(height * 0.15)
      const cushionX = Math.floor(width * 0.1)
      const cushionY = Math.floor(height * 0.4)

      for (let y = cushionY; y < cushionY + cushionHeight; y++) {
        for (let x = cushionX; x < cushionX + cushionWidth; x++) {
          if (y >= 0 && y < height && x >= 0 && x < width) {
            const pixelIndex = (y * width + x) * 4
            cushionMaskBuffer[pixelIndex] = 255
            cushionMaskBuffer[pixelIndex + 1] = 255
            cushionMaskBuffer[pixelIndex + 2] = 255
            cushionMaskBuffer[pixelIndex + 3] = 180
          }
        }
      }

      const cushionMaskFilename = `mask-${uploadId}-cushion.png`
      const cushionMaskPath = join(MASK_DIR, cushionMaskFilename)

      await sharp(cushionMaskBuffer, {
        raw: {
          width,
          height,
          channels: 4,
        },
      })
        .png()
        .toFile(cushionMaskPath)

      items.push({
        id: `${uploadId}-cushion`,
        type: 'cushion' as FurnitureType,
        label: 'Cushion',
        confidence: 0.78,
        maskUrl: `/masks/visualizer/${cushionMaskFilename}`,
        color: '#D4A574',
        editable: true,
        boundingBox: {
          x: cushionX,
          y: cushionY,
          width: cushionWidth,
          height: cushionHeight,
        },
      })
    }
  } catch (error) {
    console.error('Mock detection error:', error)
    // Fallback: return a basic sofa detection
    items.push({
      id: `${uploadId}-sofa-fallback`,
      type: 'sofa-3-seater' as FurnitureType,
      label: 'Sofa',
      confidence: 0.5,
      maskUrl: `/masks/visualizer/fallback-mask.png`,
      color: '#8B7355',
      editable: true,
    })
  }

  return items
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirs()

    const body = await request.json()
    const { uploadId, imageUrl, imageWidth, imageHeight } = body

    if (!uploadId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing uploadId or imageUrl' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // Run mock detection
    const detectedItems = await mockFurnitureDetection(
      imageUrl,
      uploadId,
      imageWidth,
      imageHeight
    )

    const processingTimeMs = Date.now() - startTime

    const response: FurnitureDetectionResponse = {
      uploadId,
      items: detectedItems,
      detectedAt: new Date().toISOString(),
      modelUsed: 'mock-segmentation-v1',
      processingTimeMs,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Detection error:', error)
    return NextResponse.json(
      { error: 'Detection failed. Please try again.' },
      { status: 500 }
    )
  }
}
