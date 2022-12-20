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
  @Field(() => [String], { nullable: false })
  newSupportedCategories!: string[]
}

@ObjectType()
export class SetSupportedCategoriesResult {
  @Field(() => Int, { nullable: false })
  newNumberOfCategoriesSupported!: number
}
