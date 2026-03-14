import { NextResponse } from 'next/server'
import { loginSchema } from '@/features/auth/auth.validator'
import { authService } from '@/features/auth/auth.service'
import { badRequest, ok, unauthorized } from '@/core/http/response'

export async function POST(req: Request) {
  const body = await req.json()

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return badRequest('Validation error', parsed.error.flatten())
  }

  const result = await authService.login(parsed.data)

  if (!result) {
    return unauthorized('Email atau password salah')
  }

  return ok(result, 'Login berhasil')
}