// TODO: uncomment and refactor for scheduler featurej
// import { EntityManager } from 'typeorm'
// import {
//   Channel,
//   Video,
//   Membership,
//   ChannelExcluded,
//   VideoExcluded,
//   VideoFeaturedOnCategoryPage,
//   VideoFeaturedAsCategoryHero,
//   NewChannelFollower,
//   CommentPostedToVideo,
//   VideoLiked,
//   VideoDisliked,
//   BidMadeCompletingAuction,
//   ChannelCreated,
//   ChannelFundsWithdrawn,
//   CommentReply,
//   ReactionToComment,
//   CreatorReceivesAuctionBid,
//   HigherBidPlaced,
//   DirectChannelPaymentByMember,
//   EnglishAuctionLost,
//   EnglishAuctionWon,
//   EnglishAuctionSettled,
//   OpenAuctionLost,
//   OpenAuctionWon,
//   NewAuction,
// } from '../../model'
// import { CreatorRecipientParams, MemberRecipientParams } from './helpers'

// export const channelExcludedText = (channelTitle: string) => {
//   return `Your channel ${channelTitle} has been excluded`
// }
// export const videoExcludedText = (videoTitle: string) => {
//   return `Your video ${videoTitle} has been excluded`
// }

// export const nftOfferedText = (videoTitle: string, price: string) => {
//   return `Nft for ${videoTitle} has been offered to you for ${price}`
// }

// export const videoFeaturedAsHeroText = (videoTitle: string) => {
//   return `Your video ${videoTitle} has been featured as Hero`
// }

// export const videoFeaturedOnCategoryPageText = (videoTitle: string, categoryTitle: string) => {
//   return `Your video ${videoTitle} has been featured on the ${categoryTitle} category page`
// }

// export const nftFeaturedOnMarketplaceText = (videoTitle: string) => {
//   return `Your nft for ${videoTitle} has been featured on the marketplace`
// }

// export const newChannelFollowerText = (channelTitle: string) => {
//   return `You have a new follower on channel ${channelTitle}`
// }

// export const commentPostedToVideoText = (videoTitle: string, memberHandle: string) => {
//   return `${memberHandle} left a comment on Your video ${videoTitle}`
// }

// export const videoLikedText = (videoTitle: string) => {
//   return `Your video ${videoTitle} has a new like`
// }

// export const videoDislikedText = (videoTitle: string) => {
//   return `Your video ${videoTitle} has a new dislike`
// }

// export const channelVerifiedViaYPPText = () => {
//   return `Your channel has been verified via YPP`
// }

// export const channelSuspendedViaYPPText = () => {
//   return `Your channel has been suspended via YPP`
// }

// export const nftPurchasedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
//   return `Your NFT for ${videoTitle} has been purchased by ${memberHandle} for ${nftPrice} JOY`
// }

// export const nftBidReceivedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
//   return `${memberHandle} placed a bid of ${nftPrice} JOY on nft: ${videoTitle}`
// }

// export const nftRoyaltyPaymentReceivedText = (videoTitle: string, royalties: string) => {
//   return `you received ${royalties} JOY nominal royalties for your nft: ${videoTitle}`
// }

// export const channelReceivedDirectPaymentText = (memberHandle: string, amount: string) => {
//   return `${memberHandle} transferred ${amount} JOY to your channel`
// }

// export const timedAuctionExpiredText = (videoTitle: string) => {
//   return `Timed auction expired for your nft: ${videoTitle}`
// }

// export const openAuctionExpiredText = (videoTitle: string) => {
//   return `Open auction settled for your nft: ${videoTitle}`
// }

// export const channelCreatedText = (channelTitle: string) => {
//   return `${channelTitle} has been created`
// }

// export const commentRepliedText = (videoTitle: string, memberHandle: string) => {
//   return `${memberHandle} has replied to your comment under ${videoTitle}`
// }

// export const commentReactedText = (memberHandle: string, videoTitle: string) => {
//   return `${memberHandle} has reacted to your comment under ${videoTitle}`
// }

// export const newVideoPostedText = (channelTitle: string, videoTitle: string) => {
//   return `${channelTitle} just posted a new video ${videoTitle}`
// }

// export const newNftOnAuctionText = (channelTitle: string, videoTitle: string) => {
//   return `${channelTitle} just started an auction of nft: ${videoTitle}`
// }

// export const newNftOnSaleText = (channelTitle: string, videoTitle: string) => {
//   return `${channelTitle} just started the sale of nft ${videoTitle}`
// }

// export const nftBidOutbidText = (videoTitle: string, memberHandle: string) => {
//   return `${memberHandle} placed a higher bid on NFT ${videoTitle}`
// }

// export const openAuctionBidWonText = (videoTitle: string) => {
//   return `You won an open auction for nft: ${videoTitle}`
// }

// export const timedAuctionBidWonText = (videoTitle: string) => {
//   return `You won a timed auction for nft: ${videoTitle}`
// }

// export const openAuctionBidLostText = (videoTitle: string) => {
//   return `You lost an open auction for nft: ${videoTitle}`
// }

// export const timedAuctionBidLostText = (videoTitle: string) => {
//   return `You lost an timed auction for nft: ${videoTitle}`
// }

// export const bidMadeCompletingAuctionText = (
//   videoTitle: string,
//   memberHandle: string,
//   price: string
// ) => {
//   return `Member ${memberHandle} won auction for nft: ${videoTitle} by a buy now bid of ${price} JOY`
// }

// export const fundsWithdrawnFromChannelText = (amount: string) => {
//   return `Sucessfully transferred ${amount} JOY from your channel`
// }

// export async function getChannelTitle(em: EntityManager, channelId: string): Promise<string> {
//   const channel = await em.getRepository(Channel).findOneOrFail({ where: { id: channelId } })
//   return channel.title || ''
// }

// export async function getVideoTitle(em: EntityManager, videoId: string): Promise<string> {
//   const video = await em.getRepository(Video).findOneOrFail({ where: { id: videoId } })
//   return video.title || ''
// }

// export async function getCategoryNameFromVideo(
//   em: EntityManager,
//   videoId: string
// ): Promise<string> {
//   const result = await em
//     .getRepository(Video)
//     .findOneOrFail({ where: { id: videoId }, relations: { category: true } })
//   return result.category?.name || ''
// }

// export async function getMemberHandle(em: EntityManager, memberId: string): Promise<string> {
//   const member = await em.getRepository(Membership).findOneOrFail({ where: { id: memberId } })
//   return member.handle || ''
// }

// export async function textForNotification(
//   param: CreatorRecipientParams | MemberRecipientParams
// ): Promise<string> {
//   switch (param.data.isTypeOf) {
//     case 'ChannelExcluded':
//       return channelExcludedText((param.data as ChannelExcluded).channelTitle)
//     case 'VideoExcluded':
//       return videoExcludedText((param.data as VideoExcluded).videoTitle)
//     case 'VideoFeaturedOnCategoryPage':
//       return videoFeaturedOnCategoryPageText(
//         (param.data as VideoFeaturedOnCategoryPage).videoTitle,
//         (param.data as VideoFeaturedOnCategoryPage).categoryName
//       )
//     case 'VideoFeaturedAsCategoryHero':
//       return videoFeaturedAsHeroText((param.data as VideoFeaturedAsCategoryHero).videoTitle)
//     case 'NewChannelFollower':
//       return newChannelFollowerText((param.data as NewChannelFollower).channelTitle)
//     case 'CommentPostedToVideo':
//       return commentPostedToVideoText(
//         (param.data as CommentPostedToVideo).videoTitle,
//         (param.data as CommentPostedToVideo).memberHandle
//       )
//     case 'VideoLiked':
//       return videoLikedText((param.data as VideoLiked).videoTitle)
//     case 'VideoDisliked':
//       return videoLikedText((param.data as VideoDisliked).videoTitle)
//     case 'ChannelVerified':
//       return channelVerifiedViaYPPText()
//     case 'ChannelSuspended':
//       return channelSuspendedViaYPPText()
//     case 'BidMadeCompletingAuction':
//       return bidMadeCompletingAuctionText(
//         (param.data as BidMadeCompletingAuction).videoTitle,
//         (param.data as BidMadeCompletingAuction).bidderHandle,
//         (param.data as BidMadeCompletingAuction).amount.toString()
//       )
//     case 'ChannelCreated':
//       return channelCreatedText((param.data as ChannelCreated).channelTitle)
//     case 'ChannelFundsWithdrawn':
//       return fundsWithdrawnFromChannelText((param.data as ChannelFundsWithdrawn).amount.toString())
//     case 'CommentReply':
//       return commentRepliedText(
//         (param.data as CommentReply).videoTitle,
//         (param.data as CommentReply).memberHandle
//       )
//     case 'ReactionToComment':
//       return commentReactedText(
//         (param.data as ReactionToComment).videoTitle,
//         (param.data as ReactionToComment).memberHandle
//       )
//     case 'CreatorReceivesAuctionBid':
//       return nftBidReceivedText(
//         (param.data as CreatorReceivesAuctionBid).videoTitle,
//         (param.data as CreatorReceivesAuctionBid).bidderHandle,
//         (param.data as CreatorReceivesAuctionBid).amount.toString()
//       )
//     case 'HigherBidPlaced':
//       return nftBidOutbidText(
//         (param.data as HigherBidPlaced).videoTitle,
//         (param.data as HigherBidPlaced).newBidderHandle
//       )
//     case 'DirectChannelPaymentByMember':
//       return channelReceivedDirectPaymentText(
//         (param.data as DirectChannelPaymentByMember).channelTitle,
//         (param.data as DirectChannelPaymentByMember).amount.toString()
//       )
//     case 'EnglishAuctionLost':
//       return timedAuctionBidLostText((param.data as EnglishAuctionLost).videoTitle)
//     case 'EnglishAuctionWon':
//       return timedAuctionBidWonText((param.data as EnglishAuctionWon).videoTitle)
//     case 'EnglishAuctionSettled':
//       return timedAuctionExpiredText((param.data as EnglishAuctionSettled).videoTitle)
//     case 'OpenAuctionLost':
//       return openAuctionBidLostText((param.data as OpenAuctionLost).videoTitle)
//     case 'OpenAuctionWon':
//       return openAuctionBidWonText((param.data as OpenAuctionWon).videoTitle)
//     case 'NewAuction':
//       return newNftOnAuctionText(
//         (param.data as NewAuction).channelTitle,
//         (param.data as NewAuction).videoTitle
//       )
//     case 'NewAuctionBid':
//       return nftBidReceivedText(param.videoTitle, param.bidderHandle, param.amount.toString())
//     case 'NewNftOnSale':
//       return newNftOnSaleText(param.channelTitle, param.videoTitle)
//     case 'NftFeaturedOnMarketPlace':
//       return nftFeaturedOnMarketplaceText(param.videoTitle)
//     case 'NftPurchased':
//       return nftPurchasedText(param.videoTitle, param.buyerHandle, param.price.toString())
//     case 'NftRoyaltyPaid':
//       return nftRoyaltyPaymentReceivedText(param.videoTitle, param.amount.toString())
//     case 'VideoPosted':
//       return newVideoPostedText(param.channelTitle, param.videoTitle)
//     default:
//       return ''
//   }
// }