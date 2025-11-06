import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Middleware to protect main application routes by checking for an `auth-token` cookie.
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const roleCookie = request.cookies.get('user-role')?.value
  const { pathname, origin } = request.nextUrl

  // Determine protected paths (main area)
  const isProtectedPath =
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/meeting') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/lecturer') ||
    pathname.startsWith('/principal') ||
    pathname.startsWith('/settings')

  // If protected and no token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', origin)
    return NextResponse.redirect(loginUrl)
  }

  // If user hits /login with a token, redirect them to their role dashboard (priority)
  if (pathname === '/login' && token) {
    const role = (roleCookie || '').toLowerCase()
    let destPath = '/calendar'
    if (role === 'student') destPath = '/student/dashboard'
    else if (role === 'lecturer') destPath = '/lecturer/dashboard'
    else if (role === 'principal') destPath = '/principal/modules'

    if (pathname !== destPath) {
      return NextResponse.redirect(new URL(destPath, origin))
    }
  }

  return NextResponse.next()
}

// Only run middleware for main-area routes
export const config = {
  matcher: [
    '/login',
    '/calendar/:path*',
    '/meeting/:path*',
    '/student/:path*',
    '/lecturer/:path*',
    '/principal/:path*',
    '/settings/:path*'
  ]
}
