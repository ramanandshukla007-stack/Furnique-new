import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type {
  FabricCatalog,
  FabricFilterOptions,
  ColorFamily,
  FabricPattern,
} from '@/lib/types/visualizer'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse filter options
    const filters: FabricFilterOptions = {
      colorFamilies: searchParams.getAll('colorFamily') as ColorFamily[],
      patterns: searchParams.getAll('pattern') as FabricPattern[],
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice')
        ? parseInt(searchParams.get('minPrice')!)
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseInt(searchParams.get('maxPrice')!)
        : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
    }

    // Build query
    const where: any = {
      active: true,
    }

    if (filters.colorFamilies && filters.colorFamilies.length > 0) {
      where.colorFamily = {
        in: filters.colorFamilies,
      }
    }

    if (filters.patterns && filters.patterns.length > 0) {
      where.pattern = {
        in: filters.patterns,
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ]
    }

    if (filters.minPrice) {
      where.pricePerMeter = { gte: filters.minPrice }
    }

    if (filters.maxPrice) {
      if (where.pricePerMeter) {
        where.pricePerMeter.lte = filters.maxPrice
      } else {
        where.pricePerMeter = { lte: filters.maxPrice }
      }
    }

    // Sort options
    const orderBy: any = {}
    if (filters.sortBy === 'price') {
      orderBy.pricePerMeter =
        filters.sortOrder === 'asc' ? 'asc' : 'desc'
    } else if (filters.sortBy === 'newest') {
      orderBy.createdAt = filters.sortOrder === 'asc' ? 'asc' : 'desc'
    } else {
      orderBy.name = filters.sortOrder === 'asc' ? 'asc' : 'desc'
    }

    // Fetch fabrics
    const fabrics = await prisma.fabricLibrary.findMany({
      where,
      orderBy,
      take: 50, // Limit to 50 for now
    })

    // Format response
    const catalog: FabricCatalog = {
      fabrics: fabrics.map((f) => ({
        id: f.id.toString(),
        name: f.name,
        code: f.code,
        collection: f.collection || undefined,
        colorFamily: f.colorFamily as ColorFamily,
        pattern: f.pattern as FabricPattern,
        composition: f.composition || undefined,
        gsm: f.gsm || undefined,
        width: f.width || undefined,
        pricePerMeter: f.pricePerMeter,
        thumbnailUrl: f.thumbnailUrl,
        tags: f.tags,
        createdAt: f.createdAt.toISOString(),
        texture: {
          id: `texture-${f.id}`,
          seamlessTextureUrl: f.seamlessTextureUrl,
          normalMapUrl: f.normalMapUrl || undefined,
          roughnessMapUrl: f.roughnessMapUrl || undefined,
          textureScale: f.textureScale || 1.0,
          format: 'jpg',
        },
      })),
      total: fabrics.length,
      filters: {
        colorFamilies: [
          'neutral',
          'warm',
          'cool',
          'jewel-tone',
          'earth',
          'gray',
          'black',
          'white',
        ] as ColorFamily[],
        patterns: [
          'plain',
          'stripe',
          'floral',
          'geometric',
          'textured',
          'print',
        ] as FabricPattern[],
      },
    }

    return NextResponse.json(catalog, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Fabrics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fabrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const fabric = await request.json()

    // Validate required fields
    if (!fabric.code || !fabric.name || !fabric.thumbnailUrl || !fabric.seamlessTextureUrl) {
      return NextResponse.json(
        { error: 'Missing required fabric fields' },
        { status: 400 }
      )
    }

    const created = await prisma.fabricLibrary.create({
      data: {
        code: fabric.code,
        name: fabric.name,
        collection: fabric.collection,
        colorFamily: fabric.colorFamily || 'neutral',
        pattern: fabric.pattern || 'plain',
        composition: fabric.composition,
        gsm: fabric.gsm,
        width: fabric.width,
        pricePerMeter: fabric.pricePerMeter || 0,
        thumbnailUrl: fabric.thumbnailUrl,
        seamlessTextureUrl: fabric.seamlessTextureUrl,
        normalMapUrl: fabric.normalMapUrl,
        roughnessMapUrl: fabric.roughnessMapUrl,
        textureScale: fabric.textureScale || 1.0,
        tags: fabric.tags || [],
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Fabric creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create fabric' },
      { status: 500 }
    )
  }
}
