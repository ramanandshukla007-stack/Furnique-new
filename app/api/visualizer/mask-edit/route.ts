import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { MaskEditPayload, BrushStroke } from '@/lib/types/visualizer'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { createCanvas, loadImage } from 'canvas'

const MASK_DIR = join(process.cwd(), 'public/masks/visualizer')

async function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    await ensureDir(MASK_DIR)

    const body = (await request.json()) as MaskEditPayload
    const { uploadId, itemId, brushStrokes } = body

    if (!uploadId || !itemId) {
      return NextResponse.json({ error: 'Missing uploadId or itemId' }, { status: 400 })
    }

    // Determine mask filename used by detection
    const suffix = itemId.split('-').pop() || 'item'
    const maskFilename = `mask-${uploadId}-${suffix}.png`
    const maskPath = join(MASK_DIR, maskFilename)

    // If mask exists, load it; otherwise create a blank canvas sized from original upload if available
    let width = 1024
    let height = 768

    // Try to infer size from existing mask or upload file
    if (existsSync(maskPath)) {
      const img = await loadImage(maskPath)
      width = img.width
      height = img.height
    } else {
      // Try to load the uploaded image to match dimensions
      const uploadImagePath = join(process.cwd(), `public/uploads/visualizer/upload-${uploadId.split('-')[1]}.jpg`)
      if (existsSync(uploadImagePath)) {
        const img = await loadImage(uploadImagePath)
        width = img.width
        height = img.height
      }
    }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // If existing mask present, draw it as the base
    if (existsSync(maskPath)) {
      const img = await loadImage(maskPath)
      ctx.drawImage(img, 0, 0, width, height)
    } else {
      // Start with fully transparent background
      ctx.clearRect(0, 0, width, height)
    }

    // Apply strokes: each stroke is a filled circle; 'add' draws white, 'erase' removes
    for (const s of brushStrokes as BrushStroke[]) {
      const x = Math.round(s.x)
      const y = Math.round(s.y)
      const r = Math.max(1, Math.round(s.radius || 10))
      const opacity = typeof s.opacity === 'number' ? s.opacity : 1

      if (s.type === 'add') {
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = opacity
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      } else {
        // Erase: use destination-out to clear pixels
        ctx.globalCompositeOperation = 'destination-out'
        ctx.globalAlpha = opacity
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Export PNG buffer and write to disk
    const outBuffer = canvas.toBuffer('image/png')
    writeFileSync(maskPath, outBuffer)

    // Record or upsert VisualizerAlphaMask in DB
    try {
      await prisma.visualizerAlphaMask.create({
        data: {
          uploadId,
          itemId: suffix,
          maskUrl: `/masks/visualizer/${maskFilename}`,
          width,
          height,
          format: 'png',
        },
      })
    } catch (e) {
      // If record exists, ignore
    }

    return NextResponse.json({ success: true, maskUrl: `/masks/visualizer/${maskFilename}`, strokeCount: brushStrokes.length }, { status: 200 })
  } catch (error) {
    console.error('Mask edit error:', error)
    return NextResponse.json({ error: 'Failed to save mask edits' }, { status: 500 })
  }
}
