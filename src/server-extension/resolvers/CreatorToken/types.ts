import { ArgsType, Field, ObjectType } from 'type-graphql'

@ArgsType()
export class GetShareDividensArgs {
  @Field(() => String, { nullable: false })
  tokenId!: string

  @Field(() => Number, { nullable: false })
  stakingAmount!: number
}

@ObjectType()
export class GetShareDividendsResult {
  @Field(() => Number, { nullable: false })
  dividendJoyAmount!: number
}
