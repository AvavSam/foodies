import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total count
    const total = await db.destination.count()

    // Get visited count
    const visited = await db.destination.count({
      where: { visited: true }
    })

    // Get unvisited count
    const unvisited = await db.destination.count({
      where: { visited: false }
    })

    // Get count by type
    const kuliner = await db.destination.count({
      where: { type: 'KULINER' }
    })

    const hiburan = await db.destination.count({
      where: { type: 'HIBURAN' }
    })

    const lainnya = await db.destination.count({
      where: { type: 'LAINNYA' }
    })

    return NextResponse.json({
      success: true,
      data: {
        total,
        visited,
        unvisited,
        byType: {
          kuliner,
          hiburan,
          lainnya
        }
      }
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
