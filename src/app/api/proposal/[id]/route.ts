import { NextResponse } from 'next/server'
import { proposalService } from '@/features/proposal/proposal.service'
import { updateProposalSchema } from '@/features/proposal/proposal.validator'
import { deleteProposalFile, saveProposalFile } from '@/utils/proposal-upload'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params
  const data = await proposalService.getById(id)

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: 'proposal not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'proposal fetched successfully',
    data,
  })
}

const parseJsonArray = <T = unknown>(value: FormDataEntryValue | null): T[] => {
  if (typeof value !== 'string') return []

  const clean = value.trim()
  if (!clean) return []

  const parsed = JSON.parse(clean)
  return Array.isArray(parsed) ? parsed : []
}

export async function PUT(request: Request, context: RouteContext) {
  let savedFileUrl: string | undefined
  let previousFileUrl: string | null | undefined

  try {
    const { id } = await context.params
    const contentType = request.headers.get('content-type') || ''

    let payload: any

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const proposalFile = formData.get('proposalFile') as File | null

      payload = {
        ownerId: formData.get('ownerId')?.toString(),
        title: formData.get('title')?.toString(),
        category: formData.get('category')?.toString(),
        focusType: formData.get('focusType')?.toString(),
        focusValue: formData.get('focusValue')?.toString(),
        schemeGroup: formData.get('schemeGroup')?.toString(),
        scopeLevel: formData.get('scopeLevel')?.toString(),
        firstProposalYear: formData.get('firstProposalYear')
          ? Number(formData.get('firstProposalYear'))
          : undefined,
        durationMonths: formData.get('durationMonths')
          ? Number(formData.get('durationMonths'))
          : undefined,
        scientificFieldLevel1: formData.get('scientificFieldLevel1')?.toString(),
        scientificFieldLevel2: formData.get('scientificFieldLevel2')?.toString(),
        scientificFieldLevel3: formData.get('scientificFieldLevel3')?.toString(),
        leadName: formData.get('leadName')?.toString(),
        inputMode: formData.get('inputMode')?.toString(),
        status: formData.get('status')?.toString(),
        serviceMembers: formData.get('serviceMembers')
          ? parseJsonArray(formData.get('serviceMembers'))
          : undefined,
        studentMembers: formData.get('studentMembers')
          ? parseJsonArray(formData.get('studentMembers'))
          : undefined,
      }

      if (proposalFile && proposalFile.size > 0) {
        const existing = await proposalService.getById(id)
        const uploadedFile = await saveProposalFile(proposalFile)
        savedFileUrl = uploadedFile.fileUrl
        previousFileUrl = existing?.fileUrl
        Object.assign(payload, uploadedFile)
      }
    } else {
      const body = await request.json()
      payload = body
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key]
    })

    const validated = updateProposalSchema.parse(payload)
    const data = await proposalService.update(id, validated)

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'proposal not found',
        },
        { status: 404 }
      )
    }

    if (savedFileUrl && previousFileUrl && previousFileUrl !== savedFileUrl) {
      await deleteProposalFile(previousFileUrl)
    }

    return NextResponse.json({
      success: true,
      message: 'proposal updated successfully',
      data,
    })
  } catch (error) {
    if (savedFileUrl) {
      await deleteProposalFile(savedFileUrl)
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update proposal',
      },
      { status: 400 }
    )
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params
  const existing = await proposalService.getById(id)
  const deleted = await proposalService.delete(id)

  if (!deleted) {
    return NextResponse.json(
      {
        success: false,
        message: 'proposal not found',
      },
      { status: 404 }
    )
  }

  if (existing?.fileUrl) {
    await deleteProposalFile(existing.fileUrl)
  }

  return NextResponse.json({
    success: true,
    message: 'proposal deleted successfully',
  })
}
