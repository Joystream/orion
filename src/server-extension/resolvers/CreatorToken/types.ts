import { ArgsType, Field, Int, ObjectType } from 'type-graphql'

@ArgsType()
export class GetShareDividensArgs {
  @Field(() => String, { nullable: false })
  tokenId!: string

  @Field(() => Int, { nullable: false })
  stakingAmount!: number
}

@ObjectType()
export class GetShareDividendsResult {
  @Field(() => Number, { nullable: false })
  dividendJoyAmount!: number
}

@ArgsType()
export class GetCumulativeHistoricalShareAllocationArgs {
  @Field(() => String, { nullable: false })
  tokenId!: string
}

@ObjectType()
export class GetCumulativeHistoricalShareAllocationResult {
  @Field(() => Int, { nullable: false })
  cumulativeHistoricalAllocation!: number
}
