import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...(isAllowedOrigin ? { 'Access-Control-Allow-Origin': origin } : {}),
        ...corsHeaders,
      },
    })
  }

  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    corsHeaders['Access-Control-Allow-Methods']
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    corsHeaders['Access-Control-Allow-Headers']
  )
  response.headers.set(
    'Access-Control-Allow-Credentials',
    corsHeaders['Access-Control-Allow-Credentials']
  )

  return response
}

export const config = {
  matcher: ['/api/:path*'],
}