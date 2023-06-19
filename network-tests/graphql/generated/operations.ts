import * as Types from './schema'

import gql from 'graphql-tag'
export type MemberFieldsFragment = {
  id: string
  handle: string
  createdAt: any
  controllerAccount: string
}

export type TokenFieldsFragment = {
  id: string
  createdAt: any
  deissued: boolean
  isInviteOnly: boolean
  status: Types.TokenStatus
  symbol?: Types.Maybe<string>
  totalSupply: string
  accountsNum: number
  annualCreatorReward: number
  numberOfVestedTransferIssued: number
  revenueShareRatioPermill: number
  description?: Types.Maybe<string>
  avatar?: Types.Maybe<
    | { __typename: 'TokenAvatarObject'; avatarObject: { id: string } }
    | { __typename: 'TokenAvatarUri' }
  >
  trailerVideo?: Types.Maybe<{ id: string }>
  benefits: Array<{
    emojiCode?: Types.Maybe<string>
    title: string
    description: string
    displayOrder: number
  }>
  currentRevenueShare?: Types.Maybe<{ id: string }>
  currentAmmSale?: Types.Maybe<{ id: string }>
  currentSale?: Types.Maybe<{ id: string }>
}

export type RevenueShareParticipationFieldsFragment = {
  id: string
  createdIn: number
  earnings: string
  stakedAmount: string
  account: { id: string; member: { id: string } }
}

export type TokenAccountFieldsFragment = {
  id: string
  stakedAmount: string
  totalAmount: string
  deleted: boolean
  member: { id: string }
  token: { id: string }
}

export type RevenueShareFieldsFragment = {
  id: string
  startingAt: number
  finalized: boolean
  endsAt: number
  createdIn: number
  claimed: string
  allocation: string
  participantsNum: number
  token: { id: string }
  stakers: Array<{ account: { id: string } }>
}

export type VestingScheduleFieldsFragment = {
  id: string
  endsAt: number
  cliffPercent: number
  cliffDurationBlocks: number
  cliffBlock: number
  accounts: Array<{ account: { member: { id: string } } }>
  vestedSale?: Types.Maybe<{ sale: { id: string } }>
}

export type SaleFieldsFragment = {
  id: string
  endsAt: number
  createdIn: number
  finalized: boolean
  maxAmountPerMember?: Types.Maybe<string>
  pricePerUnit: string
  startBlock: number
  termsAndConditions: string
  tokenSaleAllocation: string
  tokensSold: string
  vestedSale?: Types.Maybe<{ vesting: { id: string } }>
  fundsSourceAccount: { id: string }
  transactions: Array<{ createdIn: number; id: string; quantity: string; account: { id: string } }>
}

export type VestedAccountFieldsFragment = {
  id: string
  vesting: {
    cliffBlock: number
    cliffDurationBlocks: number
    cliffPercent: number
    id: string
    endsAt: number
  }
  account: { id: string }
}

export type AmmCurvFieldsFragment = {
  mintedByAmm: string
  id: string
  finalized: boolean
  burnedByAmm: string
  ammSlopeParameter: string
  ammInitPrice: string
  transactions: Array<{
    id: string
    transactionType: Types.AmmTransactionType
    pricePerUnit: string
    quantity: string
    pricePaid: string
  }>
}

export type ChannelFieldsFragment = {
  id: string
  rewardAccount: string
  language?: Types.Maybe<string>
  isPublic?: Types.Maybe<boolean>
  isExcluded: boolean
  isCensored: boolean
  followsNum: number
  description?: Types.Maybe<string>
  createdAt: any
  channelStateBloatBond: string
  videoViewsNum: number
  totalVideosCreated: number
  title?: Types.Maybe<string>
  createdInBlock: number
  videos: Array<{ id: string }>
  ownerMember?: Types.Maybe<{ id: string }>
  creatorToken?: Types.Maybe<{ id: string }>
}

export type AmmTranactionFieldsFragment = {
  id: string
  createdIn: number
  pricePaid: string
  pricePerUnit: string
  quantity: string
  transactionType: Types.AmmTransactionType
}

export type GetTokenByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetTokenByIdSubscription = { tokenById?: Types.Maybe<TokenFieldsFragment> }

export type GetTokenAccountByMemberAndTokenSubscriptionVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  tokenId: Types.Scalars['String']
}>

export type GetTokenAccountByMemberAndTokenSubscription = {
  tokenAccounts: Array<TokenAccountFieldsFragment>
}

export type GetRevenueShareByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetRevenueShareByIdSubscription = {
  revenueShareById?: Types.Maybe<RevenueShareFieldsFragment>
}

export type GetRevenueShareParticipationByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetRevenueShareParticipationByIdSubscription = {
  revenueShareParticipationById?: Types.Maybe<RevenueShareParticipationFieldsFragment>
}

export type GetVestedAccountByAccountIdAndVestingSourceSubscriptionVariables = Types.Exact<{
  accountId: Types.Scalars['String']
  vestingSourceType: Types.Scalars['String']
}>

export type GetVestedAccountByAccountIdAndVestingSourceSubscription = {
  vestedAccounts: Array<VestedAccountFieldsFragment>
}

export type GetSaleByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetSaleByIdSubscription = { saleById?: Types.Maybe<SaleFieldsFragment> }

export type GetAmmByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetAmmByIdSubscription = { ammCurveById?: Types.Maybe<AmmCurvFieldsFragment> }

export type GetChannelByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetChannelByIdSubscription = { channelById?: Types.Maybe<ChannelFieldsFragment> }

export type GetAmmTransactionByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetAmmTransactionByIdSubscription = {
  ammTransactionById?: Types.Maybe<AmmTranactionFieldsFragment>
}

export type GetMemberByIdSubscriptionVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetMemberByIdSubscription = { membershipById?: Types.Maybe<MemberFieldsFragment> }

export const MemberFields = gql`
  fragment MemberFields on Membership {
    id
    handle
    createdAt
    controllerAccount
  }
`
export const TokenFields = gql`
  fragment TokenFields on Token {
    id
    createdAt
    deissued
    isInviteOnly
    status
    symbol
    totalSupply
    accountsNum
    avatar {
      ... on TokenAvatarObject {
        __typename
        avatarObject {
          id
        }
      }
      ... on TokenAvatarUri {
        __typename
      }
    }
    trailerVideo {
      id
    }
    benefits {
      emojiCode
      title
      description
      displayOrder
    }
    annualCreatorReward
    numberOfVestedTransferIssued
    revenueShareRatioPermill
    currentRevenueShare {
      id
    }
    currentAmmSale {
      id
    }
    currentSale {
      id
    }
    description
  }
`
export const RevenueShareParticipationFields = gql`
  fragment RevenueShareParticipationFields on RevenueShareParticipation {
    id
    createdIn
    earnings
    stakedAmount
    account {
      id
      member {
        id
      }
    }
  }
`
export const TokenAccountFields = gql`
  fragment TokenAccountFields on TokenAccount {
    id
    member {
      id
    }
    token {
      id
    }
    stakedAmount
    totalAmount
    deleted
  }
`
export const RevenueShareFields = gql`
  fragment RevenueShareFields on RevenueShare {
    id
    startingAt
    finalized
    endsAt
    createdIn
    claimed
    allocation
    participantsNum
    token {
      id
    }
    stakers {
      account {
        id
      }
    }
  }
`
export const VestingScheduleFields = gql`
  fragment VestingScheduleFields on VestingSchedule {
    id
    endsAt
    cliffPercent
    cliffDurationBlocks
    cliffBlock
    accounts {
      account {
        member {
          id
        }
      }
    }
    vestedSale {
      sale {
        id
      }
    }
  }
`
export const SaleFields = gql`
  fragment SaleFields on Sale {
    id
    endsAt
    createdIn
    finalized
    id
    maxAmountPerMember
    pricePerUnit
    startBlock
    termsAndConditions
    tokenSaleAllocation
    tokensSold
    vestedSale {
      vesting {
        id
      }
    }
    fundsSourceAccount {
      id
    }
    transactions {
      createdIn
      id
      quantity
      account {
        id
      }
    }
  }
`
export const VestedAccountFields = gql`
  fragment VestedAccountFields on VestedAccount {
    id
    vesting {
      cliffBlock
      cliffDurationBlocks
      cliffPercent
      id
      endsAt
    }
    account {
      id
    }
  }
`
export const AmmCurvFields = gql`
  fragment AmmCurvFields on AmmCurve {
    mintedByAmm
    id
    finalized
    burnedByAmm
    ammSlopeParameter
    ammInitPrice
    transactions {
      id
      transactionType
      pricePerUnit
      quantity
      pricePaid
    }
  }
`
export const ChannelFields = gql`
  fragment ChannelFields on Channel {
    id
    rewardAccount
    language
    isPublic
    isExcluded
    isCensored
    followsNum
    description
    createdAt
    channelStateBloatBond
    videoViewsNum
    totalVideosCreated
    title
    videos {
      id
    }
    ownerMember {
      id
    }
    createdInBlock
    creatorToken {
      id
    }
  }
`
export const AmmTranactionFields = gql`
  fragment AmmTranactionFields on AmmTransaction {
    id
    createdIn
    pricePaid
    pricePerUnit
    quantity
    transactionType
  }
`
export const GetTokenById = gql`
  subscription getTokenById($id: String!) {
    tokenById(id: $id) {
      ...TokenFields
    }
  }
  ${TokenFields}
`
export const GetTokenAccountByMemberAndToken = gql`
  subscription getTokenAccountByMemberAndToken($memberId: String!, $tokenId: String!) {
    tokenAccounts(
      where: { member: { id_eq: $memberId }, token: { id_eq: $tokenId }, deleted_eq: false }
    ) {
      ...TokenAccountFields
    }
  }
  ${TokenAccountFields}
`
export const GetRevenueShareById = gql`
  subscription getRevenueShareById($id: String!) {
    revenueShareById(id: $id) {
      ...RevenueShareFields
    }
  }
  ${RevenueShareFields}
`
export const GetRevenueShareParticipationById = gql`
  subscription getRevenueShareParticipationById($id: String!) {
    revenueShareParticipationById(id: $id) {
      ...RevenueShareParticipationFields
    }
  }
  ${RevenueShareParticipationFields}
`
export const GetVestedAccountByAccountIdAndVestingSource = gql`
  subscription getVestedAccountByAccountIdAndVestingSource(
    $accountId: String!
    $vestingSourceType: String!
  ) {
    vestedAccounts(
      where: { account: { id_eq: $accountId }, vestingSource: { isTypeOf_eq: $vestingSourceType } }
    ) {
      ...VestedAccountFields
    }
  }
  ${VestedAccountFields}
`
export const GetSaleById = gql`
  subscription getSaleById($id: String!) {
    saleById(id: $id) {
      ...SaleFields
    }
  }
  ${SaleFields}
`
export const GetAmmById = gql`
  subscription getAmmById($id: String!) {
    ammCurveById(id: $id) {
      ...AmmCurvFields
    }
  }
  ${AmmCurvFields}
`
export const GetChannelById = gql`
  subscription getChannelById($id: String!) {
    channelById(id: $id) {
      ...ChannelFields
    }
  }
  ${ChannelFields}
`
export const GetAmmTransactionById = gql`
  subscription getAmmTransactionById($id: String!) {
    ammTransactionById(id: $id) {
      ...AmmTranactionFields
    }
  }
  ${AmmTranactionFields}
`
export const GetMemberById = gql`
  subscription getMemberById($id: String!) {
    membershipById(id: $id) {
      ...MemberFields
    }
  }
  ${MemberFields}
`
