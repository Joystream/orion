import { loadModel, resolveGraphqlSchema } from '@subsquid/openreader/lib/tools'
import { resolve } from 'path'

const rootDir = resolve(__dirname, '../../..')
const schemaFile = resolveGraphqlSchema(rootDir)
export const model = loadModel(schemaFile)
