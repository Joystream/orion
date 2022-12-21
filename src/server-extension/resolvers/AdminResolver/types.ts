import { ArgsType, Field, Int, ObjectType } from 'type-graphql'

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
