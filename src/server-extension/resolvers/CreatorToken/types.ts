import { ArgsType, Field, Float, Int, ObjectType } from 'type-graphql'
import {
  CreatorToken,
  MarketplaceTokenOrderByInput,
  MarketplaceTokenWhereInput,
  TokenWhereInput,
} from '../baseTypes'

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
export class MarketplaceTokensReturnType {
  @Field(() => CreatorToken, { nullable: false }) creatorToken!: CreatorToken
  @Field(() => Float, { nullable: false }) pricePercentageChange!: number
}

@ObjectType()
export class TopSellingTokensReturnType {
  @Field(() => CreatorToken, { nullable: false }) creatorToken!: CreatorToken
  @Field(() => String, { nullable: false }) ammVolume!: string
}

@ArgsType()
export class MarketplaceTokensArgs {
  @Field(() => TokenWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => Int, {
    nullable: false,
    description: 'The number of days in period',
  })
  periodDays: number

  @Field(() => Int, {
    nullable: true,
  })
  limit?: number

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the result should be order by price change descending',
  })
  orderByPriceDesc: boolean | null
}

@ObjectType()
export class MarketplaceTokenCount {
  @Field(() => Int, { nullable: false }) count: number
}

@ArgsType()
export class MarketplaceTokensCountArgs {
  @Field(() => MarketplaceTokenWhereInput, { nullable: true })
  where?: Record<string, unknown>
}

@ArgsType()
export class MarketplaceTableTokensArgs {
  @Field(() => MarketplaceTokenWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
    description: 'The number of videos to return',
  })
  limit?: number

  @Field(() => Int, {
    nullable: true,
  })
  offset?: number

  @Field(() => [MarketplaceTokenOrderByInput], {
    nullable: true,
    description: 'Order of input',
  })
  orderBy?: unknown[]
}

@ArgsType()
export class TopSellingTokensArgs {
  @Field(() => TokenWhereInput, { nullable: true })
  where?: Record<string, unknown>
}
