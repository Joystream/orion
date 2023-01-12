import 'reflect-metadata'
import { Args, Query, Mutation, Resolver, UseMiddleware, Info, Ctx } from 'type-graphql'
import { EntityManager, In, Not } from 'typeorm'
import {
  KillSwitch,
  SetCategoryFeaturedVideosArgs,
  SetCategoryFeaturedVideosResult,
  SetKillSwitchInput,
  SetSupportedCategoriesInput,
  SetSupportedCategoriesResult,
  SetVideoHeroInput,
  SetVideoHeroResult,
} from './types'
import { config, ConfigVariable } from '../../../utils/config'
import { OperatorOnly } from '../middleware'
import {
  Video,
  VideoCategory,
  VideoFeaturedInCategory,
  VideoHero as VideoHeroEntity,
} from '../../../model'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { parseObjectTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { EntityByIdQuery } from '@subsquid/openreader/lib/sql/query'
import { getObjectSize } from '@subsquid/openreader/lib/limit.size'
import { VideoHero } from '../baseTypes'
import { model } from '../model'

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
  async videoHero(
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<VideoHero | undefined> {
    const tree = getResolveTree(info)
    const fields = parseObjectTree(model, 'VideoHero', info.schema, tree)

    ctx.openreader.responseSizeLimit?.check(() => getObjectSize(model, fields) + 1)

    const em = await this.em()
    const { id: currentHeroId } =
      (
        await em.getRepository(VideoHeroEntity).find({
          select: { id: true },
          order: { activatedAt: 'DESC' },
          take: 1,
        })
      )[0] || {}

    if (currentHeroId === undefined) {
      return undefined
    }

    const entityByIdQuery = new EntityByIdQuery(
      model,
      ctx.openreader.dialect,
      'VideoHero',
      fields,
      currentHeroId
    )

    return ctx.openreader.executeQuery(entityByIdQuery)
  }

  @UseMiddleware(OperatorOnly)
  @Mutation(() => SetVideoHeroResult)
  async setVideoHero(@Args() args: SetVideoHeroInput): Promise<SetVideoHeroResult> {
    const em = await this.em()
    const [currentHero] = await em.getRepository(VideoHeroEntity).find({
      order: { activatedAt: 'DESC' },
      take: 1,
    })
    // Create sequential id
    const id = (parseInt(currentHero?.id || '0', 36) + 1).toString(36)
    const videoHero = new VideoHeroEntity({
      id,
      activatedAt: new Date(),
      heroPosterUrl: args.heroPosterUrl,
      heroTitle: args.heroTitle,
      heroVideoCutUrl: args.videoCutUrl,
      video: new Video({ id: args.videoId }),
    })
    await em.save(videoHero)

    return { id }
  }

  @UseMiddleware(OperatorOnly)
  @Mutation(() => SetCategoryFeaturedVideosResult)
  async setCategoryFeaturedVideos(
    @Args() args: SetCategoryFeaturedVideosArgs
  ): Promise<SetCategoryFeaturedVideosResult> {
    const em = await this.em()
    const { categoryId } = args

    const deleteResult = await em.getRepository(VideoFeaturedInCategory).delete({
      category: {
        id: categoryId,
      },
      video: {
        id: Not(In(args.videos.map((v) => v.videoId))),
      },
    })
    const numberOfFeaturedVideosUnset = deleteResult.affected || 0

    const newRows = args.videos.map(
      ({ videoId, videoCutUrl }) =>
        new VideoFeaturedInCategory({
          id: `${videoId}-${categoryId}`,
          category: new VideoCategory({ id: categoryId }),
          video: new Video({ id: videoId }),
          videoCutUrl,
        })
    )
    await em.save(newRows)

    return {
      categoryId,
      numberOfFeaturedVideosSet: newRows.length,
      numberOfFeaturedVideosUnset,
    }
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
    let newNumberOfCategoriesSupported = 0
    if (supportedCategoriesIds) {
      await em.query(`UPDATE "processor"."video_category" SET "is_supported"='0'`)
      if (supportedCategoriesIds.length) {
        const result = await em.query(
          `UPDATE "processor"."video_category" SET "is_supported"='1' WHERE ID IN (${supportedCategoriesIds
            .map((id) => `'${id}'`)
            .join(', ')})`
        )
        newNumberOfCategoriesSupported = result[1]
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
  }
}
