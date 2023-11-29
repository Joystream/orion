import { EntityManager } from 'typeorm'
import { Notification } from '../../model'
import { getNotificationAvatar } from './notificationAvatars'
import { getNotificationIcon } from './notificationIcons'
import { getNotificationLink } from './notificationLinks'
import { formatJOY } from './helpers'

export type NotificationData = {
  icon: string
  link: string
  avatar: string
  text: string
}

export const getNotificationData = async (
  em: EntityManager,
  { notificationType, recipient }: Notification
): Promise<NotificationData> => {
  const recipientId =
    recipient.isTypeOf === 'MemberRecipient' ? recipient.membership : recipient.channel

  switch (notificationType.isTypeOf) {
    //
    // Member notifications events
    //

    // Generic
    case 'ChannelCreated': {
      const { channelId, channelTitle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'bell'),
        link: await getNotificationLink(em, 'channel-page', [channelId]),
        avatar: await getNotificationAvatar(em, 'channelId', channelId),
        text: `New channel created: “${channelTitle}“`,
      }
    }

    // Engagement
    case 'CommentReply': {
      const { videoId, videoTitle, commentId, memberId, memberHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'follow'),
        link: await getNotificationLink(em, 'video-page', [videoId, commentId]),
        avatar: await getNotificationAvatar(em, 'membershipId', memberId),
        text: `${memberHandle} replied to your comment under the video: “${videoTitle}”`,
      }
    }
    case 'ReactionToComment': {
      const { videoId, videoTitle, commentId, memberId, memberHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'reaction'),
        link: await getNotificationLink(em, 'video-page', [videoId, commentId]),
        avatar: await getNotificationAvatar(em, 'membershipId', memberId),
        text: `${memberHandle} reacted to your comment on the video: “${videoTitle}”`,
      }
    }

    // Followed channels
    case 'VideoPosted': {
      const { videoId, videoTitle, channelTitle, channelId } = notificationType
      return {
        icon: await getNotificationIcon(em, 'video'),
        link: await getNotificationLink(em, 'video-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', channelId),
        text: `${channelTitle} posted a new video: “${videoTitle}”`,
      }
    }
    case 'NewNftOnSale': {
      const { videoId, videoTitle, channelTitle, channelId } = notificationType
      return {
        icon: await getNotificationIcon(em, 'nft'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', channelId),
        text: `${channelTitle} started the sale of NFT: “${videoTitle}”`,
      }
    }
    case 'NewAuction': {
      const { videoId, videoTitle, channelTitle, channelId } = notificationType
      return {
        icon: await getNotificationIcon(em, 'nft'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', channelId),
        text: `${channelTitle} started an auction for NFT: “${videoTitle}”`,
      }
    }

    // NFT
    case 'HigherBidPlaced': {
      const { videoId, videoTitle, newBidderId, newBidderHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'nft-alt'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', newBidderId),
        text: `${newBidderHandle} placed a higher bid in the timed auction for NFT: “${videoTitle}”`,
      }
    }
    case 'AuctionWon': {
      const { videoId, videoTitle, type } = notificationType
      const auctionText = type.isTypeOf === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: await getNotificationIcon(em, 'nft'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', recipientId),
        text: `You won ${auctionText} auction for NFT: “${videoTitle}”`,
      }
    }
    case 'AuctionLost': {
      const { videoId, videoTitle, type } = notificationType
      const auctionText = type.isTypeOf === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: await getNotificationIcon(em, 'nft-alt'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', recipientId),
        text: `You lost ${auctionText} auction for NFT: “${videoTitle}”. Withdraw your bid`,
      }
    }

    //
    // Channel notifications events
    //

    // Content moderation and featuring
    case 'ChannelExcluded': {
      const { channelTitle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'warning'),
        link: await getNotificationLink(em, 'term-of-sevice-page'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your channel “${channelTitle}” is excluded from App`,
      }
    }
    case 'VideoExcluded': {
      const { videoTitle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'warning'),
        link: await getNotificationLink(em, 'term-of-sevice-page'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your video is excluded from App: “${videoTitle}”`,
      }
    }
    case 'NftFeaturedOnMarketPlace': {
      const { videoTitle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'bell'),
        link: await getNotificationLink(em, 'marketplace-page'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your NFT was featured in the marketplace featured section: “${videoTitle}”`,
      }
    }

    // Engagement
    case 'NewChannelFollower': {
      const { followerId, followerHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'follow'),
        link: await getNotificationLink(em, 'member-page', [followerId]),
        avatar: await getNotificationAvatar(em, 'membershipId', followerId),
        text: `${followerHandle} followed your channel`,
      }
    }
    case 'CommentPostedToVideo': {
      const { videoId, videoTitle, memberId, memberHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'follow'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', memberId),
        text: `${memberHandle} left a comment on your video: “${videoTitle}”`,
      }
    }
    case 'VideoLiked': {
      const { videoId, videoTitle, memberId, memberHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'like'),
        link: await getNotificationLink(em, 'video-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', memberId),
        text: `${memberHandle} liked your video: “${videoTitle}”`,
      }
    }
    case 'VideoDisliked': {
      const { videoId, videoTitle, memberId, memberHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'dislike'),
        link: await getNotificationLink(em, 'video-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', memberId),
        text: `${memberHandle} disliked your video: “${videoTitle}”`,
      }
    }

    // Youtube Partnership Program
    case 'ChannelVerified': {
      return {
        icon: await getNotificationIcon(em, 'bell'),
        link: await getNotificationLink(em, 'ypp-dashboard'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your channel got verified in our Youtube Partnership Program`,
      }
    }
    case 'ChannelSuspended': {
      return {
        icon: await getNotificationIcon(em, 'warning'),
        link: await getNotificationLink(em, 'ypp-dashboard'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your channel got suspended in our Youtube Partnership Program`,
      }
    }

    // NFTs Auctions
    case 'NftPurchased': {
      const { videoId, videoTitle, buyerId, buyerHandle, price } = notificationType
      return {
        icon: await getNotificationIcon(em, 'nft'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', buyerId),
        text: `${buyerHandle} purchased for ${formatJOY(price)} your NFT: “${videoTitle}”`,
      }
    }
    case 'NftRoyaltyPaid': {
      const { videoId, videoTitle, amount } = notificationType
      return {
        icon: await getNotificationIcon(em, 'nft'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `You received ${formatJOY(amount)} royalties from your NFT: “${videoTitle}”`,
      }
    }
    case 'CreatorReceivesAuctionBid': {
      const { videoId, videoTitle, amount, bidderId, bidderHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'nft'),
        link: await getNotificationLink(em, 'nft-page', [videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', bidderId),
        text: `${bidderHandle} placed a bid of ${formatJOY(amount)} for your NFT: “${videoTitle}”`,
      }
    }

    // Payouts
    case 'DirectChannelPaymentByMember': {
      const { amount, payerId, payerHandle } = notificationType
      return {
        icon: await getNotificationIcon(em, 'payout'),
        link: await getNotificationLink(em, 'member-page', [payerId]),
        avatar: await getNotificationAvatar(em, 'membershipId', payerId),
        text: `${payerHandle} transferred ${formatJOY(amount)} to your channel`,
      }
    }
    case 'ChannelFundsWithdrawn': {
      const { amount } = notificationType
      return {
        icon: await getNotificationIcon(em, 'payout'),
        link: await getNotificationLink(em, 'payments-page'),
        avatar: await getNotificationAvatar(em, 'membershipId', recipientId),
        text: `${formatJOY(amount)} were withdrawn from your channel account`,
      }
    }
  }
}
