export type UserRole = 'ADMIN' | 'PROPOSAL_SUBMITTER' | 'PROPOSAL_REVIEWER'

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string | Date
  updatedAt: string | Date
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: UserRole
}

export type UpdateUserInput = Partial<CreateUserInput>