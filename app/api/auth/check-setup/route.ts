import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check if password is set in database
    const appConfig = await db.appConfig.findUnique({
      where: { key: 'access_password' }
    })

    const isSetup = !!appConfig

    return NextResponse.json({
      isSetup,
      message: isSetup ? 'Password is set' : 'Password not set'
    })

  } catch (error) {
    console.error('Check setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
