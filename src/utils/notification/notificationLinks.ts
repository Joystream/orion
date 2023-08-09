import { ConfigVariable, config } from '../config'
import { EntityManager } from 'typeorm'

// expected like "gleev.xyz"
const getRootDomain = async (em: EntityManager) => config.get(ConfigVariable.AppRootDomain, em)

export const channelExcludedLink = async (em: EntityManager) =>
  `https://${await getRootDomain(em)}/legal/tos`

export const videoExcludedLink = async (em: EntityManager) =>
  `https://${await getRootDomain(em)}/legal/tos`

export const videoFeaturedOnCategoryPageLink = async (em: EntityManager, categoryId: string) =>
  `https://${await getRootDomain(em)}/category/${categoryId}`

export const videoFeaturedAsCategoryHeroLink = async (em: EntityManager, categoryId: string) =>
  `https://${await getRootDomain(em)}/video/${categoryId}`

export const newChannelFollowerLink = async (em: EntityManager, memberHandle: string) =>
  `https://${await getRootDomain(em)}/${memberHandle}`

// FIXME: edit link such that the page is focused to comment
export const commentPostedToVideoLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const videoLikedLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const videoDislikedLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const channelVerifiedLink = async (em: EntityManager) =>
  `https://${await getRootDomain(em)}/ypp`

export const yppSignupSuccessfulLink = async (em: EntityManager) =>
  `https://${await getRootDomain(em)}/ypp`

export const channelSuspendedLink = async (em: EntityManager) =>
  `https://${await getRootDomain(em)}/ypp`

export const nftSoldLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const royaltiesReceivedLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const directPaymentByMemberLink = async (em: EntityManager, memberHandle: string) =>
  `https://${await getRootDomain(em)}/member/${memberHandle}`

// design specifies no-redirect
export const channelFundsWithdrawnLink = () => ''

// FIXME: edit link such that the page is focused to comment
export const commentReplyLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const commentReactionLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const newVideoPostedLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const nftOnSaleLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const nftOnAuctionLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const auctionBidMadeLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const higherBidPlacedLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const timedAuctionWonLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const openAuctionWonLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const timedAuctionExpiredLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const bidMadeCompletingAuctionLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const timedAuctionLostLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const openAuctionLostLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`

export const channelCreatedLink = async (em: EntityManager, channelId: string) =>
  `https://${await getRootDomain(em)}/channel/${channelId}`

export const nftFeaturedOnMarketplaceLink = async (em: EntityManager, videoId: string) =>
  `https://${await getRootDomain(em)}/video/${videoId}`
