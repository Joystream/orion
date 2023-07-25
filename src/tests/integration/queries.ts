import { ApolloClient, DocumentNode, gql, NormalizedCacheObject, OperationVariables } from '@apollo/client'
import { } from '@apollo/client';
import { expect } from 'chai';
import { AccountNotificationPreferences, NotificationPreference } from '../../model';
import { AccountNotificationPreferencesOutput, NotificationPreferenceGQL } from '../../server-extension/resolvers/NotificationResolver/types';

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

export const SetNotificationPreferencesAllFalseMut = gql`
mutation {
	setAccountNotificationPreferences(
		notificationPreferences: {
			channelExcludedFromAppNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			videoExcludedFromAppNotificationEnabled: { 
        inAppEnabled: false 
        emailEnabled: false 
      }
			videoFeaturedAsHeroNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			videoFeaturedOnCategoryPageNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			nftFeaturedOnMarketPlaceNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			newChannelFollowerNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			videoCommentCreatedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			videoLikedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			videoDislikedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			yppSignupSuccessfulNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			yppChannelVerifiedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			nftBoughtNotificationEnabled: { inAppEnabled: false, emailEnabled: false }
			bidMadeOnNftNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			royaltyReceivedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			channelPaymentReceivedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			channelReceivedFundsFromWgNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			newPayoutUpdatedByCouncilNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			channelFundsWithdrawnNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			channelCreatedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			replyToCommentNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			reactionToCommentNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			videoPostedNotificationEnabled: {
				emailEnabled: false
				inAppEnabled: false
			}
			newNftOnAuctionNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			newNftOnSaleNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			higherBidThanYoursMadeNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			auctionExpiredNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			auctionWonNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			auctionLostNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			openAuctionBidCanBeWithdrawnNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			fundsFromCouncilReceivedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			fundsToExternalWalletSentNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
			fundsFromWgReceivedNotificationEnabled: {
				inAppEnabled: false
				emailEnabled: false
			}
		}
	) {
		auctionExpiredNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		auctionLostNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		auctionWonNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		bidMadeOnNftNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		channelCreatedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		channelExcludedFromAppNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		channelFundsWithdrawnNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		channelPaymentReceivedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		channelReceivedFundsFromWgNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		fundsFromCouncilReceivedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		fundsFromWgReceivedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		fundsToExternalWalletSentNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		higherBidThanYoursMadeNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		newChannelFollowerNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		newNftOnAuctionNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		newNftOnSaleNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		newPayoutUpdatedByCouncilNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		nftBoughtNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		nftFeaturedOnMarketPlaceNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		openAuctionBidCanBeWithdrawnNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		reactionToCommentNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		replyToCommentNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		royaltyReceivedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		videoCommentCreatedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		videoDislikedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		videoExcludedFromAppNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		videoFeaturedAsHeroNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		videoFeaturedOnCategoryPageNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		videoLikedNotificationEnabled {
			inAppEnabled
			emailEnabled
		}
		videoPostedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		yppChannelVerifiedNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
		yppSignupSuccessfulNotificationEnabled {
			emailEnabled
			inAppEnabled
		}
	}
}
`

export function expectNotificationPreferenceToBe(pref: NotificationPreference | NotificationPreferenceGQL, expected: boolean) {
  expect(pref.inAppEnabled).to.equal(expected)
  expect(pref.emailEnabled).to.equal(expected);
}

export function checkAllNotificationPreferencesToBe(preferences: AccountNotificationPreferencesOutput | AccountNotificationPreferences, expected: boolean) {
  expectNotificationPreferenceToBe(preferences.channelExcludedFromAppNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoExcludedFromAppNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoFeaturedAsHeroNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoFeaturedOnCategoryPageNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.nftFeaturedOnMarketPlaceNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.newChannelFollowerNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoCommentCreatedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoLikedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoDislikedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.yppSignupSuccessfulNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.yppChannelVerifiedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.nftBoughtNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.bidMadeOnNftNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.royaltyReceivedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.channelPaymentReceivedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.channelReceivedFundsFromWgNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.newPayoutUpdatedByCouncilNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.channelFundsWithdrawnNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.channelCreatedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.replyToCommentNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.reactionToCommentNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.videoPostedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.newNftOnAuctionNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.newNftOnSaleNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.higherBidThanYoursMadeNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.auctionExpiredNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.auctionWonNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.auctionLostNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.openAuctionBidCanBeWithdrawnNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.fundsFromCouncilReceivedNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.fundsToExternalWalletSentNotificationEnabled, expected);
  expectNotificationPreferenceToBe(preferences.fundsFromWgReceivedNotificationEnabled, expected);
}

export const SetNotificationEnabledMut = (prefFieldName: string) => gql`
  mutation {
    setAccountNotificationPreferences(notificationPreferences: {
      ${prefFieldName}: {
        emailEnabled: true
        inAppEnabled: true
      }
    }) {
      ${prefFieldName} {
        emailEnabled
        inAppEnabled
      }
    }
  }
`

export const MarkNotificationAsReadMut = gql`
  mutation markNotificationAsRead($notificationIds: [String!]!) {
    markNotificationsAsRead(notificationIds: $notificationIds) {
      notificationsRead
    }
  }
`


