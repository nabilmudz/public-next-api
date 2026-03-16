import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  role: z.enum(["ADMIN" , "PROPOSAL_SUBMITTER" , "PROPOSAL_REVIEWER"])
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserPayload = z.infer<typeof createUserSchema>
export type UpdateUserPayload = z.infer<typeof updateUserSchema>
