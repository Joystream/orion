import { EntityManager } from 'typeorm'
import _ from 'lodash'
import fs from 'fs/promises'
import * as model from '../model'
import { globalEm } from '../utils/globalEm'

type AnyEntity = { id: string }

type AnyEntityName = {
  [K in keyof typeof model]: (typeof model)[K] extends { new (): infer T }
    ? T extends AnyEntity
      ? K
      : never
    : never
}[keyof typeof model]

export async function seed(em: EntityManager) {
  const inputPath = process.argv[2]
  if (!inputPath && !inputPath.endsWith('.json')) {
    throw new Error('Provide input path (.json) as first argument!')
  }
  const input: [AnyEntityName, Record<string, unknown>][] = JSON.parse(
    (await fs.readFile(inputPath)).toString()
  )
  for (const [entityName, values] of input) {
    const Entity = model[entityName]
    const entityInstance = new Entity(
      _.mapValues(values, (v) => {
        if (typeof v === 'object' && v) {
          ;(v as any).toJSON = () => v
        }
        return v
      })
    )
    await em.save(entityInstance)
  }
  console.log('Done')
}

async function main() {
  const em = await globalEm
  await seed(em)
}

main()
  .then(() => process.exit(0))
  .catch((e) => console.error(e))
