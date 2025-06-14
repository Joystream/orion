import _, { isObject } from 'lodash'
import { Args, Query, Resolver, Root, Subscription } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { globalEm } from '../../../utils/globalEm'
import { has } from '../../../utils/misc'
import {
  EarningStatsOutput,
  ProcessorState,
  TopInteractedEntity,
  TopInteractedEntityArgs,
} from './types'

class ProcessorStateRetriever {
  public state: ProcessorState
  private em: EntityManager

  public run(intervalMs: number) {
    this.updateLoop(intervalMs)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  private async updateLoop(intervalMs: number) {
    this.em = await globalEm
    while (true) {
      try {
        this.state = await this.getUpdatedState()
      } catch (e) {
        console.error('Cannot get updated state', e)
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  private async getUpdatedState() {
    const dbResult: unknown = await this.em.query('SELECT "height" FROM "squid_processor"."status"')
    return {
      lastProcessedBlock:
        Array.isArray(dbResult) &&
        isObject(dbResult[0]) &&
        has(dbResult[0], 'height') &&
        typeof dbResult[0].height === 'number'
          ? dbResult[0].height
          : -1,
    }
  }
}

const processorStateRetriever = new ProcessorStateRetriever()
processorStateRetriever.run(1000)

async function* processorStateGenerator(): AsyncGenerator<ProcessorState> {
  let lastState: ProcessorState | undefined
  while (1) {
    const currentState = processorStateRetriever.state
    if (!_.isEqual(currentState, lastState)) {
      yield currentState
      lastState = currentState
    }
    // 100ms interval when checking for updates
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

@Resolver()
export class StateResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Subscription({
    subscribe: () => processorStateGenerator(),
  })
  processorState(@Root() state: ProcessorState): ProcessorState {
    return state
  }

  @Query(() => [TopInteractedEntity])
  async getTopInteractedEntities(
    @Args() args: TopInteractedEntityArgs
  ): Promise<TopInteractedEntity[]> {
    const em = await this.tx()

    const result: { entity_id: string; entrycount: number }[] = await em.query(
      `
      SELECT 
        entity_id,
        SUM(count) as entryCount
      FROM
        curator.user_interaction_count
      WHERE
        type = $1 AND day_timestamp >= NOW() - INTERVAL '${args.period} DAYS'
      GROUP BY
        entity_id
      ORDER BY
        entryCount DESC
      LIMIT 10;
      `,
      [args.type]
    )

    return result.map((res) => ({
      interactionCount: res.entrycount,
      entityId: res.entity_id,
    }))
  }

  @Query(() => EarningStatsOutput)
  async totalJoystreamEarnings(): Promise<EarningStatsOutput> {
    const em = await this.tx()
    const result = (
      await em.query<
        {
          total_rewards_volume: string
          total_crt_volume: string
          total_nft_volume: string
        }[]
      >(
        `
      SELECT
          SUM(
          COALESCE(event.data->>'amount', '0')::bigint
        ) AS "total_rewards_volume",
        SUM(
          COALESCE(amm_buy.price_paid, '0')::bigint
        ) AS "total_crt_volume",
        SUM(
          COALESCE(event.data->>'price', '0')::bigint + COALESCE(winning_bid.amount, 0)
        ) AS "total_nft_volume"
      FROM
          "event"
      LEFT JOIN amm_transaction AS amm_buy ON "data"->>'ammMintTransaction' = amm_buy.id
      LEFT JOIN bid AS winning_bid ON "data"->>'winningBid' = winning_bid.id
      WHERE
          "event"."data"->>'isTypeOf' IN (
              'ChannelPaymentMadeEventData',
              'CreatorTokenMarketMintEventData',
              'NftBoughtEventData',
              'EnglishAuctionSettledEventData',
              'BidMadeCompletingAuctionEventData',
              'OpenAuctionBidAcceptedEventData'
          )

      `
      )
    )[0]

    return {
      crtSaleVolume: result.total_crt_volume ?? 0,
      nftSaleVolume: result.total_nft_volume ?? 0,
      totalRewardsPaid: result.total_rewards_volume ?? 0,
    }
  }
}
