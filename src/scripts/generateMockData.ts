import { EntityManager } from 'typeorm'
import _ from 'lodash'
import path from 'path'
import assert from 'node:assert'
import fs from 'fs/promises'
import { loadModel, resolveGraphqlSchema } from '@subsquid/openreader/lib/tools'
import {
  Enum,
  EnumPropType,
  JsonObject,
  ObjectPropType,
  Prop,
  ScalarPropType,
  Union,
  UnionPropType,
} from '@subsquid/openreader/lib/model'
import * as model from '../model'
import { globalEm } from '../utils/globalEm'

const subsquidModel = loadModel(resolveGraphqlSchema(path.join(__dirname, '../..')))

type AnyEntity = { id: string }

type AnyEntityName = {
  [K in keyof typeof model]: (typeof model)[K] extends { new (): infer T }
    ? T extends AnyEntity
      ? K
      : never
    : never
}[keyof typeof model]

const existingRefs = new Map<AnyEntityName, AnyEntity>()
const entitiesQueue: Array<AnyEntity> = []
const alwaysTrueFields = new Set(['VideoCategory.isSupported'])

// Fields that need to be populated in order for the entities to be visible in the public schema
const alwaysPopulateFields = new Set([
  'Video.category',
  'Video.channel',
  'Video.license',
  'VideoMediaMetadata.video',
  'VideoMediaMetadata.encoding',
  'Comment.video',
  'CommentReaction.comment',
  'Bid.nft',
  'Auction.nft',
  'BannedMember.channel',
  'VideoReaction.video',
  'VideoSubtitle.video',
  'VideoHero.video',
  'VideoFeaturedInCategory.video',
  'VideoFeaturedInCategory.category',
  'NftActivity.event',
  'NftHistoryEntry.event',
  'Event.data.*',
])

function shouldPopulate(propPath: string) {
  const parts = propPath.split('.')
  for (let i = parts.length - 1; i >= 0; --i) {
    if (alwaysPopulateFields.has(`${[...parts.slice(0, i), '*'].join('.')}`)) {
      return true
    }
  }

  return alwaysPopulateFields.has(propPath)
}

function mockScalar(type: ScalarPropType, fieldName: string) {
  switch (type.name) {
    case 'Boolean':
      return alwaysTrueFields.has(fieldName)
    case 'DateTime':
      return new Date()
    case 'BigInt':
    case 'BigDecimal':
    case 'Float':
    case 'Int':
      return 1
    case 'String':
      return 'string'
    case 'ID':
      return '1'
    default:
      throw new Error(`Don't know how to mock type: ${type.name}`)
  }
}

function mockEnum(type: EnumPropType) {
  const enumType = subsquidModel[type.name] as Enum
  const value = Object.keys(enumType.values)[0]
  return value
}

function mockObjectFromDef(objectDef: JsonObject, typeName: string, propPath: string) {
  const ObjectConstructor = model[typeName as keyof typeof model]
  assert(ObjectConstructor, `Object constructor for object ${typeName} not found`)
  const value = new (ObjectConstructor as { new (): any })()
  for (const [propName, propDef] of Object.entries(objectDef.properties)) {
    value[propName] = mockProp(propDef, `${propPath}.${propName}`, true)
  }
  return value
}

function mockObject(type: ObjectPropType, propPath: string) {
  const objectDef = subsquidModel[type.name] as JsonObject
  return mockObjectFromDef(objectDef, type.name, propPath)
}

function mockUnion(type: UnionPropType, propPath: string) {
  const unionDef = subsquidModel[type.name] as Union
  const mockedVariant = unionDef.variants[0]
  const variantDef = subsquidModel[mockedVariant] as JsonObject
  return mockObjectFromDef(variantDef, mockedVariant, propPath)
}

function mockProp(prop: Prop, propPath: string, isInsideJson = false): any {
  if (prop.nullable && !shouldPopulate(propPath)) {
    return null
  }
  const { type } = prop
  switch (type.kind) {
    case 'enum':
      return mockEnum(type)
    case 'list':
      return [mockProp(type.item, propPath, isInsideJson)]
    case 'scalar':
      return mockScalar(type, propPath)
    case 'fk': {
      const entity = mockEntity(type.entity as AnyEntityName, true)
      return isInsideJson ? entity.id : entity
    }
    case 'object':
      return mockObject(type, propPath)
    case 'union':
      return mockUnion(type, propPath)
    default:
      return undefined
  }
}

function mockEntity(entityName: AnyEntityName, returnRef = false): AnyEntity {
  const existingRef = existingRefs.get(entityName)
  if (existingRef) {
    return existingRef
  }
  const Entity = model[entityName]
  // For now we're assuming all entities to have an id of `1`
  existingRefs.set(entityName, new Entity({ id: '1' }))
  const entityDef = subsquidModel[entityName]
  assert(entityDef && entityDef.kind === 'entity', `"${entityName}" is not an entity`)
  const entityInstance = new Entity()
  for (const [propName, propDef] of Object.entries(entityDef.properties)) {
    ;(entityInstance as any)[propName] = mockProp(propDef, `${entityName}.${propName}`)
  }

  entitiesQueue.push(entityInstance)
  return returnRef ? new Entity({ id: entityInstance.id }) : entityInstance
}

const excludedEntities = new Set(['NextEntityId', 'OrionOffchainCursor'])

export async function generateMockData(em: EntityManager) {
  const outputPath = process.argv[2]
  if (!outputPath || !outputPath.endsWith('.json')) {
    throw new Error('Provide output path (.json) as first argument!')
  }
  //   Get a list of all entities from the metadata
  const entitiesToMock = em.connection.entityMetadatas
    .map((m) => m.name as AnyEntityName)
    .filter((e) => !excludedEntities.has(e))
  for (const entityName of entitiesToMock) {
    mockEntity(entityName)
  }

  const mockedRecords: [string, Record<string, unknown>][] = entitiesQueue.map((e) => [
    e.constructor.name,
    e,
  ])
  await fs.writeFile(outputPath, JSON.stringify(mockedRecords, null, 2))
  console.log(`Saved mock data in ${outputPath}`)
}

async function main() {
  const em = await globalEm
  await generateMockData(em)
}

main()
  .then(() => process.exit(0))
  .catch((e) => console.error(e))
