import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicPaths = ['/signIn', '/signUp']

  // If token is missing and trying to access a protected route → redirect to /signin
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  // If token exists and trying to access /signin or /signup → redirect to /
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api|static|favicon.ico).*)', // Run on all pages except static files, API, etc.
  ],
}
