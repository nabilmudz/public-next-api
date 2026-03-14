import type { LoginInput } from './auth.validator'
import type { LoginResponse } from './auth.type'
import { authRepository } from './auth.repository'
import { verifyPassword } from '@/utils/password'
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt"

export const authService = {
  async login(payload: LoginInput): Promise<LoginResponse | null> {
    const user = await authRepository.findByEmail(payload.email)
    if (!user) return null

    const isValid = await verifyPassword(payload.password, user.password)
    if (!isValid) return null

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken(jwtPayload)

    await authRepository.updateTokens(user.id, {
      accessToken,
      refreshToken
    })
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    }
  },
}