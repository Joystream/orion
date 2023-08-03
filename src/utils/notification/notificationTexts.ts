export const channelExcludedText = (channelTitle: string) => {
  return `Your channel ${channelTitle} has been excluded`
}
export const videoExcludedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been excluded`
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

export const nftPurchasedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `Your NFT for ${videoTitle} has been purchased by ${memberHandle} for ${nftPrice}`
}

export const nftBidReceivedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `${memberHandle} placed a bid of ${nftPrice} on nft: ${videoTitle}`
}

export const nftRoyaltyPaymentReceivedText = (nftPrice: string, videoTitle: string) => {
  return `you received ${nftPrice} royalties for your nft: ${videoTitle}`
}

export const channelReceivedDirectPaymentText = (memberHandle: string, nftPrice: string) => {
  return `${memberHandle} transferred ${nftPrice} to your channel`
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

export const nftBidOutbidText = (memberHandle: string, videoTitle: string) => {
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

export const fundsWithdrawnFromChannelText = (amount: string) => {
  return `Sucessfully transferred ${amount} JOY from your channel`
}
