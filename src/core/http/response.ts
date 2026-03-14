import { NextResponse } from 'next/server'

export function ok(data: unknown, message = 'OK', status = 200) {
  return NextResponse.json(
    { success: true, message, data },
    { status }
  )
}

export function badRequest(message = 'Bad Request', errors?: unknown) {
  return NextResponse.json(
    { success: false, message, errors },
    { status: 400 }
  )
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  )
}