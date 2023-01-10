import 'reflect-metadata'
import { Args, Query, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {
  KillSwitch,
  SetKillSwitchInput,
  SetSupportedCategoriesInput,
  SetSupportedCategoriesResult,
  SetVideoHeroInput,
} from './types'
import { VideoHero } from '../baseTypes'
import { config, ConfigVariable } from '../../../utils/config'
import { OperatorOnly } from '../middleware'

@Resolver()
export class AdminResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @UseMiddleware(OperatorOnly)
  @Mutation(() => KillSwitch)
  async setKillSwitch(@Args() args: SetKillSwitchInput): Promise<KillSwitch> {
    const em = await this.em()
    await config.set(ConfigVariable.KillSwitch, args.isKilled, em)
    return { isKilled: await config.get(ConfigVariable.KillSwitch, em) }
  }

  @Query(() => KillSwitch)
  async getKillSwitch(): Promise<KillSwitch> {
    const em = await this.em()
    return { isKilled: await config.get(ConfigVariable.KillSwitch, em) }
  }

  @Query(() => VideoHero, { nullable: true })
  async videoHero(): Promise<VideoHero | undefined> {
    // TODO: Implement
    return undefined
  }

  @UseMiddleware(OperatorOnly)
  @Mutation(() => VideoHero)
  async setVideoHero(@Args() args: SetVideoHeroInput): Promise<VideoHero> {
    // TODO: Implement
    return { id: '0' }
  }

  @UseMiddleware(OperatorOnly)
  @Mutation(() => SetSupportedCategoriesResult)
  async setSupportedCategories(
    @Args()
    {
      supportNewCategories,
      supportNoCategoryVideos,
      supportedCategoriesIds,
    }: SetSupportedCategoriesInput
  ): Promise<SetSupportedCategoriesResult> {
    const em = await this.em()
    let newNumberOfCategoriesSupported: number
    return em.transaction(async (em) => {
      if (supportedCategoriesIds) {
        await em.query(`UPDATE "processor"."video_category" SET "is_supported"='0'`)
        if (supportedCategoriesIds.length) {
          const result = await em.query(
            `UPDATE "processor"."video_category" SET "is_supported"='1' WHERE ID IN (${supportedCategoriesIds
              .map((id) => `'${id}'`)
              .join(', ')})`
          )
          newNumberOfCategoriesSupported = result[1]
        } else {
          newNumberOfCategoriesSupported = 0
        }
      }
      if (supportNewCategories !== undefined) {
        await config.set(ConfigVariable.SupportNewCategories, supportNewCategories, em)
      }
      if (supportNoCategoryVideos !== undefined) {
        await config.set(ConfigVariable.SupportNoCategoryVideo, supportNoCategoryVideos, em)
      }
      return {
        newNumberOfCategoriesSupported,
        newlyCreatedCategoriesSupported: await config.get(ConfigVariable.SupportNewCategories, em),
        noCategoryVideosSupported: await config.get(ConfigVariable.SupportNoCategoryVideo, em),
      }
    })
  }
}
