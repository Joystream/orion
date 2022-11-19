import 'reflect-metadata'
import { Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { ExtendedVideoCategory } from './types'

@Resolver()
export class VideoCategoriesResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ExtendedVideoCategory])
  async extendedVideoCategories(): Promise<ExtendedVideoCategory[]> {
    // TODO: Implement
    return []
  }
}
