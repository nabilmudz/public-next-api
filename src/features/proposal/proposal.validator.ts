import { z } from 'zod'

export const proposalServiceMemberSchema = z.object({
  nidn: z.string(),
  name: z.string(),
  duty: z.string(),
  status: z.string(),
})

export const proposalStudentMemberSchema = z.object({
  memberType: z.string(),
  identityNumber: z.string(),
  name: z.string(),
  duty: z.string(),
})

const proposalBaseSchema = z.object({
  title: z.string(),
  ownerId: z.string().uuid(),
  category: z.enum(['PENELITIAN', 'PENGABDIAN']),
  focusType: z.enum(['TEMATIK', 'RIRN']),
  focusValue: z.string(),
  schemeGroup: z.string(),
  scopeLevel: z.enum(['LOKAL', 'REGIONAL', 'NASIONAL', 'INTERNASIONAL']),
  firstProposalYear: z.number(),
  durationMonths: z.number(),
  scientificFieldLevel1: z.string(),
  scientificFieldLevel2: z.string(),
  scientificFieldLevel3: z.string(),
  leadName: z.string(),
  serviceMembers: z.array(proposalServiceMemberSchema).default([]),
  studentMembers: z.array(proposalStudentMemberSchema).default([]),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).optional(),
})

const editorProposalSchema = proposalBaseSchema.extend({
  inputMode: z.literal('EDITOR'),
  editorContent: z.string().min(1),
})

const uploadProposalSchema = proposalBaseSchema.extend({
  inputMode: z.literal('UPLOAD'),
  fileUrl: z.string().min(1),
  fileName: z.string().min(1),
  fileMimeType: z.string().min(1),
  fileSize: z.number().positive(),
})

export const createProposalSchema = z.discriminatedUnion('inputMode', [
  editorProposalSchema,
  uploadProposalSchema,
])

export const updateProposalSchema = z
  .object({
    title: z.string().optional(),
    category: z.enum(['PENELITIAN', 'PENGABDIAN']).optional(),
    focusType: z.enum(['TEMATIK', 'RIRN']).optional(),
    focusValue: z.string().optional(),
    schemeGroup: z.string().optional(),
    scopeLevel: z
      .enum(['LOKAL', 'REGIONAL', 'NASIONAL', 'INTERNASIONAL'])
      .optional(),
    firstProposalYear: z.number().optional(),
    durationMonths: z.number().optional(),
    scientificFieldLevel1: z.string().optional(),
    scientificFieldLevel2: z.string().optional(),
    scientificFieldLevel3: z.string().optional(),
    leadName: z.string().optional(),
    status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).optional(),

    inputMode: z.enum(['EDITOR', 'UPLOAD']).optional(),
    editorContent: z.string().nullable().optional(),

    fileUrl: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    fileMimeType: z.string().nullable().optional(),
    fileSize: z.number().nullable().optional(),

    serviceMembers: z.array(proposalServiceMemberSchema).optional(),
    studentMembers: z.array(proposalStudentMemberSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.inputMode === 'EDITOR') {
      if (!data.editorContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['editorContent'],
          message: 'editorContent wajib saat inputMode = EDITOR',
        })
      }
    }

    if (data.inputMode === 'UPLOAD') {
      if (!data.fileUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fileUrl'],
          message: 'fileUrl wajib saat inputMode = UPLOAD',
        })
      }
    }
  })

export type CreateProposalPayload = z.infer<typeof createProposalSchema>
export type UpdateProposalPayload = z.infer<typeof updateProposalSchema>