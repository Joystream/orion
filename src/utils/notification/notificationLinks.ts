import { NotificationType } from '../../model'
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
  `https://${await getRootDomain(em)}/category/${categoryId}`

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

export async function linkForNotification(
  em: EntityManager,
  notificationType: NotificationType
): Promise<string> {
  // create a map of notification type to link
  switch (notificationType.isTypeOf) {
    case 'ChannelExcluded':
      return await channelExcludedLink(em)
    case 'VideoExcluded':
      return await videoExcludedLink(em)
    case 'VideoFeaturedOnCategoryPage':
      return await videoFeaturedOnCategoryPageLink(em, notificationType.categoryId)
    case 'VideoFeaturedAsCategoryHero':
      return await videoFeaturedOnCategoryPageLink(em, notificationType.categoryName)
    case 'NewChannelFollower':
      return await newChannelFollowerLink(em, notificationType.followerHandle)
    case 'CommentPostedToVideo':
      return await commentPostedToVideoLink(em, notificationType.videoId)
    case 'VideoLiked':
      return await videoLikedLink(em, notificationType.videoId)
    case 'VideoDisliked':
      return await videoDislikedLink(em, notificationType.videoId)
    case 'ChannelVerified':
      return await channelVerifiedLink(em)
    case 'ChannelSuspended':
      return await channelSuspendedLink(em)
    case 'BidMadeCompletingAuction':
      return await bidMadeCompletingAuctionLink(em, notificationType.videoId)
    case 'ChannelCreated':
      return await channelCreatedLink(em, notificationType.channelId)
    case 'ChannelFundsWithdrawn':
      return channelFundsWithdrawnLink()
    case 'CommentReply':
      return await commentReplyLink(em, notificationType.videoId)
    case 'ReactionToComment':
      return await commentReactionLink(em, notificationType.videoId)
    case 'CreatorReceivesAuctionBid':
      return await auctionBidMadeLink(em, notificationType.videoId)
    case 'HigherBidPlaced':
      return await higherBidPlacedLink(em, notificationType.videoId)
    case 'DirectChannelPaymentByMember':
      return await directPaymentByMemberLink(em, notificationType.payerHandle)
    case 'EnglishAuctionLost':
      return await timedAuctionLostLink(em, notificationType.videoId)
    case 'EnglishAuctionWon':
      return await timedAuctionWonLink(em, notificationType.videoId)
    case 'EnglishAuctionSettled':
      return await timedAuctionExpiredLink(em, notificationType.videoId)
    case 'OpenAuctionLost':
      return await openAuctionLostLink(em, notificationType.videoId)
    case 'OpenAuctionWon':
      return await openAuctionWonLink(em, notificationType.videoId)
    case 'NewAuction':
      return await nftOnAuctionLink(em, notificationType.videoId)
    case 'NewAuctionBid':
      return await auctionBidMadeLink(em, notificationType.videoId)
    case 'NewNftOnSale':
      return await nftOnSaleLink(em, notificationType.videoId)
    case 'NftFeaturedOnMarketPlace':
      return await nftFeaturedOnMarketplaceLink(em, notificationType.videoId)
    case 'NftPurchased':
      return await nftSoldLink(em, notificationType.videoId)
    case 'NftRoyaltyPaid':
      return await royaltiesReceivedLink(em, notificationType.videoId)
    case 'VideoPosted':
      return await newVideoPostedLink(em, notificationType.videoId)
    default:
      return ''
  }
}
