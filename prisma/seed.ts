import bcrypt from 'bcrypt'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const password = 'password123'
  const passwordHash = await bcrypt.hash(password, 10)

  const users = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      password: passwordHash,
    },
    {
      name: 'Pengaju Proposal',
      email: 'pengaju@example.com',
      role: UserRole.PROPOSAL_SUBMITTER,
      password: passwordHash,
    },
    {
      name: 'Pengecek Proposal',
      email: 'pengecek@example.com',
      role: UserRole.PROPOSAL_REVIEWER,
      password: passwordHash,
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        password: user.password,
      },
      create: user,
    })
  }

  console.log('Seed selesai: 3 akun berhasil dibuat / diupdate')
}

main()
  .catch((e) => {
    console.error('Seed gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })