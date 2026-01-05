import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, confirmPassword } = body

    // Validate input
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if password is already set
    const existingConfig = await db.appConfig.findUnique({
      where: { key: 'access_password' }
    })

    if (existingConfig) {
      return NextResponse.json(
        { error: 'Password is already set. Use login instead.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Save password to database
    const config = await db.appConfig.create({
      data: {
        key: 'access_password',
        value: hashedPassword
      }
    })

    // Create session token
    const token = Buffer.from(`${Date.now()}:${config.id}`).toString('base64')

    // Set session cookie
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Password setup successful'
    })

  } catch (error) {
    console.error('Setup password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
