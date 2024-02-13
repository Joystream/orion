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
  @Field(() => String, { nullable: false })
  dividendJoyAmount!: string
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

@ArgsType()
export class GetAccountTransferrableBalanceArgs {
  @Field(() => String, { nullable: false })
  tokenId!: string

  @Field(() => String, { nullable: false })
  memberId!: string

  @Field(() => Int, { nullable: false })
  currentBlockHeight!: number
}

@ObjectType()
export class GetAccountTransferrableBalanceResult {
  @Field(() => Int, { nullable: false })
  transferrableCrtAmount!: number
}
