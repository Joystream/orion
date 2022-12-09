import 'reflect-metadata'
import { Args, Query, Mutation, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { KillSwitch, SetKillSwitchInput, SetVideoHeroInput } from './types'
import { VideoHero } from '../baseTypes'

@Resolver()
export class AdminResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Mutation(() => KillSwitch)
  async setKillSwitch(@Args() args: SetKillSwitchInput): Promise<KillSwitch> {
    // TODO: Implement
    return { isKilled: false }
  }

  @Query(() => KillSwitch)
  async getKillSwitch(): Promise<KillSwitch> {
    // TODO: Implement
    return { isKilled: false }
  }

  @Query(() => VideoHero, { nullable: true })
  async videoHero(): Promise<VideoHero | undefined> {
    // TODO: Implement
    return undefined
  }

  @Mutation(() => VideoHero)
  async setVideoHero(@Args() args: SetVideoHeroInput): Promise<VideoHero> {
    // TODO: Implement
    return { id: '0' }
  }
}
