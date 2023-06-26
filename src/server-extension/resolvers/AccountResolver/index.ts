import 'reflect-metadata'
import { Query, Resolver, Mutation, UseMiddleware, Ctx, Info, Args } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { AccountAndNotificationPreferences, AccountData, FollowedChannel, SetNotificationPreferencesArgs } from './types'
import { Context } from '../../check'
import { GraphQLResolveInfo } from 'graphql'
import assert from 'assert'
import { withHiddenEntities } from '../../../utils/sql'
import { ChannelFollow, NotificationPreferences } from '../../../model'

@Resolver()
export class AccountResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) { }

  @UseMiddleware(AccountOnly)
  @Query(() => AccountData)
  async accountData(@Info() info: GraphQLResolveInfo, @Ctx() ctx: Context): Promise<AccountData> {
    const account = ctx.account
    const em = await this.em()
    assert(account, 'Unexpected context: account is not set')
    const { id, email, joystreamAccount, membershipId, isEmailConfirmed } = account
    let followedChannels: FollowedChannel[] = []
    if (
      info.fieldNodes[0].selectionSet?.selections.some(
        (s) => s.kind === 'Field' && s.name.value === 'followedChannels'
      )
    ) {
      followedChannels = await withHiddenEntities(em, async () => {
        const followedChannels = await em
          .getRepository(ChannelFollow)
          .findBy({ userId: account.userId })
        return followedChannels.map(({ channelId, timestamp }) => ({
          channelId,
          timestamp: timestamp.toISOString(),
        }))
      })
    }

    return {
      id,
      email,
      joystreamAccount,
      membershipId,
      isEmailConfirmed,
      followedChannels,
    }
  }


  @Mutation(() => AccountAndNotificationPreferences)
  @UseMiddleware(AccountOnly)
  async setAccountNotificatioPreferences(
    @Args() notificationPreferences: SetNotificationPreferencesArgs,
    @Ctx() ctx: Context
  ): Promise<AccountAndNotificationPreferences> {
    const account = ctx.account
    assert(account, 'Unexpected context: account is not set')
    const {
      councilElectionUpdates,
      updatesInProposalCreated,
      discussionThreadPosted,
      postDirectMention,
      notificationWithRole,
      notificationWithoutRole,
      forumDirectMention,
      forumReplyToPost,
      councilElectionUpdatesMail,
      updatesInProposalCreatedMail,
      discussionThreadPostedMail,
      postDirectMentionMail,
      notificationWithRoleMail,
      notificationWithoutRoleMail,
      forumDirectMentionMail,
      forumReplyToPostMail
    } = notificationPreferences

    account.notificationPreferences.councilElectionUpdates = councilElectionUpdates
    account.notificationPreferences.updatesInProposalCreated = updatesInProposalCreated
    account.notificationPreferences.discussionThreadPosted = discussionThreadPosted
    account.notificationPreferences.postDirectMention = postDirectMention
    account.notificationPreferences.notificationWithRole = notificationWithRole
    account.notificationPreferences.notificationWithoutRole = notificationWithoutRole
    account.notificationPreferences.forumDirectMention = forumDirectMention
    account.notificationPreferences.forumReplyToPost = forumReplyToPost
    account.notificationPreferences.councilElectionUpdatesMail = councilElectionUpdatesMail
    account.notificationPreferences.updatesInProposalCreatedMail = updatesInProposalCreatedMail
    account.notificationPreferences.discussionThreadPostedMail = discussionThreadPostedMail
    account.notificationPreferences.postDirectMentionMail = postDirectMentionMail
    account.notificationPreferences.notificationWithRoleMail = notificationWithRoleMail
    account.notificationPreferences.notificationWithoutRoleMail = notificationWithoutRoleMail
    account.notificationPreferences.forumDirectMentionMail = forumDirectMentionMail
    account.notificationPreferences.forumReplyToPostMail = forumReplyToPostMail

    return {
      accountId: account.id,
      preferences: account.notificationPreferences,
    }
  }
}
