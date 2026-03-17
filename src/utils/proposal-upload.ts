import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const PROPOSAL_UPLOAD_DIR = path.join(
  process.cwd(),
  'public',
  'uploads',
  'proposals'
)

const PROPOSAL_UPLOAD_URL_PREFIX = '/uploads/proposals'

const sanitizeFileName = (fileName: string) => {
  const extension = path.extname(fileName).toLowerCase() || '.pdf'
  const baseName = path.basename(fileName, path.extname(fileName))
  const safeBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${safeBaseName || 'proposal'}-${randomUUID()}${extension}`
}

export const saveProposalFile = async (file: File) => {
  await mkdir(PROPOSAL_UPLOAD_DIR, { recursive: true })

  const fileName = sanitizeFileName(file.name)
  const filePath = path.join(PROPOSAL_UPLOAD_DIR, fileName)
  const bytes = Buffer.from(await file.arrayBuffer())

  await writeFile(filePath, bytes)

  return {
    fileUrl: `${PROPOSAL_UPLOAD_URL_PREFIX}/${fileName}`,
    fileName: file.name,
    fileMimeType: file.type || 'application/pdf',
    fileSize: file.size,
  }
}

export const deleteProposalFile = async (fileUrl: string | null | undefined) => {
  if (!fileUrl?.startsWith(`${PROPOSAL_UPLOAD_URL_PREFIX}/`)) return

  const fileName = path.basename(fileUrl)
  const filePath = path.join(PROPOSAL_UPLOAD_DIR, fileName)

  try {
    await unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}
