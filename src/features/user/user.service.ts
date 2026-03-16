import { userRepository } from './user.repository'
import { hashPassword } from '@/utils/password'
import type {
  CreateUserInput,
  UpdateUserInput,
} from './user.type'

export const userService = {
  async getAll() {
    return await userRepository.findAll()
  },

  async getById(id: string) {
    return await userRepository.findById(id)
  },

  async create(payload: CreateUserInput) {
    const password = payload.password ?? "12345678"
    const hashedPassword = await hashPassword(password)

    return userRepository.create({
      ...payload,
      password: hashedPassword,
    })
  },

  async update(id: string, payload: UpdateUserInput) {
    if (payload.password) {
      payload.password = await hashPassword(payload.password)
    }

    return userRepository.update(id, payload)
  },

  async delete(id: string) {
    return await userRepository.delete(id)
  },
}
