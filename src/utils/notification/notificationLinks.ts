import { assertNotNull } from '@subsquid/substrate-processor'
import { Membership, NotificationType, Video } from '../../model'
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

// TODO: complete
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
      const video = await em.getRepository(Video).findOneByOrFail({
        id: notificationType.video,
      })
      const categoryId = assertNotNull(video.categoryId)
      return await videoFeaturedOnCategoryPageLink(em, categoryId)
    case 'VideoFeaturedAsCategoryHero':
      const videoHero = await em.getRepository(Video).findOneByOrFail({
        id: notificationType.video,
      })
      const videoHeroCategoryid = assertNotNull(videoHero.categoryId)
      return await videoFeaturedOnCategoryPageLink(em, videoHeroCategoryid)
    case 'NewChannelFollower':
      const follower = await em
        .getRepository(Membership)
        .findOneByOrFail({ id: notificationType.follower })
      const followerHandle = assertNotNull(follower.handle)
      return await newChannelFollowerLink(em, followerHandle)
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
      const payerMember = await em
        .getRepository(Membership)
        .findOneByOrFail({ id: notificationType.member })
      const payerHandle = assertNotNull(payerMember.handle)
      return await directPaymentByMemberLink(em, payerHandle)
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
