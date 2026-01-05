import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Validate input
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Check if password is set in database
    const appConfig = await db.appConfig.findUnique({
      where: { key: 'access_password' }
    })

    if (!appConfig) {
      return NextResponse.json(
        { error: 'Password not set. Please setup password first.' },
        { status: 400 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, appConfig.value)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create session token (simple version using timestamp)
    const token = Buffer.from(`${Date.now()}:${appConfig.id}`).toString('base64')

    // Set session cookie
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
