import { NextResponse } from 'next/server'
import { userService } from '@/features/user/user.service'
import { createUserSchema } from '@/features/user/user.validator'

export async function GET() {
  const data = await userService.getAll()

  return NextResponse.json({
    success: true,
    message: 'user list fetched successfully',
    data,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = createUserSchema.parse(body)
    const userPayload = {
      ...payload,
      password: payload.password ?? "12345678",
    }

    const data = await userService.create(userPayload)

    return NextResponse.json(
      {
        success: true,
        message: 'user created successfully',
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user',
      },
      { status: 400 }
    )
  }
}
