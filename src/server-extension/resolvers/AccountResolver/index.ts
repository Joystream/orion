import 'reflect-metadata'
import { Query, Resolver, Mutation, UseMiddleware, Ctx, Info, Args } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import {
  AccountData,
  FollowedChannel,
  SetNotificationPreferencesArgs,
} from './types'
import { Context } from '../../check'
import { GraphQLResolveInfo } from 'graphql'
import assert from 'assert'
import { withHiddenEntities } from '../../../utils/sql'
import { ChannelFollow } from '../../../model'

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

  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async setAccountNotificatioPreferences(
    @Args() notificationPreferences: SetNotificationPreferencesArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    const {
      commentCreatedInAppNotificationEnabled,
      commentTextUpdatedInAppNotificationEnabled,
      openAuctionStartedInAppNotificationEnabled,
      englishAuctionStartedInAppNotificationEnabled,
      nftIssuedInAppNotificationEnabled,
      auctionBidMadeInAppNotificationEnabled,
      auctionBidCanceledInAppNotificationEnabled,
      auctionCanceledInAppNotificationEnabled,
      englishAuctionSettledInAppNotificationEnabled,
      bidMadeCompletingAuctionInAppNotificationEnabled,
      openAuctionBidAcceptedInAppNotificationEnabled,
      nftSellOrderMadeInAppNotificationEnabled,
      nftBoughtInAppNotificationEnabled,
      buyNowCanceledInAppNotificationEnabled,
      buyNowPriceUpdatedInAppNotificationEnabled,
      metaprotocolTransactionStatusInAppNotificationEnabled,
      channelRewardClaimedInAppNotificationEnabled,
      channelRewardClaimedAndWithdrawnInAppNotificationEnabled,
      channelFundsWithdrawnInAppNotificationEnabled,
      channelPayoutsUpdatedInAppNotificationEnabled,
      channelPaymentMadeInAppNotificationEnabled,
      memberBannedFromChannelInAppNotificationEnabled,
      channelCreatedInAppNotificationEnabled,
      commentCreatedMailNotificationEnabled,
      commentTextUpdatedMailNotificationEnabled,
      openAuctionStartedMailNotificationEnabled,
      englishAuctionStartedMailNotificationEnabled,
      nftIssuedMailNotificationEnabled,
      auctionBidMadeMailNotificationEnabled,
      auctionBidCanceledMailNotificationEnabled,
      auctionCanceledMailNotificationEnabled,
      englishAuctionSettledMailNotificationEnabled,
      bidMadeCompletingAuctionMailNotificationEnabled,
      openAuctionBidAcceptedMailNotificationEnabled,
      nftSellOrderMadeMailNotificationEnabled,
      nftBoughtMailNotificationEnabled,
      buyNowCanceledMailNotificationEnabled,
      buyNowPriceUpdatedMailNotificationEnabled,
      metaprotocolTransactionStatusMailNotificationEnabled,
      channelRewardClaimedMailNotificationEnabled,
      channelRewardClaimedAndWithdrawnMailNotificationEnabled,
      channelFundsWithdrawnMailNotificationEnabled,
      channelPayoutsUpdatedMailNotificationEnabled,
      channelPaymentMadeMailNotificationEnabled,
      memberBannedFromChannelMailNotificationEnabled,
      channelCreatedMailNotificationEnabled,
    } = notificationPreferences

    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const account = ctx.account
      if (account) {
        account.notificationPreferences.commentCreatedInAppNotificationEnabled =
          commentCreatedInAppNotificationEnabled
        account.notificationPreferences.commentCreatedMailNotificationEnabled =
          commentCreatedMailNotificationEnabled
        account.notificationPreferences.commentTextUpdatedInAppNotificationEnabled =
          commentTextUpdatedInAppNotificationEnabled
        account.notificationPreferences.openAuctionStartedInAppNotificationEnabled =
          openAuctionStartedInAppNotificationEnabled
        account.notificationPreferences.englishAuctionStartedInAppNotificationEnabled =
          englishAuctionStartedInAppNotificationEnabled
        account.notificationPreferences.nftIssuedInAppNotificationEnabled =
          nftIssuedInAppNotificationEnabled
        account.notificationPreferences.auctionBidMadeInAppNotificationEnabled =
          auctionBidMadeInAppNotificationEnabled
        account.notificationPreferences.auctionBidCanceledInAppNotificationEnabled =
          auctionBidCanceledInAppNotificationEnabled
        account.notificationPreferences.auctionCanceledInAppNotificationEnabled =
          auctionCanceledInAppNotificationEnabled
        account.notificationPreferences.englishAuctionSettledInAppNotificationEnabled =
          englishAuctionSettledInAppNotificationEnabled
        account.notificationPreferences.bidMadeCompletingAuctionInAppNotificationEnabled =
          bidMadeCompletingAuctionInAppNotificationEnabled
        account.notificationPreferences.openAuctionBidAcceptedInAppNotificationEnabled =
          openAuctionBidAcceptedInAppNotificationEnabled
        account.notificationPreferences.nftSellOrderMadeInAppNotificationEnabled =
          nftSellOrderMadeInAppNotificationEnabled
        account.notificationPreferences.nftBoughtInAppNotificationEnabled =
          nftBoughtInAppNotificationEnabled
        account.notificationPreferences.buyNowCanceledInAppNotificationEnabled =
          buyNowCanceledInAppNotificationEnabled
        account.notificationPreferences.buyNowPriceUpdatedInAppNotificationEnabled =
          buyNowPriceUpdatedInAppNotificationEnabled
        account.notificationPreferences.metaprotocolTransactionStatusInAppNotificationEnabled =
          metaprotocolTransactionStatusInAppNotificationEnabled
        account.notificationPreferences.channelRewardClaimedInAppNotificationEnabled =
          channelRewardClaimedInAppNotificationEnabled
        account.notificationPreferences.channelRewardClaimedAndWithdrawnInAppNotificationEnabled =
          channelRewardClaimedAndWithdrawnInAppNotificationEnabled
        account.notificationPreferences.channelFundsWithdrawnInAppNotificationEnabled =
          channelFundsWithdrawnInAppNotificationEnabled
        account.notificationPreferences.channelPayoutsUpdatedInAppNotificationEnabled =
          channelPayoutsUpdatedInAppNotificationEnabled
        account.notificationPreferences.channelPaymentMadeInAppNotificationEnabled =
          channelPaymentMadeInAppNotificationEnabled
        account.notificationPreferences.memberBannedFromChannelInAppNotificationEnabled =
          memberBannedFromChannelInAppNotificationEnabled
        account.notificationPreferences.channelCreatedInAppNotificationEnabled =
          channelCreatedInAppNotificationEnabled
        account.notificationPreferences.commentCreatedMailNotificationEnabled =
          commentCreatedMailNotificationEnabled
        account.notificationPreferences.commentTextUpdatedMailNotificationEnabled =
          commentTextUpdatedMailNotificationEnabled
        account.notificationPreferences.openAuctionStartedMailNotificationEnabled =
          openAuctionStartedMailNotificationEnabled
        account.notificationPreferences.englishAuctionStartedMailNotificationEnabled =
          englishAuctionStartedMailNotificationEnabled
        account.notificationPreferences.nftIssuedMailNotificationEnabled =
          nftIssuedMailNotificationEnabled
        account.notificationPreferences.auctionBidMadeMailNotificationEnabled =
          auctionBidMadeMailNotificationEnabled
        account.notificationPreferences.auctionBidCanceledMailNotificationEnabled =
          auctionBidCanceledMailNotificationEnabled
        account.notificationPreferences.auctionCanceledMailNotificationEnabled =
          auctionCanceledMailNotificationEnabled
        account.notificationPreferences.englishAuctionSettledMailNotificationEnabled =
          englishAuctionSettledMailNotificationEnabled
        account.notificationPreferences.bidMadeCompletingAuctionMailNotificationEnabled =
          bidMadeCompletingAuctionMailNotificationEnabled
        account.notificationPreferences.openAuctionBidAcceptedMailNotificationEnabled =
          openAuctionBidAcceptedMailNotificationEnabled
        account.notificationPreferences.nftSellOrderMadeMailNotificationEnabled =
          nftSellOrderMadeMailNotificationEnabled
        account.notificationPreferences.nftBoughtMailNotificationEnabled =
          nftBoughtMailNotificationEnabled
        account.notificationPreferences.buyNowCanceledMailNotificationEnabled =
          buyNowCanceledMailNotificationEnabled
        account.notificationPreferences.buyNowPriceUpdatedMailNotificationEnabled =
          buyNowPriceUpdatedMailNotificationEnabled
        account.notificationPreferences.metaprotocolTransactionStatusMailNotificationEnabled =
          metaprotocolTransactionStatusMailNotificationEnabled
        account.notificationPreferences.channelRewardClaimedMailNotificationEnabled =
          channelRewardClaimedMailNotificationEnabled
        account.notificationPreferences.channelRewardClaimedAndWithdrawnMailNotificationEnabled =
          channelRewardClaimedAndWithdrawnMailNotificationEnabled
        account.notificationPreferences.channelFundsWithdrawnMailNotificationEnabled =
          channelFundsWithdrawnMailNotificationEnabled
        account.notificationPreferences.channelPayoutsUpdatedMailNotificationEnabled =
          channelPayoutsUpdatedMailNotificationEnabled
        account.notificationPreferences.channelPaymentMadeMailNotificationEnabled =
          channelPaymentMadeMailNotificationEnabled
        account.notificationPreferences.memberBannedFromChannelMailNotificationEnabled =
          memberBannedFromChannelMailNotificationEnabled
        account.notificationPreferences.channelCreatedMailNotificationEnabled =
          channelCreatedMailNotificationEnabled
        return true
      }
      return false
    })

  }
}
