import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'
import type { ImageUploadResponse } from '@/lib/types/visualizer'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads/visualizer')

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir()

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get image metadata
    const metadata = await sharp(buffer).metadata()
    const width = metadata.width || 1920
    const height = metadata.height || 1080

    // Generate filename with timestamp
    const timestamp = Date.now()
    const filename = `upload-${timestamp}.jpg`
    const filepath = join(UPLOAD_DIR, filename)

    // Optimize and save the image
    await sharp(buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(filepath)

    const uploadId = `upload-${timestamp}`
    const imageUrl = `/uploads/visualizer/${filename}`

    const response: ImageUploadResponse = {
      uploadId,
      imageUrl,
      width: Math.min(width, 1920),
      height: Math.min(height, 1080),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
