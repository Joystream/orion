import { ApolloClient, DocumentNode, gql, NormalizedCacheObject, OperationVariables } from '@apollo/client'
import { } from '@apollo/client';

export type SubscriptionSession<T> = {
  query: DocumentNode,
  variables: OperationVariables,
  shouldUnsuscribe: (data: T) => boolean
}

export async function executeSubcription<T>(client: ApolloClient<NormalizedCacheObject>, { query, variables, shouldUnsuscribe }: SubscriptionSession<T>) {
  const data = await new Promise((resolve, reject) => {
    const subscription = client.subscribe({ query, variables }).subscribe({
      next: (response) => {
        if (shouldUnsuscribe(response.data)) {
          resolve(response.data); // Resolve the promise with response.data
          subscription.unsubscribe(); // Unsubscribe once the promise is resolved
        }
      },
      error: (error) => {
        reject(error); // Reject the promise if there's an error
      },
    });
  });

  return data;
}

export async function executeQuery(client: ApolloClient<NormalizedCacheObject>, query: DocumentNode, variables: OperationVariables) {
  // execute query using query and variables
  const data = await client.query({ query, variables })

  return data;
}

export const MembershipByControllerAccountSub = gql`
subscription MembershipById($accountId: String!) {
  memberships(where: {controllerAccount_eq: $accountId}) {
    id
    handle
  }
}
`

export const ChannelCreatedNotificationSub = gql`
subscription ChannelCreatedNotification($channelId: String!) {
  runtimeNotifications(where: {event: {data: {channel: {id_eq: $channelId}}}}) {
    id
    inAppRead
    mailSent
    type {
      ... on ChannelNotification {
        __typename
      }
    }
    event {
      data {
        ... on ChannelCreatedEventData {
          __typename
        }
      }
    }
  }
}
`

export const VideoCreatedNotificationSub = gql`
subscription VideoCreatedNotification($videoId: String!) {
  runtimeNotifications(where: {event: {data: {video: {id_eq: $videoId}}}}) {
    id
    inAppRead
    mailSent
    type {
      ... on ChannelNotification {
        __typename
      }
    }
    event {
      data {
        ... on VideoCreatedEventData {
          __typename
          video {
            id
          }
          channel {
            id
          }
        }
      }
    }
  }
}
`

export const ChannelFollowerNotificationSub = gql`
subscription ChannelFollowerNotification($channelId: String!) {
  offChainNotifications(where: {data: {channel: {id_eq: $channelId}}}) {
    id
    data {
      ... on NewChannelFollowerNotificationData {
        __typename
        channel {
          id
        }
      }
    }
    account {
      membership {
        id
      }
    }
  }
}
`

export const ChannelByMemberIdSub = gql`
subscription ChannelByMemberId($memberId: String!) {
  channels(where: {ownerMember: {id_eq: $memberId}}) {
    id
    isCensored
    isExcluded
    isPublic
    isVerified
    language
    title
  }
}
`

export const VideoByChannelIdSub = gql`
subscription VideosByChannelid($channelId: String!) {
  videos(where: {channel: {id_eq: $channelId}}) {
    id
    commentsCount
    isPublic
    isExplicit
    isExcluded
    isCommentSectionEnabled
    channel {
      id
    }
  }
}
`

export const SetNotificationPreferencesMut = gql`
mutation setNotificationPreferences {
  setAccountNotificationPreferences(
    auctionBidCanceledInAppNotificationEnabled: false,
    auctionBidCanceledMailNotificationEnabled: false, 
    auctionBidMadeInAppNotificationEnabled: false,
    auctionBidMadeMailNotificationEnabled: true, auctionCanceledInAppNotificationEnabled: true, auctionCanceledMailNotificationEnabled: true, bidMadeCompletingAuctionInAppNotificationEnabled: true, bidMadeCompletingAuctionMailNotificationEnabled: true, buyNowCanceledMailNotificationEnabled: true, buyNowPriceUpdatedInAppNotificationEnabled: true, buyNowPriceUpdatedMailNotificationEnabled: true, channelCreatedInAppNotificationEnabled: true, channelCreatedMailNotificationEnabled: false, channelFundsWithdrawnInAppNotificationEnabled: true, channelFundsWithdrawnMailNotificationEnabled: true, channelPaymentMadeInAppNotificationEnabled: true, channelPaymentMadeMailNotificationEnabled: true, channelPayoutsUpdatedInAppNotificationEnabled: true, channelPayoutsUpdatedMailNotificationEnabled: true, channelRewardClaimedAndWithdrawnInAppNotificationEnabled: true, channelRewardClaimedAndWithdrawnMailNotificationEnabled: true, channelRewardClaimedInAppNotificationEnabled: true, channelRewardClaimedMailNotificationEnabled: true, commentCreatedInAppNotificationEnabled: true, commentCreatedMailNotificationEnabled: true, commentTextUpdatedInAppNotificationEnabled: true, commentTextUpdatedMailNotificationEnabled: true, englishAuctionSettledInAppNotificationEnabled: true, englishAuctionSettledMailNotificationEnabled: true, englishAuctionStartedInAppNotificationEnabled: true, englishAuctionStartedMailNotificationEnabled: true, memberBannedFromChannelInAppNotificationEnabled: true, memberBannedFromChannelMailNotificationEnabled: true, metaprotocolTransactionStatusInAppNotificationEnabled: true, metaprotocolTransactionStatusMailNotificationEnabled: true, newChannelFollowerInAppNotificationPreferences: true, newChannelFollowerMailNotificationPreferences: true, nftBoughtInAppNotificationEnabled: true, nftBoughtMailNotificationEnabled: true, nftIssuedMailNotificationEnabled: true, nftSellOrderMadeInAppNotificationEnabled: true, nftSellOrderMadeMailNotificationEnabled: true, openAuctionBidAcceptedInAppNotificationEnabled: true, openAuctionBidAcceptedMailNotificationEnabled: true, openAuctionStartedInAppNotificationEnabled: true, openAuctionStartedMailNotificationEnabled: true)
}
`

export const MarkNotificationAsReadMut: (notificationIds: string[]) => string = (notificationIds: string[]) => {
  return `mutation MarkNotificationAsRead {
  markNotificationsAsRead(notificationIds: ${notificationIds})
}
`}
