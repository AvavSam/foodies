import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { Prisma } from '@/generated/prisma/client'

// GET all destinations
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const visited = searchParams.get('visited')
    const search = searchParams.get('search')
    const priority = searchParams.get('priority')

    // Build filter object
    const filter: Prisma.DestinationWhereInput = {}

    if (type) {
      filter.type = type
    }

    if (visited !== null) {
      filter.visited = visited === 'true'
    }

    if (priority) {
      filter.priority = priority
    }

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch destinations with filters
    const destinations = await db.destination.findMany({
      where: filter,
      orderBy: [
        { priority: 'desc' }, // High priority first
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: destinations
    })

  } catch (error) {
    console.error('Get destinations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new destination
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      type,
      googleMapUrl,
      description,
      imageUrl,
      priority
    } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Create destination
    const destination = await db.destination.create({
      data: {
        name,
        type,
        googleMapUrl: googleMapUrl || null,
        description: description || null,
        notes: null, // Notes only for visited status
        visited: false, // Always start as not visited
        visitDate: null,
        rating: null,
        imageUrl: imageUrl || null,
        priority: priority || 'NORMAL'
      }
    })

    return NextResponse.json({
      success: true,
      data: destination,
      message: 'Destination created successfully'
    })

  } catch (error) {
    console.error('Create destination error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
