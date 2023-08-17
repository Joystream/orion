import { assertNotNull } from '@subsquid/substrate-processor'
import { NotificationType, Video } from '../../model'
import { ConfigVariable, config } from '../config'
import { EntityManager } from 'typeorm'
import { getMemberHandle } from './notificationTexts'

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
      return await videoFeaturedOnCategoryPageLink(
        em,
        await getCategoryIdFromVideo(em, notificationType.video)
      )
    case 'VideoFeaturedAsCategoryHero':
      return await videoFeaturedOnCategoryPageLink(
        em,
        await getCategoryIdFromVideo(em, notificationType.video)
      )
    case 'NewChannelFollower':
      return await newChannelFollowerLink(em, await getMemberHandle(em, notificationType.follower))
    case 'CommentPostedToVideo':
      return await commentPostedToVideoLink(em, notificationType.video)
    case 'VideoLiked':
      return await videoLikedLink(em, notificationType.video)
    case 'VideoDisliked':
      return await videoDislikedLink(em, notificationType.video)
    case 'ChannelVerified':
      return await channelVerifiedLink(em)
    case 'ChannelSuspended':
      return await channelSuspendedLink(em)
    case 'BidMadeCompletingAuction':
      return await bidMadeCompletingAuctionLink(em, notificationType.video)
    case 'ChannelCreated':
      return await channelCreatedLink(em, notificationType.channel)
    case 'ChannelFundsWithdrawn':
      return channelFundsWithdrawnLink()
    case 'CommentReply':
      return await commentReplyLink(em, notificationType.video)
    case 'ReactionToComment':
      return await commentReactionLink(em, notificationType.video)
    case 'CreatorReceivesAuctionBid':
      return await auctionBidMadeLink(em, notificationType.video)
    case 'HigherBidPlaced':
      return await higherBidPlacedLink(em, notificationType.video)
    case 'DirectChannelPaymentByMember':
      return await directPaymentByMemberLink(em, await getMemberHandle(em, notificationType.member))
    case 'EnglishAuctionLost':
      return await timedAuctionLostLink(em, notificationType.video)
    case 'EnglishAuctionWon':
      return await timedAuctionWonLink(em, notificationType.video)
    case 'EnglishAuctionSettled':
      return await timedAuctionExpiredLink(em, notificationType.video)
    case 'OpenAuctionLost':
      return await openAuctionLostLink(em, notificationType.video)
    case 'OpenAuctionWon':
      return await openAuctionWonLink(em, notificationType.video)
    case 'NewAuction':
      return await nftOnAuctionLink(em, notificationType.video)
    case 'NewAuctionBid':
      return await auctionBidMadeLink(em, notificationType.video)
    case 'NewNftOnSale':
      return await nftOnSaleLink(em, notificationType.video)
    case 'NftFeaturedOnMarketPlace':
      return await nftFeaturedOnMarketplaceLink(em, notificationType.video)
    case 'NftPurchased':
      return await nftSoldLink(em, notificationType.video)
    case 'RoyaltyPaid':
      return await royaltiesReceivedLink(em, notificationType.video)
    case 'VideoPosted':
      return await newVideoPostedLink(em, notificationType.video)
    default:
      return ''
  }
}

async function getCategoryIdFromVideo(em: EntityManager, videoId: string): Promise<string> {
  const video = await em.getRepository(Video).findOneByOrFail({ id: videoId })
  return assertNotNull(video.categoryId)
}
