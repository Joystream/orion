import 'reflect-metadata'
import { Args, Query, Mutation, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {
  KillSwitch,
  SetKillSwitchInput,
  SetSupportedCategoriesInput,
  SetSupportedCategoriesResult,
  SetVideoHeroInput,
} from './types'
import { VideoHero } from '../baseTypes'

@Resolver()
export class AdminResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

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

  @Mutation(() => SetSupportedCategoriesResult)
  async setSupportedCategories(
    @Args() { newSupportedCategories }: SetSupportedCategoriesInput
  ): Promise<SetSupportedCategoriesResult> {
    const em = await this.em()
    return em.transaction(async (em) => {
      await em.query(`UPDATE "processor"."video_category" SET "is_supported"='0'`)
      const result = await em.query(
        `UPDATE "processor"."video_category" SET "is_supported"='1' WHERE "id" IN (${newSupportedCategories
          .map((id) => `'${id}'`)
          .join(', ')})`
      )
      const newNumberOfCategoriesSupported = result[1]
      return { newNumberOfCategoriesSupported }
    })
  }
}
