import { compile } from 'handlebars'
import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'

function getEmailTemplateData<T>(templatePath: string): (data: T) => string {
  const config = {
    'beautify': false,
    'fonts': {
      'Roboto': 'https://fonts.googleapis.com/css?family=Roboto',
    },
  }

  const fullPath = path.join(__dirname, 'templates/' + templatePath)
  return (data) => {
    const mjmlXml = compile<T>(fs.readFileSync(fullPath).toString())
    const { html } = mjml2html(mjmlXml(data), config)
    return html
  }
}

// type aliases for template data
type RegisterEmailTemplateData = {
  link: string
  linkExpiryDate: string
  appName: string
}

// function exports
export const registerEmailContent: (data: RegisterEmailTemplateData) => string =
  getEmailTemplateData('register.xml.mst')

export const notificationEmail: (notificationText: string, appName: string) => string =
  getEmailTemplateData('notificationTemplate.xml.mst')

const channelExcludedText = (channelTitle: string) => {
  return `Your channel ${channelTitle} has been excluded`
}
const videoExcludedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been excluded`
}

const videoFeaturedAsHeroText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been featured as Hero`
}

const videoFeaturedOnCategoryPageText = (videoTitle: string, categoryTitle: string) => {
  return `Your video ${videoTitle} has been featured on the ${categoryTitle} category page`
}

const nftFeaturedOnMarketplaceText = (videoTitle: string) => {
  return `Your nft for ${videoTitle} has been featured on the marketplace`
}

const newChannelFollowerText = (channelTitle: string) => {
  return `You have a new follower on channel ${channelTitle}`
}

const commentPostedToVideoText = (videoTitle: string, memberHandle: string) => {
  return `${memberHandle} left a comment on Your video ${videoTitle}`
}

const videoLikedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has a new like`
}

const videoDislikedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has a new dislike`
}

const channelVerifiedViaYPPText = () => {
  return `Your channel has been verified via YPP`
}

const nftPurchasedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `Your NFT for ${videoTitle} has been purchased by ${memberHandle} for ${nftPrice}`
}

const nftBidReceivedText = (memberHandle: string, nftPrice: string, videoTitle: string) => {
  return `${memberHandle} placed a bid of ${nftPrice} on nft: ${videoTitle}`
}

const nftRoyaltyPaymentReceivedText = (nftPrice: string, videoTitle: string) => {
  return `you received ${nftPrice} royalties for your nft: ${videoTitle}`
}

const channelReceivedDirectPaymentText = (memberHandle: string, nftPrice: string) => {
  return `${memberHandle} transferred ${nftPrice} to your channel`
}

const timedAuctionExpiredText = (videoTitle: string) => {
  return `Timed auction expired for your nft: ${videoTitle}`
}

const openAuctionExpiredText = (videoTitle: string) => {
  return `Open auction settled for your nft: ${videoTitle}`
}

const channelCreatedText = (channelTitle: string) => {
  return `${channelTitle} has been created`
}

const commentRepliedText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} has replied to your comment under ${videoTitle}`
}

const commentReactedText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} has reacted to your comment under ${videoTitle}`
}

const newVideoPostedText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just posted a new video ${videoTitle}`
}

const newNftOnAuctionText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just started an auction of nft: ${videoTitle}`
}

const newNftOnSaleText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just started the sale of nft ${videoTitle}`
}

const nftBidOutbidText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} placed a higher bid on NFT ${videoTitle}`
}

const openAuctionBidWonText = (videoTitle: string) => {
  return `You won an open auction for nft: ${videoTitle}`
}

const timedAuctionBidWonText = (videoTitle: string) => {
  return `You won a timed auction for nft: ${videoTitle}`
}

const openAuctionBidLostText = (videoTitle: string) => {
  return `You lost an open auction for nft: ${videoTitle}`
}

const timedAuctionBidLostText = (videoTitle: string) => {
  return `You lost an timed auction for nft: ${videoTitle}`
}

const councilPayoutText = (nftPrice: string) => {
  return `You received ${nftPrice} from the council`
}

const councilPayoutTextForChannel = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} received ${nftPrice} from the council`
}

const councilPayoutTextForChannelToMember = (
  channelTitle: string,
  memberHandle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to ${memberHandle}`
}

const councilPayoutTextForChannelToExternalWallet = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} transferred ${nftPrice} to an external wallet`
}

const workingGroupPayoutText = (nftPrice: string) => {
  return `You received ${nftPrice} from the working group`
}

const workingGroupPayoutTextForChannel = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} received ${nftPrice} from the working group`
}

const workingGroupPayoutTextForChannelToMember = (
  channelTitle: string,
  memberHandle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to ${memberHandle}`
}

const workingGroupPayoutTextForChannelToExternalWallet = (
  channelTitle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to an external wallet`
}

const payoutUpdatedByCouncilText = (nftPrice: string) => {
  return `New payout of ${nftPrice} has been updated by the council`
}

const payoutUpdatedByCouncilTextForChannel = (channelTitle: string, nftPrice: string) => {
  return `New payout of ${nftPrice} has been updated by the council for ${channelTitle}`
}

const payoutUpdatedByCouncilTextForChannelToMember = (
  channelTitle: string,
  memberHandle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to ${memberHandle}`
}

const payoutUpdatedByCouncilTextForChannelToExternalWallet = (
  channelTitle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to an external wallet`
}

const payoutUpdatedByCouncilTextForChannelToWorkingGroup = (
  channelTitle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to the working group`
}

const payoutUpdatedByCouncilTextForChannelToCouncil = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} transferred ${nftPrice} to the council`
}

const payoutUpdatedByCouncilTextForChannelToTreasury = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} transferred ${nftPrice} to the treasury`
}
