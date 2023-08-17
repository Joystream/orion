import { EntityManager } from 'typeorm'
import { NotificationType, Channel, ChannelRecipient, Video, Membership } from '../../model'

export const channelExcludedText = (channelTitle: string) => {
  return `Your channel ${channelTitle} has been excluded`
}
export const videoExcludedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been excluded`
}

export const nftOfferedText = (videoTitle: string, price: string) => {
  return `Nft for ${videoTitle} has been offered to you for ${price}`
}

export const videoFeaturedAsHeroText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been featured as Hero`
}

export const videoFeaturedOnCategoryPageText = (videoTitle: string, categoryTitle: string) => {
  return `Your video ${videoTitle} has been featured on the ${categoryTitle} category page`
}

export const nftFeaturedOnMarketplaceText = (videoTitle: string) => {
  return `Your nft for ${videoTitle} has been featured on the marketplace`
}

export const newChannelFollowerText = (channelTitle: string) => {
  return `You have a new follower on channel ${channelTitle}`
}

export const commentPostedToVideoText = (videoTitle: string, memberHandle: string) => {
  return `${memberHandle} left a comment on Your video ${videoTitle}`
}

export const videoLikedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has a new like`
}

export const videoDislikedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has a new dislike`
}

export const channelVerifiedViaYPPText = () => {
  return `Your channel has been verified via YPP`
}

export const channelSuspendedViaYPPText = () => {
  return `Your channel has been suspended via YPP`
}

export const nftPurchasedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `Your NFT for ${videoTitle} has been purchased by ${memberHandle} for ${nftPrice} JOY`
}

export const nftBidReceivedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `${memberHandle} placed a bid of ${nftPrice} JOY on nft: ${videoTitle}`
}

export const nftRoyaltyPaymentReceivedText = (videoTitle: string, royalties: string) => {
  return `you received ${royalties} JOY nominal royalties for your nft: ${videoTitle}`
}

export const channelReceivedDirectPaymentText = (memberHandle: string, amount: string) => {
  return `${memberHandle} transferred ${amount} JOY to your channel`
}

export const timedAuctionExpiredText = (videoTitle: string) => {
  return `Timed auction expired for your nft: ${videoTitle}`
}

export const openAuctionExpiredText = (videoTitle: string) => {
  return `Open auction settled for your nft: ${videoTitle}`
}

export const channelCreatedText = (channelTitle: string) => {
  return `${channelTitle} has been created`
}

export const commentRepliedText = (videoTitle: string, memberHandle: string) => {
  return `${memberHandle} has replied to your comment under ${videoTitle}`
}

export const commentReactedText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} has reacted to your comment under ${videoTitle}`
}

export const newVideoPostedText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just posted a new video ${videoTitle}`
}

export const newNftOnAuctionText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just started an auction of nft: ${videoTitle}`
}

export const newNftOnSaleText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just started the sale of nft ${videoTitle}`
}

export const nftBidOutbidText = (videoTitle: string, memberHandle: string) => {
  return `${memberHandle} placed a higher bid on NFT ${videoTitle}`
}

export const openAuctionBidWonText = (videoTitle: string) => {
  return `You won an open auction for nft: ${videoTitle}`
}

export const timedAuctionBidWonText = (videoTitle: string) => {
  return `You won a timed auction for nft: ${videoTitle}`
}

export const openAuctionBidLostText = (videoTitle: string) => {
  return `You lost an open auction for nft: ${videoTitle}`
}

export const timedAuctionBidLostText = (videoTitle: string) => {
  return `You lost an timed auction for nft: ${videoTitle}`
}

export const bidMadeCompletingAuctionText = (
  videoTitle: string,
  memberHandle: string,
  price: string
) => {
  return `Member ${memberHandle} won auction for nft: ${videoTitle} by a buy now bid of ${price} JOY`
}

export const fundsWithdrawnFromChannelText = (amount: string) => {
  return `Sucessfully transferred ${amount} JOY from your channel`
}

export async function getChannelTitle(em: EntityManager, channelId: string): Promise<string> {
  const channel = await em.getRepository(Channel).findOneOrFail({ where: { id: channelId } })
  return channel.title || ''
}

export async function getVideoTitle(em: EntityManager, videoId: string): Promise<string> {
  const video = await em.getRepository(Video).findOneOrFail({ where: { id: videoId } })
  return video.title || ''
}

export async function getCategoryNameFromVideo(
  em: EntityManager,
  videoId: string
): Promise<string> {
  const result = await em
    .getRepository(Video)
    .findOneOrFail({ where: { id: videoId }, relations: { category: true } })
  return result.category?.name || ''
}

export async function getMemberHandle(em: EntityManager, memberId: string): Promise<string> {
  const member = await em.getRepository(Membership).findOneOrFail({ where: { id: memberId } })
  return member.handle || ''
}

export async function textForNotification(
  em: EntityManager,
  notification: NotificationType
): Promise<string> {
  switch (notification.isTypeOf) {
    case 'ChannelExcluded':
      return channelExcludedText(
        await getChannelTitle(em, (notification.recipient as ChannelRecipient).channel)
      )
    case 'VideoExcluded':
      return videoExcludedText(await getVideoTitle(em, notification.video))
    case 'VideoFeaturedOnCategoryPage':
      return videoFeaturedOnCategoryPageText(
        await getVideoTitle(em, notification.video),
        await getCategoryNameFromVideo(em, notification.video)
      )
    case 'VideoFeaturedAsCategoryHero':
      return videoFeaturedAsHeroText(await getVideoTitle(em, notification.video))
    case 'NewChannelFollower':
      return newChannelFollowerText(
        await getChannelTitle(em, (notification.recipient as ChannelRecipient).channel)
      )
    case 'CommentPostedToVideo':
      return commentPostedToVideoText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.member)
      )
    case 'VideoLiked':
      return videoLikedText(await getVideoTitle(em, notification.video))
    case 'VideoDisliked':
      return videoLikedText(await getVideoTitle(em, notification.video))
    case 'ChannelVerified':
      return channelVerifiedViaYPPText()
    case 'ChannelSuspended':
      return channelSuspendedViaYPPText()
    case 'BidMadeCompletingAuction':
      return bidMadeCompletingAuctionText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.bidder),
        notification.amount.toString()
      )
    case 'ChannelCreated':
      return channelCreatedText(await getChannelTitle(em, notification.channel))
    case 'ChannelFundsWithdrawn':
      return fundsWithdrawnFromChannelText(notification.amount.toString())
    case 'CommentReply':
      return commentRepliedText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.member)
      )
    case 'ReactionToComment':
      return commentReactedText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.member)
      )
    case 'CreatorReceivesAuctionBid':
      return nftBidReceivedText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.bidder),
        notification.amount.toString()
      )
    case 'HigherBidPlaced':
      return nftBidOutbidText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.bidder)
      )
    case 'DirectChannelPaymentByMember':
      return channelReceivedDirectPaymentText(
        await getChannelTitle(em, notification.member),
        notification.amount.toString()
      )
    case 'EnglishAuctionLost':
      return timedAuctionBidLostText(await getVideoTitle(em, notification.video))
    case 'EnglishAuctionWon':
      return timedAuctionBidWonText(await getVideoTitle(em, notification.video))
    case 'EnglishAuctionSettled':
      return timedAuctionExpiredText(await getVideoTitle(em, notification.video))
    case 'OpenAuctionLost':
      return openAuctionBidLostText(await getVideoTitle(em, notification.video))
    case 'OpenAuctionWon':
      return openAuctionBidWonText(await getVideoTitle(em, notification.video))
    case 'NewAuction':
      return newNftOnAuctionText(
        await getChannelTitle(em, (notification.recipient as ChannelRecipient).channel),
        await getVideoTitle(em, notification.video)
      )
    case 'NewAuctionBid':
      return nftBidReceivedText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.bidder),
        notification.bidAmount.toString()
      )
    case 'NewNftOnSale':
      return newNftOnSaleText(
        await getChannelTitle(em, (notification.recipient as ChannelRecipient).channel),
        await getVideoTitle(em, notification.video)
      )
    case 'NftFeaturedOnMarketPlace':
      return nftFeaturedOnMarketplaceText(await getVideoTitle(em, notification.video))
    case 'NftPurchased':
      return nftPurchasedText(
        await getVideoTitle(em, notification.video),
        await getMemberHandle(em, notification.buyer),
        notification.price.toString()
      )
    case 'RoyaltyPaid':
      return nftRoyaltyPaymentReceivedText(
        await getVideoTitle(em, notification.video),
        notification.royaltyAmount.toString()
      )
    case 'VideoPosted':
      return newVideoPostedText(
        await getChannelTitle(em, (notification.recipient as ChannelRecipient).channel),
        await getVideoTitle(em, notification.video)
      )
    default:
      return ''
  }
}
