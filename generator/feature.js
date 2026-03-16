const fs = require('fs')
const path = require('path')

const rawName = process.argv[2]

if (!rawName) {
  console.error('❌ Please provide feature name.')
  console.error('Example: npm run gen:feature new_feature')
  process.exit(1)
}

const featureName = toSnakeCase(rawName)
const featurePascal = toPascalCase(featureName)
const featureCamel = toCamelCase(featureName)

const rootDir = process.cwd()

const featureDir = path.join(rootDir, 'src', 'features', featureName)
const apiDir = path.join(rootDir, 'src', 'app', 'api', featureName)
const apiIdDir = path.join(apiDir, '[id]')

if (fs.existsSync(featureDir) || fs.existsSync(apiDir)) {
  console.error(`❌ Feature "${featureName}" already exists.`)
  process.exit(1)
}

ensureDir(featureDir)
ensureDir(apiDir)
ensureDir(apiIdDir)

const files = [
  {
    path: path.join(featureDir, `${featureName}.type.ts`),
    content: generateTypeFile(featurePascal),
  },
  {
    path: path.join(featureDir, `${featureName}.validator.ts`),
    content: generateValidatorFile(featurePascal, featureName),
  },
  {
    path: path.join(featureDir, `${featureName}.repository.ts`),
    content: generateRepositoryFile(featurePascal, featureCamel, featureName),
  },
  {
    path: path.join(featureDir, `${featureName}.service.ts`),
    content: generateServiceFile(featurePascal, featureCamel, featureName),
  },
  {
    path: path.join(apiDir, `route.ts`),
    content: generateApiRouteFile(featurePascal, featureCamel, featureName),
  },
  {
    path: path.join(apiIdDir, `route.ts`),
    content: generateApiIdRouteFile(featurePascal, featureCamel, featureName),
  },
]

for (const file of files) {
  fs.writeFileSync(file.path, file.content, 'utf8')
}

console.log(`✅ Feature "${featureName}" generated successfully`)

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function toSnakeCase(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
}

function toPascalCase(value) {
  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toCamelCase(value) {
  const pascal = toPascalCase(value)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function generateTypeFile(featurePascal) {
  return `export type ${featurePascal} = {
  id: string
  name: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export type Create${featurePascal}Input = {
  name: string
}

export type Update${featurePascal}Input = Partial<Create${featurePascal}Input>
`
}

function generateValidatorFile(featurePascal, featureName) {
  return `import { z } from 'zod'

export const create${featurePascal}Schema = z.object({
  name: z.string().min(1, '${featureName}.name is required'),
})

export const update${featurePascal}Schema = create${featurePascal}Schema.partial()

export type Create${featurePascal}Payload = z.infer<typeof create${featurePascal}Schema>
export type Update${featurePascal}Payload = z.infer<typeof update${featurePascal}Schema>
`
}
function generateRepositoryFile(featurePascal, featureCamel, featureName) {
  return `import { prisma } from '@/core/db/prisma'
import type {
  Create${featurePascal}Input,
  Update${featurePascal}Input,
} from './${featureName}.type'

export const ${featureCamel}Repository = {
  async findAll() {
    return await prisma.${featureCamel}.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async findById(id: string) {
    return await prisma.${featureCamel}.findUnique({
      where: { id },
    })
  },

  async create(payload: Create${featurePascal}Input) {
    return await prisma.${featureCamel}.create({
      data: payload,
    })
  },

  async update(id: string, payload: Update${featurePascal}Input) {
    const existing = await prisma.${featureCamel}.findUnique({
      where: { id },
    })

    if (!existing) return null

    return await prisma.${featureCamel}.update({
      where: { id },
      data: payload,
    })
  },

  async delete(id: string) {
    const existing = await prisma.${featureCamel}.findUnique({
      where: { id },
    })

    if (!existing) return false

    await prisma.${featureCamel}.delete({
      where: { id },
    })

    return true
  },
}
`
}

function generateServiceFile(featurePascal, featureCamel, featureName) {
  return `import { ${featureCamel}Repository } from './${featureName}.repository'
import type {
  Create${featurePascal}Input,
  Update${featurePascal}Input,
} from './${featureName}.type'

export const ${featureCamel}Service = {
  async getAll() {
    return await ${featureCamel}Repository.findAll()
  },

  async getById(id: string) {
    return await ${featureCamel}Repository.findById(id)
  },

  async create(payload: Create${featurePascal}Input) {
    return await ${featureCamel}Repository.create(payload)
  },

  async update(id: string, payload: Update${featurePascal}Input) {
    return await ${featureCamel}Repository.update(id, payload)
  },

  async delete(id: string) {
    return await ${featureCamel}Repository.delete(id)
  },
}
`
}

function generateApiRouteFile(featurePascal, featureCamel, featureName) {
  return `import { NextResponse } from 'next/server'
import { ${featureCamel}Service } from '@/features/${featureName}/${featureName}.service'
import { create${featurePascal}Schema } from '@/features/${featureName}/${featureName}.validator'

export async function GET() {
  const data = await ${featureCamel}Service.getAll()

  return NextResponse.json({
    success: true,
    message: '${featureName} list fetched successfully',
    data,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = create${featurePascal}Schema.parse(body)

    const data = await ${featureCamel}Service.create(payload)

    return NextResponse.json(
      {
        success: true,
        message: '${featureName} created successfully',
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create ${featureName}',
      },
      { status: 400 }
    )
  }
}
`
}

function generateApiIdRouteFile(featurePascal, featureCamel, featureName) {
  return `import { NextResponse } from 'next/server'
import { ${featureCamel}Service } from '@/features/${featureName}/${featureName}.service'
import { update${featurePascal}Schema } from '@/features/${featureName}/${featureName}.validator'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params
  const data = await ${featureCamel}Service.getById(id)

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: '${featureName} not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: '${featureName} fetched successfully',
    data,
  })
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const payload = update${featurePascal}Schema.parse(body)

    const data = await ${featureCamel}Service.update(id, payload)

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: '${featureName} not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '${featureName} updated successfully',
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update ${featureName}',
      },
      { status: 400 }
    )
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params
  const deleted = await ${featureCamel}Service.delete(id)

  if (!deleted) {
    return NextResponse.json(
      {
        success: false,
        message: '${featureName} not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: '${featureName} deleted successfully',
  })
}
`
}