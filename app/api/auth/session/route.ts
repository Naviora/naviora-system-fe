import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Set secure HttpOnly cookies for auth-token and user-role
export async function POST(request: NextRequest) {
  try {
    const { access_token, role, maxAge } = (await request.json()) as {
      access_token: string
      role?: string
      maxAge?: number
    }

    if (!access_token) {
      return NextResponse.json({ success: false, message: 'access_token is required' }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Default to 7 days if not provided
    const cookieMaxAge = typeof maxAge === 'number' ? maxAge : 60 * 60 * 24 * 7

    cookieStore.set('auth-token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: cookieMaxAge
    })

    if (role) {
      cookieStore.set('user-role', role, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: cookieMaxAge
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 })
  }
}

// Clear cookies on logout
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  cookieStore.delete('user-role')
  return NextResponse.json({ success: true })
}
