import { prisma } from '@/core/db/prisma'
import type {
  CreateProposalInput,
  UpdateProposalInput,
} from './proposal.type'

export const proposalRepository = {
  async findAll() {
    return await prisma.proposal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        serviceMembers: true,
        studentMembers: true,
      },
    })
  },

  async findById(id: string) {
    return await prisma.proposal.findUnique({
      where: { id },
      include: {
        serviceMembers: true,
        studentMembers: true,
      },
    })
  },

  async create(payload: CreateProposalInput) {
    return await prisma.proposal.create({
      data: {
        title: payload.title,
        category: payload.category!,
        focusType: payload.focusType!,
        focusValue: payload.focusValue!,
        schemeGroup: payload.schemeGroup!,
        scopeLevel: payload.scopeLevel!,
        firstProposalYear: payload.firstProposalYear!,
        durationMonths: payload.durationMonths!,
        scientificFieldLevel1: payload.scientificFieldLevel1!,
        scientificFieldLevel2: payload.scientificFieldLevel2!,
        scientificFieldLevel3: payload.scientificFieldLevel3!,
        leadName: payload.leadName!,
        status: payload.status ?? 'DRAFT',
        inputMode: payload.inputMode,
        editorContent:
          payload.inputMode === 'EDITOR' ? payload.editorContent : null,
        fileUrl: payload.inputMode === 'UPLOAD' ? payload.fileUrl : null,
        fileName: payload.inputMode === 'UPLOAD' ? payload.fileName : null,
        fileMimeType:
          payload.inputMode === 'UPLOAD' ? payload.fileMimeType : null,
        fileSize: payload.inputMode === 'UPLOAD' ? payload.fileSize : null,
        serviceMembers: payload.serviceMembers?.length
          ? {
              create: payload.serviceMembers.map((item) => ({
                nidn: item.nidn,
                name: item.name,
                duty: item.duty,
                status: item.status,
              })),
            }
          : undefined,
        studentMembers: payload.studentMembers?.length
          ? {
              create: payload.studentMembers.map((item) => ({
                memberType: item.memberType,
                identityNumber: item.identityNumber,
                name: item.name,
                duty: item.duty,
              })),
            }
          : undefined,
      },
      include: {
        serviceMembers: true,
        studentMembers: true,
      },
    })
  },  async update(id: string, payload: UpdateProposalInput) {
    const existing = await prisma.proposal.findUnique({
      where: { id },
    })
    if (!existing) return null
    const nextInputMode = payload.inputMode ?? existing.inputMode
    return await prisma.proposal.update({
      where: { id },
      data: {
        title: payload.title ?? undefined,
        category: payload.category ?? undefined,
        focusType: payload.focusType ?? undefined,
        focusValue: payload.focusValue ?? undefined,
        schemeGroup: payload.schemeGroup ?? undefined,
        scopeLevel: payload.scopeLevel ?? undefined,
        firstProposalYear: payload.firstProposalYear ?? undefined,
        durationMonths: payload.durationMonths ?? undefined,
        scientificFieldLevel1: payload.scientificFieldLevel1 ?? undefined,
        scientificFieldLevel2: payload.scientificFieldLevel2 ?? undefined,
        scientificFieldLevel3: payload.scientificFieldLevel3 ?? undefined,
        leadName: payload.leadName ?? undefined,
        status: payload.status ?? undefined,
        inputMode: payload.inputMode ?? undefined,
        editorContent:
          nextInputMode === 'EDITOR'
            ? (payload.editorContent ?? existing.editorContent)
            : null,
        fileUrl:
          nextInputMode === 'UPLOAD'
            ? (payload.fileUrl ?? existing.fileUrl)
            : null,
        fileName:
          nextInputMode === 'UPLOAD'
            ? (payload.fileName ?? existing.fileName)
            : null,
        fileMimeType:
          nextInputMode === 'UPLOAD'
            ? (payload.fileMimeType ?? existing.fileMimeType)
            : null,
        fileSize:
          nextInputMode === 'UPLOAD'
            ? (payload.fileSize ?? existing.fileSize)
            : null,
        ...(payload.serviceMembers
          ? {
              serviceMembers: {
                deleteMany: {},
                create: payload.serviceMembers.map((item) => ({
                  nidn: item.nidn,
                  name: item.name,
                  duty: item.duty,
                  status: item.status,
                })),
              },
            }
          : {}),
        ...(payload.studentMembers
          ? {
              studentMembers: {
                deleteMany: {},
                create: payload.studentMembers.map((item) => ({
                  memberType: item.memberType,
                  identityNumber: item.identityNumber,
                  name: item.name,
                  duty: item.duty,
                })),
              },
            }
          : {}),
      },
      include: {
        serviceMembers: true,
        studentMembers: true,
      },
    })
  },

  async delete(id: string) {
    const existing = await prisma.proposal.findUnique({
      where: { id },
    })

    if (!existing) return false

    await prisma.proposal.delete({
      where: { id },
    })

    return true
  },
}