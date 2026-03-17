import { NextResponse } from 'next/server'
import { proposalService } from '@/features/proposal/proposal.service'

type RouteContext = {
  params: Promise<{
    userId: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { userId } = await context.params

    const data = await proposalService.getByUserId(userId)

    return NextResponse.json({
      success: true,
      message: 'proposals fetched successfully',
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch proposals by user id',
      },
      { status: 400 }
    )
  }
}