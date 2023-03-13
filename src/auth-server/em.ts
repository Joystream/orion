import { EntityManager } from 'typeorm'
import { createEm } from '../server-extension/orm'

export const getEm: Promise<EntityManager> = createEm()
