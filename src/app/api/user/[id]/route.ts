import { NextResponse } from 'next/server'
import { userService } from '@/features/user/user.service'
import { updateUserSchema } from '@/features/user/user.validator'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params
  const data = await userService.getById(id)

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: 'user not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'user fetched successfully',
    data,
  })
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const payload = updateUserSchema.parse(body)

    const data = await userService.update(id, payload)

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'user not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'user updated successfully',
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user',
      },
      { status: 400 }
    )
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params
  const deleted = await userService.delete(id)

  if (!deleted) {
    return NextResponse.json(
      {
        success: false,
        message: 'user not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'user deleted successfully',
  })
}
