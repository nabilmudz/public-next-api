import jwt, { type Secret, type SignOptions } from "jsonwebtoken"

type JwtPayload = {
  sub: string
  email: string
}

export function generateAccessToken(payload: JwtPayload): string {
  const secret: Secret = process.env.JWT_ACCESS_SECRET!
  
  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES as SignOptions['expiresIn']) || "15m",
  }

  return jwt.sign(payload, secret, options)
}

export function generateRefreshToken(payload: JwtPayload): string {
  const secret: Secret = process.env.JWT_REFRESH_SECRET!

  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES as SignOptions['expiresIn']) || "7d",
  }

  return jwt.sign(payload, secret, options)
}