import assert from 'assert'
import axios from 'axios'
import { GraphQLResolveInfo } from 'graphql'
import 'reflect-metadata'
import { Args, Ctx, Info, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { Account, ChannelFollow } from '../../../model'
import { getCurrentBlockHeight } from '../../../utils/blockHeight'
import { ConfigVariable, config } from '../../../utils/config'
import { pWaitFor } from '../../../utils/misc'
import { withHiddenEntities } from '../../../utils/sql'
import { Context } from '../../check'
import { AccountOnly } from '../middleware'
import {
  AccountData,
  CreateAccountMembershipArgs,
  CreateAccountMembershipResult,
  FaucetRegisterMembershipParams,
  FaucetRegisterMembershipResponse,
  FollowedChannel,
} from './types'

@Resolver()
export class AccountResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @UseMiddleware(AccountOnly)
  @Query(() => AccountData)
  async accountData(@Info() info: GraphQLResolveInfo, @Ctx() ctx: Context): Promise<AccountData> {
    const account = ctx.account
    const em = await this.em()
    assert(account, 'Unexpected context: account is not set')
    const { id, email, joystreamAccount, notificationPreferences } = account
    let followedChannels: FollowedChannel[] = []
    if (
      info.fieldNodes[0].selectionSet?.selections.some(
        (s) => s.kind === 'Field' && s.name.value === 'followedChannels'
      )
    ) {
      followedChannels = await this.getFollowedChannels(id)
    }

    return {
      id,
      email,
      joystreamAccount,
      followedChannels,
      preferences: notificationPreferences,
    }
  }

  @UseMiddleware(AccountOnly)
  @Mutation(() => CreateAccountMembershipResult)
  async createAccountMembership(
    @Args() args: CreateAccountMembershipArgs,
    @Ctx() ctx: Context
  ): Promise<CreateAccountMembershipResult> {
    const em = await this.em()
    return em.transaction(async (em) => {
      const account = await em.getRepository(Account).findOne({
        where: { id: ctx.account?.id },
        lock: { mode: 'pessimistic_write' },
        relations: { joystreamAccount: { memberships: true } },
      })

      if (!account) {
        throw new Error('Account not found')
      }

      if (account.joystreamAccount.memberships.length > 0) {
        throw new Error('Membership already exists')
      }

      const { handle, avatar, about, name } = args
      const address = account.joystreamAccountId

      const { memberId, block } = await this.createMemberWithFaucet({
        address,
        handle,
        avatar,
        about,
        name,
      })

      // ensure membership is processed
      await pWaitFor(
        async () => (await getCurrentBlockHeight(em)).lastProcessedBlock >= block,
        1000, // 1 second
        20000, // 20 seconds
        'Membership not processed'
      )

      return { accountId: account.id, memberId }
    })
  }

  private async getFollowedChannels(accountId: string): Promise<FollowedChannel[]> {
    const em = await this.em()
    return withHiddenEntities(em, async () => {
      const followedChannels = await em.getRepository(ChannelFollow).findBy({ userId: accountId })
      return followedChannels.map(({ channelId, timestamp }) => ({
        channelId,
        timestamp: timestamp.toISOString(),
      }))
    })
  }

  private async createMemberWithFaucet(
    params: FaucetRegisterMembershipParams
  ): Promise<FaucetRegisterMembershipResponse> {
    const em = await this.em()
    const url = await config.get(ConfigVariable.FaucetUrl, em)
    const captchaBypassKey = await config.get(ConfigVariable.FaucetCaptchaBypassKey, em)

    try {
      const response = await axios.post<FaucetRegisterMembershipResponse>(url, params, {
        headers: { Authorization: `Bearer ${captchaBypassKey}` },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to create membership through faucet for account address: ${
            params.address
          }, error: ${error.response?.data?.error || error.cause || error.code}`
        )
      }
      throw error
    }
  }
}
