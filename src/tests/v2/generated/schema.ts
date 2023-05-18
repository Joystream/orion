export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigInt: string
  DateTime: any
}

export type AddVideoViewResult = {
  added: Scalars['Boolean']
  videoId: Scalars['String']
  viewId: Scalars['String']
  viewsNum: Scalars['Int']
}

export type App = {
  appChannels: Array<Channel>
  appVideos: Array<Video>
  authKey?: Maybe<Scalars['String']>
  bigIcon?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  id: Scalars['String']
  mediumIcon?: Maybe<Scalars['String']>
  name: Scalars['String']
  oneLiner?: Maybe<Scalars['String']>
  ownerMember: Membership
  platforms?: Maybe<Array<Maybe<Scalars['String']>>>
  smallIcon?: Maybe<Scalars['String']>
  termsOfService?: Maybe<Scalars['String']>
  useUri?: Maybe<Scalars['String']>
  websiteUrl?: Maybe<Scalars['String']>
}

export type AppAppChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type AppAppVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export enum AppActionActionType {
  CreateChannel = 'CREATE_CHANNEL',
  CreateVideo = 'CREATE_VIDEO',
}

export type AppEdge = {
  cursor: Scalars['String']
  node: App
}

export enum AppOrderByInput {
  AuthKeyAsc = 'authKey_ASC',
  AuthKeyDesc = 'authKey_DESC',
  BigIconAsc = 'bigIcon_ASC',
  BigIconDesc = 'bigIcon_DESC',
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MediumIconAsc = 'mediumIcon_ASC',
  MediumIconDesc = 'mediumIcon_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  OneLinerAsc = 'oneLiner_ASC',
  OneLinerDesc = 'oneLiner_DESC',
  OwnerMemberControllerAccountAsc = 'ownerMember_controllerAccount_ASC',
  OwnerMemberControllerAccountDesc = 'ownerMember_controllerAccount_DESC',
  OwnerMemberCreatedAtAsc = 'ownerMember_createdAt_ASC',
  OwnerMemberCreatedAtDesc = 'ownerMember_createdAt_DESC',
  OwnerMemberHandleAsc = 'ownerMember_handle_ASC',
  OwnerMemberHandleDesc = 'ownerMember_handle_DESC',
  OwnerMemberIdAsc = 'ownerMember_id_ASC',
  OwnerMemberIdDesc = 'ownerMember_id_DESC',
  OwnerMemberTotalChannelsCreatedAsc = 'ownerMember_totalChannelsCreated_ASC',
  OwnerMemberTotalChannelsCreatedDesc = 'ownerMember_totalChannelsCreated_DESC',
  SmallIconAsc = 'smallIcon_ASC',
  SmallIconDesc = 'smallIcon_DESC',
  TermsOfServiceAsc = 'termsOfService_ASC',
  TermsOfServiceDesc = 'termsOfService_DESC',
  UseUriAsc = 'useUri_ASC',
  UseUriDesc = 'useUri_DESC',
  WebsiteUrlAsc = 'websiteUrl_ASC',
  WebsiteUrlDesc = 'websiteUrl_DESC',
}

export type AppWhereInput = {
  AND?: Maybe<Array<AppWhereInput>>
  OR?: Maybe<Array<AppWhereInput>>
  appChannels_every?: Maybe<ChannelWhereInput>
  appChannels_none?: Maybe<ChannelWhereInput>
  appChannels_some?: Maybe<ChannelWhereInput>
  appVideos_every?: Maybe<VideoWhereInput>
  appVideos_none?: Maybe<VideoWhereInput>
  appVideos_some?: Maybe<VideoWhereInput>
  authKey_contains?: Maybe<Scalars['String']>
  authKey_containsInsensitive?: Maybe<Scalars['String']>
  authKey_endsWith?: Maybe<Scalars['String']>
  authKey_eq?: Maybe<Scalars['String']>
  authKey_gt?: Maybe<Scalars['String']>
  authKey_gte?: Maybe<Scalars['String']>
  authKey_in?: Maybe<Array<Scalars['String']>>
  authKey_isNull?: Maybe<Scalars['Boolean']>
  authKey_lt?: Maybe<Scalars['String']>
  authKey_lte?: Maybe<Scalars['String']>
  authKey_not_contains?: Maybe<Scalars['String']>
  authKey_not_containsInsensitive?: Maybe<Scalars['String']>
  authKey_not_endsWith?: Maybe<Scalars['String']>
  authKey_not_eq?: Maybe<Scalars['String']>
  authKey_not_in?: Maybe<Array<Scalars['String']>>
  authKey_not_startsWith?: Maybe<Scalars['String']>
  authKey_startsWith?: Maybe<Scalars['String']>
  bigIcon_contains?: Maybe<Scalars['String']>
  bigIcon_containsInsensitive?: Maybe<Scalars['String']>
  bigIcon_endsWith?: Maybe<Scalars['String']>
  bigIcon_eq?: Maybe<Scalars['String']>
  bigIcon_gt?: Maybe<Scalars['String']>
  bigIcon_gte?: Maybe<Scalars['String']>
  bigIcon_in?: Maybe<Array<Scalars['String']>>
  bigIcon_isNull?: Maybe<Scalars['Boolean']>
  bigIcon_lt?: Maybe<Scalars['String']>
  bigIcon_lte?: Maybe<Scalars['String']>
  bigIcon_not_contains?: Maybe<Scalars['String']>
  bigIcon_not_containsInsensitive?: Maybe<Scalars['String']>
  bigIcon_not_endsWith?: Maybe<Scalars['String']>
  bigIcon_not_eq?: Maybe<Scalars['String']>
  bigIcon_not_in?: Maybe<Array<Scalars['String']>>
  bigIcon_not_startsWith?: Maybe<Scalars['String']>
  bigIcon_startsWith?: Maybe<Scalars['String']>
  category_contains?: Maybe<Scalars['String']>
  category_containsInsensitive?: Maybe<Scalars['String']>
  category_endsWith?: Maybe<Scalars['String']>
  category_eq?: Maybe<Scalars['String']>
  category_gt?: Maybe<Scalars['String']>
  category_gte?: Maybe<Scalars['String']>
  category_in?: Maybe<Array<Scalars['String']>>
  category_isNull?: Maybe<Scalars['Boolean']>
  category_lt?: Maybe<Scalars['String']>
  category_lte?: Maybe<Scalars['String']>
  category_not_contains?: Maybe<Scalars['String']>
  category_not_containsInsensitive?: Maybe<Scalars['String']>
  category_not_endsWith?: Maybe<Scalars['String']>
  category_not_eq?: Maybe<Scalars['String']>
  category_not_in?: Maybe<Array<Scalars['String']>>
  category_not_startsWith?: Maybe<Scalars['String']>
  category_startsWith?: Maybe<Scalars['String']>
  description_contains?: Maybe<Scalars['String']>
  description_containsInsensitive?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_gt?: Maybe<Scalars['String']>
  description_gte?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_isNull?: Maybe<Scalars['Boolean']>
  description_lt?: Maybe<Scalars['String']>
  description_lte?: Maybe<Scalars['String']>
  description_not_contains?: Maybe<Scalars['String']>
  description_not_containsInsensitive?: Maybe<Scalars['String']>
  description_not_endsWith?: Maybe<Scalars['String']>
  description_not_eq?: Maybe<Scalars['String']>
  description_not_in?: Maybe<Array<Scalars['String']>>
  description_not_startsWith?: Maybe<Scalars['String']>
  description_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  mediumIcon_contains?: Maybe<Scalars['String']>
  mediumIcon_containsInsensitive?: Maybe<Scalars['String']>
  mediumIcon_endsWith?: Maybe<Scalars['String']>
  mediumIcon_eq?: Maybe<Scalars['String']>
  mediumIcon_gt?: Maybe<Scalars['String']>
  mediumIcon_gte?: Maybe<Scalars['String']>
  mediumIcon_in?: Maybe<Array<Scalars['String']>>
  mediumIcon_isNull?: Maybe<Scalars['Boolean']>
  mediumIcon_lt?: Maybe<Scalars['String']>
  mediumIcon_lte?: Maybe<Scalars['String']>
  mediumIcon_not_contains?: Maybe<Scalars['String']>
  mediumIcon_not_containsInsensitive?: Maybe<Scalars['String']>
  mediumIcon_not_endsWith?: Maybe<Scalars['String']>
  mediumIcon_not_eq?: Maybe<Scalars['String']>
  mediumIcon_not_in?: Maybe<Array<Scalars['String']>>
  mediumIcon_not_startsWith?: Maybe<Scalars['String']>
  mediumIcon_startsWith?: Maybe<Scalars['String']>
  name_contains?: Maybe<Scalars['String']>
  name_containsInsensitive?: Maybe<Scalars['String']>
  name_endsWith?: Maybe<Scalars['String']>
  name_eq?: Maybe<Scalars['String']>
  name_gt?: Maybe<Scalars['String']>
  name_gte?: Maybe<Scalars['String']>
  name_in?: Maybe<Array<Scalars['String']>>
  name_isNull?: Maybe<Scalars['Boolean']>
  name_lt?: Maybe<Scalars['String']>
  name_lte?: Maybe<Scalars['String']>
  name_not_contains?: Maybe<Scalars['String']>
  name_not_containsInsensitive?: Maybe<Scalars['String']>
  name_not_endsWith?: Maybe<Scalars['String']>
  name_not_eq?: Maybe<Scalars['String']>
  name_not_in?: Maybe<Array<Scalars['String']>>
  name_not_startsWith?: Maybe<Scalars['String']>
  name_startsWith?: Maybe<Scalars['String']>
  oneLiner_contains?: Maybe<Scalars['String']>
  oneLiner_containsInsensitive?: Maybe<Scalars['String']>
  oneLiner_endsWith?: Maybe<Scalars['String']>
  oneLiner_eq?: Maybe<Scalars['String']>
  oneLiner_gt?: Maybe<Scalars['String']>
  oneLiner_gte?: Maybe<Scalars['String']>
  oneLiner_in?: Maybe<Array<Scalars['String']>>
  oneLiner_isNull?: Maybe<Scalars['Boolean']>
  oneLiner_lt?: Maybe<Scalars['String']>
  oneLiner_lte?: Maybe<Scalars['String']>
  oneLiner_not_contains?: Maybe<Scalars['String']>
  oneLiner_not_containsInsensitive?: Maybe<Scalars['String']>
  oneLiner_not_endsWith?: Maybe<Scalars['String']>
  oneLiner_not_eq?: Maybe<Scalars['String']>
  oneLiner_not_in?: Maybe<Array<Scalars['String']>>
  oneLiner_not_startsWith?: Maybe<Scalars['String']>
  oneLiner_startsWith?: Maybe<Scalars['String']>
  ownerMember?: Maybe<MembershipWhereInput>
  ownerMember_isNull?: Maybe<Scalars['Boolean']>
  platforms_containsAll?: Maybe<Array<Maybe<Scalars['String']>>>
  platforms_containsAny?: Maybe<Array<Maybe<Scalars['String']>>>
  platforms_containsNone?: Maybe<Array<Maybe<Scalars['String']>>>
  platforms_isNull?: Maybe<Scalars['Boolean']>
  smallIcon_contains?: Maybe<Scalars['String']>
  smallIcon_containsInsensitive?: Maybe<Scalars['String']>
  smallIcon_endsWith?: Maybe<Scalars['String']>
  smallIcon_eq?: Maybe<Scalars['String']>
  smallIcon_gt?: Maybe<Scalars['String']>
  smallIcon_gte?: Maybe<Scalars['String']>
  smallIcon_in?: Maybe<Array<Scalars['String']>>
  smallIcon_isNull?: Maybe<Scalars['Boolean']>
  smallIcon_lt?: Maybe<Scalars['String']>
  smallIcon_lte?: Maybe<Scalars['String']>
  smallIcon_not_contains?: Maybe<Scalars['String']>
  smallIcon_not_containsInsensitive?: Maybe<Scalars['String']>
  smallIcon_not_endsWith?: Maybe<Scalars['String']>
  smallIcon_not_eq?: Maybe<Scalars['String']>
  smallIcon_not_in?: Maybe<Array<Scalars['String']>>
  smallIcon_not_startsWith?: Maybe<Scalars['String']>
  smallIcon_startsWith?: Maybe<Scalars['String']>
  termsOfService_contains?: Maybe<Scalars['String']>
  termsOfService_containsInsensitive?: Maybe<Scalars['String']>
  termsOfService_endsWith?: Maybe<Scalars['String']>
  termsOfService_eq?: Maybe<Scalars['String']>
  termsOfService_gt?: Maybe<Scalars['String']>
  termsOfService_gte?: Maybe<Scalars['String']>
  termsOfService_in?: Maybe<Array<Scalars['String']>>
  termsOfService_isNull?: Maybe<Scalars['Boolean']>
  termsOfService_lt?: Maybe<Scalars['String']>
  termsOfService_lte?: Maybe<Scalars['String']>
  termsOfService_not_contains?: Maybe<Scalars['String']>
  termsOfService_not_containsInsensitive?: Maybe<Scalars['String']>
  termsOfService_not_endsWith?: Maybe<Scalars['String']>
  termsOfService_not_eq?: Maybe<Scalars['String']>
  termsOfService_not_in?: Maybe<Array<Scalars['String']>>
  termsOfService_not_startsWith?: Maybe<Scalars['String']>
  termsOfService_startsWith?: Maybe<Scalars['String']>
  useUri_contains?: Maybe<Scalars['String']>
  useUri_containsInsensitive?: Maybe<Scalars['String']>
  useUri_endsWith?: Maybe<Scalars['String']>
  useUri_eq?: Maybe<Scalars['String']>
  useUri_gt?: Maybe<Scalars['String']>
  useUri_gte?: Maybe<Scalars['String']>
  useUri_in?: Maybe<Array<Scalars['String']>>
  useUri_isNull?: Maybe<Scalars['Boolean']>
  useUri_lt?: Maybe<Scalars['String']>
  useUri_lte?: Maybe<Scalars['String']>
  useUri_not_contains?: Maybe<Scalars['String']>
  useUri_not_containsInsensitive?: Maybe<Scalars['String']>
  useUri_not_endsWith?: Maybe<Scalars['String']>
  useUri_not_eq?: Maybe<Scalars['String']>
  useUri_not_in?: Maybe<Array<Scalars['String']>>
  useUri_not_startsWith?: Maybe<Scalars['String']>
  useUri_startsWith?: Maybe<Scalars['String']>
  websiteUrl_contains?: Maybe<Scalars['String']>
  websiteUrl_containsInsensitive?: Maybe<Scalars['String']>
  websiteUrl_endsWith?: Maybe<Scalars['String']>
  websiteUrl_eq?: Maybe<Scalars['String']>
  websiteUrl_gt?: Maybe<Scalars['String']>
  websiteUrl_gte?: Maybe<Scalars['String']>
  websiteUrl_in?: Maybe<Array<Scalars['String']>>
  websiteUrl_isNull?: Maybe<Scalars['Boolean']>
  websiteUrl_lt?: Maybe<Scalars['String']>
  websiteUrl_lte?: Maybe<Scalars['String']>
  websiteUrl_not_contains?: Maybe<Scalars['String']>
  websiteUrl_not_containsInsensitive?: Maybe<Scalars['String']>
  websiteUrl_not_endsWith?: Maybe<Scalars['String']>
  websiteUrl_not_eq?: Maybe<Scalars['String']>
  websiteUrl_not_in?: Maybe<Array<Scalars['String']>>
  websiteUrl_not_startsWith?: Maybe<Scalars['String']>
  websiteUrl_startsWith?: Maybe<Scalars['String']>
}

export type AppsConnection = {
  edges: Array<AppEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Auction = {
  auctionType: AuctionType
  bids: Array<Bid>
  buyNowPrice?: Maybe<Scalars['BigInt']>
  endedAtBlock?: Maybe<Scalars['Int']>
  id: Scalars['String']
  isCanceled: Scalars['Boolean']
  isCompleted: Scalars['Boolean']
  nft: OwnedNft
  startingPrice: Scalars['BigInt']
  startsAtBlock: Scalars['Int']
  topBid?: Maybe<Bid>
  whitelistedMembers: Array<AuctionWhitelistedMember>
  winningMember?: Maybe<Membership>
}

export type AuctionBidsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BidOrderByInput>>
  where?: Maybe<BidWhereInput>
}

export type AuctionWhitelistedMembersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: Maybe<AuctionWhitelistedMemberWhereInput>
}

export type AuctionBidCanceledEventData = {
  bid: Bid
  member: Membership
  nftOwner: NftOwner
}

export type AuctionBidMadeEventData = {
  bid: Bid
  nftOwner: NftOwner
}

export type AuctionCanceledEventData = {
  actor: ContentActor
  auction: Auction
  nftOwner: NftOwner
}

export type AuctionEdge = {
  cursor: Scalars['String']
  node: Auction
}

export enum AuctionOrderByInput {
  AuctionTypeBidLockDurationAsc = 'auctionType_bidLockDuration_ASC',
  AuctionTypeBidLockDurationDesc = 'auctionType_bidLockDuration_DESC',
  AuctionTypeDurationAsc = 'auctionType_duration_ASC',
  AuctionTypeDurationDesc = 'auctionType_duration_DESC',
  AuctionTypeExtensionPeriodAsc = 'auctionType_extensionPeriod_ASC',
  AuctionTypeExtensionPeriodDesc = 'auctionType_extensionPeriod_DESC',
  AuctionTypeIsTypeOfAsc = 'auctionType_isTypeOf_ASC',
  AuctionTypeIsTypeOfDesc = 'auctionType_isTypeOf_DESC',
  AuctionTypeMinimalBidStepAsc = 'auctionType_minimalBidStep_ASC',
  AuctionTypeMinimalBidStepDesc = 'auctionType_minimalBidStep_DESC',
  AuctionTypePlannedEndAtBlockAsc = 'auctionType_plannedEndAtBlock_ASC',
  AuctionTypePlannedEndAtBlockDesc = 'auctionType_plannedEndAtBlock_DESC',
  BuyNowPriceAsc = 'buyNowPrice_ASC',
  BuyNowPriceDesc = 'buyNowPrice_DESC',
  EndedAtBlockAsc = 'endedAtBlock_ASC',
  EndedAtBlockDesc = 'endedAtBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsCanceledAsc = 'isCanceled_ASC',
  IsCanceledDesc = 'isCanceled_DESC',
  IsCompletedAsc = 'isCompleted_ASC',
  IsCompletedDesc = 'isCompleted_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
  StartingPriceAsc = 'startingPrice_ASC',
  StartingPriceDesc = 'startingPrice_DESC',
  StartsAtBlockAsc = 'startsAtBlock_ASC',
  StartsAtBlockDesc = 'startsAtBlock_DESC',
  TopBidAmountAsc = 'topBid_amount_ASC',
  TopBidAmountDesc = 'topBid_amount_DESC',
  TopBidCreatedAtAsc = 'topBid_createdAt_ASC',
  TopBidCreatedAtDesc = 'topBid_createdAt_DESC',
  TopBidCreatedInBlockAsc = 'topBid_createdInBlock_ASC',
  TopBidCreatedInBlockDesc = 'topBid_createdInBlock_DESC',
  TopBidIdAsc = 'topBid_id_ASC',
  TopBidIdDesc = 'topBid_id_DESC',
  TopBidIndexInBlockAsc = 'topBid_indexInBlock_ASC',
  TopBidIndexInBlockDesc = 'topBid_indexInBlock_DESC',
  TopBidIsCanceledAsc = 'topBid_isCanceled_ASC',
  TopBidIsCanceledDesc = 'topBid_isCanceled_DESC',
  WinningMemberControllerAccountAsc = 'winningMember_controllerAccount_ASC',
  WinningMemberControllerAccountDesc = 'winningMember_controllerAccount_DESC',
  WinningMemberCreatedAtAsc = 'winningMember_createdAt_ASC',
  WinningMemberCreatedAtDesc = 'winningMember_createdAt_DESC',
  WinningMemberHandleAsc = 'winningMember_handle_ASC',
  WinningMemberHandleDesc = 'winningMember_handle_DESC',
  WinningMemberIdAsc = 'winningMember_id_ASC',
  WinningMemberIdDesc = 'winningMember_id_DESC',
  WinningMemberTotalChannelsCreatedAsc = 'winningMember_totalChannelsCreated_ASC',
  WinningMemberTotalChannelsCreatedDesc = 'winningMember_totalChannelsCreated_DESC',
}

export type AuctionType = AuctionTypeEnglish | AuctionTypeOpen

export type AuctionTypeEnglish = {
  duration: Scalars['Int']
  extensionPeriod: Scalars['Int']
  minimalBidStep: Scalars['BigInt']
  plannedEndAtBlock: Scalars['Int']
}

export type AuctionTypeOpen = {
  bidLockDuration: Scalars['Int']
}

export type AuctionTypeWhereInput = {
  bidLockDuration_eq?: Maybe<Scalars['Int']>
  bidLockDuration_gt?: Maybe<Scalars['Int']>
  bidLockDuration_gte?: Maybe<Scalars['Int']>
  bidLockDuration_in?: Maybe<Array<Scalars['Int']>>
  bidLockDuration_isNull?: Maybe<Scalars['Boolean']>
  bidLockDuration_lt?: Maybe<Scalars['Int']>
  bidLockDuration_lte?: Maybe<Scalars['Int']>
  bidLockDuration_not_eq?: Maybe<Scalars['Int']>
  bidLockDuration_not_in?: Maybe<Array<Scalars['Int']>>
  duration_eq?: Maybe<Scalars['Int']>
  duration_gt?: Maybe<Scalars['Int']>
  duration_gte?: Maybe<Scalars['Int']>
  duration_in?: Maybe<Array<Scalars['Int']>>
  duration_isNull?: Maybe<Scalars['Boolean']>
  duration_lt?: Maybe<Scalars['Int']>
  duration_lte?: Maybe<Scalars['Int']>
  duration_not_eq?: Maybe<Scalars['Int']>
  duration_not_in?: Maybe<Array<Scalars['Int']>>
  extensionPeriod_eq?: Maybe<Scalars['Int']>
  extensionPeriod_gt?: Maybe<Scalars['Int']>
  extensionPeriod_gte?: Maybe<Scalars['Int']>
  extensionPeriod_in?: Maybe<Array<Scalars['Int']>>
  extensionPeriod_isNull?: Maybe<Scalars['Boolean']>
  extensionPeriod_lt?: Maybe<Scalars['Int']>
  extensionPeriod_lte?: Maybe<Scalars['Int']>
  extensionPeriod_not_eq?: Maybe<Scalars['Int']>
  extensionPeriod_not_in?: Maybe<Array<Scalars['Int']>>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  minimalBidStep_eq?: Maybe<Scalars['BigInt']>
  minimalBidStep_gt?: Maybe<Scalars['BigInt']>
  minimalBidStep_gte?: Maybe<Scalars['BigInt']>
  minimalBidStep_in?: Maybe<Array<Scalars['BigInt']>>
  minimalBidStep_isNull?: Maybe<Scalars['Boolean']>
  minimalBidStep_lt?: Maybe<Scalars['BigInt']>
  minimalBidStep_lte?: Maybe<Scalars['BigInt']>
  minimalBidStep_not_eq?: Maybe<Scalars['BigInt']>
  minimalBidStep_not_in?: Maybe<Array<Scalars['BigInt']>>
  plannedEndAtBlock_eq?: Maybe<Scalars['Int']>
  plannedEndAtBlock_gt?: Maybe<Scalars['Int']>
  plannedEndAtBlock_gte?: Maybe<Scalars['Int']>
  plannedEndAtBlock_in?: Maybe<Array<Scalars['Int']>>
  plannedEndAtBlock_isNull?: Maybe<Scalars['Boolean']>
  plannedEndAtBlock_lt?: Maybe<Scalars['Int']>
  plannedEndAtBlock_lte?: Maybe<Scalars['Int']>
  plannedEndAtBlock_not_eq?: Maybe<Scalars['Int']>
  plannedEndAtBlock_not_in?: Maybe<Array<Scalars['Int']>>
}

export type AuctionWhereInput = {
  AND?: Maybe<Array<AuctionWhereInput>>
  OR?: Maybe<Array<AuctionWhereInput>>
  auctionType?: Maybe<AuctionTypeWhereInput>
  auctionType_isNull?: Maybe<Scalars['Boolean']>
  bids_every?: Maybe<BidWhereInput>
  bids_none?: Maybe<BidWhereInput>
  bids_some?: Maybe<BidWhereInput>
  buyNowPrice_eq?: Maybe<Scalars['BigInt']>
  buyNowPrice_gt?: Maybe<Scalars['BigInt']>
  buyNowPrice_gte?: Maybe<Scalars['BigInt']>
  buyNowPrice_in?: Maybe<Array<Scalars['BigInt']>>
  buyNowPrice_isNull?: Maybe<Scalars['Boolean']>
  buyNowPrice_lt?: Maybe<Scalars['BigInt']>
  buyNowPrice_lte?: Maybe<Scalars['BigInt']>
  buyNowPrice_not_eq?: Maybe<Scalars['BigInt']>
  buyNowPrice_not_in?: Maybe<Array<Scalars['BigInt']>>
  endedAtBlock_eq?: Maybe<Scalars['Int']>
  endedAtBlock_gt?: Maybe<Scalars['Int']>
  endedAtBlock_gte?: Maybe<Scalars['Int']>
  endedAtBlock_in?: Maybe<Array<Scalars['Int']>>
  endedAtBlock_isNull?: Maybe<Scalars['Boolean']>
  endedAtBlock_lt?: Maybe<Scalars['Int']>
  endedAtBlock_lte?: Maybe<Scalars['Int']>
  endedAtBlock_not_eq?: Maybe<Scalars['Int']>
  endedAtBlock_not_in?: Maybe<Array<Scalars['Int']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isCanceled_eq?: Maybe<Scalars['Boolean']>
  isCanceled_isNull?: Maybe<Scalars['Boolean']>
  isCanceled_not_eq?: Maybe<Scalars['Boolean']>
  isCompleted_eq?: Maybe<Scalars['Boolean']>
  isCompleted_isNull?: Maybe<Scalars['Boolean']>
  isCompleted_not_eq?: Maybe<Scalars['Boolean']>
  nft?: Maybe<OwnedNftWhereInput>
  nft_isNull?: Maybe<Scalars['Boolean']>
  startingPrice_eq?: Maybe<Scalars['BigInt']>
  startingPrice_gt?: Maybe<Scalars['BigInt']>
  startingPrice_gte?: Maybe<Scalars['BigInt']>
  startingPrice_in?: Maybe<Array<Scalars['BigInt']>>
  startingPrice_isNull?: Maybe<Scalars['Boolean']>
  startingPrice_lt?: Maybe<Scalars['BigInt']>
  startingPrice_lte?: Maybe<Scalars['BigInt']>
  startingPrice_not_eq?: Maybe<Scalars['BigInt']>
  startingPrice_not_in?: Maybe<Array<Scalars['BigInt']>>
  startsAtBlock_eq?: Maybe<Scalars['Int']>
  startsAtBlock_gt?: Maybe<Scalars['Int']>
  startsAtBlock_gte?: Maybe<Scalars['Int']>
  startsAtBlock_in?: Maybe<Array<Scalars['Int']>>
  startsAtBlock_isNull?: Maybe<Scalars['Boolean']>
  startsAtBlock_lt?: Maybe<Scalars['Int']>
  startsAtBlock_lte?: Maybe<Scalars['Int']>
  startsAtBlock_not_eq?: Maybe<Scalars['Int']>
  startsAtBlock_not_in?: Maybe<Array<Scalars['Int']>>
  topBid?: Maybe<BidWhereInput>
  topBid_isNull?: Maybe<Scalars['Boolean']>
  whitelistedMembers_every?: Maybe<AuctionWhitelistedMemberWhereInput>
  whitelistedMembers_none?: Maybe<AuctionWhitelistedMemberWhereInput>
  whitelistedMembers_some?: Maybe<AuctionWhitelistedMemberWhereInput>
  winningMember?: Maybe<MembershipWhereInput>
  winningMember_isNull?: Maybe<Scalars['Boolean']>
}

export type AuctionWhitelistedMember = {
  auction: Auction
  id: Scalars['String']
  member: Membership
}

export type AuctionWhitelistedMemberEdge = {
  cursor: Scalars['String']
  node: AuctionWhitelistedMember
}

export enum AuctionWhitelistedMemberOrderByInput {
  AuctionBuyNowPriceAsc = 'auction_buyNowPrice_ASC',
  AuctionBuyNowPriceDesc = 'auction_buyNowPrice_DESC',
  AuctionEndedAtBlockAsc = 'auction_endedAtBlock_ASC',
  AuctionEndedAtBlockDesc = 'auction_endedAtBlock_DESC',
  AuctionIdAsc = 'auction_id_ASC',
  AuctionIdDesc = 'auction_id_DESC',
  AuctionIsCanceledAsc = 'auction_isCanceled_ASC',
  AuctionIsCanceledDesc = 'auction_isCanceled_DESC',
  AuctionIsCompletedAsc = 'auction_isCompleted_ASC',
  AuctionIsCompletedDesc = 'auction_isCompleted_DESC',
  AuctionStartingPriceAsc = 'auction_startingPrice_ASC',
  AuctionStartingPriceDesc = 'auction_startingPrice_DESC',
  AuctionStartsAtBlockAsc = 'auction_startsAtBlock_ASC',
  AuctionStartsAtBlockDesc = 'auction_startsAtBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type AuctionWhitelistedMemberWhereInput = {
  AND?: Maybe<Array<AuctionWhitelistedMemberWhereInput>>
  OR?: Maybe<Array<AuctionWhitelistedMemberWhereInput>>
  auction?: Maybe<AuctionWhereInput>
  auction_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
}

export type AuctionWhitelistedMembersConnection = {
  edges: Array<AuctionWhitelistedMemberEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type AuctionsConnection = {
  edges: Array<AuctionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Avatar = AvatarObject | AvatarUri

export type AvatarObject = {
  avatarObject: StorageDataObject
}

export type AvatarUri = {
  avatarUri: Scalars['String']
}

export type AvatarWhereInput = {
  avatarObject?: Maybe<StorageDataObjectWhereInput>
  avatarObject_isNull?: Maybe<Scalars['Boolean']>
  avatarUri_contains?: Maybe<Scalars['String']>
  avatarUri_containsInsensitive?: Maybe<Scalars['String']>
  avatarUri_endsWith?: Maybe<Scalars['String']>
  avatarUri_eq?: Maybe<Scalars['String']>
  avatarUri_gt?: Maybe<Scalars['String']>
  avatarUri_gte?: Maybe<Scalars['String']>
  avatarUri_in?: Maybe<Array<Scalars['String']>>
  avatarUri_isNull?: Maybe<Scalars['Boolean']>
  avatarUri_lt?: Maybe<Scalars['String']>
  avatarUri_lte?: Maybe<Scalars['String']>
  avatarUri_not_contains?: Maybe<Scalars['String']>
  avatarUri_not_containsInsensitive?: Maybe<Scalars['String']>
  avatarUri_not_endsWith?: Maybe<Scalars['String']>
  avatarUri_not_eq?: Maybe<Scalars['String']>
  avatarUri_not_in?: Maybe<Array<Scalars['String']>>
  avatarUri_not_startsWith?: Maybe<Scalars['String']>
  avatarUri_startsWith?: Maybe<Scalars['String']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
}

export type BannedMember = {
  channel: Channel
  id: Scalars['String']
  member: Membership
}

export type BannedMemberEdge = {
  cursor: Scalars['String']
  node: BannedMember
}

export enum BannedMemberOrderByInput {
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type BannedMemberWhereInput = {
  AND?: Maybe<Array<BannedMemberWhereInput>>
  OR?: Maybe<Array<BannedMemberWhereInput>>
  channel?: Maybe<ChannelWhereInput>
  channel_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
}

export type BannedMembersConnection = {
  edges: Array<BannedMemberEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Bid = {
  amount: Scalars['BigInt']
  auction: Auction
  bidder: Membership
  createdAt: Scalars['DateTime']
  createdInBlock: Scalars['Int']
  id: Scalars['String']
  indexInBlock: Scalars['Int']
  isCanceled: Scalars['Boolean']
  nft: OwnedNft
  previousTopBid?: Maybe<Bid>
}

export type BidEdge = {
  cursor: Scalars['String']
  node: Bid
}

export type BidMadeCompletingAuctionEventData = {
  previousNftOwner: NftOwner
  winningBid: Bid
}

export enum BidOrderByInput {
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
  AuctionBuyNowPriceAsc = 'auction_buyNowPrice_ASC',
  AuctionBuyNowPriceDesc = 'auction_buyNowPrice_DESC',
  AuctionEndedAtBlockAsc = 'auction_endedAtBlock_ASC',
  AuctionEndedAtBlockDesc = 'auction_endedAtBlock_DESC',
  AuctionIdAsc = 'auction_id_ASC',
  AuctionIdDesc = 'auction_id_DESC',
  AuctionIsCanceledAsc = 'auction_isCanceled_ASC',
  AuctionIsCanceledDesc = 'auction_isCanceled_DESC',
  AuctionIsCompletedAsc = 'auction_isCompleted_ASC',
  AuctionIsCompletedDesc = 'auction_isCompleted_DESC',
  AuctionStartingPriceAsc = 'auction_startingPrice_ASC',
  AuctionStartingPriceDesc = 'auction_startingPrice_DESC',
  AuctionStartsAtBlockAsc = 'auction_startsAtBlock_ASC',
  AuctionStartsAtBlockDesc = 'auction_startsAtBlock_DESC',
  BidderControllerAccountAsc = 'bidder_controllerAccount_ASC',
  BidderControllerAccountDesc = 'bidder_controllerAccount_DESC',
  BidderCreatedAtAsc = 'bidder_createdAt_ASC',
  BidderCreatedAtDesc = 'bidder_createdAt_DESC',
  BidderHandleAsc = 'bidder_handle_ASC',
  BidderHandleDesc = 'bidder_handle_DESC',
  BidderIdAsc = 'bidder_id_ASC',
  BidderIdDesc = 'bidder_id_DESC',
  BidderTotalChannelsCreatedAsc = 'bidder_totalChannelsCreated_ASC',
  BidderTotalChannelsCreatedDesc = 'bidder_totalChannelsCreated_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  IsCanceledAsc = 'isCanceled_ASC',
  IsCanceledDesc = 'isCanceled_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
  PreviousTopBidAmountAsc = 'previousTopBid_amount_ASC',
  PreviousTopBidAmountDesc = 'previousTopBid_amount_DESC',
  PreviousTopBidCreatedAtAsc = 'previousTopBid_createdAt_ASC',
  PreviousTopBidCreatedAtDesc = 'previousTopBid_createdAt_DESC',
  PreviousTopBidCreatedInBlockAsc = 'previousTopBid_createdInBlock_ASC',
  PreviousTopBidCreatedInBlockDesc = 'previousTopBid_createdInBlock_DESC',
  PreviousTopBidIdAsc = 'previousTopBid_id_ASC',
  PreviousTopBidIdDesc = 'previousTopBid_id_DESC',
  PreviousTopBidIndexInBlockAsc = 'previousTopBid_indexInBlock_ASC',
  PreviousTopBidIndexInBlockDesc = 'previousTopBid_indexInBlock_DESC',
  PreviousTopBidIsCanceledAsc = 'previousTopBid_isCanceled_ASC',
  PreviousTopBidIsCanceledDesc = 'previousTopBid_isCanceled_DESC',
}

export type BidWhereInput = {
  AND?: Maybe<Array<BidWhereInput>>
  OR?: Maybe<Array<BidWhereInput>>
  amount_eq?: Maybe<Scalars['BigInt']>
  amount_gt?: Maybe<Scalars['BigInt']>
  amount_gte?: Maybe<Scalars['BigInt']>
  amount_in?: Maybe<Array<Scalars['BigInt']>>
  amount_isNull?: Maybe<Scalars['Boolean']>
  amount_lt?: Maybe<Scalars['BigInt']>
  amount_lte?: Maybe<Scalars['BigInt']>
  amount_not_eq?: Maybe<Scalars['BigInt']>
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>
  auction?: Maybe<AuctionWhereInput>
  auction_isNull?: Maybe<Scalars['Boolean']>
  bidder?: Maybe<MembershipWhereInput>
  bidder_isNull?: Maybe<Scalars['Boolean']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: Maybe<Scalars['Boolean']>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  createdInBlock_not_eq?: Maybe<Scalars['Int']>
  createdInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  indexInBlock_eq?: Maybe<Scalars['Int']>
  indexInBlock_gt?: Maybe<Scalars['Int']>
  indexInBlock_gte?: Maybe<Scalars['Int']>
  indexInBlock_in?: Maybe<Array<Scalars['Int']>>
  indexInBlock_isNull?: Maybe<Scalars['Boolean']>
  indexInBlock_lt?: Maybe<Scalars['Int']>
  indexInBlock_lte?: Maybe<Scalars['Int']>
  indexInBlock_not_eq?: Maybe<Scalars['Int']>
  indexInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  isCanceled_eq?: Maybe<Scalars['Boolean']>
  isCanceled_isNull?: Maybe<Scalars['Boolean']>
  isCanceled_not_eq?: Maybe<Scalars['Boolean']>
  nft?: Maybe<OwnedNftWhereInput>
  nft_isNull?: Maybe<Scalars['Boolean']>
  previousTopBid?: Maybe<BidWhereInput>
  previousTopBid_isNull?: Maybe<Scalars['Boolean']>
}

export type BidsConnection = {
  edges: Array<BidEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type BuyNowCanceledEventData = {
  actor: ContentActor
  nft: OwnedNft
  nftOwner: NftOwner
}

export type BuyNowPriceUpdatedEventData = {
  actor: ContentActor
  newPrice: Scalars['BigInt']
  nft: OwnedNft
  nftOwner: NftOwner
}

export type Channel = {
  avatarPhoto?: Maybe<StorageDataObject>
  bannedMembers: Array<BannedMember>
  channelStateBloatBond: Scalars['BigInt']
  coverPhoto?: Maybe<StorageDataObject>
  createdAt: Scalars['DateTime']
  createdInBlock: Scalars['Int']
  cumulativeRewardClaimed?: Maybe<Scalars['BigInt']>
  description?: Maybe<Scalars['String']>
  entryApp?: Maybe<App>
  followsNum: Scalars['Int']
  id: Scalars['String']
  isCensored: Scalars['Boolean']
  isExcluded: Scalars['Boolean']
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Scalars['String']>
  ownerMember?: Maybe<Membership>
  rewardAccount: Scalars['String']
  title?: Maybe<Scalars['String']>
  totalVideosCreated: Scalars['Int']
  videoViewsNum: Scalars['Int']
  videos: Array<Video>
}

export type ChannelBannedMembersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BannedMemberOrderByInput>>
  where?: Maybe<BannedMemberWhereInput>
}

export type ChannelVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export type ChannelEdge = {
  cursor: Scalars['String']
  node: Channel
}

export type ChannelFollow = {
  channelId: Scalars['String']
  id: Scalars['String']
  ip: Scalars['String']
  timestamp: Scalars['DateTime']
}

export type ChannelFollowEdge = {
  cursor: Scalars['String']
  node: ChannelFollow
}

export enum ChannelFollowOrderByInput {
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpAsc = 'ip_ASC',
  IpDesc = 'ip_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type ChannelFollowResult = {
  added: Scalars['Boolean']
  cancelToken: Scalars['String']
  channelId: Scalars['String']
  follows: Scalars['Int']
}

export type ChannelFollowWhereInput = {
  AND?: Maybe<Array<ChannelFollowWhereInput>>
  OR?: Maybe<Array<ChannelFollowWhereInput>>
  channelId_contains?: Maybe<Scalars['String']>
  channelId_containsInsensitive?: Maybe<Scalars['String']>
  channelId_endsWith?: Maybe<Scalars['String']>
  channelId_eq?: Maybe<Scalars['String']>
  channelId_gt?: Maybe<Scalars['String']>
  channelId_gte?: Maybe<Scalars['String']>
  channelId_in?: Maybe<Array<Scalars['String']>>
  channelId_isNull?: Maybe<Scalars['Boolean']>
  channelId_lt?: Maybe<Scalars['String']>
  channelId_lte?: Maybe<Scalars['String']>
  channelId_not_contains?: Maybe<Scalars['String']>
  channelId_not_containsInsensitive?: Maybe<Scalars['String']>
  channelId_not_endsWith?: Maybe<Scalars['String']>
  channelId_not_eq?: Maybe<Scalars['String']>
  channelId_not_in?: Maybe<Array<Scalars['String']>>
  channelId_not_startsWith?: Maybe<Scalars['String']>
  channelId_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  ip_contains?: Maybe<Scalars['String']>
  ip_containsInsensitive?: Maybe<Scalars['String']>
  ip_endsWith?: Maybe<Scalars['String']>
  ip_eq?: Maybe<Scalars['String']>
  ip_gt?: Maybe<Scalars['String']>
  ip_gte?: Maybe<Scalars['String']>
  ip_in?: Maybe<Array<Scalars['String']>>
  ip_isNull?: Maybe<Scalars['Boolean']>
  ip_lt?: Maybe<Scalars['String']>
  ip_lte?: Maybe<Scalars['String']>
  ip_not_contains?: Maybe<Scalars['String']>
  ip_not_containsInsensitive?: Maybe<Scalars['String']>
  ip_not_endsWith?: Maybe<Scalars['String']>
  ip_not_eq?: Maybe<Scalars['String']>
  ip_not_in?: Maybe<Array<Scalars['String']>>
  ip_not_startsWith?: Maybe<Scalars['String']>
  ip_startsWith?: Maybe<Scalars['String']>
  timestamp_eq?: Maybe<Scalars['DateTime']>
  timestamp_gt?: Maybe<Scalars['DateTime']>
  timestamp_gte?: Maybe<Scalars['DateTime']>
  timestamp_in?: Maybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: Maybe<Scalars['Boolean']>
  timestamp_lt?: Maybe<Scalars['DateTime']>
  timestamp_lte?: Maybe<Scalars['DateTime']>
  timestamp_not_eq?: Maybe<Scalars['DateTime']>
  timestamp_not_in?: Maybe<Array<Scalars['DateTime']>>
}

export type ChannelFollowsConnection = {
  edges: Array<ChannelFollowEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelFundsWithdrawnEventData = {
  account?: Maybe<Scalars['String']>
  actor: ContentActor
  amount: Scalars['BigInt']
  channel: Channel
}

export type ChannelNftCollector = {
  amount: Scalars['Int']
  member: Membership
}

export enum ChannelNftCollectorsOrderByInput {
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
}

export enum ChannelOrderByInput {
  AvatarPhotoCreatedAtAsc = 'avatarPhoto_createdAt_ASC',
  AvatarPhotoCreatedAtDesc = 'avatarPhoto_createdAt_DESC',
  AvatarPhotoIdAsc = 'avatarPhoto_id_ASC',
  AvatarPhotoIdDesc = 'avatarPhoto_id_DESC',
  AvatarPhotoIpfsHashAsc = 'avatarPhoto_ipfsHash_ASC',
  AvatarPhotoIpfsHashDesc = 'avatarPhoto_ipfsHash_DESC',
  AvatarPhotoIsAcceptedAsc = 'avatarPhoto_isAccepted_ASC',
  AvatarPhotoIsAcceptedDesc = 'avatarPhoto_isAccepted_DESC',
  AvatarPhotoSizeAsc = 'avatarPhoto_size_ASC',
  AvatarPhotoSizeDesc = 'avatarPhoto_size_DESC',
  AvatarPhotoStateBloatBondAsc = 'avatarPhoto_stateBloatBond_ASC',
  AvatarPhotoStateBloatBondDesc = 'avatarPhoto_stateBloatBond_DESC',
  AvatarPhotoUnsetAtAsc = 'avatarPhoto_unsetAt_ASC',
  AvatarPhotoUnsetAtDesc = 'avatarPhoto_unsetAt_DESC',
  ChannelStateBloatBondAsc = 'channelStateBloatBond_ASC',
  ChannelStateBloatBondDesc = 'channelStateBloatBond_DESC',
  CoverPhotoCreatedAtAsc = 'coverPhoto_createdAt_ASC',
  CoverPhotoCreatedAtDesc = 'coverPhoto_createdAt_DESC',
  CoverPhotoIdAsc = 'coverPhoto_id_ASC',
  CoverPhotoIdDesc = 'coverPhoto_id_DESC',
  CoverPhotoIpfsHashAsc = 'coverPhoto_ipfsHash_ASC',
  CoverPhotoIpfsHashDesc = 'coverPhoto_ipfsHash_DESC',
  CoverPhotoIsAcceptedAsc = 'coverPhoto_isAccepted_ASC',
  CoverPhotoIsAcceptedDesc = 'coverPhoto_isAccepted_DESC',
  CoverPhotoSizeAsc = 'coverPhoto_size_ASC',
  CoverPhotoSizeDesc = 'coverPhoto_size_DESC',
  CoverPhotoStateBloatBondAsc = 'coverPhoto_stateBloatBond_ASC',
  CoverPhotoStateBloatBondDesc = 'coverPhoto_stateBloatBond_DESC',
  CoverPhotoUnsetAtAsc = 'coverPhoto_unsetAt_ASC',
  CoverPhotoUnsetAtDesc = 'coverPhoto_unsetAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  CumulativeRewardClaimedAsc = 'cumulativeRewardClaimed_ASC',
  CumulativeRewardClaimedDesc = 'cumulativeRewardClaimed_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  EntryAppAuthKeyAsc = 'entryApp_authKey_ASC',
  EntryAppAuthKeyDesc = 'entryApp_authKey_DESC',
  EntryAppBigIconAsc = 'entryApp_bigIcon_ASC',
  EntryAppBigIconDesc = 'entryApp_bigIcon_DESC',
  EntryAppCategoryAsc = 'entryApp_category_ASC',
  EntryAppCategoryDesc = 'entryApp_category_DESC',
  EntryAppDescriptionAsc = 'entryApp_description_ASC',
  EntryAppDescriptionDesc = 'entryApp_description_DESC',
  EntryAppIdAsc = 'entryApp_id_ASC',
  EntryAppIdDesc = 'entryApp_id_DESC',
  EntryAppMediumIconAsc = 'entryApp_mediumIcon_ASC',
  EntryAppMediumIconDesc = 'entryApp_mediumIcon_DESC',
  EntryAppNameAsc = 'entryApp_name_ASC',
  EntryAppNameDesc = 'entryApp_name_DESC',
  EntryAppOneLinerAsc = 'entryApp_oneLiner_ASC',
  EntryAppOneLinerDesc = 'entryApp_oneLiner_DESC',
  EntryAppSmallIconAsc = 'entryApp_smallIcon_ASC',
  EntryAppSmallIconDesc = 'entryApp_smallIcon_DESC',
  EntryAppTermsOfServiceAsc = 'entryApp_termsOfService_ASC',
  EntryAppTermsOfServiceDesc = 'entryApp_termsOfService_DESC',
  EntryAppUseUriAsc = 'entryApp_useUri_ASC',
  EntryAppUseUriDesc = 'entryApp_useUri_DESC',
  EntryAppWebsiteUrlAsc = 'entryApp_websiteUrl_ASC',
  EntryAppWebsiteUrlDesc = 'entryApp_websiteUrl_DESC',
  FollowsNumAsc = 'followsNum_ASC',
  FollowsNumDesc = 'followsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsCensoredAsc = 'isCensored_ASC',
  IsCensoredDesc = 'isCensored_DESC',
  IsExcludedAsc = 'isExcluded_ASC',
  IsExcludedDesc = 'isExcluded_DESC',
  IsPublicAsc = 'isPublic_ASC',
  IsPublicDesc = 'isPublic_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  OwnerMemberControllerAccountAsc = 'ownerMember_controllerAccount_ASC',
  OwnerMemberControllerAccountDesc = 'ownerMember_controllerAccount_DESC',
  OwnerMemberCreatedAtAsc = 'ownerMember_createdAt_ASC',
  OwnerMemberCreatedAtDesc = 'ownerMember_createdAt_DESC',
  OwnerMemberHandleAsc = 'ownerMember_handle_ASC',
  OwnerMemberHandleDesc = 'ownerMember_handle_DESC',
  OwnerMemberIdAsc = 'ownerMember_id_ASC',
  OwnerMemberIdDesc = 'ownerMember_id_DESC',
  OwnerMemberTotalChannelsCreatedAsc = 'ownerMember_totalChannelsCreated_ASC',
  OwnerMemberTotalChannelsCreatedDesc = 'ownerMember_totalChannelsCreated_DESC',
  RewardAccountAsc = 'rewardAccount_ASC',
  RewardAccountDesc = 'rewardAccount_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TotalVideosCreatedAsc = 'totalVideosCreated_ASC',
  TotalVideosCreatedDesc = 'totalVideosCreated_DESC',
  VideoViewsNumAsc = 'videoViewsNum_ASC',
  VideoViewsNumDesc = 'videoViewsNum_DESC',
}

export type ChannelPaymentMadeEventData = {
  amount: Scalars['BigInt']
  payeeChannel?: Maybe<Channel>
  payer: Membership
  paymentContext?: Maybe<PaymentContext>
  rationale?: Maybe<Scalars['String']>
}

export type ChannelPayoutsUpdatedEventData = {
  channelCashoutsEnabled?: Maybe<Scalars['Boolean']>
  commitment?: Maybe<Scalars['String']>
  maxCashoutAllowed?: Maybe<Scalars['BigInt']>
  minCashoutAllowed?: Maybe<Scalars['BigInt']>
  payloadDataObject?: Maybe<StorageDataObject>
}

export type ChannelReportInfo = {
  channelId: Scalars['String']
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
  reporterIp: Scalars['String']
}

export type ChannelRewardClaimedAndWithdrawnEventData = {
  account?: Maybe<Scalars['String']>
  actor: ContentActor
  amount: Scalars['BigInt']
  channel: Channel
}

export type ChannelRewardClaimedEventData = {
  amount: Scalars['BigInt']
  channel: Channel
}

export type ChannelUnfollowResult = {
  channelId: Scalars['String']
  follows: Scalars['Int']
  removed: Scalars['Boolean']
}

export type ChannelWhereInput = {
  AND?: Maybe<Array<ChannelWhereInput>>
  OR?: Maybe<Array<ChannelWhereInput>>
  avatarPhoto?: Maybe<StorageDataObjectWhereInput>
  avatarPhoto_isNull?: Maybe<Scalars['Boolean']>
  bannedMembers_every?: Maybe<BannedMemberWhereInput>
  bannedMembers_none?: Maybe<BannedMemberWhereInput>
  bannedMembers_some?: Maybe<BannedMemberWhereInput>
  channelStateBloatBond_eq?: Maybe<Scalars['BigInt']>
  channelStateBloatBond_gt?: Maybe<Scalars['BigInt']>
  channelStateBloatBond_gte?: Maybe<Scalars['BigInt']>
  channelStateBloatBond_in?: Maybe<Array<Scalars['BigInt']>>
  channelStateBloatBond_isNull?: Maybe<Scalars['Boolean']>
  channelStateBloatBond_lt?: Maybe<Scalars['BigInt']>
  channelStateBloatBond_lte?: Maybe<Scalars['BigInt']>
  channelStateBloatBond_not_eq?: Maybe<Scalars['BigInt']>
  channelStateBloatBond_not_in?: Maybe<Array<Scalars['BigInt']>>
  coverPhoto?: Maybe<StorageDataObjectWhereInput>
  coverPhoto_isNull?: Maybe<Scalars['Boolean']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: Maybe<Scalars['Boolean']>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  createdInBlock_not_eq?: Maybe<Scalars['Int']>
  createdInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  cumulativeRewardClaimed_eq?: Maybe<Scalars['BigInt']>
  cumulativeRewardClaimed_gt?: Maybe<Scalars['BigInt']>
  cumulativeRewardClaimed_gte?: Maybe<Scalars['BigInt']>
  cumulativeRewardClaimed_in?: Maybe<Array<Scalars['BigInt']>>
  cumulativeRewardClaimed_isNull?: Maybe<Scalars['Boolean']>
  cumulativeRewardClaimed_lt?: Maybe<Scalars['BigInt']>
  cumulativeRewardClaimed_lte?: Maybe<Scalars['BigInt']>
  cumulativeRewardClaimed_not_eq?: Maybe<Scalars['BigInt']>
  cumulativeRewardClaimed_not_in?: Maybe<Array<Scalars['BigInt']>>
  description_contains?: Maybe<Scalars['String']>
  description_containsInsensitive?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_gt?: Maybe<Scalars['String']>
  description_gte?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_isNull?: Maybe<Scalars['Boolean']>
  description_lt?: Maybe<Scalars['String']>
  description_lte?: Maybe<Scalars['String']>
  description_not_contains?: Maybe<Scalars['String']>
  description_not_containsInsensitive?: Maybe<Scalars['String']>
  description_not_endsWith?: Maybe<Scalars['String']>
  description_not_eq?: Maybe<Scalars['String']>
  description_not_in?: Maybe<Array<Scalars['String']>>
  description_not_startsWith?: Maybe<Scalars['String']>
  description_startsWith?: Maybe<Scalars['String']>
  entryApp?: Maybe<AppWhereInput>
  entryApp_isNull?: Maybe<Scalars['Boolean']>
  followsNum_eq?: Maybe<Scalars['Int']>
  followsNum_gt?: Maybe<Scalars['Int']>
  followsNum_gte?: Maybe<Scalars['Int']>
  followsNum_in?: Maybe<Array<Scalars['Int']>>
  followsNum_isNull?: Maybe<Scalars['Boolean']>
  followsNum_lt?: Maybe<Scalars['Int']>
  followsNum_lte?: Maybe<Scalars['Int']>
  followsNum_not_eq?: Maybe<Scalars['Int']>
  followsNum_not_in?: Maybe<Array<Scalars['Int']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  isCensored_isNull?: Maybe<Scalars['Boolean']>
  isCensored_not_eq?: Maybe<Scalars['Boolean']>
  isExcluded_eq?: Maybe<Scalars['Boolean']>
  isExcluded_isNull?: Maybe<Scalars['Boolean']>
  isExcluded_not_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isPublic_isNull?: Maybe<Scalars['Boolean']>
  isPublic_not_eq?: Maybe<Scalars['Boolean']>
  language_contains?: Maybe<Scalars['String']>
  language_containsInsensitive?: Maybe<Scalars['String']>
  language_endsWith?: Maybe<Scalars['String']>
  language_eq?: Maybe<Scalars['String']>
  language_gt?: Maybe<Scalars['String']>
  language_gte?: Maybe<Scalars['String']>
  language_in?: Maybe<Array<Scalars['String']>>
  language_isNull?: Maybe<Scalars['Boolean']>
  language_lt?: Maybe<Scalars['String']>
  language_lte?: Maybe<Scalars['String']>
  language_not_contains?: Maybe<Scalars['String']>
  language_not_containsInsensitive?: Maybe<Scalars['String']>
  language_not_endsWith?: Maybe<Scalars['String']>
  language_not_eq?: Maybe<Scalars['String']>
  language_not_in?: Maybe<Array<Scalars['String']>>
  language_not_startsWith?: Maybe<Scalars['String']>
  language_startsWith?: Maybe<Scalars['String']>
  ownerMember?: Maybe<MembershipWhereInput>
  ownerMember_isNull?: Maybe<Scalars['Boolean']>
  rewardAccount_contains?: Maybe<Scalars['String']>
  rewardAccount_containsInsensitive?: Maybe<Scalars['String']>
  rewardAccount_endsWith?: Maybe<Scalars['String']>
  rewardAccount_eq?: Maybe<Scalars['String']>
  rewardAccount_gt?: Maybe<Scalars['String']>
  rewardAccount_gte?: Maybe<Scalars['String']>
  rewardAccount_in?: Maybe<Array<Scalars['String']>>
  rewardAccount_isNull?: Maybe<Scalars['Boolean']>
  rewardAccount_lt?: Maybe<Scalars['String']>
  rewardAccount_lte?: Maybe<Scalars['String']>
  rewardAccount_not_contains?: Maybe<Scalars['String']>
  rewardAccount_not_containsInsensitive?: Maybe<Scalars['String']>
  rewardAccount_not_endsWith?: Maybe<Scalars['String']>
  rewardAccount_not_eq?: Maybe<Scalars['String']>
  rewardAccount_not_in?: Maybe<Array<Scalars['String']>>
  rewardAccount_not_startsWith?: Maybe<Scalars['String']>
  rewardAccount_startsWith?: Maybe<Scalars['String']>
  title_contains?: Maybe<Scalars['String']>
  title_containsInsensitive?: Maybe<Scalars['String']>
  title_endsWith?: Maybe<Scalars['String']>
  title_eq?: Maybe<Scalars['String']>
  title_gt?: Maybe<Scalars['String']>
  title_gte?: Maybe<Scalars['String']>
  title_in?: Maybe<Array<Scalars['String']>>
  title_isNull?: Maybe<Scalars['Boolean']>
  title_lt?: Maybe<Scalars['String']>
  title_lte?: Maybe<Scalars['String']>
  title_not_contains?: Maybe<Scalars['String']>
  title_not_containsInsensitive?: Maybe<Scalars['String']>
  title_not_endsWith?: Maybe<Scalars['String']>
  title_not_eq?: Maybe<Scalars['String']>
  title_not_in?: Maybe<Array<Scalars['String']>>
  title_not_startsWith?: Maybe<Scalars['String']>
  title_startsWith?: Maybe<Scalars['String']>
  totalVideosCreated_eq?: Maybe<Scalars['Int']>
  totalVideosCreated_gt?: Maybe<Scalars['Int']>
  totalVideosCreated_gte?: Maybe<Scalars['Int']>
  totalVideosCreated_in?: Maybe<Array<Scalars['Int']>>
  totalVideosCreated_isNull?: Maybe<Scalars['Boolean']>
  totalVideosCreated_lt?: Maybe<Scalars['Int']>
  totalVideosCreated_lte?: Maybe<Scalars['Int']>
  totalVideosCreated_not_eq?: Maybe<Scalars['Int']>
  totalVideosCreated_not_in?: Maybe<Array<Scalars['Int']>>
  videoViewsNum_eq?: Maybe<Scalars['Int']>
  videoViewsNum_gt?: Maybe<Scalars['Int']>
  videoViewsNum_gte?: Maybe<Scalars['Int']>
  videoViewsNum_in?: Maybe<Array<Scalars['Int']>>
  videoViewsNum_isNull?: Maybe<Scalars['Boolean']>
  videoViewsNum_lt?: Maybe<Scalars['Int']>
  videoViewsNum_lte?: Maybe<Scalars['Int']>
  videoViewsNum_not_eq?: Maybe<Scalars['Int']>
  videoViewsNum_not_in?: Maybe<Array<Scalars['Int']>>
  videos_every?: Maybe<VideoWhereInput>
  videos_none?: Maybe<VideoWhereInput>
  videos_some?: Maybe<VideoWhereInput>
}

export type ChannelsConnection = {
  edges: Array<ChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelsSearchResult = {
  channel: Channel
  relevance: Scalars['Int']
}

export type Comment = {
  author: Membership
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  isEdited: Scalars['Boolean']
  isExcluded: Scalars['Boolean']
  parentComment?: Maybe<Comment>
  reactions: Array<CommentReaction>
  reactionsAndRepliesCount: Scalars['Int']
  reactionsCount: Scalars['Int']
  reactionsCountByReactionId?: Maybe<Array<CommentReactionsCountByReactionId>>
  repliesCount: Scalars['Int']
  status: CommentStatus
  text: Scalars['String']
  video: Video
}

export type CommentReactionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CommentReactionOrderByInput>>
  where?: Maybe<CommentReactionWhereInput>
}

export type CommentCreatedEventData = {
  comment: Comment
  text: Scalars['String']
}

export type CommentEdge = {
  cursor: Scalars['String']
  node: Comment
}

export enum CommentOrderByInput {
  AuthorControllerAccountAsc = 'author_controllerAccount_ASC',
  AuthorControllerAccountDesc = 'author_controllerAccount_DESC',
  AuthorCreatedAtAsc = 'author_createdAt_ASC',
  AuthorCreatedAtDesc = 'author_createdAt_DESC',
  AuthorHandleAsc = 'author_handle_ASC',
  AuthorHandleDesc = 'author_handle_DESC',
  AuthorIdAsc = 'author_id_ASC',
  AuthorIdDesc = 'author_id_DESC',
  AuthorTotalChannelsCreatedAsc = 'author_totalChannelsCreated_ASC',
  AuthorTotalChannelsCreatedDesc = 'author_totalChannelsCreated_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsEditedAsc = 'isEdited_ASC',
  IsEditedDesc = 'isEdited_DESC',
  IsExcludedAsc = 'isExcluded_ASC',
  IsExcludedDesc = 'isExcluded_DESC',
  ParentCommentCreatedAtAsc = 'parentComment_createdAt_ASC',
  ParentCommentCreatedAtDesc = 'parentComment_createdAt_DESC',
  ParentCommentIdAsc = 'parentComment_id_ASC',
  ParentCommentIdDesc = 'parentComment_id_DESC',
  ParentCommentIsEditedAsc = 'parentComment_isEdited_ASC',
  ParentCommentIsEditedDesc = 'parentComment_isEdited_DESC',
  ParentCommentIsExcludedAsc = 'parentComment_isExcluded_ASC',
  ParentCommentIsExcludedDesc = 'parentComment_isExcluded_DESC',
  ParentCommentReactionsAndRepliesCountAsc = 'parentComment_reactionsAndRepliesCount_ASC',
  ParentCommentReactionsAndRepliesCountDesc = 'parentComment_reactionsAndRepliesCount_DESC',
  ParentCommentReactionsCountAsc = 'parentComment_reactionsCount_ASC',
  ParentCommentReactionsCountDesc = 'parentComment_reactionsCount_DESC',
  ParentCommentRepliesCountAsc = 'parentComment_repliesCount_ASC',
  ParentCommentRepliesCountDesc = 'parentComment_repliesCount_DESC',
  ParentCommentStatusAsc = 'parentComment_status_ASC',
  ParentCommentStatusDesc = 'parentComment_status_DESC',
  ParentCommentTextAsc = 'parentComment_text_ASC',
  ParentCommentTextDesc = 'parentComment_text_DESC',
  ReactionsAndRepliesCountAsc = 'reactionsAndRepliesCount_ASC',
  ReactionsAndRepliesCountDesc = 'reactionsAndRepliesCount_DESC',
  ReactionsCountAsc = 'reactionsCount_ASC',
  ReactionsCountDesc = 'reactionsCount_DESC',
  RepliesCountAsc = 'repliesCount_ASC',
  RepliesCountDesc = 'repliesCount_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  TextAsc = 'text_ASC',
  TextDesc = 'text_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type CommentReaction = {
  comment: Comment
  id: Scalars['String']
  member: Membership
  reactionId: Scalars['Int']
  video: Video
}

export type CommentReactionEdge = {
  cursor: Scalars['String']
  node: CommentReaction
}

export enum CommentReactionOrderByInput {
  CommentCreatedAtAsc = 'comment_createdAt_ASC',
  CommentCreatedAtDesc = 'comment_createdAt_DESC',
  CommentIdAsc = 'comment_id_ASC',
  CommentIdDesc = 'comment_id_DESC',
  CommentIsEditedAsc = 'comment_isEdited_ASC',
  CommentIsEditedDesc = 'comment_isEdited_DESC',
  CommentIsExcludedAsc = 'comment_isExcluded_ASC',
  CommentIsExcludedDesc = 'comment_isExcluded_DESC',
  CommentReactionsAndRepliesCountAsc = 'comment_reactionsAndRepliesCount_ASC',
  CommentReactionsAndRepliesCountDesc = 'comment_reactionsAndRepliesCount_DESC',
  CommentReactionsCountAsc = 'comment_reactionsCount_ASC',
  CommentReactionsCountDesc = 'comment_reactionsCount_DESC',
  CommentRepliesCountAsc = 'comment_repliesCount_ASC',
  CommentRepliesCountDesc = 'comment_repliesCount_DESC',
  CommentStatusAsc = 'comment_status_ASC',
  CommentStatusDesc = 'comment_status_DESC',
  CommentTextAsc = 'comment_text_ASC',
  CommentTextDesc = 'comment_text_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  ReactionIdAsc = 'reactionId_ASC',
  ReactionIdDesc = 'reactionId_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type CommentReactionWhereInput = {
  AND?: Maybe<Array<CommentReactionWhereInput>>
  OR?: Maybe<Array<CommentReactionWhereInput>>
  comment?: Maybe<CommentWhereInput>
  comment_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
  reactionId_eq?: Maybe<Scalars['Int']>
  reactionId_gt?: Maybe<Scalars['Int']>
  reactionId_gte?: Maybe<Scalars['Int']>
  reactionId_in?: Maybe<Array<Scalars['Int']>>
  reactionId_isNull?: Maybe<Scalars['Boolean']>
  reactionId_lt?: Maybe<Scalars['Int']>
  reactionId_lte?: Maybe<Scalars['Int']>
  reactionId_not_eq?: Maybe<Scalars['Int']>
  reactionId_not_in?: Maybe<Array<Scalars['Int']>>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type CommentReactionsConnection = {
  edges: Array<CommentReactionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type CommentReactionsCountByReactionId = {
  count: Scalars['Int']
  reactionId: Scalars['Int']
}

export enum CommentStatus {
  Deleted = 'DELETED',
  Moderated = 'MODERATED',
  Visible = 'VISIBLE',
}

export type CommentTextUpdatedEventData = {
  comment: Comment
  newText: Scalars['String']
}

export type CommentWhereInput = {
  AND?: Maybe<Array<CommentWhereInput>>
  OR?: Maybe<Array<CommentWhereInput>>
  author?: Maybe<MembershipWhereInput>
  author_isNull?: Maybe<Scalars['Boolean']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isEdited_eq?: Maybe<Scalars['Boolean']>
  isEdited_isNull?: Maybe<Scalars['Boolean']>
  isEdited_not_eq?: Maybe<Scalars['Boolean']>
  isExcluded_eq?: Maybe<Scalars['Boolean']>
  isExcluded_isNull?: Maybe<Scalars['Boolean']>
  isExcluded_not_eq?: Maybe<Scalars['Boolean']>
  parentComment?: Maybe<CommentWhereInput>
  parentComment_isNull?: Maybe<Scalars['Boolean']>
  reactionsAndRepliesCount_eq?: Maybe<Scalars['Int']>
  reactionsAndRepliesCount_gt?: Maybe<Scalars['Int']>
  reactionsAndRepliesCount_gte?: Maybe<Scalars['Int']>
  reactionsAndRepliesCount_in?: Maybe<Array<Scalars['Int']>>
  reactionsAndRepliesCount_isNull?: Maybe<Scalars['Boolean']>
  reactionsAndRepliesCount_lt?: Maybe<Scalars['Int']>
  reactionsAndRepliesCount_lte?: Maybe<Scalars['Int']>
  reactionsAndRepliesCount_not_eq?: Maybe<Scalars['Int']>
  reactionsAndRepliesCount_not_in?: Maybe<Array<Scalars['Int']>>
  reactionsCountByReactionId_isNull?: Maybe<Scalars['Boolean']>
  reactionsCount_eq?: Maybe<Scalars['Int']>
  reactionsCount_gt?: Maybe<Scalars['Int']>
  reactionsCount_gte?: Maybe<Scalars['Int']>
  reactionsCount_in?: Maybe<Array<Scalars['Int']>>
  reactionsCount_isNull?: Maybe<Scalars['Boolean']>
  reactionsCount_lt?: Maybe<Scalars['Int']>
  reactionsCount_lte?: Maybe<Scalars['Int']>
  reactionsCount_not_eq?: Maybe<Scalars['Int']>
  reactionsCount_not_in?: Maybe<Array<Scalars['Int']>>
  reactions_every?: Maybe<CommentReactionWhereInput>
  reactions_none?: Maybe<CommentReactionWhereInput>
  reactions_some?: Maybe<CommentReactionWhereInput>
  repliesCount_eq?: Maybe<Scalars['Int']>
  repliesCount_gt?: Maybe<Scalars['Int']>
  repliesCount_gte?: Maybe<Scalars['Int']>
  repliesCount_in?: Maybe<Array<Scalars['Int']>>
  repliesCount_isNull?: Maybe<Scalars['Boolean']>
  repliesCount_lt?: Maybe<Scalars['Int']>
  repliesCount_lte?: Maybe<Scalars['Int']>
  repliesCount_not_eq?: Maybe<Scalars['Int']>
  repliesCount_not_in?: Maybe<Array<Scalars['Int']>>
  status_eq?: Maybe<CommentStatus>
  status_in?: Maybe<Array<CommentStatus>>
  status_isNull?: Maybe<Scalars['Boolean']>
  status_not_eq?: Maybe<CommentStatus>
  status_not_in?: Maybe<Array<CommentStatus>>
  text_contains?: Maybe<Scalars['String']>
  text_containsInsensitive?: Maybe<Scalars['String']>
  text_endsWith?: Maybe<Scalars['String']>
  text_eq?: Maybe<Scalars['String']>
  text_gt?: Maybe<Scalars['String']>
  text_gte?: Maybe<Scalars['String']>
  text_in?: Maybe<Array<Scalars['String']>>
  text_isNull?: Maybe<Scalars['Boolean']>
  text_lt?: Maybe<Scalars['String']>
  text_lte?: Maybe<Scalars['String']>
  text_not_contains?: Maybe<Scalars['String']>
  text_not_containsInsensitive?: Maybe<Scalars['String']>
  text_not_endsWith?: Maybe<Scalars['String']>
  text_not_eq?: Maybe<Scalars['String']>
  text_not_in?: Maybe<Array<Scalars['String']>>
  text_not_startsWith?: Maybe<Scalars['String']>
  text_startsWith?: Maybe<Scalars['String']>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type CommentsConnection = {
  edges: Array<CommentEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ContentActor = ContentActorCurator | ContentActorLead | ContentActorMember

export type ContentActorCurator = {
  curator: Curator
}

export type ContentActorLead = {
  phantom?: Maybe<Scalars['Int']>
}

export type ContentActorMember = {
  member: Membership
}

export type ContentActorWhereInput = {
  curator?: Maybe<CuratorWhereInput>
  curator_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
  phantom_eq?: Maybe<Scalars['Int']>
  phantom_gt?: Maybe<Scalars['Int']>
  phantom_gte?: Maybe<Scalars['Int']>
  phantom_in?: Maybe<Array<Scalars['Int']>>
  phantom_isNull?: Maybe<Scalars['Boolean']>
  phantom_lt?: Maybe<Scalars['Int']>
  phantom_lte?: Maybe<Scalars['Int']>
  phantom_not_eq?: Maybe<Scalars['Int']>
  phantom_not_in?: Maybe<Array<Scalars['Int']>>
}

export enum Continent {
  Af = 'AF',
  An = 'AN',
  As = 'AS',
  Eu = 'EU',
  Na = 'NA',
  Oc = 'OC',
  Sa = 'SA',
}

export type Curator = {
  id: Scalars['String']
}

export type CuratorEdge = {
  cursor: Scalars['String']
  node: Curator
}

export type CuratorGroup = {
  id: Scalars['String']
  isActive: Scalars['Boolean']
}

export type CuratorGroupEdge = {
  cursor: Scalars['String']
  node: CuratorGroup
}

export enum CuratorGroupOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
}

export type CuratorGroupWhereInput = {
  AND?: Maybe<Array<CuratorGroupWhereInput>>
  OR?: Maybe<Array<CuratorGroupWhereInput>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isActive_eq?: Maybe<Scalars['Boolean']>
  isActive_isNull?: Maybe<Scalars['Boolean']>
  isActive_not_eq?: Maybe<Scalars['Boolean']>
}

export type CuratorGroupsConnection = {
  edges: Array<CuratorGroupEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum CuratorOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type CuratorWhereInput = {
  AND?: Maybe<Array<CuratorWhereInput>>
  OR?: Maybe<Array<CuratorWhereInput>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
}

export type CuratorsConnection = {
  edges: Array<CuratorEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DataObjectType =
  | DataObjectTypeChannelAvatar
  | DataObjectTypeChannelCoverPhoto
  | DataObjectTypeChannelPayoutsPayload
  | DataObjectTypeVideoMedia
  | DataObjectTypeVideoSubtitle
  | DataObjectTypeVideoThumbnail

export type DataObjectTypeChannelAvatar = {
  channel: Channel
}

export type DataObjectTypeChannelCoverPhoto = {
  channel: Channel
}

export type DataObjectTypeChannelPayoutsPayload = {
  phantom?: Maybe<Scalars['Int']>
}

export type DataObjectTypeVideoMedia = {
  video: Video
}

export type DataObjectTypeVideoSubtitle = {
  subtitle: VideoSubtitle
  video: Video
}

export type DataObjectTypeVideoThumbnail = {
  video: Video
}

export type DataObjectTypeWhereInput = {
  channel?: Maybe<ChannelWhereInput>
  channel_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  phantom_eq?: Maybe<Scalars['Int']>
  phantom_gt?: Maybe<Scalars['Int']>
  phantom_gte?: Maybe<Scalars['Int']>
  phantom_in?: Maybe<Array<Scalars['Int']>>
  phantom_isNull?: Maybe<Scalars['Boolean']>
  phantom_lt?: Maybe<Scalars['Int']>
  phantom_lte?: Maybe<Scalars['Int']>
  phantom_not_eq?: Maybe<Scalars['Int']>
  phantom_not_in?: Maybe<Array<Scalars['Int']>>
  subtitle?: Maybe<VideoSubtitleWhereInput>
  subtitle_isNull?: Maybe<Scalars['Boolean']>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type DistributionBucket = {
  acceptingNewBags: Scalars['Boolean']
  bags: Array<DistributionBucketBag>
  bucketIndex: Scalars['Int']
  distributing: Scalars['Boolean']
  family: DistributionBucketFamily
  id: Scalars['String']
  operators: Array<DistributionBucketOperator>
}

export type DistributionBucketBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketBagOrderByInput>>
  where?: Maybe<DistributionBucketBagWhereInput>
}

export type DistributionBucketOperatorsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: Maybe<DistributionBucketOperatorWhereInput>
}

export type DistributionBucketBag = {
  bag: StorageBag
  distributionBucket: DistributionBucket
  id: Scalars['String']
}

export type DistributionBucketBagEdge = {
  cursor: Scalars['String']
  node: DistributionBucketBag
}

export enum DistributionBucketBagOrderByInput {
  BagIdAsc = 'bag_id_ASC',
  BagIdDesc = 'bag_id_DESC',
  DistributionBucketAcceptingNewBagsAsc = 'distributionBucket_acceptingNewBags_ASC',
  DistributionBucketAcceptingNewBagsDesc = 'distributionBucket_acceptingNewBags_DESC',
  DistributionBucketBucketIndexAsc = 'distributionBucket_bucketIndex_ASC',
  DistributionBucketBucketIndexDesc = 'distributionBucket_bucketIndex_DESC',
  DistributionBucketDistributingAsc = 'distributionBucket_distributing_ASC',
  DistributionBucketDistributingDesc = 'distributionBucket_distributing_DESC',
  DistributionBucketIdAsc = 'distributionBucket_id_ASC',
  DistributionBucketIdDesc = 'distributionBucket_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type DistributionBucketBagWhereInput = {
  AND?: Maybe<Array<DistributionBucketBagWhereInput>>
  OR?: Maybe<Array<DistributionBucketBagWhereInput>>
  bag?: Maybe<StorageBagWhereInput>
  bag_isNull?: Maybe<Scalars['Boolean']>
  distributionBucket?: Maybe<DistributionBucketWhereInput>
  distributionBucket_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
}

export type DistributionBucketBagsConnection = {
  edges: Array<DistributionBucketBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketEdge = {
  cursor: Scalars['String']
  node: DistributionBucket
}

export type DistributionBucketFamiliesConnection = {
  edges: Array<DistributionBucketFamilyEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamily = {
  buckets: Array<DistributionBucket>
  id: Scalars['String']
  metadata?: Maybe<DistributionBucketFamilyMetadata>
}

export type DistributionBucketFamilyBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOrderByInput>>
  where?: Maybe<DistributionBucketWhereInput>
}

export type DistributionBucketFamilyEdge = {
  cursor: Scalars['String']
  node: DistributionBucketFamily
}

export type DistributionBucketFamilyMetadata = {
  areas?: Maybe<Array<GeographicalArea>>
  description?: Maybe<Scalars['String']>
  family: DistributionBucketFamily
  id: Scalars['String']
  latencyTestTargets?: Maybe<Array<Maybe<Scalars['String']>>>
  region?: Maybe<Scalars['String']>
}

export type DistributionBucketFamilyMetadataConnection = {
  edges: Array<DistributionBucketFamilyMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamilyMetadataEdge = {
  cursor: Scalars['String']
  node: DistributionBucketFamilyMetadata
}

export enum DistributionBucketFamilyMetadataOrderByInput {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  FamilyIdAsc = 'family_id_ASC',
  FamilyIdDesc = 'family_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  RegionAsc = 'region_ASC',
  RegionDesc = 'region_DESC',
}

export type DistributionBucketFamilyMetadataWhereInput = {
  AND?: Maybe<Array<DistributionBucketFamilyMetadataWhereInput>>
  OR?: Maybe<Array<DistributionBucketFamilyMetadataWhereInput>>
  areas_isNull?: Maybe<Scalars['Boolean']>
  description_contains?: Maybe<Scalars['String']>
  description_containsInsensitive?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_gt?: Maybe<Scalars['String']>
  description_gte?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_isNull?: Maybe<Scalars['Boolean']>
  description_lt?: Maybe<Scalars['String']>
  description_lte?: Maybe<Scalars['String']>
  description_not_contains?: Maybe<Scalars['String']>
  description_not_containsInsensitive?: Maybe<Scalars['String']>
  description_not_endsWith?: Maybe<Scalars['String']>
  description_not_eq?: Maybe<Scalars['String']>
  description_not_in?: Maybe<Array<Scalars['String']>>
  description_not_startsWith?: Maybe<Scalars['String']>
  description_startsWith?: Maybe<Scalars['String']>
  family?: Maybe<DistributionBucketFamilyWhereInput>
  family_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  latencyTestTargets_containsAll?: Maybe<Array<Maybe<Scalars['String']>>>
  latencyTestTargets_containsAny?: Maybe<Array<Maybe<Scalars['String']>>>
  latencyTestTargets_containsNone?: Maybe<Array<Maybe<Scalars['String']>>>
  latencyTestTargets_isNull?: Maybe<Scalars['Boolean']>
  region_contains?: Maybe<Scalars['String']>
  region_containsInsensitive?: Maybe<Scalars['String']>
  region_endsWith?: Maybe<Scalars['String']>
  region_eq?: Maybe<Scalars['String']>
  region_gt?: Maybe<Scalars['String']>
  region_gte?: Maybe<Scalars['String']>
  region_in?: Maybe<Array<Scalars['String']>>
  region_isNull?: Maybe<Scalars['Boolean']>
  region_lt?: Maybe<Scalars['String']>
  region_lte?: Maybe<Scalars['String']>
  region_not_contains?: Maybe<Scalars['String']>
  region_not_containsInsensitive?: Maybe<Scalars['String']>
  region_not_endsWith?: Maybe<Scalars['String']>
  region_not_eq?: Maybe<Scalars['String']>
  region_not_in?: Maybe<Array<Scalars['String']>>
  region_not_startsWith?: Maybe<Scalars['String']>
  region_startsWith?: Maybe<Scalars['String']>
}

export enum DistributionBucketFamilyOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataDescriptionAsc = 'metadata_description_ASC',
  MetadataDescriptionDesc = 'metadata_description_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataRegionAsc = 'metadata_region_ASC',
  MetadataRegionDesc = 'metadata_region_DESC',
}

export type DistributionBucketFamilyWhereInput = {
  AND?: Maybe<Array<DistributionBucketFamilyWhereInput>>
  OR?: Maybe<Array<DistributionBucketFamilyWhereInput>>
  buckets_every?: Maybe<DistributionBucketWhereInput>
  buckets_none?: Maybe<DistributionBucketWhereInput>
  buckets_some?: Maybe<DistributionBucketWhereInput>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  metadata?: Maybe<DistributionBucketFamilyMetadataWhereInput>
  metadata_isNull?: Maybe<Scalars['Boolean']>
}

export type DistributionBucketOperator = {
  distributionBucket: DistributionBucket
  id: Scalars['String']
  metadata?: Maybe<DistributionBucketOperatorMetadata>
  status: DistributionBucketOperatorStatus
  workerId: Scalars['Int']
}

export type DistributionBucketOperatorEdge = {
  cursor: Scalars['String']
  node: DistributionBucketOperator
}

export type DistributionBucketOperatorMetadata = {
  distirbutionBucketOperator: DistributionBucketOperator
  extra?: Maybe<Scalars['String']>
  id: Scalars['String']
  nodeEndpoint?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadata>
}

export type DistributionBucketOperatorMetadataConnection = {
  edges: Array<DistributionBucketOperatorMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketOperatorMetadataEdge = {
  cursor: Scalars['String']
  node: DistributionBucketOperatorMetadata
}

export enum DistributionBucketOperatorMetadataOrderByInput {
  DistirbutionBucketOperatorIdAsc = 'distirbutionBucketOperator_id_ASC',
  DistirbutionBucketOperatorIdDesc = 'distirbutionBucketOperator_id_DESC',
  DistirbutionBucketOperatorStatusAsc = 'distirbutionBucketOperator_status_ASC',
  DistirbutionBucketOperatorStatusDesc = 'distirbutionBucketOperator_status_DESC',
  DistirbutionBucketOperatorWorkerIdAsc = 'distirbutionBucketOperator_workerId_ASC',
  DistirbutionBucketOperatorWorkerIdDesc = 'distirbutionBucketOperator_workerId_DESC',
  ExtraAsc = 'extra_ASC',
  ExtraDesc = 'extra_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeEndpointAsc = 'nodeEndpoint_ASC',
  NodeEndpointDesc = 'nodeEndpoint_DESC',
  NodeLocationCityAsc = 'nodeLocation_city_ASC',
  NodeLocationCityDesc = 'nodeLocation_city_DESC',
  NodeLocationCountryCodeAsc = 'nodeLocation_countryCode_ASC',
  NodeLocationCountryCodeDesc = 'nodeLocation_countryCode_DESC',
}

export type DistributionBucketOperatorMetadataWhereInput = {
  AND?: Maybe<Array<DistributionBucketOperatorMetadataWhereInput>>
  OR?: Maybe<Array<DistributionBucketOperatorMetadataWhereInput>>
  distirbutionBucketOperator?: Maybe<DistributionBucketOperatorWhereInput>
  distirbutionBucketOperator_isNull?: Maybe<Scalars['Boolean']>
  extra_contains?: Maybe<Scalars['String']>
  extra_containsInsensitive?: Maybe<Scalars['String']>
  extra_endsWith?: Maybe<Scalars['String']>
  extra_eq?: Maybe<Scalars['String']>
  extra_gt?: Maybe<Scalars['String']>
  extra_gte?: Maybe<Scalars['String']>
  extra_in?: Maybe<Array<Scalars['String']>>
  extra_isNull?: Maybe<Scalars['Boolean']>
  extra_lt?: Maybe<Scalars['String']>
  extra_lte?: Maybe<Scalars['String']>
  extra_not_contains?: Maybe<Scalars['String']>
  extra_not_containsInsensitive?: Maybe<Scalars['String']>
  extra_not_endsWith?: Maybe<Scalars['String']>
  extra_not_eq?: Maybe<Scalars['String']>
  extra_not_in?: Maybe<Array<Scalars['String']>>
  extra_not_startsWith?: Maybe<Scalars['String']>
  extra_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  nodeEndpoint_contains?: Maybe<Scalars['String']>
  nodeEndpoint_containsInsensitive?: Maybe<Scalars['String']>
  nodeEndpoint_endsWith?: Maybe<Scalars['String']>
  nodeEndpoint_eq?: Maybe<Scalars['String']>
  nodeEndpoint_gt?: Maybe<Scalars['String']>
  nodeEndpoint_gte?: Maybe<Scalars['String']>
  nodeEndpoint_in?: Maybe<Array<Scalars['String']>>
  nodeEndpoint_isNull?: Maybe<Scalars['Boolean']>
  nodeEndpoint_lt?: Maybe<Scalars['String']>
  nodeEndpoint_lte?: Maybe<Scalars['String']>
  nodeEndpoint_not_contains?: Maybe<Scalars['String']>
  nodeEndpoint_not_containsInsensitive?: Maybe<Scalars['String']>
  nodeEndpoint_not_endsWith?: Maybe<Scalars['String']>
  nodeEndpoint_not_eq?: Maybe<Scalars['String']>
  nodeEndpoint_not_in?: Maybe<Array<Scalars['String']>>
  nodeEndpoint_not_startsWith?: Maybe<Scalars['String']>
  nodeEndpoint_startsWith?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadataWhereInput>
  nodeLocation_isNull?: Maybe<Scalars['Boolean']>
}

export enum DistributionBucketOperatorOrderByInput {
  DistributionBucketAcceptingNewBagsAsc = 'distributionBucket_acceptingNewBags_ASC',
  DistributionBucketAcceptingNewBagsDesc = 'distributionBucket_acceptingNewBags_DESC',
  DistributionBucketBucketIndexAsc = 'distributionBucket_bucketIndex_ASC',
  DistributionBucketBucketIndexDesc = 'distributionBucket_bucketIndex_DESC',
  DistributionBucketDistributingAsc = 'distributionBucket_distributing_ASC',
  DistributionBucketDistributingDesc = 'distributionBucket_distributing_DESC',
  DistributionBucketIdAsc = 'distributionBucket_id_ASC',
  DistributionBucketIdDesc = 'distributionBucket_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataExtraAsc = 'metadata_extra_ASC',
  MetadataExtraDesc = 'metadata_extra_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataNodeEndpointAsc = 'metadata_nodeEndpoint_ASC',
  MetadataNodeEndpointDesc = 'metadata_nodeEndpoint_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  WorkerIdAsc = 'workerId_ASC',
  WorkerIdDesc = 'workerId_DESC',
}

export enum DistributionBucketOperatorStatus {
  Active = 'ACTIVE',
  Invited = 'INVITED',
}

export type DistributionBucketOperatorWhereInput = {
  AND?: Maybe<Array<DistributionBucketOperatorWhereInput>>
  OR?: Maybe<Array<DistributionBucketOperatorWhereInput>>
  distributionBucket?: Maybe<DistributionBucketWhereInput>
  distributionBucket_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  metadata?: Maybe<DistributionBucketOperatorMetadataWhereInput>
  metadata_isNull?: Maybe<Scalars['Boolean']>
  status_eq?: Maybe<DistributionBucketOperatorStatus>
  status_in?: Maybe<Array<DistributionBucketOperatorStatus>>
  status_isNull?: Maybe<Scalars['Boolean']>
  status_not_eq?: Maybe<DistributionBucketOperatorStatus>
  status_not_in?: Maybe<Array<DistributionBucketOperatorStatus>>
  workerId_eq?: Maybe<Scalars['Int']>
  workerId_gt?: Maybe<Scalars['Int']>
  workerId_gte?: Maybe<Scalars['Int']>
  workerId_in?: Maybe<Array<Scalars['Int']>>
  workerId_isNull?: Maybe<Scalars['Boolean']>
  workerId_lt?: Maybe<Scalars['Int']>
  workerId_lte?: Maybe<Scalars['Int']>
  workerId_not_eq?: Maybe<Scalars['Int']>
  workerId_not_in?: Maybe<Array<Scalars['Int']>>
}

export type DistributionBucketOperatorsConnection = {
  edges: Array<DistributionBucketOperatorEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum DistributionBucketOrderByInput {
  AcceptingNewBagsAsc = 'acceptingNewBags_ASC',
  AcceptingNewBagsDesc = 'acceptingNewBags_DESC',
  BucketIndexAsc = 'bucketIndex_ASC',
  BucketIndexDesc = 'bucketIndex_DESC',
  DistributingAsc = 'distributing_ASC',
  DistributingDesc = 'distributing_DESC',
  FamilyIdAsc = 'family_id_ASC',
  FamilyIdDesc = 'family_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type DistributionBucketWhereInput = {
  AND?: Maybe<Array<DistributionBucketWhereInput>>
  OR?: Maybe<Array<DistributionBucketWhereInput>>
  acceptingNewBags_eq?: Maybe<Scalars['Boolean']>
  acceptingNewBags_isNull?: Maybe<Scalars['Boolean']>
  acceptingNewBags_not_eq?: Maybe<Scalars['Boolean']>
  bags_every?: Maybe<DistributionBucketBagWhereInput>
  bags_none?: Maybe<DistributionBucketBagWhereInput>
  bags_some?: Maybe<DistributionBucketBagWhereInput>
  bucketIndex_eq?: Maybe<Scalars['Int']>
  bucketIndex_gt?: Maybe<Scalars['Int']>
  bucketIndex_gte?: Maybe<Scalars['Int']>
  bucketIndex_in?: Maybe<Array<Scalars['Int']>>
  bucketIndex_isNull?: Maybe<Scalars['Boolean']>
  bucketIndex_lt?: Maybe<Scalars['Int']>
  bucketIndex_lte?: Maybe<Scalars['Int']>
  bucketIndex_not_eq?: Maybe<Scalars['Int']>
  bucketIndex_not_in?: Maybe<Array<Scalars['Int']>>
  distributing_eq?: Maybe<Scalars['Boolean']>
  distributing_isNull?: Maybe<Scalars['Boolean']>
  distributing_not_eq?: Maybe<Scalars['Boolean']>
  family?: Maybe<DistributionBucketFamilyWhereInput>
  family_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  operators_every?: Maybe<DistributionBucketOperatorWhereInput>
  operators_none?: Maybe<DistributionBucketOperatorWhereInput>
  operators_some?: Maybe<DistributionBucketOperatorWhereInput>
}

export type DistributionBucketsConnection = {
  edges: Array<DistributionBucketEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type EnglishAuctionSettledEventData = {
  previousNftOwner: NftOwner
  winningBid: Bid
}

export type EnglishAuctionStartedEventData = {
  actor: ContentActor
  auction: Auction
  nftOwner: NftOwner
}

export type EntityReportInfo = {
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
  reporterIp: Scalars['String']
}

export type Event = {
  data: EventData
  id: Scalars['String']
  inBlock: Scalars['Int']
  inExtrinsic?: Maybe<Scalars['String']>
  indexInBlock: Scalars['Int']
  timestamp: Scalars['DateTime']
}

export type EventData =
  | AuctionBidCanceledEventData
  | AuctionBidMadeEventData
  | AuctionCanceledEventData
  | BidMadeCompletingAuctionEventData
  | BuyNowCanceledEventData
  | BuyNowPriceUpdatedEventData
  | ChannelFundsWithdrawnEventData
  | ChannelPaymentMadeEventData
  | ChannelPayoutsUpdatedEventData
  | ChannelRewardClaimedAndWithdrawnEventData
  | ChannelRewardClaimedEventData
  | CommentCreatedEventData
  | CommentTextUpdatedEventData
  | EnglishAuctionSettledEventData
  | EnglishAuctionStartedEventData
  | MemberBannedFromChannelEventData
  | MetaprotocolTransactionStatusEventData
  | NftBoughtEventData
  | NftIssuedEventData
  | NftSellOrderMadeEventData
  | OpenAuctionBidAcceptedEventData
  | OpenAuctionStartedEventData

export type EventDataWhereInput = {
  account_contains?: Maybe<Scalars['String']>
  account_containsInsensitive?: Maybe<Scalars['String']>
  account_endsWith?: Maybe<Scalars['String']>
  account_eq?: Maybe<Scalars['String']>
  account_gt?: Maybe<Scalars['String']>
  account_gte?: Maybe<Scalars['String']>
  account_in?: Maybe<Array<Scalars['String']>>
  account_isNull?: Maybe<Scalars['Boolean']>
  account_lt?: Maybe<Scalars['String']>
  account_lte?: Maybe<Scalars['String']>
  account_not_contains?: Maybe<Scalars['String']>
  account_not_containsInsensitive?: Maybe<Scalars['String']>
  account_not_endsWith?: Maybe<Scalars['String']>
  account_not_eq?: Maybe<Scalars['String']>
  account_not_in?: Maybe<Array<Scalars['String']>>
  account_not_startsWith?: Maybe<Scalars['String']>
  account_startsWith?: Maybe<Scalars['String']>
  action_eq?: Maybe<Scalars['Boolean']>
  action_isNull?: Maybe<Scalars['Boolean']>
  action_not_eq?: Maybe<Scalars['Boolean']>
  actor?: Maybe<ContentActorWhereInput>
  actor_isNull?: Maybe<Scalars['Boolean']>
  amount_eq?: Maybe<Scalars['BigInt']>
  amount_gt?: Maybe<Scalars['BigInt']>
  amount_gte?: Maybe<Scalars['BigInt']>
  amount_in?: Maybe<Array<Scalars['BigInt']>>
  amount_isNull?: Maybe<Scalars['Boolean']>
  amount_lt?: Maybe<Scalars['BigInt']>
  amount_lte?: Maybe<Scalars['BigInt']>
  amount_not_eq?: Maybe<Scalars['BigInt']>
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>
  auction?: Maybe<AuctionWhereInput>
  auction_isNull?: Maybe<Scalars['Boolean']>
  bid?: Maybe<BidWhereInput>
  bid_isNull?: Maybe<Scalars['Boolean']>
  buyer?: Maybe<MembershipWhereInput>
  buyer_isNull?: Maybe<Scalars['Boolean']>
  channel?: Maybe<ChannelWhereInput>
  channelCashoutsEnabled_eq?: Maybe<Scalars['Boolean']>
  channelCashoutsEnabled_isNull?: Maybe<Scalars['Boolean']>
  channelCashoutsEnabled_not_eq?: Maybe<Scalars['Boolean']>
  channel_isNull?: Maybe<Scalars['Boolean']>
  comment?: Maybe<CommentWhereInput>
  comment_isNull?: Maybe<Scalars['Boolean']>
  commitment_contains?: Maybe<Scalars['String']>
  commitment_containsInsensitive?: Maybe<Scalars['String']>
  commitment_endsWith?: Maybe<Scalars['String']>
  commitment_eq?: Maybe<Scalars['String']>
  commitment_gt?: Maybe<Scalars['String']>
  commitment_gte?: Maybe<Scalars['String']>
  commitment_in?: Maybe<Array<Scalars['String']>>
  commitment_isNull?: Maybe<Scalars['Boolean']>
  commitment_lt?: Maybe<Scalars['String']>
  commitment_lte?: Maybe<Scalars['String']>
  commitment_not_contains?: Maybe<Scalars['String']>
  commitment_not_containsInsensitive?: Maybe<Scalars['String']>
  commitment_not_endsWith?: Maybe<Scalars['String']>
  commitment_not_eq?: Maybe<Scalars['String']>
  commitment_not_in?: Maybe<Array<Scalars['String']>>
  commitment_not_startsWith?: Maybe<Scalars['String']>
  commitment_startsWith?: Maybe<Scalars['String']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  maxCashoutAllowed_eq?: Maybe<Scalars['BigInt']>
  maxCashoutAllowed_gt?: Maybe<Scalars['BigInt']>
  maxCashoutAllowed_gte?: Maybe<Scalars['BigInt']>
  maxCashoutAllowed_in?: Maybe<Array<Scalars['BigInt']>>
  maxCashoutAllowed_isNull?: Maybe<Scalars['Boolean']>
  maxCashoutAllowed_lt?: Maybe<Scalars['BigInt']>
  maxCashoutAllowed_lte?: Maybe<Scalars['BigInt']>
  maxCashoutAllowed_not_eq?: Maybe<Scalars['BigInt']>
  maxCashoutAllowed_not_in?: Maybe<Array<Scalars['BigInt']>>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
  minCashoutAllowed_eq?: Maybe<Scalars['BigInt']>
  minCashoutAllowed_gt?: Maybe<Scalars['BigInt']>
  minCashoutAllowed_gte?: Maybe<Scalars['BigInt']>
  minCashoutAllowed_in?: Maybe<Array<Scalars['BigInt']>>
  minCashoutAllowed_isNull?: Maybe<Scalars['Boolean']>
  minCashoutAllowed_lt?: Maybe<Scalars['BigInt']>
  minCashoutAllowed_lte?: Maybe<Scalars['BigInt']>
  minCashoutAllowed_not_eq?: Maybe<Scalars['BigInt']>
  minCashoutAllowed_not_in?: Maybe<Array<Scalars['BigInt']>>
  newPrice_eq?: Maybe<Scalars['BigInt']>
  newPrice_gt?: Maybe<Scalars['BigInt']>
  newPrice_gte?: Maybe<Scalars['BigInt']>
  newPrice_in?: Maybe<Array<Scalars['BigInt']>>
  newPrice_isNull?: Maybe<Scalars['Boolean']>
  newPrice_lt?: Maybe<Scalars['BigInt']>
  newPrice_lte?: Maybe<Scalars['BigInt']>
  newPrice_not_eq?: Maybe<Scalars['BigInt']>
  newPrice_not_in?: Maybe<Array<Scalars['BigInt']>>
  newText_contains?: Maybe<Scalars['String']>
  newText_containsInsensitive?: Maybe<Scalars['String']>
  newText_endsWith?: Maybe<Scalars['String']>
  newText_eq?: Maybe<Scalars['String']>
  newText_gt?: Maybe<Scalars['String']>
  newText_gte?: Maybe<Scalars['String']>
  newText_in?: Maybe<Array<Scalars['String']>>
  newText_isNull?: Maybe<Scalars['Boolean']>
  newText_lt?: Maybe<Scalars['String']>
  newText_lte?: Maybe<Scalars['String']>
  newText_not_contains?: Maybe<Scalars['String']>
  newText_not_containsInsensitive?: Maybe<Scalars['String']>
  newText_not_endsWith?: Maybe<Scalars['String']>
  newText_not_eq?: Maybe<Scalars['String']>
  newText_not_in?: Maybe<Array<Scalars['String']>>
  newText_not_startsWith?: Maybe<Scalars['String']>
  newText_startsWith?: Maybe<Scalars['String']>
  nft?: Maybe<OwnedNftWhereInput>
  nftOwner?: Maybe<NftOwnerWhereInput>
  nftOwner_isNull?: Maybe<Scalars['Boolean']>
  nft_isNull?: Maybe<Scalars['Boolean']>
  payeeChannel?: Maybe<ChannelWhereInput>
  payeeChannel_isNull?: Maybe<Scalars['Boolean']>
  payer?: Maybe<MembershipWhereInput>
  payer_isNull?: Maybe<Scalars['Boolean']>
  payloadDataObject?: Maybe<StorageDataObjectWhereInput>
  payloadDataObject_isNull?: Maybe<Scalars['Boolean']>
  paymentContext?: Maybe<PaymentContextWhereInput>
  paymentContext_isNull?: Maybe<Scalars['Boolean']>
  previousNftOwner?: Maybe<NftOwnerWhereInput>
  previousNftOwner_isNull?: Maybe<Scalars['Boolean']>
  price_eq?: Maybe<Scalars['BigInt']>
  price_gt?: Maybe<Scalars['BigInt']>
  price_gte?: Maybe<Scalars['BigInt']>
  price_in?: Maybe<Array<Scalars['BigInt']>>
  price_isNull?: Maybe<Scalars['Boolean']>
  price_lt?: Maybe<Scalars['BigInt']>
  price_lte?: Maybe<Scalars['BigInt']>
  price_not_eq?: Maybe<Scalars['BigInt']>
  price_not_in?: Maybe<Array<Scalars['BigInt']>>
  rationale_contains?: Maybe<Scalars['String']>
  rationale_containsInsensitive?: Maybe<Scalars['String']>
  rationale_endsWith?: Maybe<Scalars['String']>
  rationale_eq?: Maybe<Scalars['String']>
  rationale_gt?: Maybe<Scalars['String']>
  rationale_gte?: Maybe<Scalars['String']>
  rationale_in?: Maybe<Array<Scalars['String']>>
  rationale_isNull?: Maybe<Scalars['Boolean']>
  rationale_lt?: Maybe<Scalars['String']>
  rationale_lte?: Maybe<Scalars['String']>
  rationale_not_contains?: Maybe<Scalars['String']>
  rationale_not_containsInsensitive?: Maybe<Scalars['String']>
  rationale_not_endsWith?: Maybe<Scalars['String']>
  rationale_not_eq?: Maybe<Scalars['String']>
  rationale_not_in?: Maybe<Array<Scalars['String']>>
  rationale_not_startsWith?: Maybe<Scalars['String']>
  rationale_startsWith?: Maybe<Scalars['String']>
  result?: Maybe<MetaprotocolTransactionResultWhereInput>
  result_isNull?: Maybe<Scalars['Boolean']>
  text_contains?: Maybe<Scalars['String']>
  text_containsInsensitive?: Maybe<Scalars['String']>
  text_endsWith?: Maybe<Scalars['String']>
  text_eq?: Maybe<Scalars['String']>
  text_gt?: Maybe<Scalars['String']>
  text_gte?: Maybe<Scalars['String']>
  text_in?: Maybe<Array<Scalars['String']>>
  text_isNull?: Maybe<Scalars['Boolean']>
  text_lt?: Maybe<Scalars['String']>
  text_lte?: Maybe<Scalars['String']>
  text_not_contains?: Maybe<Scalars['String']>
  text_not_containsInsensitive?: Maybe<Scalars['String']>
  text_not_endsWith?: Maybe<Scalars['String']>
  text_not_eq?: Maybe<Scalars['String']>
  text_not_in?: Maybe<Array<Scalars['String']>>
  text_not_startsWith?: Maybe<Scalars['String']>
  text_startsWith?: Maybe<Scalars['String']>
  winningBid?: Maybe<BidWhereInput>
  winningBid_isNull?: Maybe<Scalars['Boolean']>
}

export type EventEdge = {
  cursor: Scalars['String']
  node: Event
}

export enum EventOrderByInput {
  DataAccountAsc = 'data_account_ASC',
  DataAccountDesc = 'data_account_DESC',
  DataActionAsc = 'data_action_ASC',
  DataActionDesc = 'data_action_DESC',
  DataAmountAsc = 'data_amount_ASC',
  DataAmountDesc = 'data_amount_DESC',
  DataChannelCashoutsEnabledAsc = 'data_channelCashoutsEnabled_ASC',
  DataChannelCashoutsEnabledDesc = 'data_channelCashoutsEnabled_DESC',
  DataCommitmentAsc = 'data_commitment_ASC',
  DataCommitmentDesc = 'data_commitment_DESC',
  DataIsTypeOfAsc = 'data_isTypeOf_ASC',
  DataIsTypeOfDesc = 'data_isTypeOf_DESC',
  DataMaxCashoutAllowedAsc = 'data_maxCashoutAllowed_ASC',
  DataMaxCashoutAllowedDesc = 'data_maxCashoutAllowed_DESC',
  DataMinCashoutAllowedAsc = 'data_minCashoutAllowed_ASC',
  DataMinCashoutAllowedDesc = 'data_minCashoutAllowed_DESC',
  DataNewPriceAsc = 'data_newPrice_ASC',
  DataNewPriceDesc = 'data_newPrice_DESC',
  DataNewTextAsc = 'data_newText_ASC',
  DataNewTextDesc = 'data_newText_DESC',
  DataPriceAsc = 'data_price_ASC',
  DataPriceDesc = 'data_price_DESC',
  DataRationaleAsc = 'data_rationale_ASC',
  DataRationaleDesc = 'data_rationale_DESC',
  DataTextAsc = 'data_text_ASC',
  DataTextDesc = 'data_text_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InBlockAsc = 'inBlock_ASC',
  InBlockDesc = 'inBlock_DESC',
  InExtrinsicAsc = 'inExtrinsic_ASC',
  InExtrinsicDesc = 'inExtrinsic_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type EventWhereInput = {
  AND?: Maybe<Array<EventWhereInput>>
  OR?: Maybe<Array<EventWhereInput>>
  data?: Maybe<EventDataWhereInput>
  data_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  inBlock_eq?: Maybe<Scalars['Int']>
  inBlock_gt?: Maybe<Scalars['Int']>
  inBlock_gte?: Maybe<Scalars['Int']>
  inBlock_in?: Maybe<Array<Scalars['Int']>>
  inBlock_isNull?: Maybe<Scalars['Boolean']>
  inBlock_lt?: Maybe<Scalars['Int']>
  inBlock_lte?: Maybe<Scalars['Int']>
  inBlock_not_eq?: Maybe<Scalars['Int']>
  inBlock_not_in?: Maybe<Array<Scalars['Int']>>
  inExtrinsic_contains?: Maybe<Scalars['String']>
  inExtrinsic_containsInsensitive?: Maybe<Scalars['String']>
  inExtrinsic_endsWith?: Maybe<Scalars['String']>
  inExtrinsic_eq?: Maybe<Scalars['String']>
  inExtrinsic_gt?: Maybe<Scalars['String']>
  inExtrinsic_gte?: Maybe<Scalars['String']>
  inExtrinsic_in?: Maybe<Array<Scalars['String']>>
  inExtrinsic_isNull?: Maybe<Scalars['Boolean']>
  inExtrinsic_lt?: Maybe<Scalars['String']>
  inExtrinsic_lte?: Maybe<Scalars['String']>
  inExtrinsic_not_contains?: Maybe<Scalars['String']>
  inExtrinsic_not_containsInsensitive?: Maybe<Scalars['String']>
  inExtrinsic_not_endsWith?: Maybe<Scalars['String']>
  inExtrinsic_not_eq?: Maybe<Scalars['String']>
  inExtrinsic_not_in?: Maybe<Array<Scalars['String']>>
  inExtrinsic_not_startsWith?: Maybe<Scalars['String']>
  inExtrinsic_startsWith?: Maybe<Scalars['String']>
  indexInBlock_eq?: Maybe<Scalars['Int']>
  indexInBlock_gt?: Maybe<Scalars['Int']>
  indexInBlock_gte?: Maybe<Scalars['Int']>
  indexInBlock_in?: Maybe<Array<Scalars['Int']>>
  indexInBlock_isNull?: Maybe<Scalars['Boolean']>
  indexInBlock_lt?: Maybe<Scalars['Int']>
  indexInBlock_lte?: Maybe<Scalars['Int']>
  indexInBlock_not_eq?: Maybe<Scalars['Int']>
  indexInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  timestamp_eq?: Maybe<Scalars['DateTime']>
  timestamp_gt?: Maybe<Scalars['DateTime']>
  timestamp_gte?: Maybe<Scalars['DateTime']>
  timestamp_in?: Maybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: Maybe<Scalars['Boolean']>
  timestamp_lt?: Maybe<Scalars['DateTime']>
  timestamp_lte?: Maybe<Scalars['DateTime']>
  timestamp_not_eq?: Maybe<Scalars['DateTime']>
  timestamp_not_in?: Maybe<Array<Scalars['DateTime']>>
}

export type EventsConnection = {
  edges: Array<EventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum ExcludableContentType {
  Channel = 'Channel',
  Comment = 'Comment',
  Video = 'Video',
}

export type ExcludeContentResult = {
  numberOfEntitiesAffected: Scalars['Int']
}

export type ExtendedChannel = {
  activeVideosCount: Scalars['Int']
  channel: Channel
}

export type ExtendedChannelWhereInput = {
  activeVideosCount_gt?: Maybe<Scalars['Int']>
  channel?: Maybe<ChannelWhereInput>
}

export type ExtendedVideoCategory = {
  activeVideosCount: Scalars['Int']
  category: VideoCategory
}

export type FeaturedVideoInput = {
  videoCutUrl?: Maybe<Scalars['String']>
  videoId: Scalars['String']
}

export type GeneratedSignature = {
  signature: Scalars['String']
}

export type GeoCoordinates = {
  latitude: Scalars['Float']
  longitude: Scalars['Float']
}

export type GeoCoordinatesWhereInput = {
  latitude_eq?: Maybe<Scalars['Float']>
  latitude_gt?: Maybe<Scalars['Float']>
  latitude_gte?: Maybe<Scalars['Float']>
  latitude_in?: Maybe<Array<Scalars['Float']>>
  latitude_isNull?: Maybe<Scalars['Boolean']>
  latitude_lt?: Maybe<Scalars['Float']>
  latitude_lte?: Maybe<Scalars['Float']>
  latitude_not_eq?: Maybe<Scalars['Float']>
  latitude_not_in?: Maybe<Array<Scalars['Float']>>
  longitude_eq?: Maybe<Scalars['Float']>
  longitude_gt?: Maybe<Scalars['Float']>
  longitude_gte?: Maybe<Scalars['Float']>
  longitude_in?: Maybe<Array<Scalars['Float']>>
  longitude_isNull?: Maybe<Scalars['Boolean']>
  longitude_lt?: Maybe<Scalars['Float']>
  longitude_lte?: Maybe<Scalars['Float']>
  longitude_not_eq?: Maybe<Scalars['Float']>
  longitude_not_in?: Maybe<Array<Scalars['Float']>>
}

export type GeographicalArea =
  | GeographicalAreaContinent
  | GeographicalAreaCountry
  | GeographicalAreaSubdivistion

export type GeographicalAreaContinent = {
  continentCode?: Maybe<Continent>
}

export type GeographicalAreaCountry = {
  countryCode?: Maybe<Scalars['String']>
}

export type GeographicalAreaSubdivistion = {
  subdivisionCode?: Maybe<Scalars['String']>
}

export type KillSwitch = {
  isKilled: Scalars['Boolean']
}

export type License = {
  attribution?: Maybe<Scalars['String']>
  code?: Maybe<Scalars['Int']>
  customText?: Maybe<Scalars['String']>
  id: Scalars['String']
}

export type LicenseEdge = {
  cursor: Scalars['String']
  node: License
}

export enum LicenseOrderByInput {
  AttributionAsc = 'attribution_ASC',
  AttributionDesc = 'attribution_DESC',
  CodeAsc = 'code_ASC',
  CodeDesc = 'code_DESC',
  CustomTextAsc = 'customText_ASC',
  CustomTextDesc = 'customText_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type LicenseWhereInput = {
  AND?: Maybe<Array<LicenseWhereInput>>
  OR?: Maybe<Array<LicenseWhereInput>>
  attribution_contains?: Maybe<Scalars['String']>
  attribution_containsInsensitive?: Maybe<Scalars['String']>
  attribution_endsWith?: Maybe<Scalars['String']>
  attribution_eq?: Maybe<Scalars['String']>
  attribution_gt?: Maybe<Scalars['String']>
  attribution_gte?: Maybe<Scalars['String']>
  attribution_in?: Maybe<Array<Scalars['String']>>
  attribution_isNull?: Maybe<Scalars['Boolean']>
  attribution_lt?: Maybe<Scalars['String']>
  attribution_lte?: Maybe<Scalars['String']>
  attribution_not_contains?: Maybe<Scalars['String']>
  attribution_not_containsInsensitive?: Maybe<Scalars['String']>
  attribution_not_endsWith?: Maybe<Scalars['String']>
  attribution_not_eq?: Maybe<Scalars['String']>
  attribution_not_in?: Maybe<Array<Scalars['String']>>
  attribution_not_startsWith?: Maybe<Scalars['String']>
  attribution_startsWith?: Maybe<Scalars['String']>
  code_eq?: Maybe<Scalars['Int']>
  code_gt?: Maybe<Scalars['Int']>
  code_gte?: Maybe<Scalars['Int']>
  code_in?: Maybe<Array<Scalars['Int']>>
  code_isNull?: Maybe<Scalars['Boolean']>
  code_lt?: Maybe<Scalars['Int']>
  code_lte?: Maybe<Scalars['Int']>
  code_not_eq?: Maybe<Scalars['Int']>
  code_not_in?: Maybe<Array<Scalars['Int']>>
  customText_contains?: Maybe<Scalars['String']>
  customText_containsInsensitive?: Maybe<Scalars['String']>
  customText_endsWith?: Maybe<Scalars['String']>
  customText_eq?: Maybe<Scalars['String']>
  customText_gt?: Maybe<Scalars['String']>
  customText_gte?: Maybe<Scalars['String']>
  customText_in?: Maybe<Array<Scalars['String']>>
  customText_isNull?: Maybe<Scalars['Boolean']>
  customText_lt?: Maybe<Scalars['String']>
  customText_lte?: Maybe<Scalars['String']>
  customText_not_contains?: Maybe<Scalars['String']>
  customText_not_containsInsensitive?: Maybe<Scalars['String']>
  customText_not_endsWith?: Maybe<Scalars['String']>
  customText_not_eq?: Maybe<Scalars['String']>
  customText_not_in?: Maybe<Array<Scalars['String']>>
  customText_not_startsWith?: Maybe<Scalars['String']>
  customText_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
}

export type LicensesConnection = {
  edges: Array<LicenseEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MemberBannedFromChannelEventData = {
  action: Scalars['Boolean']
  channel: Channel
  member: Membership
}

export type MemberMetadata = {
  about?: Maybe<Scalars['String']>
  avatar?: Maybe<Avatar>
  id: Scalars['String']
  member: Membership
  name?: Maybe<Scalars['String']>
}

export type MemberMetadataConnection = {
  edges: Array<MemberMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MemberMetadataEdge = {
  cursor: Scalars['String']
  node: MemberMetadata
}

export enum MemberMetadataOrderByInput {
  AboutAsc = 'about_ASC',
  AboutDesc = 'about_DESC',
  AvatarAvatarUriAsc = 'avatar_avatarUri_ASC',
  AvatarAvatarUriDesc = 'avatar_avatarUri_DESC',
  AvatarIsTypeOfAsc = 'avatar_isTypeOf_ASC',
  AvatarIsTypeOfDesc = 'avatar_isTypeOf_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
}

export type MemberMetadataWhereInput = {
  AND?: Maybe<Array<MemberMetadataWhereInput>>
  OR?: Maybe<Array<MemberMetadataWhereInput>>
  about_contains?: Maybe<Scalars['String']>
  about_containsInsensitive?: Maybe<Scalars['String']>
  about_endsWith?: Maybe<Scalars['String']>
  about_eq?: Maybe<Scalars['String']>
  about_gt?: Maybe<Scalars['String']>
  about_gte?: Maybe<Scalars['String']>
  about_in?: Maybe<Array<Scalars['String']>>
  about_isNull?: Maybe<Scalars['Boolean']>
  about_lt?: Maybe<Scalars['String']>
  about_lte?: Maybe<Scalars['String']>
  about_not_contains?: Maybe<Scalars['String']>
  about_not_containsInsensitive?: Maybe<Scalars['String']>
  about_not_endsWith?: Maybe<Scalars['String']>
  about_not_eq?: Maybe<Scalars['String']>
  about_not_in?: Maybe<Array<Scalars['String']>>
  about_not_startsWith?: Maybe<Scalars['String']>
  about_startsWith?: Maybe<Scalars['String']>
  avatar?: Maybe<AvatarWhereInput>
  avatar_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
  name_contains?: Maybe<Scalars['String']>
  name_containsInsensitive?: Maybe<Scalars['String']>
  name_endsWith?: Maybe<Scalars['String']>
  name_eq?: Maybe<Scalars['String']>
  name_gt?: Maybe<Scalars['String']>
  name_gte?: Maybe<Scalars['String']>
  name_in?: Maybe<Array<Scalars['String']>>
  name_isNull?: Maybe<Scalars['Boolean']>
  name_lt?: Maybe<Scalars['String']>
  name_lte?: Maybe<Scalars['String']>
  name_not_contains?: Maybe<Scalars['String']>
  name_not_containsInsensitive?: Maybe<Scalars['String']>
  name_not_endsWith?: Maybe<Scalars['String']>
  name_not_eq?: Maybe<Scalars['String']>
  name_not_in?: Maybe<Array<Scalars['String']>>
  name_not_startsWith?: Maybe<Scalars['String']>
  name_startsWith?: Maybe<Scalars['String']>
}

export type Membership = {
  bannedFromChannels: Array<BannedMember>
  channels: Array<Channel>
  controllerAccount: Scalars['String']
  createdAt: Scalars['DateTime']
  handle: Scalars['String']
  id: Scalars['String']
  metadata?: Maybe<MemberMetadata>
  totalChannelsCreated: Scalars['Int']
  whitelistedInAuctions: Array<AuctionWhitelistedMember>
}

export type MembershipBannedFromChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BannedMemberOrderByInput>>
  where?: Maybe<BannedMemberWhereInput>
}

export type MembershipChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type MembershipWhitelistedInAuctionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: Maybe<AuctionWhitelistedMemberWhereInput>
}

export type MembershipEdge = {
  cursor: Scalars['String']
  node: Membership
}

export enum MembershipOrderByInput {
  ControllerAccountAsc = 'controllerAccount_ASC',
  ControllerAccountDesc = 'controllerAccount_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataAboutAsc = 'metadata_about_ASC',
  MetadataAboutDesc = 'metadata_about_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataNameAsc = 'metadata_name_ASC',
  MetadataNameDesc = 'metadata_name_DESC',
  TotalChannelsCreatedAsc = 'totalChannelsCreated_ASC',
  TotalChannelsCreatedDesc = 'totalChannelsCreated_DESC',
}

export type MembershipWhereInput = {
  AND?: Maybe<Array<MembershipWhereInput>>
  OR?: Maybe<Array<MembershipWhereInput>>
  bannedFromChannels_every?: Maybe<BannedMemberWhereInput>
  bannedFromChannels_none?: Maybe<BannedMemberWhereInput>
  bannedFromChannels_some?: Maybe<BannedMemberWhereInput>
  channels_every?: Maybe<ChannelWhereInput>
  channels_none?: Maybe<ChannelWhereInput>
  channels_some?: Maybe<ChannelWhereInput>
  controllerAccount_contains?: Maybe<Scalars['String']>
  controllerAccount_containsInsensitive?: Maybe<Scalars['String']>
  controllerAccount_endsWith?: Maybe<Scalars['String']>
  controllerAccount_eq?: Maybe<Scalars['String']>
  controllerAccount_gt?: Maybe<Scalars['String']>
  controllerAccount_gte?: Maybe<Scalars['String']>
  controllerAccount_in?: Maybe<Array<Scalars['String']>>
  controllerAccount_isNull?: Maybe<Scalars['Boolean']>
  controllerAccount_lt?: Maybe<Scalars['String']>
  controllerAccount_lte?: Maybe<Scalars['String']>
  controllerAccount_not_contains?: Maybe<Scalars['String']>
  controllerAccount_not_containsInsensitive?: Maybe<Scalars['String']>
  controllerAccount_not_endsWith?: Maybe<Scalars['String']>
  controllerAccount_not_eq?: Maybe<Scalars['String']>
  controllerAccount_not_in?: Maybe<Array<Scalars['String']>>
  controllerAccount_not_startsWith?: Maybe<Scalars['String']>
  controllerAccount_startsWith?: Maybe<Scalars['String']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  handle_contains?: Maybe<Scalars['String']>
  handle_containsInsensitive?: Maybe<Scalars['String']>
  handle_endsWith?: Maybe<Scalars['String']>
  handle_eq?: Maybe<Scalars['String']>
  handle_gt?: Maybe<Scalars['String']>
  handle_gte?: Maybe<Scalars['String']>
  handle_in?: Maybe<Array<Scalars['String']>>
  handle_isNull?: Maybe<Scalars['Boolean']>
  handle_lt?: Maybe<Scalars['String']>
  handle_lte?: Maybe<Scalars['String']>
  handle_not_contains?: Maybe<Scalars['String']>
  handle_not_containsInsensitive?: Maybe<Scalars['String']>
  handle_not_endsWith?: Maybe<Scalars['String']>
  handle_not_eq?: Maybe<Scalars['String']>
  handle_not_in?: Maybe<Array<Scalars['String']>>
  handle_not_startsWith?: Maybe<Scalars['String']>
  handle_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  metadata?: Maybe<MemberMetadataWhereInput>
  metadata_isNull?: Maybe<Scalars['Boolean']>
  totalChannelsCreated_eq?: Maybe<Scalars['Int']>
  totalChannelsCreated_gt?: Maybe<Scalars['Int']>
  totalChannelsCreated_gte?: Maybe<Scalars['Int']>
  totalChannelsCreated_in?: Maybe<Array<Scalars['Int']>>
  totalChannelsCreated_isNull?: Maybe<Scalars['Boolean']>
  totalChannelsCreated_lt?: Maybe<Scalars['Int']>
  totalChannelsCreated_lte?: Maybe<Scalars['Int']>
  totalChannelsCreated_not_eq?: Maybe<Scalars['Int']>
  totalChannelsCreated_not_in?: Maybe<Array<Scalars['Int']>>
  whitelistedInAuctions_every?: Maybe<AuctionWhitelistedMemberWhereInput>
  whitelistedInAuctions_none?: Maybe<AuctionWhitelistedMemberWhereInput>
  whitelistedInAuctions_some?: Maybe<AuctionWhitelistedMemberWhereInput>
}

export type MembershipsConnection = {
  edges: Array<MembershipEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MetaprotocolTransactionResult =
  | MetaprotocolTransactionResultChannelPaid
  | MetaprotocolTransactionResultCommentCreated
  | MetaprotocolTransactionResultCommentDeleted
  | MetaprotocolTransactionResultCommentEdited
  | MetaprotocolTransactionResultCommentModerated
  | MetaprotocolTransactionResultFailed
  | MetaprotocolTransactionResultOk

export type MetaprotocolTransactionResultChannelPaid = {
  channelPaid?: Maybe<Channel>
}

export type MetaprotocolTransactionResultCommentCreated = {
  commentCreated?: Maybe<Comment>
}

export type MetaprotocolTransactionResultCommentDeleted = {
  commentDeleted?: Maybe<Comment>
}

export type MetaprotocolTransactionResultCommentEdited = {
  commentEdited?: Maybe<Comment>
}

export type MetaprotocolTransactionResultCommentModerated = {
  commentModerated?: Maybe<Comment>
}

export type MetaprotocolTransactionResultFailed = {
  errorMessage: Scalars['String']
}

export type MetaprotocolTransactionResultOk = {
  phantom?: Maybe<Scalars['Int']>
}

export type MetaprotocolTransactionResultWhereInput = {
  channelPaid?: Maybe<ChannelWhereInput>
  channelPaid_isNull?: Maybe<Scalars['Boolean']>
  commentCreated?: Maybe<CommentWhereInput>
  commentCreated_isNull?: Maybe<Scalars['Boolean']>
  commentDeleted?: Maybe<CommentWhereInput>
  commentDeleted_isNull?: Maybe<Scalars['Boolean']>
  commentEdited?: Maybe<CommentWhereInput>
  commentEdited_isNull?: Maybe<Scalars['Boolean']>
  commentModerated?: Maybe<CommentWhereInput>
  commentModerated_isNull?: Maybe<Scalars['Boolean']>
  errorMessage_contains?: Maybe<Scalars['String']>
  errorMessage_containsInsensitive?: Maybe<Scalars['String']>
  errorMessage_endsWith?: Maybe<Scalars['String']>
  errorMessage_eq?: Maybe<Scalars['String']>
  errorMessage_gt?: Maybe<Scalars['String']>
  errorMessage_gte?: Maybe<Scalars['String']>
  errorMessage_in?: Maybe<Array<Scalars['String']>>
  errorMessage_isNull?: Maybe<Scalars['Boolean']>
  errorMessage_lt?: Maybe<Scalars['String']>
  errorMessage_lte?: Maybe<Scalars['String']>
  errorMessage_not_contains?: Maybe<Scalars['String']>
  errorMessage_not_containsInsensitive?: Maybe<Scalars['String']>
  errorMessage_not_endsWith?: Maybe<Scalars['String']>
  errorMessage_not_eq?: Maybe<Scalars['String']>
  errorMessage_not_in?: Maybe<Array<Scalars['String']>>
  errorMessage_not_startsWith?: Maybe<Scalars['String']>
  errorMessage_startsWith?: Maybe<Scalars['String']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  phantom_eq?: Maybe<Scalars['Int']>
  phantom_gt?: Maybe<Scalars['Int']>
  phantom_gte?: Maybe<Scalars['Int']>
  phantom_in?: Maybe<Array<Scalars['Int']>>
  phantom_isNull?: Maybe<Scalars['Boolean']>
  phantom_lt?: Maybe<Scalars['Int']>
  phantom_lte?: Maybe<Scalars['Int']>
  phantom_not_eq?: Maybe<Scalars['Int']>
  phantom_not_in?: Maybe<Array<Scalars['Int']>>
}

export type MetaprotocolTransactionStatusEventData = {
  result: MetaprotocolTransactionResult
}

export type Mutation = {
  addVideoView: AddVideoViewResult
  excludeContent: ExcludeContentResult
  followChannel: ChannelFollowResult
  reportChannel: ChannelReportInfo
  reportVideo: VideoReportInfo
  requestNftFeatured: NftFeaturedRequstInfo
  restoreContent: RestoreContentResult
  setCategoryFeaturedVideos: SetCategoryFeaturedVideosResult
  setFeaturedNfts: SetFeaturedNftsResult
  setKillSwitch: KillSwitch
  setSupportedCategories: SetSupportedCategoriesResult
  setVideoHero: SetVideoHeroResult
  setVideoViewPerIpTimeLimit: VideoViewPerIpTimeLimit
  signAppActionCommitment: GeneratedSignature
  unfollowChannel: ChannelUnfollowResult
}

export type MutationAddVideoViewArgs = {
  videoId: Scalars['String']
}

export type MutationExcludeContentArgs = {
  ids: Array<Scalars['String']>
  type: ExcludableContentType
}

export type MutationFollowChannelArgs = {
  channelId: Scalars['String']
}

export type MutationReportChannelArgs = {
  channelId: Scalars['String']
  rationale: Scalars['String']
}

export type MutationReportVideoArgs = {
  rationale: Scalars['String']
  videoId: Scalars['String']
}

export type MutationRequestNftFeaturedArgs = {
  nftId: Scalars['String']
  rationale: Scalars['String']
}

export type MutationRestoreContentArgs = {
  ids: Array<Scalars['String']>
  type: ExcludableContentType
}

export type MutationSetCategoryFeaturedVideosArgs = {
  categoryId: Scalars['String']
  videos: Array<FeaturedVideoInput>
}

export type MutationSetFeaturedNftsArgs = {
  featuredNftsIds: Array<Scalars['String']>
}

export type MutationSetKillSwitchArgs = {
  isKilled: Scalars['Boolean']
}

export type MutationSetSupportedCategoriesArgs = {
  supportNewCategories?: Maybe<Scalars['Boolean']>
  supportNoCategoryVideos?: Maybe<Scalars['Boolean']>
  supportedCategoriesIds?: Maybe<Array<Scalars['String']>>
}

export type MutationSetVideoHeroArgs = {
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  videoCutUrl: Scalars['String']
  videoId: Scalars['String']
}

export type MutationSetVideoViewPerIpTimeLimitArgs = {
  limitInSeconds: Scalars['Int']
}

export type MutationSignAppActionCommitmentArgs = {
  actionType: AppActionActionType
  assets: Scalars['String']
  creatorId: Scalars['String']
  nonce: Scalars['Float']
  rawAction: Scalars['String']
}

export type MutationUnfollowChannelArgs = {
  channelId: Scalars['String']
  token: Scalars['String']
}

export type NftActivitiesConnection = {
  edges: Array<NftActivityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NftActivity = {
  event: Event
  id: Scalars['String']
  member: Membership
}

export type NftActivityEdge = {
  cursor: Scalars['String']
  node: NftActivity
}

export enum NftActivityOrderByInput {
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventInBlockAsc = 'event_inBlock_ASC',
  EventInBlockDesc = 'event_inBlock_DESC',
  EventInExtrinsicAsc = 'event_inExtrinsic_ASC',
  EventInExtrinsicDesc = 'event_inExtrinsic_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type NftActivityWhereInput = {
  AND?: Maybe<Array<NftActivityWhereInput>>
  OR?: Maybe<Array<NftActivityWhereInput>>
  event?: Maybe<EventWhereInput>
  event_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
}

export type NftBoughtEventData = {
  buyer: Membership
  nft: OwnedNft
  previousNftOwner: NftOwner
  price: Scalars['BigInt']
}

export type NftFeaturedRequstInfo = {
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  nftId: Scalars['String']
  rationale: Scalars['String']
  reporterIp: Scalars['String']
}

export type NftFeaturingRequest = {
  id: Scalars['String']
  ip: Scalars['String']
  nftId: Scalars['String']
  rationale: Scalars['String']
  timestamp: Scalars['DateTime']
}

export type NftFeaturingRequestEdge = {
  cursor: Scalars['String']
  node: NftFeaturingRequest
}

export enum NftFeaturingRequestOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpAsc = 'ip_ASC',
  IpDesc = 'ip_DESC',
  NftIdAsc = 'nftId_ASC',
  NftIdDesc = 'nftId_DESC',
  RationaleAsc = 'rationale_ASC',
  RationaleDesc = 'rationale_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type NftFeaturingRequestWhereInput = {
  AND?: Maybe<Array<NftFeaturingRequestWhereInput>>
  OR?: Maybe<Array<NftFeaturingRequestWhereInput>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  ip_contains?: Maybe<Scalars['String']>
  ip_containsInsensitive?: Maybe<Scalars['String']>
  ip_endsWith?: Maybe<Scalars['String']>
  ip_eq?: Maybe<Scalars['String']>
  ip_gt?: Maybe<Scalars['String']>
  ip_gte?: Maybe<Scalars['String']>
  ip_in?: Maybe<Array<Scalars['String']>>
  ip_isNull?: Maybe<Scalars['Boolean']>
  ip_lt?: Maybe<Scalars['String']>
  ip_lte?: Maybe<Scalars['String']>
  ip_not_contains?: Maybe<Scalars['String']>
  ip_not_containsInsensitive?: Maybe<Scalars['String']>
  ip_not_endsWith?: Maybe<Scalars['String']>
  ip_not_eq?: Maybe<Scalars['String']>
  ip_not_in?: Maybe<Array<Scalars['String']>>
  ip_not_startsWith?: Maybe<Scalars['String']>
  ip_startsWith?: Maybe<Scalars['String']>
  nftId_contains?: Maybe<Scalars['String']>
  nftId_containsInsensitive?: Maybe<Scalars['String']>
  nftId_endsWith?: Maybe<Scalars['String']>
  nftId_eq?: Maybe<Scalars['String']>
  nftId_gt?: Maybe<Scalars['String']>
  nftId_gte?: Maybe<Scalars['String']>
  nftId_in?: Maybe<Array<Scalars['String']>>
  nftId_isNull?: Maybe<Scalars['Boolean']>
  nftId_lt?: Maybe<Scalars['String']>
  nftId_lte?: Maybe<Scalars['String']>
  nftId_not_contains?: Maybe<Scalars['String']>
  nftId_not_containsInsensitive?: Maybe<Scalars['String']>
  nftId_not_endsWith?: Maybe<Scalars['String']>
  nftId_not_eq?: Maybe<Scalars['String']>
  nftId_not_in?: Maybe<Array<Scalars['String']>>
  nftId_not_startsWith?: Maybe<Scalars['String']>
  nftId_startsWith?: Maybe<Scalars['String']>
  rationale_contains?: Maybe<Scalars['String']>
  rationale_containsInsensitive?: Maybe<Scalars['String']>
  rationale_endsWith?: Maybe<Scalars['String']>
  rationale_eq?: Maybe<Scalars['String']>
  rationale_gt?: Maybe<Scalars['String']>
  rationale_gte?: Maybe<Scalars['String']>
  rationale_in?: Maybe<Array<Scalars['String']>>
  rationale_isNull?: Maybe<Scalars['Boolean']>
  rationale_lt?: Maybe<Scalars['String']>
  rationale_lte?: Maybe<Scalars['String']>
  rationale_not_contains?: Maybe<Scalars['String']>
  rationale_not_containsInsensitive?: Maybe<Scalars['String']>
  rationale_not_endsWith?: Maybe<Scalars['String']>
  rationale_not_eq?: Maybe<Scalars['String']>
  rationale_not_in?: Maybe<Array<Scalars['String']>>
  rationale_not_startsWith?: Maybe<Scalars['String']>
  rationale_startsWith?: Maybe<Scalars['String']>
  timestamp_eq?: Maybe<Scalars['DateTime']>
  timestamp_gt?: Maybe<Scalars['DateTime']>
  timestamp_gte?: Maybe<Scalars['DateTime']>
  timestamp_in?: Maybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: Maybe<Scalars['Boolean']>
  timestamp_lt?: Maybe<Scalars['DateTime']>
  timestamp_lte?: Maybe<Scalars['DateTime']>
  timestamp_not_eq?: Maybe<Scalars['DateTime']>
  timestamp_not_in?: Maybe<Array<Scalars['DateTime']>>
}

export type NftFeaturingRequestsConnection = {
  edges: Array<NftFeaturingRequestEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NftHistoryEntriesConnection = {
  edges: Array<NftHistoryEntryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NftHistoryEntry = {
  event: Event
  id: Scalars['String']
  nft: OwnedNft
}

export type NftHistoryEntryEdge = {
  cursor: Scalars['String']
  node: NftHistoryEntry
}

export enum NftHistoryEntryOrderByInput {
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventInBlockAsc = 'event_inBlock_ASC',
  EventInBlockDesc = 'event_inBlock_DESC',
  EventInExtrinsicAsc = 'event_inExtrinsic_ASC',
  EventInExtrinsicDesc = 'event_inExtrinsic_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
}

export type NftHistoryEntryWhereInput = {
  AND?: Maybe<Array<NftHistoryEntryWhereInput>>
  OR?: Maybe<Array<NftHistoryEntryWhereInput>>
  event?: Maybe<EventWhereInput>
  event_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  nft?: Maybe<OwnedNftWhereInput>
  nft_isNull?: Maybe<Scalars['Boolean']>
}

export type NftIssuedEventData = {
  actor: ContentActor
  nft: OwnedNft
  nftOwner: NftOwner
}

export type NftOwner = NftOwnerChannel | NftOwnerMember

export type NftOwnerChannel = {
  channel: Channel
}

export type NftOwnerMember = {
  member: Membership
}

export type NftOwnerWhereInput = {
  channel?: Maybe<ChannelWhereInput>
  channel_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
}

export type NftSellOrderMadeEventData = {
  actor: ContentActor
  nft: OwnedNft
  nftOwner: NftOwner
  price: Scalars['BigInt']
}

export type NodeLocationMetadata = {
  city?: Maybe<Scalars['String']>
  coordinates?: Maybe<GeoCoordinates>
  countryCode?: Maybe<Scalars['String']>
}

export type NodeLocationMetadataWhereInput = {
  city_contains?: Maybe<Scalars['String']>
  city_containsInsensitive?: Maybe<Scalars['String']>
  city_endsWith?: Maybe<Scalars['String']>
  city_eq?: Maybe<Scalars['String']>
  city_gt?: Maybe<Scalars['String']>
  city_gte?: Maybe<Scalars['String']>
  city_in?: Maybe<Array<Scalars['String']>>
  city_isNull?: Maybe<Scalars['Boolean']>
  city_lt?: Maybe<Scalars['String']>
  city_lte?: Maybe<Scalars['String']>
  city_not_contains?: Maybe<Scalars['String']>
  city_not_containsInsensitive?: Maybe<Scalars['String']>
  city_not_endsWith?: Maybe<Scalars['String']>
  city_not_eq?: Maybe<Scalars['String']>
  city_not_in?: Maybe<Array<Scalars['String']>>
  city_not_startsWith?: Maybe<Scalars['String']>
  city_startsWith?: Maybe<Scalars['String']>
  coordinates?: Maybe<GeoCoordinatesWhereInput>
  coordinates_isNull?: Maybe<Scalars['Boolean']>
  countryCode_contains?: Maybe<Scalars['String']>
  countryCode_containsInsensitive?: Maybe<Scalars['String']>
  countryCode_endsWith?: Maybe<Scalars['String']>
  countryCode_eq?: Maybe<Scalars['String']>
  countryCode_gt?: Maybe<Scalars['String']>
  countryCode_gte?: Maybe<Scalars['String']>
  countryCode_in?: Maybe<Array<Scalars['String']>>
  countryCode_isNull?: Maybe<Scalars['Boolean']>
  countryCode_lt?: Maybe<Scalars['String']>
  countryCode_lte?: Maybe<Scalars['String']>
  countryCode_not_contains?: Maybe<Scalars['String']>
  countryCode_not_containsInsensitive?: Maybe<Scalars['String']>
  countryCode_not_endsWith?: Maybe<Scalars['String']>
  countryCode_not_eq?: Maybe<Scalars['String']>
  countryCode_not_in?: Maybe<Array<Scalars['String']>>
  countryCode_not_startsWith?: Maybe<Scalars['String']>
  countryCode_startsWith?: Maybe<Scalars['String']>
}

export type Notification = {
  event: Event
  id: Scalars['String']
  member: Membership
}

export type NotificationEdge = {
  cursor: Scalars['String']
  node: Notification
}

export enum NotificationOrderByInput {
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventInBlockAsc = 'event_inBlock_ASC',
  EventInBlockDesc = 'event_inBlock_DESC',
  EventInExtrinsicAsc = 'event_inExtrinsic_ASC',
  EventInExtrinsicDesc = 'event_inExtrinsic_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type NotificationWhereInput = {
  AND?: Maybe<Array<NotificationWhereInput>>
  OR?: Maybe<Array<NotificationWhereInput>>
  event?: Maybe<EventWhereInput>
  event_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
}

export type NotificationsConnection = {
  edges: Array<NotificationEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type OpenAuctionBidAcceptedEventData = {
  actor: ContentActor
  previousNftOwner: NftOwner
  winningBid: Bid
}

export type OpenAuctionStartedEventData = {
  actor: ContentActor
  auction: Auction
  nftOwner: NftOwner
}

export type OwnedNft = {
  auctions: Array<Auction>
  bids: Array<Bid>
  createdAt: Scalars['DateTime']
  creatorRoyalty?: Maybe<Scalars['Float']>
  id: Scalars['String']
  isFeatured: Scalars['Boolean']
  lastSaleDate?: Maybe<Scalars['DateTime']>
  lastSalePrice?: Maybe<Scalars['BigInt']>
  owner: NftOwner
  transactionalStatus?: Maybe<TransactionalStatus>
  video: Video
}

export type OwnedNftAuctionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionOrderByInput>>
  where?: Maybe<AuctionWhereInput>
}

export type OwnedNftBidsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BidOrderByInput>>
  where?: Maybe<BidWhereInput>
}

export type OwnedNftEdge = {
  cursor: Scalars['String']
  node: OwnedNft
}

export enum OwnedNftOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatorRoyaltyAsc = 'creatorRoyalty_ASC',
  CreatorRoyaltyDesc = 'creatorRoyalty_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsFeaturedAsc = 'isFeatured_ASC',
  IsFeaturedDesc = 'isFeatured_DESC',
  LastSaleDateAsc = 'lastSaleDate_ASC',
  LastSaleDateDesc = 'lastSaleDate_DESC',
  LastSalePriceAsc = 'lastSalePrice_ASC',
  LastSalePriceDesc = 'lastSalePrice_DESC',
  OwnerIsTypeOfAsc = 'owner_isTypeOf_ASC',
  OwnerIsTypeOfDesc = 'owner_isTypeOf_DESC',
  TransactionalStatusIsTypeOfAsc = 'transactionalStatus_isTypeOf_ASC',
  TransactionalStatusIsTypeOfDesc = 'transactionalStatus_isTypeOf_DESC',
  TransactionalStatusPhantomAsc = 'transactionalStatus_phantom_ASC',
  TransactionalStatusPhantomDesc = 'transactionalStatus_phantom_DESC',
  TransactionalStatusPriceAsc = 'transactionalStatus_price_ASC',
  TransactionalStatusPriceDesc = 'transactionalStatus_price_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type OwnedNftWhereInput = {
  AND?: Maybe<Array<OwnedNftWhereInput>>
  OR?: Maybe<Array<OwnedNftWhereInput>>
  auctions_every?: Maybe<AuctionWhereInput>
  auctions_none?: Maybe<AuctionWhereInput>
  auctions_some?: Maybe<AuctionWhereInput>
  bids_every?: Maybe<BidWhereInput>
  bids_none?: Maybe<BidWhereInput>
  bids_some?: Maybe<BidWhereInput>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  creatorRoyalty_eq?: Maybe<Scalars['Float']>
  creatorRoyalty_gt?: Maybe<Scalars['Float']>
  creatorRoyalty_gte?: Maybe<Scalars['Float']>
  creatorRoyalty_in?: Maybe<Array<Scalars['Float']>>
  creatorRoyalty_isNull?: Maybe<Scalars['Boolean']>
  creatorRoyalty_lt?: Maybe<Scalars['Float']>
  creatorRoyalty_lte?: Maybe<Scalars['Float']>
  creatorRoyalty_not_eq?: Maybe<Scalars['Float']>
  creatorRoyalty_not_in?: Maybe<Array<Scalars['Float']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isFeatured_eq?: Maybe<Scalars['Boolean']>
  isFeatured_isNull?: Maybe<Scalars['Boolean']>
  isFeatured_not_eq?: Maybe<Scalars['Boolean']>
  lastSaleDate_eq?: Maybe<Scalars['DateTime']>
  lastSaleDate_gt?: Maybe<Scalars['DateTime']>
  lastSaleDate_gte?: Maybe<Scalars['DateTime']>
  lastSaleDate_in?: Maybe<Array<Scalars['DateTime']>>
  lastSaleDate_isNull?: Maybe<Scalars['Boolean']>
  lastSaleDate_lt?: Maybe<Scalars['DateTime']>
  lastSaleDate_lte?: Maybe<Scalars['DateTime']>
  lastSaleDate_not_eq?: Maybe<Scalars['DateTime']>
  lastSaleDate_not_in?: Maybe<Array<Scalars['DateTime']>>
  lastSalePrice_eq?: Maybe<Scalars['BigInt']>
  lastSalePrice_gt?: Maybe<Scalars['BigInt']>
  lastSalePrice_gte?: Maybe<Scalars['BigInt']>
  lastSalePrice_in?: Maybe<Array<Scalars['BigInt']>>
  lastSalePrice_isNull?: Maybe<Scalars['Boolean']>
  lastSalePrice_lt?: Maybe<Scalars['BigInt']>
  lastSalePrice_lte?: Maybe<Scalars['BigInt']>
  lastSalePrice_not_eq?: Maybe<Scalars['BigInt']>
  lastSalePrice_not_in?: Maybe<Array<Scalars['BigInt']>>
  owner?: Maybe<NftOwnerWhereInput>
  owner_isNull?: Maybe<Scalars['Boolean']>
  transactionalStatus?: Maybe<TransactionalStatusWhereInput>
  transactionalStatus_isNull?: Maybe<Scalars['Boolean']>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type OwnedNftsConnection = {
  edges: Array<OwnedNftEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type PageInfo = {
  endCursor: Scalars['String']
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor: Scalars['String']
}

export type PaymentContext = PaymentContextChannel | PaymentContextVideo

export type PaymentContextChannel = {
  channel: Channel
}

export type PaymentContextVideo = {
  video: Video
}

export type PaymentContextWhereInput = {
  channel?: Maybe<ChannelWhereInput>
  channel_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type ProcessorState = {
  lastProcessedBlock: Scalars['Int']
}

export type Query = {
  appById?: Maybe<App>
  /** @deprecated Use appById */
  appByUniqueInput?: Maybe<App>
  apps: Array<App>
  appsConnection: AppsConnection
  auctionById?: Maybe<Auction>
  /** @deprecated Use auctionById */
  auctionByUniqueInput?: Maybe<Auction>
  auctionWhitelistedMemberById?: Maybe<AuctionWhitelistedMember>
  /** @deprecated Use auctionWhitelistedMemberById */
  auctionWhitelistedMemberByUniqueInput?: Maybe<AuctionWhitelistedMember>
  auctionWhitelistedMembers: Array<AuctionWhitelistedMember>
  auctionWhitelistedMembersConnection: AuctionWhitelistedMembersConnection
  auctions: Array<Auction>
  auctionsConnection: AuctionsConnection
  bannedMemberById?: Maybe<BannedMember>
  /** @deprecated Use bannedMemberById */
  bannedMemberByUniqueInput?: Maybe<BannedMember>
  bannedMembers: Array<BannedMember>
  bannedMembersConnection: BannedMembersConnection
  bidById?: Maybe<Bid>
  /** @deprecated Use bidById */
  bidByUniqueInput?: Maybe<Bid>
  bids: Array<Bid>
  bidsConnection: BidsConnection
  channelById?: Maybe<Channel>
  /** @deprecated Use channelById */
  channelByUniqueInput?: Maybe<Channel>
  channelFollowById?: Maybe<ChannelFollow>
  /** @deprecated Use channelFollowById */
  channelFollowByUniqueInput?: Maybe<ChannelFollow>
  channelFollows: Array<ChannelFollow>
  channelFollowsConnection: ChannelFollowsConnection
  channelNftCollectors: Array<ChannelNftCollector>
  channels: Array<Channel>
  channelsConnection: ChannelsConnection
  commentById?: Maybe<Comment>
  /** @deprecated Use commentById */
  commentByUniqueInput?: Maybe<Comment>
  commentReactionById?: Maybe<CommentReaction>
  /** @deprecated Use commentReactionById */
  commentReactionByUniqueInput?: Maybe<CommentReaction>
  commentReactions: Array<CommentReaction>
  commentReactionsConnection: CommentReactionsConnection
  comments: Array<Comment>
  commentsConnection: CommentsConnection
  curatorById?: Maybe<Curator>
  /** @deprecated Use curatorById */
  curatorByUniqueInput?: Maybe<Curator>
  curatorGroupById?: Maybe<CuratorGroup>
  /** @deprecated Use curatorGroupById */
  curatorGroupByUniqueInput?: Maybe<CuratorGroup>
  curatorGroups: Array<CuratorGroup>
  curatorGroupsConnection: CuratorGroupsConnection
  curators: Array<Curator>
  curatorsConnection: CuratorsConnection
  distributionBucketBagById?: Maybe<DistributionBucketBag>
  /** @deprecated Use distributionBucketBagById */
  distributionBucketBagByUniqueInput?: Maybe<DistributionBucketBag>
  distributionBucketBags: Array<DistributionBucketBag>
  distributionBucketBagsConnection: DistributionBucketBagsConnection
  distributionBucketById?: Maybe<DistributionBucket>
  /** @deprecated Use distributionBucketById */
  distributionBucketByUniqueInput?: Maybe<DistributionBucket>
  distributionBucketFamilies: Array<DistributionBucketFamily>
  distributionBucketFamiliesConnection: DistributionBucketFamiliesConnection
  distributionBucketFamilyById?: Maybe<DistributionBucketFamily>
  /** @deprecated Use distributionBucketFamilyById */
  distributionBucketFamilyByUniqueInput?: Maybe<DistributionBucketFamily>
  distributionBucketFamilyMetadata: Array<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataById?: Maybe<DistributionBucketFamilyMetadata>
  /** @deprecated Use distributionBucketFamilyMetadataById */
  distributionBucketFamilyMetadataByUniqueInput?: Maybe<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataConnection: DistributionBucketFamilyMetadataConnection
  distributionBucketOperatorById?: Maybe<DistributionBucketOperator>
  /** @deprecated Use distributionBucketOperatorById */
  distributionBucketOperatorByUniqueInput?: Maybe<DistributionBucketOperator>
  distributionBucketOperatorMetadata: Array<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataById?: Maybe<DistributionBucketOperatorMetadata>
  /** @deprecated Use distributionBucketOperatorMetadataById */
  distributionBucketOperatorMetadataByUniqueInput?: Maybe<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataConnection: DistributionBucketOperatorMetadataConnection
  distributionBucketOperators: Array<DistributionBucketOperator>
  distributionBucketOperatorsConnection: DistributionBucketOperatorsConnection
  distributionBuckets: Array<DistributionBucket>
  distributionBucketsConnection: DistributionBucketsConnection
  endingAuctionsNfts: Array<Maybe<OwnedNft>>
  eventById?: Maybe<Event>
  /** @deprecated Use eventById */
  eventByUniqueInput?: Maybe<Event>
  events: Array<Event>
  eventsConnection: EventsConnection
  extendedChannels: Array<ExtendedChannel>
  extendedVideoCategories: Array<ExtendedVideoCategory>
  getKillSwitch: KillSwitch
  getVideoViewPerIpTimeLimit: VideoViewPerIpTimeLimit
  licenseById?: Maybe<License>
  /** @deprecated Use licenseById */
  licenseByUniqueInput?: Maybe<License>
  licenses: Array<License>
  licensesConnection: LicensesConnection
  memberMetadata: Array<MemberMetadata>
  memberMetadataById?: Maybe<MemberMetadata>
  /** @deprecated Use memberMetadataById */
  memberMetadataByUniqueInput?: Maybe<MemberMetadata>
  memberMetadataConnection: MemberMetadataConnection
  membershipById?: Maybe<Membership>
  /** @deprecated Use membershipById */
  membershipByUniqueInput?: Maybe<Membership>
  memberships: Array<Membership>
  membershipsConnection: MembershipsConnection
  mostRecentChannels: Array<ExtendedChannel>
  mostViewedVideosConnection: VideosConnection
  nftActivities: Array<NftActivity>
  nftActivitiesConnection: NftActivitiesConnection
  nftActivityById?: Maybe<NftActivity>
  /** @deprecated Use nftActivityById */
  nftActivityByUniqueInput?: Maybe<NftActivity>
  nftFeaturingRequestById?: Maybe<NftFeaturingRequest>
  /** @deprecated Use nftFeaturingRequestById */
  nftFeaturingRequestByUniqueInput?: Maybe<NftFeaturingRequest>
  nftFeaturingRequests: Array<NftFeaturingRequest>
  nftFeaturingRequestsConnection: NftFeaturingRequestsConnection
  nftHistoryEntries: Array<NftHistoryEntry>
  nftHistoryEntriesConnection: NftHistoryEntriesConnection
  nftHistoryEntryById?: Maybe<NftHistoryEntry>
  /** @deprecated Use nftHistoryEntryById */
  nftHistoryEntryByUniqueInput?: Maybe<NftHistoryEntry>
  notificationById?: Maybe<Notification>
  /** @deprecated Use notificationById */
  notificationByUniqueInput?: Maybe<Notification>
  notifications: Array<Notification>
  notificationsConnection: NotificationsConnection
  ownedNftById?: Maybe<OwnedNft>
  /** @deprecated Use ownedNftById */
  ownedNftByUniqueInput?: Maybe<OwnedNft>
  ownedNfts: Array<OwnedNft>
  ownedNftsConnection: OwnedNftsConnection
  reportById?: Maybe<Report>
  /** @deprecated Use reportById */
  reportByUniqueInput?: Maybe<Report>
  reports: Array<Report>
  reportsConnection: ReportsConnection
  squidStatus?: Maybe<SquidStatus>
  storageBagById?: Maybe<StorageBag>
  /** @deprecated Use storageBagById */
  storageBagByUniqueInput?: Maybe<StorageBag>
  storageBags: Array<StorageBag>
  storageBagsConnection: StorageBagsConnection
  storageBucketBagById?: Maybe<StorageBucketBag>
  /** @deprecated Use storageBucketBagById */
  storageBucketBagByUniqueInput?: Maybe<StorageBucketBag>
  storageBucketBags: Array<StorageBucketBag>
  storageBucketBagsConnection: StorageBucketBagsConnection
  storageBucketById?: Maybe<StorageBucket>
  /** @deprecated Use storageBucketById */
  storageBucketByUniqueInput?: Maybe<StorageBucket>
  storageBucketOperatorMetadata: Array<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataById?: Maybe<StorageBucketOperatorMetadata>
  /** @deprecated Use storageBucketOperatorMetadataById */
  storageBucketOperatorMetadataByUniqueInput?: Maybe<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataConnection: StorageBucketOperatorMetadataConnection
  storageBuckets: Array<StorageBucket>
  storageBucketsConnection: StorageBucketsConnection
  storageDataObjectById?: Maybe<StorageDataObject>
  /** @deprecated Use storageDataObjectById */
  storageDataObjectByUniqueInput?: Maybe<StorageDataObject>
  storageDataObjects: Array<StorageDataObject>
  storageDataObjectsConnection: StorageDataObjectsConnection
  topSellingChannels?: Maybe<Array<Maybe<TopSellingChannelsResult>>>
  videoById?: Maybe<Video>
  /** @deprecated Use videoById */
  videoByUniqueInput?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  videoCategoriesConnection: VideoCategoriesConnection
  videoCategoryById?: Maybe<VideoCategory>
  /** @deprecated Use videoCategoryById */
  videoCategoryByUniqueInput?: Maybe<VideoCategory>
  videoFeaturedInCategories: Array<VideoFeaturedInCategory>
  videoFeaturedInCategoriesConnection: VideoFeaturedInCategoriesConnection
  videoFeaturedInCategoryById?: Maybe<VideoFeaturedInCategory>
  /** @deprecated Use videoFeaturedInCategoryById */
  videoFeaturedInCategoryByUniqueInput?: Maybe<VideoFeaturedInCategory>
  videoHero?: Maybe<VideoHero>
  videoHeroById?: Maybe<VideoHero>
  /** @deprecated Use videoHeroById */
  videoHeroByUniqueInput?: Maybe<VideoHero>
  videoHeros: Array<VideoHero>
  videoHerosConnection: VideoHerosConnection
  videoMediaEncodingById?: Maybe<VideoMediaEncoding>
  /** @deprecated Use videoMediaEncodingById */
  videoMediaEncodingByUniqueInput?: Maybe<VideoMediaEncoding>
  videoMediaEncodings: Array<VideoMediaEncoding>
  videoMediaEncodingsConnection: VideoMediaEncodingsConnection
  videoMediaMetadata: Array<VideoMediaMetadata>
  videoMediaMetadataById?: Maybe<VideoMediaMetadata>
  /** @deprecated Use videoMediaMetadataById */
  videoMediaMetadataByUniqueInput?: Maybe<VideoMediaMetadata>
  videoMediaMetadataConnection: VideoMediaMetadataConnection
  videoReactionById?: Maybe<VideoReaction>
  /** @deprecated Use videoReactionById */
  videoReactionByUniqueInput?: Maybe<VideoReaction>
  videoReactions: Array<VideoReaction>
  videoReactionsConnection: VideoReactionsConnection
  videoSubtitleById?: Maybe<VideoSubtitle>
  /** @deprecated Use videoSubtitleById */
  videoSubtitleByUniqueInput?: Maybe<VideoSubtitle>
  videoSubtitles: Array<VideoSubtitle>
  videoSubtitlesConnection: VideoSubtitlesConnection
  videoViewEventById?: Maybe<VideoViewEvent>
  /** @deprecated Use videoViewEventById */
  videoViewEventByUniqueInput?: Maybe<VideoViewEvent>
  videoViewEvents: Array<VideoViewEvent>
  videoViewEventsConnection: VideoViewEventsConnection
  videos: Array<Video>
  videosConnection: VideosConnection
}

export type QueryAppByIdArgs = {
  id: Scalars['String']
}

export type QueryAppByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAppsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AppOrderByInput>>
  where?: Maybe<AppWhereInput>
}

export type QueryAppsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<AppOrderByInput>
  where?: Maybe<AppWhereInput>
}

export type QueryAuctionByIdArgs = {
  id: Scalars['String']
}

export type QueryAuctionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAuctionWhitelistedMemberByIdArgs = {
  id: Scalars['String']
}

export type QueryAuctionWhitelistedMemberByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAuctionWhitelistedMembersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: Maybe<AuctionWhitelistedMemberWhereInput>
}

export type QueryAuctionWhitelistedMembersConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<AuctionWhitelistedMemberOrderByInput>
  where?: Maybe<AuctionWhitelistedMemberWhereInput>
}

export type QueryAuctionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionOrderByInput>>
  where?: Maybe<AuctionWhereInput>
}

export type QueryAuctionsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<AuctionOrderByInput>
  where?: Maybe<AuctionWhereInput>
}

export type QueryBannedMemberByIdArgs = {
  id: Scalars['String']
}

export type QueryBannedMemberByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryBannedMembersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BannedMemberOrderByInput>>
  where?: Maybe<BannedMemberWhereInput>
}

export type QueryBannedMembersConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<BannedMemberOrderByInput>
  where?: Maybe<BannedMemberWhereInput>
}

export type QueryBidByIdArgs = {
  id: Scalars['String']
}

export type QueryBidByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryBidsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BidOrderByInput>>
  where?: Maybe<BidWhereInput>
}

export type QueryBidsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<BidOrderByInput>
  where?: Maybe<BidWhereInput>
}

export type QueryChannelByIdArgs = {
  id: Scalars['String']
}

export type QueryChannelByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryChannelFollowByIdArgs = {
  id: Scalars['String']
}

export type QueryChannelFollowByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryChannelFollowsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelFollowOrderByInput>>
  where?: Maybe<ChannelFollowWhereInput>
}

export type QueryChannelFollowsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<ChannelFollowOrderByInput>
  where?: Maybe<ChannelFollowWhereInput>
}

export type QueryChannelNftCollectorsArgs = {
  channelId: Scalars['String']
  limit?: Maybe<Scalars['Int']>
  orderBy?: Maybe<ChannelNftCollectorsOrderByInput>
}

export type QueryChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type QueryChannelsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<ChannelOrderByInput>
  where?: Maybe<ChannelWhereInput>
}

export type QueryCommentByIdArgs = {
  id: Scalars['String']
}

export type QueryCommentByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCommentReactionByIdArgs = {
  id: Scalars['String']
}

export type QueryCommentReactionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCommentReactionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CommentReactionOrderByInput>>
  where?: Maybe<CommentReactionWhereInput>
}

export type QueryCommentReactionsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<CommentReactionOrderByInput>
  where?: Maybe<CommentReactionWhereInput>
}

export type QueryCommentsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CommentOrderByInput>>
  where?: Maybe<CommentWhereInput>
}

export type QueryCommentsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<CommentOrderByInput>
  where?: Maybe<CommentWhereInput>
}

export type QueryCuratorByIdArgs = {
  id: Scalars['String']
}

export type QueryCuratorByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCuratorGroupByIdArgs = {
  id: Scalars['String']
}

export type QueryCuratorGroupByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCuratorGroupsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CuratorGroupOrderByInput>>
  where?: Maybe<CuratorGroupWhereInput>
}

export type QueryCuratorGroupsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<CuratorGroupOrderByInput>
  where?: Maybe<CuratorGroupWhereInput>
}

export type QueryCuratorsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CuratorOrderByInput>>
  where?: Maybe<CuratorWhereInput>
}

export type QueryCuratorsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<CuratorOrderByInput>
  where?: Maybe<CuratorWhereInput>
}

export type QueryDistributionBucketBagByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketBagByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketBagOrderByInput>>
  where?: Maybe<DistributionBucketBagWhereInput>
}

export type QueryDistributionBucketBagsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<DistributionBucketBagOrderByInput>
  where?: Maybe<DistributionBucketBagWhereInput>
}

export type QueryDistributionBucketByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketFamiliesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketFamilyOrderByInput>>
  where?: Maybe<DistributionBucketFamilyWhereInput>
}

export type QueryDistributionBucketFamiliesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<DistributionBucketFamilyOrderByInput>
  where?: Maybe<DistributionBucketFamilyWhereInput>
}

export type QueryDistributionBucketFamilyByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketFamilyByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketFamilyMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketFamilyMetadataOrderByInput>>
  where?: Maybe<DistributionBucketFamilyMetadataWhereInput>
}

export type QueryDistributionBucketFamilyMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketFamilyMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketFamilyMetadataConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<DistributionBucketFamilyMetadataOrderByInput>
  where?: Maybe<DistributionBucketFamilyMetadataWhereInput>
}

export type QueryDistributionBucketOperatorByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketOperatorByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketOperatorMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOperatorMetadataOrderByInput>>
  where?: Maybe<DistributionBucketOperatorMetadataWhereInput>
}

export type QueryDistributionBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketOperatorMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketOperatorMetadataConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<DistributionBucketOperatorMetadataOrderByInput>
  where?: Maybe<DistributionBucketOperatorMetadataWhereInput>
}

export type QueryDistributionBucketOperatorsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: Maybe<DistributionBucketOperatorWhereInput>
}

export type QueryDistributionBucketOperatorsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<DistributionBucketOperatorOrderByInput>
  where?: Maybe<DistributionBucketOperatorWhereInput>
}

export type QueryDistributionBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOrderByInput>>
  where?: Maybe<DistributionBucketWhereInput>
}

export type QueryDistributionBucketsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<DistributionBucketOrderByInput>
  where?: Maybe<DistributionBucketWhereInput>
}

export type QueryEndingAuctionsNftsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  where?: Maybe<OwnedNftWhereInput>
}

export type QueryEventByIdArgs = {
  id: Scalars['String']
}

export type QueryEventByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryEventsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<EventOrderByInput>>
  where?: Maybe<EventWhereInput>
}

export type QueryEventsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<EventOrderByInput>
  where?: Maybe<EventWhereInput>
}

export type QueryExtendedChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ExtendedChannelWhereInput>
}

export type QueryLicenseByIdArgs = {
  id: Scalars['String']
}

export type QueryLicenseByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryLicensesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<LicenseOrderByInput>>
  where?: Maybe<LicenseWhereInput>
}

export type QueryLicensesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<LicenseOrderByInput>
  where?: Maybe<LicenseWhereInput>
}

export type QueryMemberMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<MemberMetadataOrderByInput>>
  where?: Maybe<MemberMetadataWhereInput>
}

export type QueryMemberMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryMemberMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryMemberMetadataConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<MemberMetadataOrderByInput>
  where?: Maybe<MemberMetadataWhereInput>
}

export type QueryMembershipByIdArgs = {
  id: Scalars['String']
}

export type QueryMembershipByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryMembershipsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<MembershipOrderByInput>>
  where?: Maybe<MembershipWhereInput>
}

export type QueryMembershipsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<MembershipOrderByInput>
  where?: Maybe<MembershipWhereInput>
}

export type QueryMostRecentChannelsArgs = {
  mostRecentLimit: Scalars['Int']
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  resultsLimit?: Maybe<Scalars['Int']>
  where?: Maybe<ExtendedChannelWhereInput>
}

export type QueryMostViewedVideosConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy: Array<VideoOrderByInput>
  periodDays?: Maybe<Scalars['Int']>
  where?: Maybe<VideoWhereInput>
}

export type QueryNftActivitiesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NftActivityOrderByInput>>
  where?: Maybe<NftActivityWhereInput>
}

export type QueryNftActivitiesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<NftActivityOrderByInput>
  where?: Maybe<NftActivityWhereInput>
}

export type QueryNftActivityByIdArgs = {
  id: Scalars['String']
}

export type QueryNftActivityByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNftFeaturingRequestByIdArgs = {
  id: Scalars['String']
}

export type QueryNftFeaturingRequestByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNftFeaturingRequestsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NftFeaturingRequestOrderByInput>>
  where?: Maybe<NftFeaturingRequestWhereInput>
}

export type QueryNftFeaturingRequestsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<NftFeaturingRequestOrderByInput>
  where?: Maybe<NftFeaturingRequestWhereInput>
}

export type QueryNftHistoryEntriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NftHistoryEntryOrderByInput>>
  where?: Maybe<NftHistoryEntryWhereInput>
}

export type QueryNftHistoryEntriesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<NftHistoryEntryOrderByInput>
  where?: Maybe<NftHistoryEntryWhereInput>
}

export type QueryNftHistoryEntryByIdArgs = {
  id: Scalars['String']
}

export type QueryNftHistoryEntryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNotificationByIdArgs = {
  id: Scalars['String']
}

export type QueryNotificationByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNotificationsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NotificationOrderByInput>>
  where?: Maybe<NotificationWhereInput>
}

export type QueryNotificationsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<NotificationOrderByInput>
  where?: Maybe<NotificationWhereInput>
}

export type QueryOwnedNftByIdArgs = {
  id: Scalars['String']
}

export type QueryOwnedNftByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryOwnedNftsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<OwnedNftOrderByInput>>
  where?: Maybe<OwnedNftWhereInput>
}

export type QueryOwnedNftsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<OwnedNftOrderByInput>
  where?: Maybe<OwnedNftWhereInput>
}

export type QueryReportByIdArgs = {
  id: Scalars['String']
}

export type QueryReportByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryReportsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ReportOrderByInput>>
  where?: Maybe<ReportWhereInput>
}

export type QueryReportsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<ReportOrderByInput>
  where?: Maybe<ReportWhereInput>
}

export type QueryStorageBagByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBagByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBagOrderByInput>>
  where?: Maybe<StorageBagWhereInput>
}

export type QueryStorageBagsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<StorageBagOrderByInput>
  where?: Maybe<StorageBagWhereInput>
}

export type QueryStorageBucketBagByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBucketBagByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBucketBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketBagOrderByInput>>
  where?: Maybe<StorageBucketBagWhereInput>
}

export type QueryStorageBucketBagsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<StorageBucketBagOrderByInput>
  where?: Maybe<StorageBucketBagWhereInput>
}

export type QueryStorageBucketByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBucketByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBucketOperatorMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketOperatorMetadataOrderByInput>>
  where?: Maybe<StorageBucketOperatorMetadataWhereInput>
}

export type QueryStorageBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBucketOperatorMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBucketOperatorMetadataConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<StorageBucketOperatorMetadataOrderByInput>
  where?: Maybe<StorageBucketOperatorMetadataWhereInput>
}

export type QueryStorageBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketOrderByInput>>
  where?: Maybe<StorageBucketWhereInput>
}

export type QueryStorageBucketsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<StorageBucketOrderByInput>
  where?: Maybe<StorageBucketWhereInput>
}

export type QueryStorageDataObjectByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageDataObjectByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageDataObjectsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageDataObjectOrderByInput>>
  where?: Maybe<StorageDataObjectWhereInput>
}

export type QueryStorageDataObjectsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<StorageDataObjectOrderByInput>
  where?: Maybe<StorageDataObjectWhereInput>
}

export type QueryTopSellingChannelsArgs = {
  limit: Scalars['Int']
  periodDays: Scalars['Int']
  where?: Maybe<ExtendedChannelWhereInput>
}

export type QueryVideoByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoCategoryOrderByInput>>
  where?: Maybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoriesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoCategoryOrderByInput>
  where?: Maybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoryByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoCategoryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoFeaturedInCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoFeaturedInCategoryOrderByInput>>
  where?: Maybe<VideoFeaturedInCategoryWhereInput>
}

export type QueryVideoFeaturedInCategoriesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoFeaturedInCategoryOrderByInput>
  where?: Maybe<VideoFeaturedInCategoryWhereInput>
}

export type QueryVideoFeaturedInCategoryByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoFeaturedInCategoryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoHeroByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoHeroByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoHerosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoHeroOrderByInput>>
  where?: Maybe<VideoHeroWhereInput>
}

export type QueryVideoHerosConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoHeroOrderByInput>
  where?: Maybe<VideoHeroWhereInput>
}

export type QueryVideoMediaEncodingByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoMediaEncodingByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoMediaEncodingsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaEncodingOrderByInput>>
  where?: Maybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaEncodingsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoMediaEncodingOrderByInput>
  where?: Maybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaMetadataOrderByInput>>
  where?: Maybe<VideoMediaMetadataWhereInput>
}

export type QueryVideoMediaMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoMediaMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoMediaMetadataConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoMediaMetadataOrderByInput>
  where?: Maybe<VideoMediaMetadataWhereInput>
}

export type QueryVideoReactionByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoReactionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoReactionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoReactionOrderByInput>>
  where?: Maybe<VideoReactionWhereInput>
}

export type QueryVideoReactionsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoReactionOrderByInput>
  where?: Maybe<VideoReactionWhereInput>
}

export type QueryVideoSubtitleByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoSubtitleByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoSubtitlesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoSubtitleOrderByInput>>
  where?: Maybe<VideoSubtitleWhereInput>
}

export type QueryVideoSubtitlesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoSubtitleOrderByInput>
  where?: Maybe<VideoSubtitleWhereInput>
}

export type QueryVideoViewEventByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoViewEventByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoViewEventsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoViewEventOrderByInput>>
  where?: Maybe<VideoViewEventWhereInput>
}

export type QueryVideoViewEventsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoViewEventOrderByInput>
  where?: Maybe<VideoViewEventWhereInput>
}

export type QueryVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export type QueryVideosConnectionArgs = {
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  orderBy: Array<VideoOrderByInput>
  where?: Maybe<VideoWhereInput>
}

export type Report = {
  channelId?: Maybe<Scalars['String']>
  id: Scalars['String']
  ip: Scalars['String']
  rationale: Scalars['String']
  timestamp: Scalars['DateTime']
  videoId?: Maybe<Scalars['String']>
}

export type ReportEdge = {
  cursor: Scalars['String']
  node: Report
}

export enum ReportOrderByInput {
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpAsc = 'ip_ASC',
  IpDesc = 'ip_DESC',
  RationaleAsc = 'rationale_ASC',
  RationaleDesc = 'rationale_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  VideoIdAsc = 'videoId_ASC',
  VideoIdDesc = 'videoId_DESC',
}

export type ReportWhereInput = {
  AND?: Maybe<Array<ReportWhereInput>>
  OR?: Maybe<Array<ReportWhereInput>>
  channelId_contains?: Maybe<Scalars['String']>
  channelId_containsInsensitive?: Maybe<Scalars['String']>
  channelId_endsWith?: Maybe<Scalars['String']>
  channelId_eq?: Maybe<Scalars['String']>
  channelId_gt?: Maybe<Scalars['String']>
  channelId_gte?: Maybe<Scalars['String']>
  channelId_in?: Maybe<Array<Scalars['String']>>
  channelId_isNull?: Maybe<Scalars['Boolean']>
  channelId_lt?: Maybe<Scalars['String']>
  channelId_lte?: Maybe<Scalars['String']>
  channelId_not_contains?: Maybe<Scalars['String']>
  channelId_not_containsInsensitive?: Maybe<Scalars['String']>
  channelId_not_endsWith?: Maybe<Scalars['String']>
  channelId_not_eq?: Maybe<Scalars['String']>
  channelId_not_in?: Maybe<Array<Scalars['String']>>
  channelId_not_startsWith?: Maybe<Scalars['String']>
  channelId_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  ip_contains?: Maybe<Scalars['String']>
  ip_containsInsensitive?: Maybe<Scalars['String']>
  ip_endsWith?: Maybe<Scalars['String']>
  ip_eq?: Maybe<Scalars['String']>
  ip_gt?: Maybe<Scalars['String']>
  ip_gte?: Maybe<Scalars['String']>
  ip_in?: Maybe<Array<Scalars['String']>>
  ip_isNull?: Maybe<Scalars['Boolean']>
  ip_lt?: Maybe<Scalars['String']>
  ip_lte?: Maybe<Scalars['String']>
  ip_not_contains?: Maybe<Scalars['String']>
  ip_not_containsInsensitive?: Maybe<Scalars['String']>
  ip_not_endsWith?: Maybe<Scalars['String']>
  ip_not_eq?: Maybe<Scalars['String']>
  ip_not_in?: Maybe<Array<Scalars['String']>>
  ip_not_startsWith?: Maybe<Scalars['String']>
  ip_startsWith?: Maybe<Scalars['String']>
  rationale_contains?: Maybe<Scalars['String']>
  rationale_containsInsensitive?: Maybe<Scalars['String']>
  rationale_endsWith?: Maybe<Scalars['String']>
  rationale_eq?: Maybe<Scalars['String']>
  rationale_gt?: Maybe<Scalars['String']>
  rationale_gte?: Maybe<Scalars['String']>
  rationale_in?: Maybe<Array<Scalars['String']>>
  rationale_isNull?: Maybe<Scalars['Boolean']>
  rationale_lt?: Maybe<Scalars['String']>
  rationale_lte?: Maybe<Scalars['String']>
  rationale_not_contains?: Maybe<Scalars['String']>
  rationale_not_containsInsensitive?: Maybe<Scalars['String']>
  rationale_not_endsWith?: Maybe<Scalars['String']>
  rationale_not_eq?: Maybe<Scalars['String']>
  rationale_not_in?: Maybe<Array<Scalars['String']>>
  rationale_not_startsWith?: Maybe<Scalars['String']>
  rationale_startsWith?: Maybe<Scalars['String']>
  timestamp_eq?: Maybe<Scalars['DateTime']>
  timestamp_gt?: Maybe<Scalars['DateTime']>
  timestamp_gte?: Maybe<Scalars['DateTime']>
  timestamp_in?: Maybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: Maybe<Scalars['Boolean']>
  timestamp_lt?: Maybe<Scalars['DateTime']>
  timestamp_lte?: Maybe<Scalars['DateTime']>
  timestamp_not_eq?: Maybe<Scalars['DateTime']>
  timestamp_not_in?: Maybe<Array<Scalars['DateTime']>>
  videoId_contains?: Maybe<Scalars['String']>
  videoId_containsInsensitive?: Maybe<Scalars['String']>
  videoId_endsWith?: Maybe<Scalars['String']>
  videoId_eq?: Maybe<Scalars['String']>
  videoId_gt?: Maybe<Scalars['String']>
  videoId_gte?: Maybe<Scalars['String']>
  videoId_in?: Maybe<Array<Scalars['String']>>
  videoId_isNull?: Maybe<Scalars['Boolean']>
  videoId_lt?: Maybe<Scalars['String']>
  videoId_lte?: Maybe<Scalars['String']>
  videoId_not_contains?: Maybe<Scalars['String']>
  videoId_not_containsInsensitive?: Maybe<Scalars['String']>
  videoId_not_endsWith?: Maybe<Scalars['String']>
  videoId_not_eq?: Maybe<Scalars['String']>
  videoId_not_in?: Maybe<Array<Scalars['String']>>
  videoId_not_startsWith?: Maybe<Scalars['String']>
  videoId_startsWith?: Maybe<Scalars['String']>
}

export type ReportsConnection = {
  edges: Array<ReportEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type RestoreContentResult = {
  numberOfEntitiesAffected: Scalars['Int']
}

export type SetCategoryFeaturedVideosResult = {
  categoryId: Scalars['String']
  numberOfFeaturedVideosSet: Scalars['Int']
  numberOfFeaturedVideosUnset: Scalars['Int']
}

export type SetFeaturedNftsResult = {
  newNumberOfNftsFeatured?: Maybe<Scalars['Int']>
}

export type SetSupportedCategoriesResult = {
  newNumberOfCategoriesSupported?: Maybe<Scalars['Int']>
  newlyCreatedCategoriesSupported: Scalars['Boolean']
  noCategoryVideosSupported: Scalars['Boolean']
}

export type SetVideoHeroResult = {
  id: Scalars['String']
}

export type SquidStatus = {
  height?: Maybe<Scalars['Int']>
}

export type StorageBag = {
  distributionBuckets: Array<DistributionBucketBag>
  id: Scalars['String']
  objects: Array<StorageDataObject>
  owner: StorageBagOwner
  storageBuckets: Array<StorageBucketBag>
}

export type StorageBagDistributionBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketBagOrderByInput>>
  where?: Maybe<DistributionBucketBagWhereInput>
}

export type StorageBagObjectsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageDataObjectOrderByInput>>
  where?: Maybe<StorageDataObjectWhereInput>
}

export type StorageBagStorageBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketBagOrderByInput>>
  where?: Maybe<StorageBucketBagWhereInput>
}

export type StorageBagEdge = {
  cursor: Scalars['String']
  node: StorageBag
}

export enum StorageBagOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  OwnerChannelIdAsc = 'owner_channelId_ASC',
  OwnerChannelIdDesc = 'owner_channelId_DESC',
  OwnerDaoIdAsc = 'owner_daoId_ASC',
  OwnerDaoIdDesc = 'owner_daoId_DESC',
  OwnerIsTypeOfAsc = 'owner_isTypeOf_ASC',
  OwnerIsTypeOfDesc = 'owner_isTypeOf_DESC',
  OwnerMemberIdAsc = 'owner_memberId_ASC',
  OwnerMemberIdDesc = 'owner_memberId_DESC',
  OwnerPhantomAsc = 'owner_phantom_ASC',
  OwnerPhantomDesc = 'owner_phantom_DESC',
  OwnerWorkingGroupIdAsc = 'owner_workingGroupId_ASC',
  OwnerWorkingGroupIdDesc = 'owner_workingGroupId_DESC',
}

export type StorageBagOwner =
  | StorageBagOwnerChannel
  | StorageBagOwnerCouncil
  | StorageBagOwnerDao
  | StorageBagOwnerMember
  | StorageBagOwnerWorkingGroup

export type StorageBagOwnerChannel = {
  channelId: Scalars['String']
}

export type StorageBagOwnerCouncil = {
  phantom?: Maybe<Scalars['Int']>
}

export type StorageBagOwnerDao = {
  daoId?: Maybe<Scalars['Int']>
}

export type StorageBagOwnerMember = {
  memberId: Scalars['String']
}

export type StorageBagOwnerWhereInput = {
  channelId_contains?: Maybe<Scalars['String']>
  channelId_containsInsensitive?: Maybe<Scalars['String']>
  channelId_endsWith?: Maybe<Scalars['String']>
  channelId_eq?: Maybe<Scalars['String']>
  channelId_gt?: Maybe<Scalars['String']>
  channelId_gte?: Maybe<Scalars['String']>
  channelId_in?: Maybe<Array<Scalars['String']>>
  channelId_isNull?: Maybe<Scalars['Boolean']>
  channelId_lt?: Maybe<Scalars['String']>
  channelId_lte?: Maybe<Scalars['String']>
  channelId_not_contains?: Maybe<Scalars['String']>
  channelId_not_containsInsensitive?: Maybe<Scalars['String']>
  channelId_not_endsWith?: Maybe<Scalars['String']>
  channelId_not_eq?: Maybe<Scalars['String']>
  channelId_not_in?: Maybe<Array<Scalars['String']>>
  channelId_not_startsWith?: Maybe<Scalars['String']>
  channelId_startsWith?: Maybe<Scalars['String']>
  daoId_eq?: Maybe<Scalars['Int']>
  daoId_gt?: Maybe<Scalars['Int']>
  daoId_gte?: Maybe<Scalars['Int']>
  daoId_in?: Maybe<Array<Scalars['Int']>>
  daoId_isNull?: Maybe<Scalars['Boolean']>
  daoId_lt?: Maybe<Scalars['Int']>
  daoId_lte?: Maybe<Scalars['Int']>
  daoId_not_eq?: Maybe<Scalars['Int']>
  daoId_not_in?: Maybe<Array<Scalars['Int']>>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  memberId_contains?: Maybe<Scalars['String']>
  memberId_containsInsensitive?: Maybe<Scalars['String']>
  memberId_endsWith?: Maybe<Scalars['String']>
  memberId_eq?: Maybe<Scalars['String']>
  memberId_gt?: Maybe<Scalars['String']>
  memberId_gte?: Maybe<Scalars['String']>
  memberId_in?: Maybe<Array<Scalars['String']>>
  memberId_isNull?: Maybe<Scalars['Boolean']>
  memberId_lt?: Maybe<Scalars['String']>
  memberId_lte?: Maybe<Scalars['String']>
  memberId_not_contains?: Maybe<Scalars['String']>
  memberId_not_containsInsensitive?: Maybe<Scalars['String']>
  memberId_not_endsWith?: Maybe<Scalars['String']>
  memberId_not_eq?: Maybe<Scalars['String']>
  memberId_not_in?: Maybe<Array<Scalars['String']>>
  memberId_not_startsWith?: Maybe<Scalars['String']>
  memberId_startsWith?: Maybe<Scalars['String']>
  phantom_eq?: Maybe<Scalars['Int']>
  phantom_gt?: Maybe<Scalars['Int']>
  phantom_gte?: Maybe<Scalars['Int']>
  phantom_in?: Maybe<Array<Scalars['Int']>>
  phantom_isNull?: Maybe<Scalars['Boolean']>
  phantom_lt?: Maybe<Scalars['Int']>
  phantom_lte?: Maybe<Scalars['Int']>
  phantom_not_eq?: Maybe<Scalars['Int']>
  phantom_not_in?: Maybe<Array<Scalars['Int']>>
  workingGroupId_contains?: Maybe<Scalars['String']>
  workingGroupId_containsInsensitive?: Maybe<Scalars['String']>
  workingGroupId_endsWith?: Maybe<Scalars['String']>
  workingGroupId_eq?: Maybe<Scalars['String']>
  workingGroupId_gt?: Maybe<Scalars['String']>
  workingGroupId_gte?: Maybe<Scalars['String']>
  workingGroupId_in?: Maybe<Array<Scalars['String']>>
  workingGroupId_isNull?: Maybe<Scalars['Boolean']>
  workingGroupId_lt?: Maybe<Scalars['String']>
  workingGroupId_lte?: Maybe<Scalars['String']>
  workingGroupId_not_contains?: Maybe<Scalars['String']>
  workingGroupId_not_containsInsensitive?: Maybe<Scalars['String']>
  workingGroupId_not_endsWith?: Maybe<Scalars['String']>
  workingGroupId_not_eq?: Maybe<Scalars['String']>
  workingGroupId_not_in?: Maybe<Array<Scalars['String']>>
  workingGroupId_not_startsWith?: Maybe<Scalars['String']>
  workingGroupId_startsWith?: Maybe<Scalars['String']>
}

export type StorageBagOwnerWorkingGroup = {
  workingGroupId?: Maybe<Scalars['String']>
}

export type StorageBagWhereInput = {
  AND?: Maybe<Array<StorageBagWhereInput>>
  OR?: Maybe<Array<StorageBagWhereInput>>
  distributionBuckets_every?: Maybe<DistributionBucketBagWhereInput>
  distributionBuckets_none?: Maybe<DistributionBucketBagWhereInput>
  distributionBuckets_some?: Maybe<DistributionBucketBagWhereInput>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  objects_every?: Maybe<StorageDataObjectWhereInput>
  objects_none?: Maybe<StorageDataObjectWhereInput>
  objects_some?: Maybe<StorageDataObjectWhereInput>
  owner?: Maybe<StorageBagOwnerWhereInput>
  owner_isNull?: Maybe<Scalars['Boolean']>
  storageBuckets_every?: Maybe<StorageBucketBagWhereInput>
  storageBuckets_none?: Maybe<StorageBucketBagWhereInput>
  storageBuckets_some?: Maybe<StorageBucketBagWhereInput>
}

export type StorageBagsConnection = {
  edges: Array<StorageBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucket = {
  acceptingNewBags: Scalars['Boolean']
  bags: Array<StorageBucketBag>
  dataObjectCountLimit: Scalars['BigInt']
  dataObjectsCount: Scalars['BigInt']
  dataObjectsSize: Scalars['BigInt']
  dataObjectsSizeLimit: Scalars['BigInt']
  id: Scalars['String']
  operatorMetadata?: Maybe<StorageBucketOperatorMetadata>
  operatorStatus: StorageBucketOperatorStatus
}

export type StorageBucketBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketBagOrderByInput>>
  where?: Maybe<StorageBucketBagWhereInput>
}

export type StorageBucketBag = {
  bag: StorageBag
  id: Scalars['String']
  storageBucket: StorageBucket
}

export type StorageBucketBagEdge = {
  cursor: Scalars['String']
  node: StorageBucketBag
}

export enum StorageBucketBagOrderByInput {
  BagIdAsc = 'bag_id_ASC',
  BagIdDesc = 'bag_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StorageBucketAcceptingNewBagsAsc = 'storageBucket_acceptingNewBags_ASC',
  StorageBucketAcceptingNewBagsDesc = 'storageBucket_acceptingNewBags_DESC',
  StorageBucketDataObjectCountLimitAsc = 'storageBucket_dataObjectCountLimit_ASC',
  StorageBucketDataObjectCountLimitDesc = 'storageBucket_dataObjectCountLimit_DESC',
  StorageBucketDataObjectsCountAsc = 'storageBucket_dataObjectsCount_ASC',
  StorageBucketDataObjectsCountDesc = 'storageBucket_dataObjectsCount_DESC',
  StorageBucketDataObjectsSizeLimitAsc = 'storageBucket_dataObjectsSizeLimit_ASC',
  StorageBucketDataObjectsSizeLimitDesc = 'storageBucket_dataObjectsSizeLimit_DESC',
  StorageBucketDataObjectsSizeAsc = 'storageBucket_dataObjectsSize_ASC',
  StorageBucketDataObjectsSizeDesc = 'storageBucket_dataObjectsSize_DESC',
  StorageBucketIdAsc = 'storageBucket_id_ASC',
  StorageBucketIdDesc = 'storageBucket_id_DESC',
}

export type StorageBucketBagWhereInput = {
  AND?: Maybe<Array<StorageBucketBagWhereInput>>
  OR?: Maybe<Array<StorageBucketBagWhereInput>>
  bag?: Maybe<StorageBagWhereInput>
  bag_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  storageBucket?: Maybe<StorageBucketWhereInput>
  storageBucket_isNull?: Maybe<Scalars['Boolean']>
}

export type StorageBucketBagsConnection = {
  edges: Array<StorageBucketBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucketEdge = {
  cursor: Scalars['String']
  node: StorageBucket
}

export type StorageBucketOperatorMetadata = {
  extra?: Maybe<Scalars['String']>
  id: Scalars['String']
  nodeEndpoint?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadata>
  storageBucket: StorageBucket
}

export type StorageBucketOperatorMetadataConnection = {
  edges: Array<StorageBucketOperatorMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucketOperatorMetadataEdge = {
  cursor: Scalars['String']
  node: StorageBucketOperatorMetadata
}

export enum StorageBucketOperatorMetadataOrderByInput {
  ExtraAsc = 'extra_ASC',
  ExtraDesc = 'extra_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeEndpointAsc = 'nodeEndpoint_ASC',
  NodeEndpointDesc = 'nodeEndpoint_DESC',
  NodeLocationCityAsc = 'nodeLocation_city_ASC',
  NodeLocationCityDesc = 'nodeLocation_city_DESC',
  NodeLocationCountryCodeAsc = 'nodeLocation_countryCode_ASC',
  NodeLocationCountryCodeDesc = 'nodeLocation_countryCode_DESC',
  StorageBucketAcceptingNewBagsAsc = 'storageBucket_acceptingNewBags_ASC',
  StorageBucketAcceptingNewBagsDesc = 'storageBucket_acceptingNewBags_DESC',
  StorageBucketDataObjectCountLimitAsc = 'storageBucket_dataObjectCountLimit_ASC',
  StorageBucketDataObjectCountLimitDesc = 'storageBucket_dataObjectCountLimit_DESC',
  StorageBucketDataObjectsCountAsc = 'storageBucket_dataObjectsCount_ASC',
  StorageBucketDataObjectsCountDesc = 'storageBucket_dataObjectsCount_DESC',
  StorageBucketDataObjectsSizeLimitAsc = 'storageBucket_dataObjectsSizeLimit_ASC',
  StorageBucketDataObjectsSizeLimitDesc = 'storageBucket_dataObjectsSizeLimit_DESC',
  StorageBucketDataObjectsSizeAsc = 'storageBucket_dataObjectsSize_ASC',
  StorageBucketDataObjectsSizeDesc = 'storageBucket_dataObjectsSize_DESC',
  StorageBucketIdAsc = 'storageBucket_id_ASC',
  StorageBucketIdDesc = 'storageBucket_id_DESC',
}

export type StorageBucketOperatorMetadataWhereInput = {
  AND?: Maybe<Array<StorageBucketOperatorMetadataWhereInput>>
  OR?: Maybe<Array<StorageBucketOperatorMetadataWhereInput>>
  extra_contains?: Maybe<Scalars['String']>
  extra_containsInsensitive?: Maybe<Scalars['String']>
  extra_endsWith?: Maybe<Scalars['String']>
  extra_eq?: Maybe<Scalars['String']>
  extra_gt?: Maybe<Scalars['String']>
  extra_gte?: Maybe<Scalars['String']>
  extra_in?: Maybe<Array<Scalars['String']>>
  extra_isNull?: Maybe<Scalars['Boolean']>
  extra_lt?: Maybe<Scalars['String']>
  extra_lte?: Maybe<Scalars['String']>
  extra_not_contains?: Maybe<Scalars['String']>
  extra_not_containsInsensitive?: Maybe<Scalars['String']>
  extra_not_endsWith?: Maybe<Scalars['String']>
  extra_not_eq?: Maybe<Scalars['String']>
  extra_not_in?: Maybe<Array<Scalars['String']>>
  extra_not_startsWith?: Maybe<Scalars['String']>
  extra_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  nodeEndpoint_contains?: Maybe<Scalars['String']>
  nodeEndpoint_containsInsensitive?: Maybe<Scalars['String']>
  nodeEndpoint_endsWith?: Maybe<Scalars['String']>
  nodeEndpoint_eq?: Maybe<Scalars['String']>
  nodeEndpoint_gt?: Maybe<Scalars['String']>
  nodeEndpoint_gte?: Maybe<Scalars['String']>
  nodeEndpoint_in?: Maybe<Array<Scalars['String']>>
  nodeEndpoint_isNull?: Maybe<Scalars['Boolean']>
  nodeEndpoint_lt?: Maybe<Scalars['String']>
  nodeEndpoint_lte?: Maybe<Scalars['String']>
  nodeEndpoint_not_contains?: Maybe<Scalars['String']>
  nodeEndpoint_not_containsInsensitive?: Maybe<Scalars['String']>
  nodeEndpoint_not_endsWith?: Maybe<Scalars['String']>
  nodeEndpoint_not_eq?: Maybe<Scalars['String']>
  nodeEndpoint_not_in?: Maybe<Array<Scalars['String']>>
  nodeEndpoint_not_startsWith?: Maybe<Scalars['String']>
  nodeEndpoint_startsWith?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadataWhereInput>
  nodeLocation_isNull?: Maybe<Scalars['Boolean']>
  storageBucket?: Maybe<StorageBucketWhereInput>
  storageBucket_isNull?: Maybe<Scalars['Boolean']>
}

export type StorageBucketOperatorStatus =
  | StorageBucketOperatorStatusActive
  | StorageBucketOperatorStatusInvited
  | StorageBucketOperatorStatusMissing

export type StorageBucketOperatorStatusActive = {
  transactorAccountId: Scalars['String']
  workerId: Scalars['Int']
}

export type StorageBucketOperatorStatusInvited = {
  workerId: Scalars['Int']
}

export type StorageBucketOperatorStatusMissing = {
  phantom?: Maybe<Scalars['Int']>
}

export type StorageBucketOperatorStatusWhereInput = {
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  phantom_eq?: Maybe<Scalars['Int']>
  phantom_gt?: Maybe<Scalars['Int']>
  phantom_gte?: Maybe<Scalars['Int']>
  phantom_in?: Maybe<Array<Scalars['Int']>>
  phantom_isNull?: Maybe<Scalars['Boolean']>
  phantom_lt?: Maybe<Scalars['Int']>
  phantom_lte?: Maybe<Scalars['Int']>
  phantom_not_eq?: Maybe<Scalars['Int']>
  phantom_not_in?: Maybe<Array<Scalars['Int']>>
  transactorAccountId_contains?: Maybe<Scalars['String']>
  transactorAccountId_containsInsensitive?: Maybe<Scalars['String']>
  transactorAccountId_endsWith?: Maybe<Scalars['String']>
  transactorAccountId_eq?: Maybe<Scalars['String']>
  transactorAccountId_gt?: Maybe<Scalars['String']>
  transactorAccountId_gte?: Maybe<Scalars['String']>
  transactorAccountId_in?: Maybe<Array<Scalars['String']>>
  transactorAccountId_isNull?: Maybe<Scalars['Boolean']>
  transactorAccountId_lt?: Maybe<Scalars['String']>
  transactorAccountId_lte?: Maybe<Scalars['String']>
  transactorAccountId_not_contains?: Maybe<Scalars['String']>
  transactorAccountId_not_containsInsensitive?: Maybe<Scalars['String']>
  transactorAccountId_not_endsWith?: Maybe<Scalars['String']>
  transactorAccountId_not_eq?: Maybe<Scalars['String']>
  transactorAccountId_not_in?: Maybe<Array<Scalars['String']>>
  transactorAccountId_not_startsWith?: Maybe<Scalars['String']>
  transactorAccountId_startsWith?: Maybe<Scalars['String']>
  workerId_eq?: Maybe<Scalars['Int']>
  workerId_gt?: Maybe<Scalars['Int']>
  workerId_gte?: Maybe<Scalars['Int']>
  workerId_in?: Maybe<Array<Scalars['Int']>>
  workerId_isNull?: Maybe<Scalars['Boolean']>
  workerId_lt?: Maybe<Scalars['Int']>
  workerId_lte?: Maybe<Scalars['Int']>
  workerId_not_eq?: Maybe<Scalars['Int']>
  workerId_not_in?: Maybe<Array<Scalars['Int']>>
}

export enum StorageBucketOrderByInput {
  AcceptingNewBagsAsc = 'acceptingNewBags_ASC',
  AcceptingNewBagsDesc = 'acceptingNewBags_DESC',
  DataObjectCountLimitAsc = 'dataObjectCountLimit_ASC',
  DataObjectCountLimitDesc = 'dataObjectCountLimit_DESC',
  DataObjectsCountAsc = 'dataObjectsCount_ASC',
  DataObjectsCountDesc = 'dataObjectsCount_DESC',
  DataObjectsSizeLimitAsc = 'dataObjectsSizeLimit_ASC',
  DataObjectsSizeLimitDesc = 'dataObjectsSizeLimit_DESC',
  DataObjectsSizeAsc = 'dataObjectsSize_ASC',
  DataObjectsSizeDesc = 'dataObjectsSize_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  OperatorMetadataExtraAsc = 'operatorMetadata_extra_ASC',
  OperatorMetadataExtraDesc = 'operatorMetadata_extra_DESC',
  OperatorMetadataIdAsc = 'operatorMetadata_id_ASC',
  OperatorMetadataIdDesc = 'operatorMetadata_id_DESC',
  OperatorMetadataNodeEndpointAsc = 'operatorMetadata_nodeEndpoint_ASC',
  OperatorMetadataNodeEndpointDesc = 'operatorMetadata_nodeEndpoint_DESC',
  OperatorStatusIsTypeOfAsc = 'operatorStatus_isTypeOf_ASC',
  OperatorStatusIsTypeOfDesc = 'operatorStatus_isTypeOf_DESC',
  OperatorStatusPhantomAsc = 'operatorStatus_phantom_ASC',
  OperatorStatusPhantomDesc = 'operatorStatus_phantom_DESC',
  OperatorStatusTransactorAccountIdAsc = 'operatorStatus_transactorAccountId_ASC',
  OperatorStatusTransactorAccountIdDesc = 'operatorStatus_transactorAccountId_DESC',
  OperatorStatusWorkerIdAsc = 'operatorStatus_workerId_ASC',
  OperatorStatusWorkerIdDesc = 'operatorStatus_workerId_DESC',
}

export type StorageBucketWhereInput = {
  AND?: Maybe<Array<StorageBucketWhereInput>>
  OR?: Maybe<Array<StorageBucketWhereInput>>
  acceptingNewBags_eq?: Maybe<Scalars['Boolean']>
  acceptingNewBags_isNull?: Maybe<Scalars['Boolean']>
  acceptingNewBags_not_eq?: Maybe<Scalars['Boolean']>
  bags_every?: Maybe<StorageBucketBagWhereInput>
  bags_none?: Maybe<StorageBucketBagWhereInput>
  bags_some?: Maybe<StorageBucketBagWhereInput>
  dataObjectCountLimit_eq?: Maybe<Scalars['BigInt']>
  dataObjectCountLimit_gt?: Maybe<Scalars['BigInt']>
  dataObjectCountLimit_gte?: Maybe<Scalars['BigInt']>
  dataObjectCountLimit_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectCountLimit_isNull?: Maybe<Scalars['Boolean']>
  dataObjectCountLimit_lt?: Maybe<Scalars['BigInt']>
  dataObjectCountLimit_lte?: Maybe<Scalars['BigInt']>
  dataObjectCountLimit_not_eq?: Maybe<Scalars['BigInt']>
  dataObjectCountLimit_not_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectsCount_eq?: Maybe<Scalars['BigInt']>
  dataObjectsCount_gt?: Maybe<Scalars['BigInt']>
  dataObjectsCount_gte?: Maybe<Scalars['BigInt']>
  dataObjectsCount_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectsCount_isNull?: Maybe<Scalars['Boolean']>
  dataObjectsCount_lt?: Maybe<Scalars['BigInt']>
  dataObjectsCount_lte?: Maybe<Scalars['BigInt']>
  dataObjectsCount_not_eq?: Maybe<Scalars['BigInt']>
  dataObjectsCount_not_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectsSizeLimit_eq?: Maybe<Scalars['BigInt']>
  dataObjectsSizeLimit_gt?: Maybe<Scalars['BigInt']>
  dataObjectsSizeLimit_gte?: Maybe<Scalars['BigInt']>
  dataObjectsSizeLimit_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectsSizeLimit_isNull?: Maybe<Scalars['Boolean']>
  dataObjectsSizeLimit_lt?: Maybe<Scalars['BigInt']>
  dataObjectsSizeLimit_lte?: Maybe<Scalars['BigInt']>
  dataObjectsSizeLimit_not_eq?: Maybe<Scalars['BigInt']>
  dataObjectsSizeLimit_not_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectsSize_eq?: Maybe<Scalars['BigInt']>
  dataObjectsSize_gt?: Maybe<Scalars['BigInt']>
  dataObjectsSize_gte?: Maybe<Scalars['BigInt']>
  dataObjectsSize_in?: Maybe<Array<Scalars['BigInt']>>
  dataObjectsSize_isNull?: Maybe<Scalars['Boolean']>
  dataObjectsSize_lt?: Maybe<Scalars['BigInt']>
  dataObjectsSize_lte?: Maybe<Scalars['BigInt']>
  dataObjectsSize_not_eq?: Maybe<Scalars['BigInt']>
  dataObjectsSize_not_in?: Maybe<Array<Scalars['BigInt']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  operatorMetadata?: Maybe<StorageBucketOperatorMetadataWhereInput>
  operatorMetadata_isNull?: Maybe<Scalars['Boolean']>
  operatorStatus?: Maybe<StorageBucketOperatorStatusWhereInput>
  operatorStatus_isNull?: Maybe<Scalars['Boolean']>
}

export type StorageBucketsConnection = {
  edges: Array<StorageBucketEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageDataObject = {
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  ipfsHash: Scalars['String']
  isAccepted: Scalars['Boolean']
  resolvedUrls: Array<Scalars['String']>
  size: Scalars['BigInt']
  stateBloatBond: Scalars['BigInt']
  storageBag: StorageBag
  type?: Maybe<DataObjectType>
  unsetAt?: Maybe<Scalars['DateTime']>
}

export type StorageDataObjectEdge = {
  cursor: Scalars['String']
  node: StorageDataObject
}

export enum StorageDataObjectOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpfsHashAsc = 'ipfsHash_ASC',
  IpfsHashDesc = 'ipfsHash_DESC',
  IsAcceptedAsc = 'isAccepted_ASC',
  IsAcceptedDesc = 'isAccepted_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  StateBloatBondAsc = 'stateBloatBond_ASC',
  StateBloatBondDesc = 'stateBloatBond_DESC',
  StorageBagIdAsc = 'storageBag_id_ASC',
  StorageBagIdDesc = 'storageBag_id_DESC',
  TypeIsTypeOfAsc = 'type_isTypeOf_ASC',
  TypeIsTypeOfDesc = 'type_isTypeOf_DESC',
  TypePhantomAsc = 'type_phantom_ASC',
  TypePhantomDesc = 'type_phantom_DESC',
  UnsetAtAsc = 'unsetAt_ASC',
  UnsetAtDesc = 'unsetAt_DESC',
}

export type StorageDataObjectWhereInput = {
  AND?: Maybe<Array<StorageDataObjectWhereInput>>
  OR?: Maybe<Array<StorageDataObjectWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  ipfsHash_contains?: Maybe<Scalars['String']>
  ipfsHash_containsInsensitive?: Maybe<Scalars['String']>
  ipfsHash_endsWith?: Maybe<Scalars['String']>
  ipfsHash_eq?: Maybe<Scalars['String']>
  ipfsHash_gt?: Maybe<Scalars['String']>
  ipfsHash_gte?: Maybe<Scalars['String']>
  ipfsHash_in?: Maybe<Array<Scalars['String']>>
  ipfsHash_isNull?: Maybe<Scalars['Boolean']>
  ipfsHash_lt?: Maybe<Scalars['String']>
  ipfsHash_lte?: Maybe<Scalars['String']>
  ipfsHash_not_contains?: Maybe<Scalars['String']>
  ipfsHash_not_containsInsensitive?: Maybe<Scalars['String']>
  ipfsHash_not_endsWith?: Maybe<Scalars['String']>
  ipfsHash_not_eq?: Maybe<Scalars['String']>
  ipfsHash_not_in?: Maybe<Array<Scalars['String']>>
  ipfsHash_not_startsWith?: Maybe<Scalars['String']>
  ipfsHash_startsWith?: Maybe<Scalars['String']>
  isAccepted_eq?: Maybe<Scalars['Boolean']>
  isAccepted_isNull?: Maybe<Scalars['Boolean']>
  isAccepted_not_eq?: Maybe<Scalars['Boolean']>
  resolvedUrls_containsAll?: Maybe<Array<Scalars['String']>>
  resolvedUrls_containsAny?: Maybe<Array<Scalars['String']>>
  resolvedUrls_containsNone?: Maybe<Array<Scalars['String']>>
  resolvedUrls_isNull?: Maybe<Scalars['Boolean']>
  size_eq?: Maybe<Scalars['BigInt']>
  size_gt?: Maybe<Scalars['BigInt']>
  size_gte?: Maybe<Scalars['BigInt']>
  size_in?: Maybe<Array<Scalars['BigInt']>>
  size_isNull?: Maybe<Scalars['Boolean']>
  size_lt?: Maybe<Scalars['BigInt']>
  size_lte?: Maybe<Scalars['BigInt']>
  size_not_eq?: Maybe<Scalars['BigInt']>
  size_not_in?: Maybe<Array<Scalars['BigInt']>>
  stateBloatBond_eq?: Maybe<Scalars['BigInt']>
  stateBloatBond_gt?: Maybe<Scalars['BigInt']>
  stateBloatBond_gte?: Maybe<Scalars['BigInt']>
  stateBloatBond_in?: Maybe<Array<Scalars['BigInt']>>
  stateBloatBond_isNull?: Maybe<Scalars['Boolean']>
  stateBloatBond_lt?: Maybe<Scalars['BigInt']>
  stateBloatBond_lte?: Maybe<Scalars['BigInt']>
  stateBloatBond_not_eq?: Maybe<Scalars['BigInt']>
  stateBloatBond_not_in?: Maybe<Array<Scalars['BigInt']>>
  storageBag?: Maybe<StorageBagWhereInput>
  storageBag_isNull?: Maybe<Scalars['Boolean']>
  type?: Maybe<DataObjectTypeWhereInput>
  type_isNull?: Maybe<Scalars['Boolean']>
  unsetAt_eq?: Maybe<Scalars['DateTime']>
  unsetAt_gt?: Maybe<Scalars['DateTime']>
  unsetAt_gte?: Maybe<Scalars['DateTime']>
  unsetAt_in?: Maybe<Array<Scalars['DateTime']>>
  unsetAt_isNull?: Maybe<Scalars['Boolean']>
  unsetAt_lt?: Maybe<Scalars['DateTime']>
  unsetAt_lte?: Maybe<Scalars['DateTime']>
  unsetAt_not_eq?: Maybe<Scalars['DateTime']>
  unsetAt_not_in?: Maybe<Array<Scalars['DateTime']>>
}

export type StorageDataObjectsConnection = {
  edges: Array<StorageDataObjectEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Subscription = {
  appById?: Maybe<App>
  apps: Array<App>
  auctionById?: Maybe<Auction>
  auctionWhitelistedMemberById?: Maybe<AuctionWhitelistedMember>
  auctionWhitelistedMembers: Array<AuctionWhitelistedMember>
  auctions: Array<Auction>
  bannedMemberById?: Maybe<BannedMember>
  bannedMembers: Array<BannedMember>
  bidById?: Maybe<Bid>
  bids: Array<Bid>
  channelById?: Maybe<Channel>
  channelFollowById?: Maybe<ChannelFollow>
  channelFollows: Array<ChannelFollow>
  channels: Array<Channel>
  commentById?: Maybe<Comment>
  commentReactionById?: Maybe<CommentReaction>
  commentReactions: Array<CommentReaction>
  comments: Array<Comment>
  curatorById?: Maybe<Curator>
  curatorGroupById?: Maybe<CuratorGroup>
  curatorGroups: Array<CuratorGroup>
  curators: Array<Curator>
  distributionBucketBagById?: Maybe<DistributionBucketBag>
  distributionBucketBags: Array<DistributionBucketBag>
  distributionBucketById?: Maybe<DistributionBucket>
  distributionBucketFamilies: Array<DistributionBucketFamily>
  distributionBucketFamilyById?: Maybe<DistributionBucketFamily>
  distributionBucketFamilyMetadata: Array<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataById?: Maybe<DistributionBucketFamilyMetadata>
  distributionBucketOperatorById?: Maybe<DistributionBucketOperator>
  distributionBucketOperatorMetadata: Array<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataById?: Maybe<DistributionBucketOperatorMetadata>
  distributionBucketOperators: Array<DistributionBucketOperator>
  distributionBuckets: Array<DistributionBucket>
  eventById?: Maybe<Event>
  events: Array<Event>
  licenseById?: Maybe<License>
  licenses: Array<License>
  memberMetadata: Array<MemberMetadata>
  memberMetadataById?: Maybe<MemberMetadata>
  membershipById?: Maybe<Membership>
  memberships: Array<Membership>
  nftActivities: Array<NftActivity>
  nftActivityById?: Maybe<NftActivity>
  nftFeaturingRequestById?: Maybe<NftFeaturingRequest>
  nftFeaturingRequests: Array<NftFeaturingRequest>
  nftHistoryEntries: Array<NftHistoryEntry>
  nftHistoryEntryById?: Maybe<NftHistoryEntry>
  notificationById?: Maybe<Notification>
  notifications: Array<Notification>
  ownedNftById?: Maybe<OwnedNft>
  ownedNfts: Array<OwnedNft>
  processorState: ProcessorState
  reportById?: Maybe<Report>
  reports: Array<Report>
  storageBagById?: Maybe<StorageBag>
  storageBags: Array<StorageBag>
  storageBucketBagById?: Maybe<StorageBucketBag>
  storageBucketBags: Array<StorageBucketBag>
  storageBucketById?: Maybe<StorageBucket>
  storageBucketOperatorMetadata: Array<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataById?: Maybe<StorageBucketOperatorMetadata>
  storageBuckets: Array<StorageBucket>
  storageDataObjectById?: Maybe<StorageDataObject>
  storageDataObjects: Array<StorageDataObject>
  videoById?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  videoCategoryById?: Maybe<VideoCategory>
  videoFeaturedInCategories: Array<VideoFeaturedInCategory>
  videoFeaturedInCategoryById?: Maybe<VideoFeaturedInCategory>
  videoHeroById?: Maybe<VideoHero>
  videoHeros: Array<VideoHero>
  videoMediaEncodingById?: Maybe<VideoMediaEncoding>
  videoMediaEncodings: Array<VideoMediaEncoding>
  videoMediaMetadata: Array<VideoMediaMetadata>
  videoMediaMetadataById?: Maybe<VideoMediaMetadata>
  videoReactionById?: Maybe<VideoReaction>
  videoReactions: Array<VideoReaction>
  videoSubtitleById?: Maybe<VideoSubtitle>
  videoSubtitles: Array<VideoSubtitle>
  videoViewEventById?: Maybe<VideoViewEvent>
  videoViewEvents: Array<VideoViewEvent>
  videos: Array<Video>
}

export type SubscriptionAppByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAppsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AppOrderByInput>>
  where?: Maybe<AppWhereInput>
}

export type SubscriptionAuctionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAuctionWhitelistedMemberByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAuctionWhitelistedMembersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: Maybe<AuctionWhitelistedMemberWhereInput>
}

export type SubscriptionAuctionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<AuctionOrderByInput>>
  where?: Maybe<AuctionWhereInput>
}

export type SubscriptionBannedMemberByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionBannedMembersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BannedMemberOrderByInput>>
  where?: Maybe<BannedMemberWhereInput>
}

export type SubscriptionBidByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionBidsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<BidOrderByInput>>
  where?: Maybe<BidWhereInput>
}

export type SubscriptionChannelByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionChannelFollowByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionChannelFollowsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelFollowOrderByInput>>
  where?: Maybe<ChannelFollowWhereInput>
}

export type SubscriptionChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type SubscriptionCommentByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCommentReactionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCommentReactionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CommentReactionOrderByInput>>
  where?: Maybe<CommentReactionWhereInput>
}

export type SubscriptionCommentsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CommentOrderByInput>>
  where?: Maybe<CommentWhereInput>
}

export type SubscriptionCuratorByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCuratorGroupByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCuratorGroupsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CuratorGroupOrderByInput>>
  where?: Maybe<CuratorGroupWhereInput>
}

export type SubscriptionCuratorsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CuratorOrderByInput>>
  where?: Maybe<CuratorWhereInput>
}

export type SubscriptionDistributionBucketBagByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketBagOrderByInput>>
  where?: Maybe<DistributionBucketBagWhereInput>
}

export type SubscriptionDistributionBucketByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketFamiliesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketFamilyOrderByInput>>
  where?: Maybe<DistributionBucketFamilyWhereInput>
}

export type SubscriptionDistributionBucketFamilyByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketFamilyMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketFamilyMetadataOrderByInput>>
  where?: Maybe<DistributionBucketFamilyMetadataWhereInput>
}

export type SubscriptionDistributionBucketFamilyMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketOperatorByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketOperatorMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOperatorMetadataOrderByInput>>
  where?: Maybe<DistributionBucketOperatorMetadataWhereInput>
}

export type SubscriptionDistributionBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketOperatorsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: Maybe<DistributionBucketOperatorWhereInput>
}

export type SubscriptionDistributionBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DistributionBucketOrderByInput>>
  where?: Maybe<DistributionBucketWhereInput>
}

export type SubscriptionEventByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionEventsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<EventOrderByInput>>
  where?: Maybe<EventWhereInput>
}

export type SubscriptionLicenseByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionLicensesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<LicenseOrderByInput>>
  where?: Maybe<LicenseWhereInput>
}

export type SubscriptionMemberMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<MemberMetadataOrderByInput>>
  where?: Maybe<MemberMetadataWhereInput>
}

export type SubscriptionMemberMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionMembershipByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionMembershipsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<MembershipOrderByInput>>
  where?: Maybe<MembershipWhereInput>
}

export type SubscriptionNftActivitiesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NftActivityOrderByInput>>
  where?: Maybe<NftActivityWhereInput>
}

export type SubscriptionNftActivityByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNftFeaturingRequestByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNftFeaturingRequestsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NftFeaturingRequestOrderByInput>>
  where?: Maybe<NftFeaturingRequestWhereInput>
}

export type SubscriptionNftHistoryEntriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NftHistoryEntryOrderByInput>>
  where?: Maybe<NftHistoryEntryWhereInput>
}

export type SubscriptionNftHistoryEntryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNotificationByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNotificationsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NotificationOrderByInput>>
  where?: Maybe<NotificationWhereInput>
}

export type SubscriptionOwnedNftByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionOwnedNftsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<OwnedNftOrderByInput>>
  where?: Maybe<OwnedNftWhereInput>
}

export type SubscriptionReportByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionReportsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ReportOrderByInput>>
  where?: Maybe<ReportWhereInput>
}

export type SubscriptionStorageBagByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBagOrderByInput>>
  where?: Maybe<StorageBagWhereInput>
}

export type SubscriptionStorageBucketBagByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBucketBagsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketBagOrderByInput>>
  where?: Maybe<StorageBucketBagWhereInput>
}

export type SubscriptionStorageBucketByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBucketOperatorMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketOperatorMetadataOrderByInput>>
  where?: Maybe<StorageBucketOperatorMetadataWhereInput>
}

export type SubscriptionStorageBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBucketsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageBucketOrderByInput>>
  where?: Maybe<StorageBucketWhereInput>
}

export type SubscriptionStorageDataObjectByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageDataObjectsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<StorageDataObjectOrderByInput>>
  where?: Maybe<StorageDataObjectWhereInput>
}

export type SubscriptionVideoByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoCategoryOrderByInput>>
  where?: Maybe<VideoCategoryWhereInput>
}

export type SubscriptionVideoCategoryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoFeaturedInCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoFeaturedInCategoryOrderByInput>>
  where?: Maybe<VideoFeaturedInCategoryWhereInput>
}

export type SubscriptionVideoFeaturedInCategoryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoHeroByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoHerosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoHeroOrderByInput>>
  where?: Maybe<VideoHeroWhereInput>
}

export type SubscriptionVideoMediaEncodingByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoMediaEncodingsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaEncodingOrderByInput>>
  where?: Maybe<VideoMediaEncodingWhereInput>
}

export type SubscriptionVideoMediaMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaMetadataOrderByInput>>
  where?: Maybe<VideoMediaMetadataWhereInput>
}

export type SubscriptionVideoMediaMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoReactionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoReactionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoReactionOrderByInput>>
  where?: Maybe<VideoReactionWhereInput>
}

export type SubscriptionVideoSubtitleByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoSubtitlesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoSubtitleOrderByInput>>
  where?: Maybe<VideoSubtitleWhereInput>
}

export type SubscriptionVideoViewEventByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoViewEventsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoViewEventOrderByInput>>
  where?: Maybe<VideoViewEventWhereInput>
}

export type SubscriptionVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export type TopSellingChannelsResult = {
  amount: Scalars['String']
  channel: Channel
  nftSold: Scalars['Int']
}

export type TransactionalStatus =
  | TransactionalStatusAuction
  | TransactionalStatusBuyNow
  | TransactionalStatusIdle
  | TransactionalStatusInitiatedOfferToMember

export type TransactionalStatusAuction = {
  auction: Auction
}

export type TransactionalStatusBuyNow = {
  price: Scalars['BigInt']
}

export type TransactionalStatusIdle = {
  phantom?: Maybe<Scalars['Int']>
}

export type TransactionalStatusInitiatedOfferToMember = {
  member: Membership
  price?: Maybe<Scalars['BigInt']>
}

export type TransactionalStatusWhereInput = {
  auction?: Maybe<AuctionWhereInput>
  auction_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_contains?: Maybe<Scalars['String']>
  isTypeOf_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_endsWith?: Maybe<Scalars['String']>
  isTypeOf_eq?: Maybe<Scalars['String']>
  isTypeOf_gt?: Maybe<Scalars['String']>
  isTypeOf_gte?: Maybe<Scalars['String']>
  isTypeOf_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_isNull?: Maybe<Scalars['Boolean']>
  isTypeOf_lt?: Maybe<Scalars['String']>
  isTypeOf_lte?: Maybe<Scalars['String']>
  isTypeOf_not_contains?: Maybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: Maybe<Scalars['String']>
  isTypeOf_not_endsWith?: Maybe<Scalars['String']>
  isTypeOf_not_eq?: Maybe<Scalars['String']>
  isTypeOf_not_in?: Maybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: Maybe<Scalars['String']>
  isTypeOf_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
  phantom_eq?: Maybe<Scalars['Int']>
  phantom_gt?: Maybe<Scalars['Int']>
  phantom_gte?: Maybe<Scalars['Int']>
  phantom_in?: Maybe<Array<Scalars['Int']>>
  phantom_isNull?: Maybe<Scalars['Boolean']>
  phantom_lt?: Maybe<Scalars['Int']>
  phantom_lte?: Maybe<Scalars['Int']>
  phantom_not_eq?: Maybe<Scalars['Int']>
  phantom_not_in?: Maybe<Array<Scalars['Int']>>
  price_eq?: Maybe<Scalars['BigInt']>
  price_gt?: Maybe<Scalars['BigInt']>
  price_gte?: Maybe<Scalars['BigInt']>
  price_in?: Maybe<Array<Scalars['BigInt']>>
  price_isNull?: Maybe<Scalars['Boolean']>
  price_lt?: Maybe<Scalars['BigInt']>
  price_lte?: Maybe<Scalars['BigInt']>
  price_not_eq?: Maybe<Scalars['BigInt']>
  price_not_in?: Maybe<Array<Scalars['BigInt']>>
}

export type Video = {
  category?: Maybe<VideoCategory>
  channel: Channel
  comments: Array<Comment>
  commentsCount: Scalars['Int']
  createdAt: Scalars['DateTime']
  createdInBlock: Scalars['Int']
  description?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['Int']>
  entryApp?: Maybe<App>
  hasMarketing?: Maybe<Scalars['Boolean']>
  id: Scalars['String']
  isCensored: Scalars['Boolean']
  isCommentSectionEnabled: Scalars['Boolean']
  isExcluded: Scalars['Boolean']
  isExplicit?: Maybe<Scalars['Boolean']>
  isPublic?: Maybe<Scalars['Boolean']>
  isReactionFeatureEnabled: Scalars['Boolean']
  language?: Maybe<Scalars['String']>
  license?: Maybe<License>
  media?: Maybe<StorageDataObject>
  mediaMetadata?: Maybe<VideoMediaMetadata>
  nft?: Maybe<OwnedNft>
  pinnedComment?: Maybe<Comment>
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  reactions: Array<VideoReaction>
  reactionsCount: Scalars['Int']
  reactionsCountByReactionId?: Maybe<Array<VideoReactionsCountByReactionType>>
  subtitles: Array<VideoSubtitle>
  thumbnailPhoto?: Maybe<StorageDataObject>
  title?: Maybe<Scalars['String']>
  videoStateBloatBond: Scalars['BigInt']
  viewsNum: Scalars['Int']
  ytVideoId?: Maybe<Scalars['String']>
}

export type VideoCommentsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CommentOrderByInput>>
  where?: Maybe<CommentWhereInput>
}

export type VideoReactionsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoReactionOrderByInput>>
  where?: Maybe<VideoReactionWhereInput>
}

export type VideoSubtitlesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoSubtitleOrderByInput>>
  where?: Maybe<VideoSubtitleWhereInput>
}

export type VideoCategoriesConnection = {
  edges: Array<VideoCategoryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoCategory = {
  createdInBlock: Scalars['Int']
  description?: Maybe<Scalars['String']>
  featuredVideos: Array<VideoFeaturedInCategory>
  id: Scalars['String']
  isSupported: Scalars['Boolean']
  name?: Maybe<Scalars['String']>
  parentCategory?: Maybe<VideoCategory>
  videos: Array<Video>
}

export type VideoCategoryFeaturedVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoFeaturedInCategoryOrderByInput>>
  where?: Maybe<VideoFeaturedInCategoryWhereInput>
}

export type VideoCategoryVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export type VideoCategoryEdge = {
  cursor: Scalars['String']
  node: VideoCategory
}

export enum VideoCategoryOrderByInput {
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsSupportedAsc = 'isSupported_ASC',
  IsSupportedDesc = 'isSupported_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  ParentCategoryCreatedInBlockAsc = 'parentCategory_createdInBlock_ASC',
  ParentCategoryCreatedInBlockDesc = 'parentCategory_createdInBlock_DESC',
  ParentCategoryDescriptionAsc = 'parentCategory_description_ASC',
  ParentCategoryDescriptionDesc = 'parentCategory_description_DESC',
  ParentCategoryIdAsc = 'parentCategory_id_ASC',
  ParentCategoryIdDesc = 'parentCategory_id_DESC',
  ParentCategoryIsSupportedAsc = 'parentCategory_isSupported_ASC',
  ParentCategoryIsSupportedDesc = 'parentCategory_isSupported_DESC',
  ParentCategoryNameAsc = 'parentCategory_name_ASC',
  ParentCategoryNameDesc = 'parentCategory_name_DESC',
}

export type VideoCategoryWhereInput = {
  AND?: Maybe<Array<VideoCategoryWhereInput>>
  OR?: Maybe<Array<VideoCategoryWhereInput>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: Maybe<Scalars['Boolean']>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  createdInBlock_not_eq?: Maybe<Scalars['Int']>
  createdInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  description_contains?: Maybe<Scalars['String']>
  description_containsInsensitive?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_gt?: Maybe<Scalars['String']>
  description_gte?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_isNull?: Maybe<Scalars['Boolean']>
  description_lt?: Maybe<Scalars['String']>
  description_lte?: Maybe<Scalars['String']>
  description_not_contains?: Maybe<Scalars['String']>
  description_not_containsInsensitive?: Maybe<Scalars['String']>
  description_not_endsWith?: Maybe<Scalars['String']>
  description_not_eq?: Maybe<Scalars['String']>
  description_not_in?: Maybe<Array<Scalars['String']>>
  description_not_startsWith?: Maybe<Scalars['String']>
  description_startsWith?: Maybe<Scalars['String']>
  featuredVideos_every?: Maybe<VideoFeaturedInCategoryWhereInput>
  featuredVideos_none?: Maybe<VideoFeaturedInCategoryWhereInput>
  featuredVideos_some?: Maybe<VideoFeaturedInCategoryWhereInput>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isSupported_eq?: Maybe<Scalars['Boolean']>
  isSupported_isNull?: Maybe<Scalars['Boolean']>
  isSupported_not_eq?: Maybe<Scalars['Boolean']>
  name_contains?: Maybe<Scalars['String']>
  name_containsInsensitive?: Maybe<Scalars['String']>
  name_endsWith?: Maybe<Scalars['String']>
  name_eq?: Maybe<Scalars['String']>
  name_gt?: Maybe<Scalars['String']>
  name_gte?: Maybe<Scalars['String']>
  name_in?: Maybe<Array<Scalars['String']>>
  name_isNull?: Maybe<Scalars['Boolean']>
  name_lt?: Maybe<Scalars['String']>
  name_lte?: Maybe<Scalars['String']>
  name_not_contains?: Maybe<Scalars['String']>
  name_not_containsInsensitive?: Maybe<Scalars['String']>
  name_not_endsWith?: Maybe<Scalars['String']>
  name_not_eq?: Maybe<Scalars['String']>
  name_not_in?: Maybe<Array<Scalars['String']>>
  name_not_startsWith?: Maybe<Scalars['String']>
  name_startsWith?: Maybe<Scalars['String']>
  parentCategory?: Maybe<VideoCategoryWhereInput>
  parentCategory_isNull?: Maybe<Scalars['Boolean']>
  videos_every?: Maybe<VideoWhereInput>
  videos_none?: Maybe<VideoWhereInput>
  videos_some?: Maybe<VideoWhereInput>
}

export type VideoEdge = {
  cursor: Scalars['String']
  node: Video
}

export type VideoFeaturedInCategoriesConnection = {
  edges: Array<VideoFeaturedInCategoryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoFeaturedInCategory = {
  category: VideoCategory
  id: Scalars['String']
  video: Video
  videoCutUrl?: Maybe<Scalars['String']>
}

export type VideoFeaturedInCategoryEdge = {
  cursor: Scalars['String']
  node: VideoFeaturedInCategory
}

export enum VideoFeaturedInCategoryOrderByInput {
  CategoryCreatedInBlockAsc = 'category_createdInBlock_ASC',
  CategoryCreatedInBlockDesc = 'category_createdInBlock_DESC',
  CategoryDescriptionAsc = 'category_description_ASC',
  CategoryDescriptionDesc = 'category_description_DESC',
  CategoryIdAsc = 'category_id_ASC',
  CategoryIdDesc = 'category_id_DESC',
  CategoryIsSupportedAsc = 'category_isSupported_ASC',
  CategoryIsSupportedDesc = 'category_isSupported_DESC',
  CategoryNameAsc = 'category_name_ASC',
  CategoryNameDesc = 'category_name_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  VideoCutUrlAsc = 'videoCutUrl_ASC',
  VideoCutUrlDesc = 'videoCutUrl_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoFeaturedInCategoryWhereInput = {
  AND?: Maybe<Array<VideoFeaturedInCategoryWhereInput>>
  OR?: Maybe<Array<VideoFeaturedInCategoryWhereInput>>
  category?: Maybe<VideoCategoryWhereInput>
  category_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  video?: Maybe<VideoWhereInput>
  videoCutUrl_contains?: Maybe<Scalars['String']>
  videoCutUrl_containsInsensitive?: Maybe<Scalars['String']>
  videoCutUrl_endsWith?: Maybe<Scalars['String']>
  videoCutUrl_eq?: Maybe<Scalars['String']>
  videoCutUrl_gt?: Maybe<Scalars['String']>
  videoCutUrl_gte?: Maybe<Scalars['String']>
  videoCutUrl_in?: Maybe<Array<Scalars['String']>>
  videoCutUrl_isNull?: Maybe<Scalars['Boolean']>
  videoCutUrl_lt?: Maybe<Scalars['String']>
  videoCutUrl_lte?: Maybe<Scalars['String']>
  videoCutUrl_not_contains?: Maybe<Scalars['String']>
  videoCutUrl_not_containsInsensitive?: Maybe<Scalars['String']>
  videoCutUrl_not_endsWith?: Maybe<Scalars['String']>
  videoCutUrl_not_eq?: Maybe<Scalars['String']>
  videoCutUrl_not_in?: Maybe<Array<Scalars['String']>>
  videoCutUrl_not_startsWith?: Maybe<Scalars['String']>
  videoCutUrl_startsWith?: Maybe<Scalars['String']>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type VideoHero = {
  activatedAt?: Maybe<Scalars['DateTime']>
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  heroVideoCutUrl: Scalars['String']
  id: Scalars['String']
  video: Video
}

export type VideoHeroEdge = {
  cursor: Scalars['String']
  node: VideoHero
}

export enum VideoHeroOrderByInput {
  ActivatedAtAsc = 'activatedAt_ASC',
  ActivatedAtDesc = 'activatedAt_DESC',
  HeroPosterUrlAsc = 'heroPosterUrl_ASC',
  HeroPosterUrlDesc = 'heroPosterUrl_DESC',
  HeroTitleAsc = 'heroTitle_ASC',
  HeroTitleDesc = 'heroTitle_DESC',
  HeroVideoCutUrlAsc = 'heroVideoCutUrl_ASC',
  HeroVideoCutUrlDesc = 'heroVideoCutUrl_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoHeroWhereInput = {
  AND?: Maybe<Array<VideoHeroWhereInput>>
  OR?: Maybe<Array<VideoHeroWhereInput>>
  activatedAt_eq?: Maybe<Scalars['DateTime']>
  activatedAt_gt?: Maybe<Scalars['DateTime']>
  activatedAt_gte?: Maybe<Scalars['DateTime']>
  activatedAt_in?: Maybe<Array<Scalars['DateTime']>>
  activatedAt_isNull?: Maybe<Scalars['Boolean']>
  activatedAt_lt?: Maybe<Scalars['DateTime']>
  activatedAt_lte?: Maybe<Scalars['DateTime']>
  activatedAt_not_eq?: Maybe<Scalars['DateTime']>
  activatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  heroPosterUrl_contains?: Maybe<Scalars['String']>
  heroPosterUrl_containsInsensitive?: Maybe<Scalars['String']>
  heroPosterUrl_endsWith?: Maybe<Scalars['String']>
  heroPosterUrl_eq?: Maybe<Scalars['String']>
  heroPosterUrl_gt?: Maybe<Scalars['String']>
  heroPosterUrl_gte?: Maybe<Scalars['String']>
  heroPosterUrl_in?: Maybe<Array<Scalars['String']>>
  heroPosterUrl_isNull?: Maybe<Scalars['Boolean']>
  heroPosterUrl_lt?: Maybe<Scalars['String']>
  heroPosterUrl_lte?: Maybe<Scalars['String']>
  heroPosterUrl_not_contains?: Maybe<Scalars['String']>
  heroPosterUrl_not_containsInsensitive?: Maybe<Scalars['String']>
  heroPosterUrl_not_endsWith?: Maybe<Scalars['String']>
  heroPosterUrl_not_eq?: Maybe<Scalars['String']>
  heroPosterUrl_not_in?: Maybe<Array<Scalars['String']>>
  heroPosterUrl_not_startsWith?: Maybe<Scalars['String']>
  heroPosterUrl_startsWith?: Maybe<Scalars['String']>
  heroTitle_contains?: Maybe<Scalars['String']>
  heroTitle_containsInsensitive?: Maybe<Scalars['String']>
  heroTitle_endsWith?: Maybe<Scalars['String']>
  heroTitle_eq?: Maybe<Scalars['String']>
  heroTitle_gt?: Maybe<Scalars['String']>
  heroTitle_gte?: Maybe<Scalars['String']>
  heroTitle_in?: Maybe<Array<Scalars['String']>>
  heroTitle_isNull?: Maybe<Scalars['Boolean']>
  heroTitle_lt?: Maybe<Scalars['String']>
  heroTitle_lte?: Maybe<Scalars['String']>
  heroTitle_not_contains?: Maybe<Scalars['String']>
  heroTitle_not_containsInsensitive?: Maybe<Scalars['String']>
  heroTitle_not_endsWith?: Maybe<Scalars['String']>
  heroTitle_not_eq?: Maybe<Scalars['String']>
  heroTitle_not_in?: Maybe<Array<Scalars['String']>>
  heroTitle_not_startsWith?: Maybe<Scalars['String']>
  heroTitle_startsWith?: Maybe<Scalars['String']>
  heroVideoCutUrl_contains?: Maybe<Scalars['String']>
  heroVideoCutUrl_containsInsensitive?: Maybe<Scalars['String']>
  heroVideoCutUrl_endsWith?: Maybe<Scalars['String']>
  heroVideoCutUrl_eq?: Maybe<Scalars['String']>
  heroVideoCutUrl_gt?: Maybe<Scalars['String']>
  heroVideoCutUrl_gte?: Maybe<Scalars['String']>
  heroVideoCutUrl_in?: Maybe<Array<Scalars['String']>>
  heroVideoCutUrl_isNull?: Maybe<Scalars['Boolean']>
  heroVideoCutUrl_lt?: Maybe<Scalars['String']>
  heroVideoCutUrl_lte?: Maybe<Scalars['String']>
  heroVideoCutUrl_not_contains?: Maybe<Scalars['String']>
  heroVideoCutUrl_not_containsInsensitive?: Maybe<Scalars['String']>
  heroVideoCutUrl_not_endsWith?: Maybe<Scalars['String']>
  heroVideoCutUrl_not_eq?: Maybe<Scalars['String']>
  heroVideoCutUrl_not_in?: Maybe<Array<Scalars['String']>>
  heroVideoCutUrl_not_startsWith?: Maybe<Scalars['String']>
  heroVideoCutUrl_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type VideoHerosConnection = {
  edges: Array<VideoHeroEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaEncoding = {
  codecName?: Maybe<Scalars['String']>
  container?: Maybe<Scalars['String']>
  id: Scalars['String']
  mimeMediaType?: Maybe<Scalars['String']>
}

export type VideoMediaEncodingEdge = {
  cursor: Scalars['String']
  node: VideoMediaEncoding
}

export enum VideoMediaEncodingOrderByInput {
  CodecNameAsc = 'codecName_ASC',
  CodecNameDesc = 'codecName_DESC',
  ContainerAsc = 'container_ASC',
  ContainerDesc = 'container_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MimeMediaTypeAsc = 'mimeMediaType_ASC',
  MimeMediaTypeDesc = 'mimeMediaType_DESC',
}

export type VideoMediaEncodingWhereInput = {
  AND?: Maybe<Array<VideoMediaEncodingWhereInput>>
  OR?: Maybe<Array<VideoMediaEncodingWhereInput>>
  codecName_contains?: Maybe<Scalars['String']>
  codecName_containsInsensitive?: Maybe<Scalars['String']>
  codecName_endsWith?: Maybe<Scalars['String']>
  codecName_eq?: Maybe<Scalars['String']>
  codecName_gt?: Maybe<Scalars['String']>
  codecName_gte?: Maybe<Scalars['String']>
  codecName_in?: Maybe<Array<Scalars['String']>>
  codecName_isNull?: Maybe<Scalars['Boolean']>
  codecName_lt?: Maybe<Scalars['String']>
  codecName_lte?: Maybe<Scalars['String']>
  codecName_not_contains?: Maybe<Scalars['String']>
  codecName_not_containsInsensitive?: Maybe<Scalars['String']>
  codecName_not_endsWith?: Maybe<Scalars['String']>
  codecName_not_eq?: Maybe<Scalars['String']>
  codecName_not_in?: Maybe<Array<Scalars['String']>>
  codecName_not_startsWith?: Maybe<Scalars['String']>
  codecName_startsWith?: Maybe<Scalars['String']>
  container_contains?: Maybe<Scalars['String']>
  container_containsInsensitive?: Maybe<Scalars['String']>
  container_endsWith?: Maybe<Scalars['String']>
  container_eq?: Maybe<Scalars['String']>
  container_gt?: Maybe<Scalars['String']>
  container_gte?: Maybe<Scalars['String']>
  container_in?: Maybe<Array<Scalars['String']>>
  container_isNull?: Maybe<Scalars['Boolean']>
  container_lt?: Maybe<Scalars['String']>
  container_lte?: Maybe<Scalars['String']>
  container_not_contains?: Maybe<Scalars['String']>
  container_not_containsInsensitive?: Maybe<Scalars['String']>
  container_not_endsWith?: Maybe<Scalars['String']>
  container_not_eq?: Maybe<Scalars['String']>
  container_not_in?: Maybe<Array<Scalars['String']>>
  container_not_startsWith?: Maybe<Scalars['String']>
  container_startsWith?: Maybe<Scalars['String']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  mimeMediaType_contains?: Maybe<Scalars['String']>
  mimeMediaType_containsInsensitive?: Maybe<Scalars['String']>
  mimeMediaType_endsWith?: Maybe<Scalars['String']>
  mimeMediaType_eq?: Maybe<Scalars['String']>
  mimeMediaType_gt?: Maybe<Scalars['String']>
  mimeMediaType_gte?: Maybe<Scalars['String']>
  mimeMediaType_in?: Maybe<Array<Scalars['String']>>
  mimeMediaType_isNull?: Maybe<Scalars['Boolean']>
  mimeMediaType_lt?: Maybe<Scalars['String']>
  mimeMediaType_lte?: Maybe<Scalars['String']>
  mimeMediaType_not_contains?: Maybe<Scalars['String']>
  mimeMediaType_not_containsInsensitive?: Maybe<Scalars['String']>
  mimeMediaType_not_endsWith?: Maybe<Scalars['String']>
  mimeMediaType_not_eq?: Maybe<Scalars['String']>
  mimeMediaType_not_in?: Maybe<Array<Scalars['String']>>
  mimeMediaType_not_startsWith?: Maybe<Scalars['String']>
  mimeMediaType_startsWith?: Maybe<Scalars['String']>
}

export type VideoMediaEncodingsConnection = {
  edges: Array<VideoMediaEncodingEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaMetadata = {
  createdInBlock: Scalars['Int']
  encoding?: Maybe<VideoMediaEncoding>
  id: Scalars['String']
  pixelHeight?: Maybe<Scalars['Int']>
  pixelWidth?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['BigInt']>
  video: Video
}

export type VideoMediaMetadataConnection = {
  edges: Array<VideoMediaMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaMetadataEdge = {
  cursor: Scalars['String']
  node: VideoMediaMetadata
}

export enum VideoMediaMetadataOrderByInput {
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  EncodingCodecNameAsc = 'encoding_codecName_ASC',
  EncodingCodecNameDesc = 'encoding_codecName_DESC',
  EncodingContainerAsc = 'encoding_container_ASC',
  EncodingContainerDesc = 'encoding_container_DESC',
  EncodingIdAsc = 'encoding_id_ASC',
  EncodingIdDesc = 'encoding_id_DESC',
  EncodingMimeMediaTypeAsc = 'encoding_mimeMediaType_ASC',
  EncodingMimeMediaTypeDesc = 'encoding_mimeMediaType_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PixelHeightAsc = 'pixelHeight_ASC',
  PixelHeightDesc = 'pixelHeight_DESC',
  PixelWidthAsc = 'pixelWidth_ASC',
  PixelWidthDesc = 'pixelWidth_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoMediaMetadataWhereInput = {
  AND?: Maybe<Array<VideoMediaMetadataWhereInput>>
  OR?: Maybe<Array<VideoMediaMetadataWhereInput>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: Maybe<Scalars['Boolean']>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  createdInBlock_not_eq?: Maybe<Scalars['Int']>
  createdInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  encoding?: Maybe<VideoMediaEncodingWhereInput>
  encoding_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  pixelHeight_eq?: Maybe<Scalars['Int']>
  pixelHeight_gt?: Maybe<Scalars['Int']>
  pixelHeight_gte?: Maybe<Scalars['Int']>
  pixelHeight_in?: Maybe<Array<Scalars['Int']>>
  pixelHeight_isNull?: Maybe<Scalars['Boolean']>
  pixelHeight_lt?: Maybe<Scalars['Int']>
  pixelHeight_lte?: Maybe<Scalars['Int']>
  pixelHeight_not_eq?: Maybe<Scalars['Int']>
  pixelHeight_not_in?: Maybe<Array<Scalars['Int']>>
  pixelWidth_eq?: Maybe<Scalars['Int']>
  pixelWidth_gt?: Maybe<Scalars['Int']>
  pixelWidth_gte?: Maybe<Scalars['Int']>
  pixelWidth_in?: Maybe<Array<Scalars['Int']>>
  pixelWidth_isNull?: Maybe<Scalars['Boolean']>
  pixelWidth_lt?: Maybe<Scalars['Int']>
  pixelWidth_lte?: Maybe<Scalars['Int']>
  pixelWidth_not_eq?: Maybe<Scalars['Int']>
  pixelWidth_not_in?: Maybe<Array<Scalars['Int']>>
  size_eq?: Maybe<Scalars['BigInt']>
  size_gt?: Maybe<Scalars['BigInt']>
  size_gte?: Maybe<Scalars['BigInt']>
  size_in?: Maybe<Array<Scalars['BigInt']>>
  size_isNull?: Maybe<Scalars['Boolean']>
  size_lt?: Maybe<Scalars['BigInt']>
  size_lte?: Maybe<Scalars['BigInt']>
  size_not_eq?: Maybe<Scalars['BigInt']>
  size_not_in?: Maybe<Array<Scalars['BigInt']>>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export enum VideoOrderByInput {
  CategoryCreatedInBlockAsc = 'category_createdInBlock_ASC',
  CategoryCreatedInBlockDesc = 'category_createdInBlock_DESC',
  CategoryDescriptionAsc = 'category_description_ASC',
  CategoryDescriptionDesc = 'category_description_DESC',
  CategoryIdAsc = 'category_id_ASC',
  CategoryIdDesc = 'category_id_DESC',
  CategoryIsSupportedAsc = 'category_isSupported_ASC',
  CategoryIsSupportedDesc = 'category_isSupported_DESC',
  CategoryNameAsc = 'category_name_ASC',
  CategoryNameDesc = 'category_name_DESC',
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  CommentsCountAsc = 'commentsCount_ASC',
  CommentsCountDesc = 'commentsCount_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  DurationAsc = 'duration_ASC',
  DurationDesc = 'duration_DESC',
  EntryAppAuthKeyAsc = 'entryApp_authKey_ASC',
  EntryAppAuthKeyDesc = 'entryApp_authKey_DESC',
  EntryAppBigIconAsc = 'entryApp_bigIcon_ASC',
  EntryAppBigIconDesc = 'entryApp_bigIcon_DESC',
  EntryAppCategoryAsc = 'entryApp_category_ASC',
  EntryAppCategoryDesc = 'entryApp_category_DESC',
  EntryAppDescriptionAsc = 'entryApp_description_ASC',
  EntryAppDescriptionDesc = 'entryApp_description_DESC',
  EntryAppIdAsc = 'entryApp_id_ASC',
  EntryAppIdDesc = 'entryApp_id_DESC',
  EntryAppMediumIconAsc = 'entryApp_mediumIcon_ASC',
  EntryAppMediumIconDesc = 'entryApp_mediumIcon_DESC',
  EntryAppNameAsc = 'entryApp_name_ASC',
  EntryAppNameDesc = 'entryApp_name_DESC',
  EntryAppOneLinerAsc = 'entryApp_oneLiner_ASC',
  EntryAppOneLinerDesc = 'entryApp_oneLiner_DESC',
  EntryAppSmallIconAsc = 'entryApp_smallIcon_ASC',
  EntryAppSmallIconDesc = 'entryApp_smallIcon_DESC',
  EntryAppTermsOfServiceAsc = 'entryApp_termsOfService_ASC',
  EntryAppTermsOfServiceDesc = 'entryApp_termsOfService_DESC',
  EntryAppUseUriAsc = 'entryApp_useUri_ASC',
  EntryAppUseUriDesc = 'entryApp_useUri_DESC',
  EntryAppWebsiteUrlAsc = 'entryApp_websiteUrl_ASC',
  EntryAppWebsiteUrlDesc = 'entryApp_websiteUrl_DESC',
  HasMarketingAsc = 'hasMarketing_ASC',
  HasMarketingDesc = 'hasMarketing_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsCensoredAsc = 'isCensored_ASC',
  IsCensoredDesc = 'isCensored_DESC',
  IsCommentSectionEnabledAsc = 'isCommentSectionEnabled_ASC',
  IsCommentSectionEnabledDesc = 'isCommentSectionEnabled_DESC',
  IsExcludedAsc = 'isExcluded_ASC',
  IsExcludedDesc = 'isExcluded_DESC',
  IsExplicitAsc = 'isExplicit_ASC',
  IsExplicitDesc = 'isExplicit_DESC',
  IsPublicAsc = 'isPublic_ASC',
  IsPublicDesc = 'isPublic_DESC',
  IsReactionFeatureEnabledAsc = 'isReactionFeatureEnabled_ASC',
  IsReactionFeatureEnabledDesc = 'isReactionFeatureEnabled_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  LicenseAttributionAsc = 'license_attribution_ASC',
  LicenseAttributionDesc = 'license_attribution_DESC',
  LicenseCodeAsc = 'license_code_ASC',
  LicenseCodeDesc = 'license_code_DESC',
  LicenseCustomTextAsc = 'license_customText_ASC',
  LicenseCustomTextDesc = 'license_customText_DESC',
  LicenseIdAsc = 'license_id_ASC',
  LicenseIdDesc = 'license_id_DESC',
  MediaMetadataCreatedInBlockAsc = 'mediaMetadata_createdInBlock_ASC',
  MediaMetadataCreatedInBlockDesc = 'mediaMetadata_createdInBlock_DESC',
  MediaMetadataIdAsc = 'mediaMetadata_id_ASC',
  MediaMetadataIdDesc = 'mediaMetadata_id_DESC',
  MediaMetadataPixelHeightAsc = 'mediaMetadata_pixelHeight_ASC',
  MediaMetadataPixelHeightDesc = 'mediaMetadata_pixelHeight_DESC',
  MediaMetadataPixelWidthAsc = 'mediaMetadata_pixelWidth_ASC',
  MediaMetadataPixelWidthDesc = 'mediaMetadata_pixelWidth_DESC',
  MediaMetadataSizeAsc = 'mediaMetadata_size_ASC',
  MediaMetadataSizeDesc = 'mediaMetadata_size_DESC',
  MediaCreatedAtAsc = 'media_createdAt_ASC',
  MediaCreatedAtDesc = 'media_createdAt_DESC',
  MediaIdAsc = 'media_id_ASC',
  MediaIdDesc = 'media_id_DESC',
  MediaIpfsHashAsc = 'media_ipfsHash_ASC',
  MediaIpfsHashDesc = 'media_ipfsHash_DESC',
  MediaIsAcceptedAsc = 'media_isAccepted_ASC',
  MediaIsAcceptedDesc = 'media_isAccepted_DESC',
  MediaSizeAsc = 'media_size_ASC',
  MediaSizeDesc = 'media_size_DESC',
  MediaStateBloatBondAsc = 'media_stateBloatBond_ASC',
  MediaStateBloatBondDesc = 'media_stateBloatBond_DESC',
  MediaUnsetAtAsc = 'media_unsetAt_ASC',
  MediaUnsetAtDesc = 'media_unsetAt_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
  PinnedCommentCreatedAtAsc = 'pinnedComment_createdAt_ASC',
  PinnedCommentCreatedAtDesc = 'pinnedComment_createdAt_DESC',
  PinnedCommentIdAsc = 'pinnedComment_id_ASC',
  PinnedCommentIdDesc = 'pinnedComment_id_DESC',
  PinnedCommentIsEditedAsc = 'pinnedComment_isEdited_ASC',
  PinnedCommentIsEditedDesc = 'pinnedComment_isEdited_DESC',
  PinnedCommentIsExcludedAsc = 'pinnedComment_isExcluded_ASC',
  PinnedCommentIsExcludedDesc = 'pinnedComment_isExcluded_DESC',
  PinnedCommentReactionsAndRepliesCountAsc = 'pinnedComment_reactionsAndRepliesCount_ASC',
  PinnedCommentReactionsAndRepliesCountDesc = 'pinnedComment_reactionsAndRepliesCount_DESC',
  PinnedCommentReactionsCountAsc = 'pinnedComment_reactionsCount_ASC',
  PinnedCommentReactionsCountDesc = 'pinnedComment_reactionsCount_DESC',
  PinnedCommentRepliesCountAsc = 'pinnedComment_repliesCount_ASC',
  PinnedCommentRepliesCountDesc = 'pinnedComment_repliesCount_DESC',
  PinnedCommentStatusAsc = 'pinnedComment_status_ASC',
  PinnedCommentStatusDesc = 'pinnedComment_status_DESC',
  PinnedCommentTextAsc = 'pinnedComment_text_ASC',
  PinnedCommentTextDesc = 'pinnedComment_text_DESC',
  PublishedBeforeJoystreamAsc = 'publishedBeforeJoystream_ASC',
  PublishedBeforeJoystreamDesc = 'publishedBeforeJoystream_DESC',
  ReactionsCountAsc = 'reactionsCount_ASC',
  ReactionsCountDesc = 'reactionsCount_DESC',
  ThumbnailPhotoCreatedAtAsc = 'thumbnailPhoto_createdAt_ASC',
  ThumbnailPhotoCreatedAtDesc = 'thumbnailPhoto_createdAt_DESC',
  ThumbnailPhotoIdAsc = 'thumbnailPhoto_id_ASC',
  ThumbnailPhotoIdDesc = 'thumbnailPhoto_id_DESC',
  ThumbnailPhotoIpfsHashAsc = 'thumbnailPhoto_ipfsHash_ASC',
  ThumbnailPhotoIpfsHashDesc = 'thumbnailPhoto_ipfsHash_DESC',
  ThumbnailPhotoIsAcceptedAsc = 'thumbnailPhoto_isAccepted_ASC',
  ThumbnailPhotoIsAcceptedDesc = 'thumbnailPhoto_isAccepted_DESC',
  ThumbnailPhotoSizeAsc = 'thumbnailPhoto_size_ASC',
  ThumbnailPhotoSizeDesc = 'thumbnailPhoto_size_DESC',
  ThumbnailPhotoStateBloatBondAsc = 'thumbnailPhoto_stateBloatBond_ASC',
  ThumbnailPhotoStateBloatBondDesc = 'thumbnailPhoto_stateBloatBond_DESC',
  ThumbnailPhotoUnsetAtAsc = 'thumbnailPhoto_unsetAt_ASC',
  ThumbnailPhotoUnsetAtDesc = 'thumbnailPhoto_unsetAt_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VideoStateBloatBondAsc = 'videoStateBloatBond_ASC',
  VideoStateBloatBondDesc = 'videoStateBloatBond_DESC',
  ViewsNumAsc = 'viewsNum_ASC',
  ViewsNumDesc = 'viewsNum_DESC',
  YtVideoIdAsc = 'ytVideoId_ASC',
  YtVideoIdDesc = 'ytVideoId_DESC',
}

export type VideoReaction = {
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  member: Membership
  reaction: VideoReactionOptions
  video: Video
}

export type VideoReactionEdge = {
  cursor: Scalars['String']
  node: VideoReaction
}

export enum VideoReactionOptions {
  Like = 'LIKE',
  Unlike = 'UNLIKE',
}

export enum VideoReactionOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  ReactionAsc = 'reaction_ASC',
  ReactionDesc = 'reaction_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoReactionWhereInput = {
  AND?: Maybe<Array<VideoReactionWhereInput>>
  OR?: Maybe<Array<VideoReactionWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  member?: Maybe<MembershipWhereInput>
  member_isNull?: Maybe<Scalars['Boolean']>
  reaction_eq?: Maybe<VideoReactionOptions>
  reaction_in?: Maybe<Array<VideoReactionOptions>>
  reaction_isNull?: Maybe<Scalars['Boolean']>
  reaction_not_eq?: Maybe<VideoReactionOptions>
  reaction_not_in?: Maybe<Array<VideoReactionOptions>>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type VideoReactionsConnection = {
  edges: Array<VideoReactionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoReactionsCountByReactionType = {
  count: Scalars['Int']
  reaction: VideoReactionOptions
}

export type VideoReportInfo = {
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
  reporterIp: Scalars['String']
  videoId: Scalars['String']
}

export type VideoSubtitle = {
  asset?: Maybe<StorageDataObject>
  id: Scalars['String']
  language?: Maybe<Scalars['String']>
  mimeType: Scalars['String']
  type: Scalars['String']
  video: Video
}

export type VideoSubtitleEdge = {
  cursor: Scalars['String']
  node: VideoSubtitle
}

export enum VideoSubtitleOrderByInput {
  AssetCreatedAtAsc = 'asset_createdAt_ASC',
  AssetCreatedAtDesc = 'asset_createdAt_DESC',
  AssetIdAsc = 'asset_id_ASC',
  AssetIdDesc = 'asset_id_DESC',
  AssetIpfsHashAsc = 'asset_ipfsHash_ASC',
  AssetIpfsHashDesc = 'asset_ipfsHash_DESC',
  AssetIsAcceptedAsc = 'asset_isAccepted_ASC',
  AssetIsAcceptedDesc = 'asset_isAccepted_DESC',
  AssetSizeAsc = 'asset_size_ASC',
  AssetSizeDesc = 'asset_size_DESC',
  AssetStateBloatBondAsc = 'asset_stateBloatBond_ASC',
  AssetStateBloatBondDesc = 'asset_stateBloatBond_DESC',
  AssetUnsetAtAsc = 'asset_unsetAt_ASC',
  AssetUnsetAtDesc = 'asset_unsetAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  MimeTypeAsc = 'mimeType_ASC',
  MimeTypeDesc = 'mimeType_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoSubtitleWhereInput = {
  AND?: Maybe<Array<VideoSubtitleWhereInput>>
  OR?: Maybe<Array<VideoSubtitleWhereInput>>
  asset?: Maybe<StorageDataObjectWhereInput>
  asset_isNull?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  language_contains?: Maybe<Scalars['String']>
  language_containsInsensitive?: Maybe<Scalars['String']>
  language_endsWith?: Maybe<Scalars['String']>
  language_eq?: Maybe<Scalars['String']>
  language_gt?: Maybe<Scalars['String']>
  language_gte?: Maybe<Scalars['String']>
  language_in?: Maybe<Array<Scalars['String']>>
  language_isNull?: Maybe<Scalars['Boolean']>
  language_lt?: Maybe<Scalars['String']>
  language_lte?: Maybe<Scalars['String']>
  language_not_contains?: Maybe<Scalars['String']>
  language_not_containsInsensitive?: Maybe<Scalars['String']>
  language_not_endsWith?: Maybe<Scalars['String']>
  language_not_eq?: Maybe<Scalars['String']>
  language_not_in?: Maybe<Array<Scalars['String']>>
  language_not_startsWith?: Maybe<Scalars['String']>
  language_startsWith?: Maybe<Scalars['String']>
  mimeType_contains?: Maybe<Scalars['String']>
  mimeType_containsInsensitive?: Maybe<Scalars['String']>
  mimeType_endsWith?: Maybe<Scalars['String']>
  mimeType_eq?: Maybe<Scalars['String']>
  mimeType_gt?: Maybe<Scalars['String']>
  mimeType_gte?: Maybe<Scalars['String']>
  mimeType_in?: Maybe<Array<Scalars['String']>>
  mimeType_isNull?: Maybe<Scalars['Boolean']>
  mimeType_lt?: Maybe<Scalars['String']>
  mimeType_lte?: Maybe<Scalars['String']>
  mimeType_not_contains?: Maybe<Scalars['String']>
  mimeType_not_containsInsensitive?: Maybe<Scalars['String']>
  mimeType_not_endsWith?: Maybe<Scalars['String']>
  mimeType_not_eq?: Maybe<Scalars['String']>
  mimeType_not_in?: Maybe<Array<Scalars['String']>>
  mimeType_not_startsWith?: Maybe<Scalars['String']>
  mimeType_startsWith?: Maybe<Scalars['String']>
  type_contains?: Maybe<Scalars['String']>
  type_containsInsensitive?: Maybe<Scalars['String']>
  type_endsWith?: Maybe<Scalars['String']>
  type_eq?: Maybe<Scalars['String']>
  type_gt?: Maybe<Scalars['String']>
  type_gte?: Maybe<Scalars['String']>
  type_in?: Maybe<Array<Scalars['String']>>
  type_isNull?: Maybe<Scalars['Boolean']>
  type_lt?: Maybe<Scalars['String']>
  type_lte?: Maybe<Scalars['String']>
  type_not_contains?: Maybe<Scalars['String']>
  type_not_containsInsensitive?: Maybe<Scalars['String']>
  type_not_endsWith?: Maybe<Scalars['String']>
  type_not_eq?: Maybe<Scalars['String']>
  type_not_in?: Maybe<Array<Scalars['String']>>
  type_not_startsWith?: Maybe<Scalars['String']>
  type_startsWith?: Maybe<Scalars['String']>
  video?: Maybe<VideoWhereInput>
  video_isNull?: Maybe<Scalars['Boolean']>
}

export type VideoSubtitlesConnection = {
  edges: Array<VideoSubtitleEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoViewEvent = {
  id: Scalars['String']
  ip: Scalars['String']
  timestamp: Scalars['DateTime']
  videoId: Scalars['String']
}

export type VideoViewEventEdge = {
  cursor: Scalars['String']
  node: VideoViewEvent
}

export enum VideoViewEventOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpAsc = 'ip_ASC',
  IpDesc = 'ip_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  VideoIdAsc = 'videoId_ASC',
  VideoIdDesc = 'videoId_DESC',
}

export type VideoViewEventWhereInput = {
  AND?: Maybe<Array<VideoViewEventWhereInput>>
  OR?: Maybe<Array<VideoViewEventWhereInput>>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  ip_contains?: Maybe<Scalars['String']>
  ip_containsInsensitive?: Maybe<Scalars['String']>
  ip_endsWith?: Maybe<Scalars['String']>
  ip_eq?: Maybe<Scalars['String']>
  ip_gt?: Maybe<Scalars['String']>
  ip_gte?: Maybe<Scalars['String']>
  ip_in?: Maybe<Array<Scalars['String']>>
  ip_isNull?: Maybe<Scalars['Boolean']>
  ip_lt?: Maybe<Scalars['String']>
  ip_lte?: Maybe<Scalars['String']>
  ip_not_contains?: Maybe<Scalars['String']>
  ip_not_containsInsensitive?: Maybe<Scalars['String']>
  ip_not_endsWith?: Maybe<Scalars['String']>
  ip_not_eq?: Maybe<Scalars['String']>
  ip_not_in?: Maybe<Array<Scalars['String']>>
  ip_not_startsWith?: Maybe<Scalars['String']>
  ip_startsWith?: Maybe<Scalars['String']>
  timestamp_eq?: Maybe<Scalars['DateTime']>
  timestamp_gt?: Maybe<Scalars['DateTime']>
  timestamp_gte?: Maybe<Scalars['DateTime']>
  timestamp_in?: Maybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: Maybe<Scalars['Boolean']>
  timestamp_lt?: Maybe<Scalars['DateTime']>
  timestamp_lte?: Maybe<Scalars['DateTime']>
  timestamp_not_eq?: Maybe<Scalars['DateTime']>
  timestamp_not_in?: Maybe<Array<Scalars['DateTime']>>
  videoId_contains?: Maybe<Scalars['String']>
  videoId_containsInsensitive?: Maybe<Scalars['String']>
  videoId_endsWith?: Maybe<Scalars['String']>
  videoId_eq?: Maybe<Scalars['String']>
  videoId_gt?: Maybe<Scalars['String']>
  videoId_gte?: Maybe<Scalars['String']>
  videoId_in?: Maybe<Array<Scalars['String']>>
  videoId_isNull?: Maybe<Scalars['Boolean']>
  videoId_lt?: Maybe<Scalars['String']>
  videoId_lte?: Maybe<Scalars['String']>
  videoId_not_contains?: Maybe<Scalars['String']>
  videoId_not_containsInsensitive?: Maybe<Scalars['String']>
  videoId_not_endsWith?: Maybe<Scalars['String']>
  videoId_not_eq?: Maybe<Scalars['String']>
  videoId_not_in?: Maybe<Array<Scalars['String']>>
  videoId_not_startsWith?: Maybe<Scalars['String']>
  videoId_startsWith?: Maybe<Scalars['String']>
}

export type VideoViewEventsConnection = {
  edges: Array<VideoViewEventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoViewPerIpTimeLimit = {
  limitInSeconds: Scalars['Int']
}

export type VideoWhereInput = {
  AND?: Maybe<Array<VideoWhereInput>>
  OR?: Maybe<Array<VideoWhereInput>>
  category?: Maybe<VideoCategoryWhereInput>
  category_isNull?: Maybe<Scalars['Boolean']>
  channel?: Maybe<ChannelWhereInput>
  channel_isNull?: Maybe<Scalars['Boolean']>
  commentsCount_eq?: Maybe<Scalars['Int']>
  commentsCount_gt?: Maybe<Scalars['Int']>
  commentsCount_gte?: Maybe<Scalars['Int']>
  commentsCount_in?: Maybe<Array<Scalars['Int']>>
  commentsCount_isNull?: Maybe<Scalars['Boolean']>
  commentsCount_lt?: Maybe<Scalars['Int']>
  commentsCount_lte?: Maybe<Scalars['Int']>
  commentsCount_not_eq?: Maybe<Scalars['Int']>
  commentsCount_not_in?: Maybe<Array<Scalars['Int']>>
  comments_every?: Maybe<CommentWhereInput>
  comments_none?: Maybe<CommentWhereInput>
  comments_some?: Maybe<CommentWhereInput>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: Maybe<Scalars['Boolean']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_not_eq?: Maybe<Scalars['DateTime']>
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: Maybe<Scalars['Boolean']>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  createdInBlock_not_eq?: Maybe<Scalars['Int']>
  createdInBlock_not_in?: Maybe<Array<Scalars['Int']>>
  description_contains?: Maybe<Scalars['String']>
  description_containsInsensitive?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_gt?: Maybe<Scalars['String']>
  description_gte?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_isNull?: Maybe<Scalars['Boolean']>
  description_lt?: Maybe<Scalars['String']>
  description_lte?: Maybe<Scalars['String']>
  description_not_contains?: Maybe<Scalars['String']>
  description_not_containsInsensitive?: Maybe<Scalars['String']>
  description_not_endsWith?: Maybe<Scalars['String']>
  description_not_eq?: Maybe<Scalars['String']>
  description_not_in?: Maybe<Array<Scalars['String']>>
  description_not_startsWith?: Maybe<Scalars['String']>
  description_startsWith?: Maybe<Scalars['String']>
  duration_eq?: Maybe<Scalars['Int']>
  duration_gt?: Maybe<Scalars['Int']>
  duration_gte?: Maybe<Scalars['Int']>
  duration_in?: Maybe<Array<Scalars['Int']>>
  duration_isNull?: Maybe<Scalars['Boolean']>
  duration_lt?: Maybe<Scalars['Int']>
  duration_lte?: Maybe<Scalars['Int']>
  duration_not_eq?: Maybe<Scalars['Int']>
  duration_not_in?: Maybe<Array<Scalars['Int']>>
  entryApp?: Maybe<AppWhereInput>
  entryApp_isNull?: Maybe<Scalars['Boolean']>
  hasMarketing_eq?: Maybe<Scalars['Boolean']>
  hasMarketing_isNull?: Maybe<Scalars['Boolean']>
  hasMarketing_not_eq?: Maybe<Scalars['Boolean']>
  id_contains?: Maybe<Scalars['String']>
  id_containsInsensitive?: Maybe<Scalars['String']>
  id_endsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_gt?: Maybe<Scalars['String']>
  id_gte?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  id_isNull?: Maybe<Scalars['Boolean']>
  id_lt?: Maybe<Scalars['String']>
  id_lte?: Maybe<Scalars['String']>
  id_not_contains?: Maybe<Scalars['String']>
  id_not_containsInsensitive?: Maybe<Scalars['String']>
  id_not_endsWith?: Maybe<Scalars['String']>
  id_not_eq?: Maybe<Scalars['String']>
  id_not_in?: Maybe<Array<Scalars['String']>>
  id_not_startsWith?: Maybe<Scalars['String']>
  id_startsWith?: Maybe<Scalars['String']>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  isCensored_isNull?: Maybe<Scalars['Boolean']>
  isCensored_not_eq?: Maybe<Scalars['Boolean']>
  isCommentSectionEnabled_eq?: Maybe<Scalars['Boolean']>
  isCommentSectionEnabled_isNull?: Maybe<Scalars['Boolean']>
  isCommentSectionEnabled_not_eq?: Maybe<Scalars['Boolean']>
  isExcluded_eq?: Maybe<Scalars['Boolean']>
  isExcluded_isNull?: Maybe<Scalars['Boolean']>
  isExcluded_not_eq?: Maybe<Scalars['Boolean']>
  isExplicit_eq?: Maybe<Scalars['Boolean']>
  isExplicit_isNull?: Maybe<Scalars['Boolean']>
  isExplicit_not_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isPublic_isNull?: Maybe<Scalars['Boolean']>
  isPublic_not_eq?: Maybe<Scalars['Boolean']>
  isReactionFeatureEnabled_eq?: Maybe<Scalars['Boolean']>
  isReactionFeatureEnabled_isNull?: Maybe<Scalars['Boolean']>
  isReactionFeatureEnabled_not_eq?: Maybe<Scalars['Boolean']>
  language_contains?: Maybe<Scalars['String']>
  language_containsInsensitive?: Maybe<Scalars['String']>
  language_endsWith?: Maybe<Scalars['String']>
  language_eq?: Maybe<Scalars['String']>
  language_gt?: Maybe<Scalars['String']>
  language_gte?: Maybe<Scalars['String']>
  language_in?: Maybe<Array<Scalars['String']>>
  language_isNull?: Maybe<Scalars['Boolean']>
  language_lt?: Maybe<Scalars['String']>
  language_lte?: Maybe<Scalars['String']>
  language_not_contains?: Maybe<Scalars['String']>
  language_not_containsInsensitive?: Maybe<Scalars['String']>
  language_not_endsWith?: Maybe<Scalars['String']>
  language_not_eq?: Maybe<Scalars['String']>
  language_not_in?: Maybe<Array<Scalars['String']>>
  language_not_startsWith?: Maybe<Scalars['String']>
  language_startsWith?: Maybe<Scalars['String']>
  license?: Maybe<LicenseWhereInput>
  license_isNull?: Maybe<Scalars['Boolean']>
  media?: Maybe<StorageDataObjectWhereInput>
  mediaMetadata?: Maybe<VideoMediaMetadataWhereInput>
  mediaMetadata_isNull?: Maybe<Scalars['Boolean']>
  media_isNull?: Maybe<Scalars['Boolean']>
  nft?: Maybe<OwnedNftWhereInput>
  nft_isNull?: Maybe<Scalars['Boolean']>
  pinnedComment?: Maybe<CommentWhereInput>
  pinnedComment_isNull?: Maybe<Scalars['Boolean']>
  publishedBeforeJoystream_eq?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_gt?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_gte?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_in?: Maybe<Array<Scalars['DateTime']>>
  publishedBeforeJoystream_isNull?: Maybe<Scalars['Boolean']>
  publishedBeforeJoystream_lt?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_lte?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_not_eq?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_not_in?: Maybe<Array<Scalars['DateTime']>>
  reactionsCountByReactionId_isNull?: Maybe<Scalars['Boolean']>
  reactionsCount_eq?: Maybe<Scalars['Int']>
  reactionsCount_gt?: Maybe<Scalars['Int']>
  reactionsCount_gte?: Maybe<Scalars['Int']>
  reactionsCount_in?: Maybe<Array<Scalars['Int']>>
  reactionsCount_isNull?: Maybe<Scalars['Boolean']>
  reactionsCount_lt?: Maybe<Scalars['Int']>
  reactionsCount_lte?: Maybe<Scalars['Int']>
  reactionsCount_not_eq?: Maybe<Scalars['Int']>
  reactionsCount_not_in?: Maybe<Array<Scalars['Int']>>
  reactions_every?: Maybe<VideoReactionWhereInput>
  reactions_none?: Maybe<VideoReactionWhereInput>
  reactions_some?: Maybe<VideoReactionWhereInput>
  subtitles_every?: Maybe<VideoSubtitleWhereInput>
  subtitles_none?: Maybe<VideoSubtitleWhereInput>
  subtitles_some?: Maybe<VideoSubtitleWhereInput>
  thumbnailPhoto?: Maybe<StorageDataObjectWhereInput>
  thumbnailPhoto_isNull?: Maybe<Scalars['Boolean']>
  title_contains?: Maybe<Scalars['String']>
  title_containsInsensitive?: Maybe<Scalars['String']>
  title_endsWith?: Maybe<Scalars['String']>
  title_eq?: Maybe<Scalars['String']>
  title_gt?: Maybe<Scalars['String']>
  title_gte?: Maybe<Scalars['String']>
  title_in?: Maybe<Array<Scalars['String']>>
  title_isNull?: Maybe<Scalars['Boolean']>
  title_lt?: Maybe<Scalars['String']>
  title_lte?: Maybe<Scalars['String']>
  title_not_contains?: Maybe<Scalars['String']>
  title_not_containsInsensitive?: Maybe<Scalars['String']>
  title_not_endsWith?: Maybe<Scalars['String']>
  title_not_eq?: Maybe<Scalars['String']>
  title_not_in?: Maybe<Array<Scalars['String']>>
  title_not_startsWith?: Maybe<Scalars['String']>
  title_startsWith?: Maybe<Scalars['String']>
  videoStateBloatBond_eq?: Maybe<Scalars['BigInt']>
  videoStateBloatBond_gt?: Maybe<Scalars['BigInt']>
  videoStateBloatBond_gte?: Maybe<Scalars['BigInt']>
  videoStateBloatBond_in?: Maybe<Array<Scalars['BigInt']>>
  videoStateBloatBond_isNull?: Maybe<Scalars['Boolean']>
  videoStateBloatBond_lt?: Maybe<Scalars['BigInt']>
  videoStateBloatBond_lte?: Maybe<Scalars['BigInt']>
  videoStateBloatBond_not_eq?: Maybe<Scalars['BigInt']>
  videoStateBloatBond_not_in?: Maybe<Array<Scalars['BigInt']>>
  viewsNum_eq?: Maybe<Scalars['Int']>
  viewsNum_gt?: Maybe<Scalars['Int']>
  viewsNum_gte?: Maybe<Scalars['Int']>
  viewsNum_in?: Maybe<Array<Scalars['Int']>>
  viewsNum_isNull?: Maybe<Scalars['Boolean']>
  viewsNum_lt?: Maybe<Scalars['Int']>
  viewsNum_lte?: Maybe<Scalars['Int']>
  viewsNum_not_eq?: Maybe<Scalars['Int']>
  viewsNum_not_in?: Maybe<Array<Scalars['Int']>>
  ytVideoId_contains?: Maybe<Scalars['String']>
  ytVideoId_containsInsensitive?: Maybe<Scalars['String']>
  ytVideoId_endsWith?: Maybe<Scalars['String']>
  ytVideoId_eq?: Maybe<Scalars['String']>
  ytVideoId_gt?: Maybe<Scalars['String']>
  ytVideoId_gte?: Maybe<Scalars['String']>
  ytVideoId_in?: Maybe<Array<Scalars['String']>>
  ytVideoId_isNull?: Maybe<Scalars['Boolean']>
  ytVideoId_lt?: Maybe<Scalars['String']>
  ytVideoId_lte?: Maybe<Scalars['String']>
  ytVideoId_not_contains?: Maybe<Scalars['String']>
  ytVideoId_not_containsInsensitive?: Maybe<Scalars['String']>
  ytVideoId_not_endsWith?: Maybe<Scalars['String']>
  ytVideoId_not_eq?: Maybe<Scalars['String']>
  ytVideoId_not_in?: Maybe<Array<Scalars['String']>>
  ytVideoId_not_startsWith?: Maybe<Scalars['String']>
  ytVideoId_startsWith?: Maybe<Scalars['String']>
}

export type VideosConnection = {
  edges: Array<VideoEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideosSearchResult = {
  relevance: Scalars['Int']
  video: Video
}

export type WhereIdInput = {
  id: Scalars['String']
}
