import { EntityManager } from 'typeorm'
import { Channel, Notification } from '../../model'
import { getNotificationAvatar } from './notificationAvatars'
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
  { notificationType: notif, recipient }: Notification
): Promise<NotificationData> => {
  const recipientId =
    recipient.isTypeOf === 'MemberRecipient' ? recipient.membership : recipient.channel

  switch (notif.isTypeOf) {
    //
    // Member notifications events
    //

    // Generic
    case 'ChannelCreated':
      return {
        icon: getNotificationIcon('bell'),
        link: await getNotificationLink(em, 'channel-page', [notif.channelId]),
        avatar: await getNotificationAvatar(em, 'channelId', notif.channelId),
        text: `New channel created: “$${notif.channelTitle}“`,
      }

    // Engagement
    case 'CommentReply':
      return {
        icon: getNotificationIcon('follow'),
        link: await getNotificationLink(em, 'video-page', [notif.videoId, notif.commentId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.memberHandle),
        text: `${notif.memberHandle} replied to your comment under the video: “${notif.videoTitle}”`,
      }
    case 'ReactionToComment':
      return {
        icon: getNotificationIcon('reaction'),
        link: await getNotificationLink(em, 'video-page', [notif.videoId, notif.commentId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.memberHandle),
        text: `${notif.memberHandle} reacted to your comment on the video: “${notif.videoTitle}”`,
      }

    // Followed channels
    case 'VideoPosted':
      return {
        icon: getNotificationIcon('video'),
        link: await getNotificationLink(em, 'video-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', notif.channelId),
        text: `${notif.channelTitle} posted a new video: “${notif.videoTitle}”`,
      }
    case 'NewNftOnSale':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', notif.channelId),
        text: `${notif.channelTitle} started the sale of NFT: “${notif.videoTitle}”`,
      }
    case 'NewAuction':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', notif.channelId),
        text: `${notif.channelTitle} started an auction for NFT: “${notif.videoTitle}”`,
      }

    // NFT
    case 'HigherBidPlaced':
      return {
        icon: getNotificationIcon('nft-alt'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.newBidderHandle),
        text: `${notif.newBidderHandle} placed a higher bid in the auction for NFT: “${notif.videoTitle}”`,
      }
    case 'AuctionWon': {
      const auctionText = notif.type.isTypeOf === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', recipientId),
        text: `You won ${auctionText} auction for NFT: “${notif.videoTitle}”`,
      }
    }
    case 'AuctionLost': {
      const auctionText = notif.type.isTypeOf === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: getNotificationIcon('nft-alt'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipId', recipientId),
        text: `You lost ${auctionText} auction for NFT: “${notif.videoTitle}”. Withdraw your bid`,
      }
    }

    //
    // Channel notifications events
    //

    // Content moderation and featuring
    case 'ChannelExcluded': {
      const channel = await em.getRepository(Channel).findOneBy({ id: recipientId })
      return {
        icon: getNotificationIcon('warning'),
        link: await getNotificationLink(em, 'term-of-sevice-page'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your channel “${channel?.title}” is excluded from App`,
      }
    }
    case 'VideoExcluded':
      return {
        icon: getNotificationIcon('warning'),
        link: await getNotificationLink(em, 'term-of-sevice-page'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your video is excluded from App: “$${notif.videoTitle}”`,
      }
    case 'NftFeaturedOnMarketPlace':
      return {
        icon: getNotificationIcon('bell'),
        link: await getNotificationLink(em, 'marketplace-page'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your NFT was featured in the marketplace featured section: “$${notif.videoTitle}”`,
      }

    // Engagement
    case 'NewChannelFollower':
      return {
        icon: getNotificationIcon('follow'),
        link: await getNotificationLink(em, 'member-page', [notif.followerHandle]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.followerHandle),
        text: `${notif.followerHandle} followed your channel`,
      }
    case 'CommentPostedToVideo':
      return {
        icon: getNotificationIcon('follow'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.memberHandle),
        text: `${notif.memberHandle} left a comment on your video: “${notif.videoTitle}”`,
      }
    case 'VideoLiked':
      return {
        icon: getNotificationIcon('like'),
        link: await getNotificationLink(em, 'video-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.memberHandle),
        text: `{/*notification.memberHandle*/ 'Someone'} liked your video: “${notif.videoTitle}”`,
      }
    case 'VideoDisliked':
      return {
        icon: getNotificationIcon('dislike'),
        link: await getNotificationLink(em, 'video-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.memberHandle),
        text: `{/*notification.memberHandle*/ 'Someone'} disliked your video: “${notif.videoTitle}”`,
      }

    // Youtube Partnership Program
    case 'ChannelVerified':
      return {
        icon: getNotificationIcon('bell'),
        link: await getNotificationLink(em, 'ypp-dashboard'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your channel got verified in our Youtube Partnership Program`,
      }
    case 'ChannelSuspended':
      return {
        icon: getNotificationIcon('warning'),
        link: await getNotificationLink(em, 'ypp-dashboard'),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `Your channel got suspended in our Youtube Partnership Program`,
      }

    // NFTs Auctions
    case 'NftPurchased':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.buyerHandle),
        text: `${notif.buyerHandle} purchased for <NumberFormat as="span" value=${notif.price} format="short" withToken withDenomination="before" /> your NFT: “${notif.videoTitle}”`,
      }
    case 'NftRoyaltyPaid':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'channelId', recipientId),
        text: `You received <NumberFormat as="span" value=${notif.amount} format="short" withToken withDenomination="before" /> royalties from your NFT: “${notif.videoTitle}”`,
      }
    case 'CreatorReceivesAuctionBid':
      return {
        icon: getNotificationIcon('nft'),
        link: await getNotificationLink(em, 'nft-page', [notif.videoId]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.bidderHandle),
        text: `${notif.bidderHandle} placed a bid of <NumberFormat as="span" value=${notif.amount} format="short" withToken withDenomination="before" /> for your NFT: “${notif.videoTitle}”`,
      }

    // Payouts
    case 'DirectChannelPaymentByMember':
      return {
        icon: getNotificationIcon('payout'),
        link: await getNotificationLink(em, 'member-page', [notif.payerHandle]),
        avatar: await getNotificationAvatar(em, 'membershipHandle', notif.payerHandle),
        text: `${notif.payerHandle} transferred <NumberFormat as="span" value=${notif.amount} format="short" withToken withDenomination="before" /> to
            your channel`,
      }
    case 'ChannelFundsWithdrawn':
      return {
        icon: getNotificationIcon('payout'),
        link: await getNotificationLink(em, 'payments-page'),
        avatar: await getNotificationAvatar(em, 'membershipId', recipientId),
        text: `<NumberFormat as="span" value=${notif.amount} format="short" withToken withDenomination="before" /> were withdrawn from your channel account`,
      }
  }
}
