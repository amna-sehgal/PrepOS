import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          )
          res = NextResponse.next()
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage =
    req.nextUrl.pathname.startsWith('/auth')

  // 🔐 If user NOT logged in → block dashboard
  if (isDashboard && !user) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // 🚫 If user already logged in → block login/signup pages
  if (isAuthPage && user) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mock-interview/:path*',
    '/tracker/:path*',
    '/brainstorm/:path*',
    '/roadmap/:path*',
    '/resources/:path*',
    '/auth/:path*',
  ]
}