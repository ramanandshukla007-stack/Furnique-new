import { NextRequest, NextResponse } from 'next/server'
import type { ApplyFabricResponse, WebGLRenderParams } from '@/lib/types/visualizer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uploadId, itemId, fabricId, tileScale = 1.0, rotation = 0 } = body

    if (!uploadId || !itemId || !fabricId) {
      return NextResponse.json(
        { error: 'Missing required fields: uploadId, itemId, fabricId' },
        { status: 400 }
      )
    }

    // In a real implementation, would:
    // 1. Load the fabric texture and material from database
    // 2. Apply compositing on the server (using Sharp/Canvas) or return render params for client
    // 3. Cache the result

    // For now, return render parameters for client-side WebGL rendering
    const renderParams: WebGLRenderParams = {
      originalImageUrl: `/uploads/visualizer/upload-${uploadId.split('-')[1]}.jpg`,
      maskUrl: `/masks/visualizer/mask-${uploadId}-${itemId.split('-').pop()}.png`,
      fabricTextureUrl: `/textures/fabrics/fabric-${fabricId}.jpg`, // Placeholder
      normalMapUrl: `/textures/fabrics/fabric-${fabricId}-normal.jpg`,
      roughnessMapUrl: `/textures/fabrics/fabric-${fabricId}-roughness.jpg`,
      tileScale,
      rotation,
      blendMode: 'overlay',
    }

    const response: ApplyFabricResponse = {
      uploadId,
      itemId,
      fabricId,
      renderParams,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Apply fabric error:', error)
    return NextResponse.json(
      { error: 'Failed to apply fabric' },
      { status: 500 }
    )
  }
}
