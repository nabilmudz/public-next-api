import { prisma } from '@/core/db/prisma'

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    })
  },
  async updateTokens(
    userId: string, 
    data: {
      accessToken: string
      refreshToken: string
    }) {
    return prisma.user.update({
      where: { id: userId },
      data
    })
  },
}
