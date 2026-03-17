import { NextResponse } from 'next/server'
import { proposalService } from '@/features/proposal/proposal.service'
import { createProposalSchema, updateProposalSchema } from '@/features/proposal/proposal.validator'

export async function GET() {
  const data = await proposalService.getAll()

  return NextResponse.json({
    success: true,
    message: 'proposal list fetched successfully',
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

export async function POST(request: Request) {
  try {
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
        firstProposalYear: Number(formData.get('firstProposalYear')),
        durationMonths: Number(formData.get('durationMonths')),
        scientificFieldLevel1: formData.get('scientificFieldLevel1')?.toString(),
        scientificFieldLevel2: formData.get('scientificFieldLevel2')?.toString(),
        scientificFieldLevel3: formData.get('scientificFieldLevel3')?.toString(),
        leadName: formData.get('leadName')?.toString(),
        inputMode: formData.get('inputMode')?.toString(),
        status: formData.get('status')?.toString() ?? 'DRAFT',
        serviceMembers: parseJsonArray(formData.get('serviceMembers')),
        studentMembers: parseJsonArray(formData.get('studentMembers')),
      }

      if (proposalFile) {
        payload.fileName = proposalFile.name
        payload.fileMimeType = proposalFile.type
        payload.fileSize = proposalFile.size

        // nanti ganti dengan upload ke storage
        payload.fileUrl = `/uploads/${proposalFile.name}`
      }
    } else {
      const body = await request.json()
      payload = body
    }

    const validated = createProposalSchema.parse(payload)
    const data = await proposalService.create(validated)

    return NextResponse.json(
      {
        success: true,
        message: 'proposal created successfully',
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to create proposal',
      },
      { status: 400 }
    )
  }
}