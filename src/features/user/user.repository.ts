import { prisma } from '@/core/db/prisma'
import type {
  CreateUserInput,
  UpdateUserInput,
} from './user.type'

export const userRepository = {
  async findAll() {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    })
  },

  async findByUser(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    })
  },

  async create(payload: CreateUserInput) {
    return await prisma.user.create({
      data: payload,
    })
  },

  async update(id: string, payload: UpdateUserInput) {
    const existing = await prisma.user.findUnique({
      where: { id },
    })

    if (!existing) return null

    return await prisma.user.update({
      where: { id },
      data: payload,
    })
  },

  async delete(id: string) {
    const existing = await prisma.user.findUnique({
      where: { id },
    })

    if (!existing) return false

    await prisma.user.delete({
      where: { id },
    })

    return true
  },
}
