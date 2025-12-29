import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads/fabrics')

async function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    await ensureDir(UPLOAD_DIR)
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const buf = Buffer.from(await file.arrayBuffer())
    const ts = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const filename = `${ts}-${safeName}`
    const outPath = join(UPLOAD_DIR, filename)
    writeFileSync(outPath, buf)

    const publicUrl = `/uploads/fabrics/${filename}`
    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error('Fabric upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
