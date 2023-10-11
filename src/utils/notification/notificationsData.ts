import { EntityManager } from 'typeorm'
import { NotificationType } from '../../model'
import { getNotificationIcon } from './notificationIcons'
import { getNotificationLink } from './notificationLinks'

type NotificationData = {
  icon: string
  link: string
  avatar: string
  text: string
}

export const getNotificationData = async (
  em: EntityManager,
  notification: NotificationType
): Promise<NotificationData> => {
  switch (notification.isTypeOf) {
    //
    // Member notifications events
    //

    // Generic
    case 'ChannelCreated':
      return {
        icon: getNotificationIcon('bell'),
        link: await getNotificationLink(em, {
          type: 'channel-page',
          params: [notification.channelId],
        }),
        avatar: await getNotificationAvatar(em, {
          type: 'channel',
          params: [notification.channelId],
        }),
        text: `New channel created: “$${notification.channelTitle}“`,
      }

    // Engagement
    case 'CommentReply':
      return {
        icon: getNotificationIcon('follow'),
        link: await getNotificationLink(em, {
          type: 'video-page',
          params: [notification.videoId, notification.commentId],
        }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.memberHandle],
        }),
        text: `${notification.memberHandle} replied to your comment under the video: “${notification.videoTitle}”`,
      }
    case 'ReactionToComment':
      return {
        icon: getNotificationIcon('reaction'),
        link: await getNotificationLink(em, {
          type: 'video-page',
          params: [notification.videoId, notification.commentId],
        }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.memberHandle],
        }),
        text: `${notification.memberHandle} reacted to your comment on the video: “${notification.videoTitle}”`,
      }

    // Followed channels
    case 'VideoPosted':
      return {
        icon: getNotificationIcon('video'),
        link: await getNotificationLink(em, { type: 'video-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'channel',
          params: [notification.channelId],
        }),
        text: `${notification.channelTitle} posted a new video: “${notification.videoTitle}”`,
      }
    case 'NewNftOnSale':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'channel',
          params: [notification.channelId],
        }),
        text: `${notification.channelTitle} started the sale of NFT: “${notification.videoTitle}”`,
      }
    case 'NewAuction':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'channel',
          params: [notification.channelId],
        }),
        text: `${notification.channelTitle} started an auction for NFT: “${notification.videoTitle}”`,
      }

    // NFT
    case 'HigherBidPlaced':
      return {
        icon: getNotificationIcon('nft-alt'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.newBidderHandle],
        }),
        text: `${notification.newBidderHandle} placed a higher bid in the auction for NFT: “${notification.videoTitle}”`,
      }
    case 'AuctionWon': {
      const auctionText = notification.type.isTypeOf === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, { type: 'active-membership' }),
        text: `You won ${auctionText} auction for NFT: “${notification.videoTitle}”`,
      }
    }
    case 'AuctionLost': {
      const auctionText = notification.type.isTypeOf === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: getNotificationIcon('nft-alt'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, { type: 'active-membership' }),
        text: `You lost ${auctionText} auction for NFT: “${notification.videoTitle}”. Withdraw your bid`,
      }
    }

    //
    // Channel notifications events
    //

    // Content moderation and featuring
    case 'ChannelExcluded': {
      const channelTitle = '...' // TODO
      return {
        icon: getNotificationIcon('warning'),
        link: await getNotificationLink(em, { type: 'term-of-sevice-page' }),
        avatar: await getNotificationAvatar(em, { type: 'active-channel' }),
        text: `Your channel “${channelTitle}” is excluded from App`,
      }
    }
    case 'VideoExcluded':
      return {
        icon: getNotificationIcon('warning'),
        link: await getNotificationLink(em, { type: 'term-of-sevice-page' }),
        avatar: await getNotificationAvatar(em, { type: 'active-channel' }),
        text: `Your video is excluded from App: “$${notification.videoTitle}”`,
      }
    case 'NftFeaturedOnMarketPlace':
      return {
        icon: getNotificationIcon('bell'),
        link: await getNotificationLink(em, { type: 'marketplace-page' }),
        avatar: await getNotificationAvatar(em, { type: 'active-channel' }),
        text: `Your NFT was featured in the marketplace featured section: “$${notification.videoTitle}”`,
      }

    // Engagement
    case 'NewChannelFollower':
      return {
        icon: getNotificationIcon('follow'),
        link: await getNotificationLink(em, {
          type: 'member-page',
          params: [notification.followerHandle],
        }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.followerHandle],
        }),
        text: `${notification.followerHandle} followed your channel`,
      }
    case 'CommentPostedToVideo':
      return {
        icon: getNotificationIcon('follow'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.memberHandle],
        }),
        text: `${notification.memberHandle} left a comment on your video: “${notification.videoTitle}”`,
      }
    case 'VideoLiked':
      return {
        icon: getNotificationIcon('like'),
        link: await getNotificationLink(em, { type: 'video-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.memberHandle],
        }),
        text: `{/*notification.memberHandle*/ 'Someone'} liked your video: “${notification.videoTitle}”`,
      }
    case 'VideoDisliked':
      return {
        icon: getNotificationIcon('dislike'),
        link: await getNotificationLink(em, { type: 'video-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.memberHandle],
        }),
        text: `{/*notification.memberHandle*/ 'Someone'} disliked your video: “${notification.videoTitle}”`,
      }

    // Youtube Partnership Program
    case 'ChannelVerified':
      return {
        icon: getNotificationIcon('bell'),
        link: await getNotificationLink(em, { type: 'ypp-dashboard' }),
        avatar: await getNotificationAvatar(em, { type: 'active-channel' }),
        text: `Your channel got verified in our Youtube Partnership Program`,
      }
    case 'ChannelSuspended':
      return {
        icon: getNotificationIcon('warning'),
        link: await getNotificationLink(em, { type: 'ypp-dashboard' }),
        avatar: await getNotificationAvatar(em, { type: 'active-channel' }),
        text: `Your channel got suspended in our Youtube Partnership Program`,
      }

    // NFTs Auctions
    case 'NftPurchased':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.buyerHandle],
        }),
        text: `${notification.buyerHandle} purchased for <NumberFormat as="span" value=${notification.price} format="short" withToken withDenomination="before" /> your NFT: “${notification.videoTitle}”`,
      }
    case 'NftRoyaltyPaid':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, { type: 'active-channel' }),
        text: `You received <NumberFormat as="span" value=${notification.amount} format="short" withToken withDenomination="before" /> royalties from your NFT: “${notification.videoTitle}”`,
      }
    case 'CreatorReceivesAuctionBid':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, { type: 'nft-page', params: [notification.videoId] }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.bidderHandle],
        }),
        text: `${notification.bidderHandle} placed a bid of <NumberFormat as="span" value=${notification.amount} format="short" withToken withDenomination="before" /> for your NFT: “${notification.videoTitle}”`,
      }

    // Payouts
    case 'DirectChannelPaymentByMember':
      return {
        icon: getNotificationIcon('payout'),
        link: await getNotificationLink(em, {
          type: 'member-page',
          params: [notification.payerHandle],
        }),
        avatar: await getNotificationAvatar(em, {
          type: 'membership',
          params: [notification.payerHandle],
        }),
        text: `${notification.payerHandle} transferred <NumberFormat as="span" value=${notification.amount} format="short" withToken withDenomination="before" /> to
            your channel`,
      }
    case 'ChannelFundsWithdrawn':
      return {
        icon: getNotificationIcon('payout'),
        link: await getNotificationLink(em, { type: 'payments-page' }),
        avatar: await getNotificationAvatar(em, { type: 'active-membership' }),
        text: `<NumberFormat as="span" value=${notification.amount} format="short" withToken withDenomination="before" /> were withdrawn from your channel account`,
      }
  }
}
