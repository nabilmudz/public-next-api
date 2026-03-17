import { proposalRepository } from './proposal.repository'
import type {
  CreateProposalInput,
  UpdateProposalInput,
} from './proposal.type'

export const proposalService = {
  async getAll() {
    return await proposalRepository.findAll()
  },

  async getById(id: string) {
    return await proposalRepository.findById(id)
  },

  async create(payload: CreateProposalInput) {
    if (payload.inputMode === 'UPLOAD' && payload.fileMimeType !== 'application/pdf') {
      throw new Error('File proposal harus PDF')
    }

    return await proposalRepository.create(payload)
  },

  async update(id: string, payload: UpdateProposalInput) {
    if (
      payload.inputMode === 'UPLOAD' &&
      payload.fileMimeType &&
      payload.fileMimeType !== 'application/pdf'
    ) {
      throw new Error('File proposal harus PDF')
    }

    return await proposalRepository.update(id, payload)
  },

  async delete(id: string) {
    return await proposalRepository.delete(id)
  },
}