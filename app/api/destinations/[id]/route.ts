import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// PATCH update destination
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if destination exists
    const existing = await db.destination.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Update destination
    const destination = await db.destination.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.type && { type: body.type }),
        ...(body.googleMapUrl !== undefined && { googleMapUrl: body.googleMapUrl || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
        ...(body.visited !== undefined && { visited: body.visited }),
        ...(body.visitDate !== undefined && { visitDate: body.visitDate ? new Date(body.visitDate) : null }),
        ...(body.rating !== undefined && { rating: body.rating || null }),
        ...(body.ratingAvav !== undefined && { ratingAvav: body.ratingAvav || null }),
        ...(body.ratingUti !== undefined && { ratingUti: body.ratingUti || null }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
        ...(body.priority && { priority: body.priority }),
      }
    })

    return NextResponse.json({
      success: true,
      data: destination,
      message: 'Destination updated successfully'
    })

  } catch (error) {
    console.error('Update destination error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE destination
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if destination exists
    const existing = await db.destination.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Delete destination
    await db.destination.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    })

  } catch (error) {
    console.error('Delete destination error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
