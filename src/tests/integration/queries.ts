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

export function checkNotificationPreferences(preferences: AccountNotificationPreferencesOutput | AccountNotificationPreferences) {
  expectNotificationPreferenceToBe(preferences.channelExcludedFromAppNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoExcludedFromAppNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoFeaturedAsHeroNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoFeaturedOnCategoryPageNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.nftFeaturedOnMarketPlaceNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.newChannelFollowerNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoCommentCreatedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoLikedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoDislikedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.yppSignupSuccessfulNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.yppChannelVerifiedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.nftBoughtNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.bidMadeOnNftNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.royaltyReceivedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.channelPaymentReceivedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.channelReceivedFundsFromWgNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.newPayoutUpdatedByCouncilNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.channelFundsWithdrawnNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.channelCreatedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.replyToCommentNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.reactionToCommentNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.videoPostedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.newNftOnAuctionNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.newNftOnSaleNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.higherBidThanYoursMadeNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.auctionExpiredNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.auctionWonNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.auctionLostNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.openAuctionBidCanBeWithdrawnNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.fundsFromCouncilReceivedNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.fundsToExternalWalletSentNotificationEnabled, false);
  expectNotificationPreferenceToBe(preferences.fundsFromWgReceivedNotificationEnabled, false);
}

export const SetNotificationEnabledMut = (prefFieldName: string) => gql`
mutation MyMutation {
  setAccountNotificationPreferences(notificationPreferences: {${prefFieldName}: {emailEnabled: true, inAppEnabled: true}}) {
    ${prefFieldName} 
      emailEnabled
      inAppEnabled
    }
  }
}
`

export const MarkNotificationAsReadMut: (notificationIds: string[]) => string = (notificationIds: string[]) => {
  return `mutation MarkNotificationAsRead {
  markNotificationsAsRead(notificationIds: ${notificationIds})
}
`}
