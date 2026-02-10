import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Routes for non-authenticated users (auth folder routes)
  const authRoutes = ["/auth/login", "/auth/register"]
  
  // Routes for authenticated users (main folder routes)
  const protectedRoutes = ["/dashboard", "/account"]

  // Check if accessing auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Allow non-authenticated users to access auth routes
    return NextResponse.next()
  }

  // Check if accessing protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // User is not authenticated, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    // Allow authenticated users to access protected routes
    return NextResponse.next()
  }

  // Allow access to root and other public routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
