import bcrypt from "bcrypt"

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  if (!plain || !hashed) return false
  return bcrypt.compare(plain, hashed)
}

export async function hashPassword(
  plain: string
): Promise<string> {
  return bcrypt.hash(plain, 10);
}