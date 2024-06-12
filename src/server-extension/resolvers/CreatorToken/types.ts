import { ArgsType, Field, Float, Int, ObjectType } from 'type-graphql'
import { GraphQLScalarType } from 'graphql'

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
  @Field(() => String, { nullable: false })
  cumulativeHistoricalAllocation!: string
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

@ObjectType()
export class CreatorToken {
  @Field(() => String, { nullable: false }) id!: string
}

@ObjectType()
export class MarketplaceTokensReturnType {
  @Field(() => CreatorToken, { nullable: false }) creatorToken!: CreatorToken
  @Field(() => Float, { nullable: false }) pricePercentageChange!: number
}

@ObjectType()
export class TopSellingTokensReturnType {
  @Field(() => CreatorToken, { nullable: false }) creatorToken!: CreatorToken
  @Field(() => String, { nullable: false }) ammVolume!: string
}

export const TokenWhereInput = new GraphQLScalarType({
  name: 'CreatorTokenWhereInput',
})

@ArgsType()
export class MarketplaceTokensArgs {
  @Field(() => TokenWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => Int, {
    nullable: false,
    description: 'The number of days in period',
  })
  periodDays: number
}

@ArgsType()
export class TopSellingTokensArgs {
  @Field(() => TokenWhereInput, { nullable: true })
  where?: Record<string, unknown>
}
