import { ArgsType, Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

@ArgsType()
export class SetKillSwitchInput {
  @Field(() => Boolean, { nullable: false })
  isKilled!: boolean
}

@ObjectType()
export class KillSwitch {
  @Field(() => Boolean, { nullable: false })
  isKilled!: boolean
}

@ArgsType()
export class SetVideoViewPerIpTimeLimitInput {
  @Field(() => Int, { nullable: false })
  limitInSeconds!: number
}

@ObjectType()
export class VideoViewPerIpTimeLimit {
  @Field(() => Int, { nullable: false })
  limitInSeconds!: number
}

@ArgsType()
export class SetVideoHeroInput {
  @Field(() => String, { nullable: false })
  videoId!: string

  @Field(() => String, { nullable: false })
  heroTitle!: string

  @Field(() => String, { nullable: false })
  videoCutUrl!: string

  @Field(() => String, { nullable: false })
  heroPosterUrl!: string
}

@ObjectType()
export class SetVideoHeroResult {
  @Field(() => String, { nullable: false })
  id!: string
}

@ArgsType()
export class SetSupportedCategoriesInput {
  @Field(() => [String], {
    nullable: true,
    description: 'IDs of the video categories that should be supported by the Gateway',
  })
  supportedCategoriesIds?: string[]

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the newly created video categories should be supported by default',
  })
  supportNewCategories?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the Gateway should support videos that have no category assigned',
  })
  supportNoCategoryVideos?: boolean
}

@ObjectType()
export class SetSupportedCategoriesResult {
  @Field(() => Int, {
    nullable: true,
    description:
      'The updated number of categories that are now explicitly supported by the Gateway',
  })
  newNumberOfCategoriesSupported?: number

  @Field(() => Boolean, {
    nullable: false,
    description: 'Whether or not newly created video categories will be automatically supported',
  })
  newlyCreatedCategoriesSupported!: boolean

  @Field(() => Boolean, {
    nullable: false,
    description: 'Whether or not vidoes w/o any category assigned will be supported',
  })
  noCategoryVideosSupported!: boolean
}

@InputType()
class FeaturedVideoInput {
  @Field(() => String)
  videoId!: string

  @Field({ nullable: true })
  videoCutUrl?: string
}

@ArgsType()
export class SetCategoryFeaturedVideosArgs {
  @Field(() => String)
  categoryId!: string

  @Field(() => [FeaturedVideoInput])
  videos!: FeaturedVideoInput[]
}

@ObjectType()
export class SetCategoryFeaturedVideosResult {
  @Field(() => String)
  categoryId!: string

  @Field(() => Int)
  numberOfFeaturedVideosUnset!: number

  @Field(() => Int)
  numberOfFeaturedVideosSet!: number
}

export enum ExcludableContentType {
  Channel = 'channel',
  Video = 'video',
  Comment = 'comment',
}
registerEnumType(ExcludableContentType, { name: 'ExcludableContentType' })

@ArgsType()
export class ExcludeContentArgs {
  @Field(() => ExcludableContentType, {
    nullable: false,
    description: 'Type of the content to exclude/hide',
  })
  type: ExcludableContentType

  @Field(() => [String], {
    nullable: false,
    description: 'IDs of the entities to be excluded (hidden)',
  })
  ids!: string[]
}

@ObjectType()
export class ExcludeContentResult {
  @Field(() => Int)
  numberOfEntitiesAffected!: number
}

@ArgsType()
export class RestoreContentArgs {
  @Field(() => ExcludableContentType, {
    nullable: false,
    description: 'Type of the content to restore',
  })
  type: ExcludableContentType

  @Field(() => [String], {
    nullable: false,
    description: 'IDs of the entities to be restored',
  })
  ids!: string[]
}

@ObjectType()
export class RestoreContentResult {
  @Field(() => Int)
  numberOfEntitiesAffected!: number
}
