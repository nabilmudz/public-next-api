export type ProgramCategory = 'PENELITIAN' | 'PENGABDIAN'
export type FocusType = 'TEMATIK' | 'RIRN'
export type ScopeLevel = 'LOKAL' | 'REGIONAL' | 'NASIONAL' | 'INTERNASIONAL'
export type ProposalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'

export type ProposalInputMode = 'EDITOR' | 'UPLOAD'

export type ProposalServiceMember = {
  nidn: string
  name: string
  duty: string
  status: string
}

export type ProposalStudentMember = {
  memberType: string
  identityNumber: string
  name: string
  duty: string
}

export type ProposalFile = {
  fileUrl: string
  fileName: string
  fileMimeType: string
  fileSize: number
}

export type Proposal = {
  id: string
  ownerId: string
  title: string
  category: ProgramCategory
  focusType: FocusType
  focusValue: string
  schemeGroup: string
  scopeLevel: ScopeLevel
  firstProposalYear: number
  durationMonths: number
  scientificFieldLevel1: string
  scientificFieldLevel2: string
  scientificFieldLevel3: string
  leadName: string

  inputMode: ProposalInputMode
  editorContent?: string | null

  fileUrl?: string | null
  fileName?: string | null
  fileMimeType?: string | null
  fileSize?: number | null

  serviceMembers: ProposalServiceMember[]
  studentMembers: ProposalStudentMember[]

  status: ProposalStatus
  createdAt?: string | Date
  updatedAt?: string | Date
}

type BaseProposalInput = {
  title: string
  ownerId: string
  category?: ProgramCategory | null
  focusType?: FocusType | null
  focusValue?: string | null
  schemeGroup?: string | null
  scopeLevel?: ScopeLevel | null
  firstProposalYear?: number | null
  durationMonths?: number | null
  scientificFieldLevel1?: string | null
  scientificFieldLevel2?: string | null
  scientificFieldLevel3?: string | null
  leadName?: string | null
  status?: ProposalStatus
  serviceMembers?: ProposalServiceMember[]
  studentMembers?: ProposalStudentMember[]
}

export type CreateProposalEditorInput = BaseProposalInput & {
  inputMode: 'EDITOR'
  editorContent: string
  fileUrl?: never
  fileName?: never
  fileMimeType?: never
  fileSize?: never
}

export type CreateProposalUploadInput = BaseProposalInput & {
  inputMode: 'UPLOAD'
  editorContent?: never
  fileUrl: string
  fileName: string
  fileMimeType: string
  fileSize: number
}

export type CreateProposalInput =
  | CreateProposalEditorInput
  | CreateProposalUploadInput

export type UpdateProposalInput = Partial<BaseProposalInput> & {
  inputMode?: ProposalInputMode
  editorContent?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileMimeType?: string | null
  fileSize?: number | null
}