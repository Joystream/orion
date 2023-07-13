import { ApolloClient, DocumentNode, gql, NormalizedCacheObject, OperationVariables } from '@apollo/client'
import { } from '@apollo/client';

export async function executeSubcription(client: ApolloClient<NormalizedCacheObject>, query: DocumentNode, variables: OperationVariables) {
  const data = await new Promise((resolve, reject) => {
    const subscription = client.subscribe({ query, variables }).subscribe({
      next: (response) => {
        resolve(response.data); // Resolve the promise with response.data
        subscription.unsubscribe(); // Unsubscribe once the promise is resolved
      },
      error: (error) => {
        reject(error); // Reject the promise if there's an error
      },
    });
  });

  return data
}

export const MembershipById = gql`
subscription MembershipById($id: ID!) {
  membershipById(id: $id) {
    id
    handle
  }
}
`
export const ChannelCreatedNotificationSub = () => gql`
subscription ChannelCreatedNotification {
  runtimeNotifications {
    event {
      data {
        ... on ChannelCreatedEventData {
          __typename
          channel {
            id
            ownerMember {
              id
            }
          }
        }
      }
    }
  }
}
`

export const ChannelFollowerNotificationSub = (channelId: string) => gql`
subscription ChannelFollowerNotification {
  offChainNotifications(where: {data: {channel: {id_eq: ${channelId}}}}) {
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
export const FollowChannelMutation = (channelId: string) => gql`
mutation FollowChannel {
  followChannel(channelId: ${channelId})
    channelId
    followId
  }
}
`
