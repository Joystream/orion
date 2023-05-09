import { Args, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { RequestFeaturedNftArgs, NftFeaturedRequstInfo, EndingAuctionsNftsArgs } from './types'
import { ContextWithIP } from '../../check'
import { extendClause, withHiddenEntities } from '../../../utils/sql'
import { NftFeaturingRequest, OwnedNft as OwnedNftEntity } from '../../../model'
import { OwnedNft } from '../baseTypes'
import { randomAsHex } from '@polkadot/util-crypto'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { model } from '../model'
import { parseAnyTree, parseSqlArguments } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { isObject } from 'lodash'
import { has } from '../../../utils/misc'

@Resolver()
export class NftResolver {
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => [OwnedNft])
  async endingAuctionsNfts(
    @Args() args: EndingAuctionsNftsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<OwnedNft[]> {
    const em = await this.em()
    const dbResult: unknown = await em.query('SELECT "height" FROM "squid_processor"."status"')
    const lastProcessedBlock =
      Array.isArray(dbResult) &&
      isObject(dbResult[0]) &&
      has(dbResult[0], 'height') &&
      typeof dbResult[0].height === 'number'
        ? dbResult[0].height
        : -1

    const tree = getResolveTree(info)

    const sqlArgs = parseSqlArguments(model, 'OwnedNft', {
      ...args,
    })

    // Extract subsquid-supported OwnedNft fields
    const ownedNftFields = parseAnyTree(model, 'OwnedNft', info.schema, tree)

    // Generate query using subsquid's ListQuery
    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'OwnedNft',
      ownedNftFields,
      sqlArgs
    )
    let listQuerySql = listQuery.sql

    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      `
        INNER JOIN (
          SELECT nft_id, auction_type->>'plannedEndAtBlock' AS end_block FROM auction a
          WHERE auction_type->>'isTypeOf' = 'AuctionTypeEnglish'
          AND (auction_type->>'plannedEndAtBlock')::int > ${lastProcessedBlock}
          AND a.is_canceled = false
          AND a.is_completed = false
        ) AS auctions ON auctions.nft_id = owned_nft.id 
`,
      ''
    )
    listQuerySql = extendClause(listQuerySql, 'ORDER BY', 'end_block::int asc', '')
    ;(listQuery as { sql: string }).sql = listQuerySql

    const result = await ctx.openreader.executeQuery(listQuery)

    return result
  }

  @Mutation(() => NftFeaturedRequstInfo)
  async requestNftFeatured(
    @Args() { nftId, rationale }: RequestFeaturedNftArgs,
    @Ctx() ctx: ContextWithIP
  ): Promise<NftFeaturedRequstInfo> {
    const em = await this.em()
    const { ip } = ctx
    return withHiddenEntities(em, async () => {
      const nft = await em.findOne(OwnedNftEntity, {
        where: { id: nftId },
      })

      if (!nft) {
        throw new Error(`NFT with id ${nftId} not found!`)
      }

      const existingRequest = await em.findOne(NftFeaturingRequest, {
        where: { ip, nftId },
      })

      if (existingRequest) {
        return {
          id: existingRequest.id,
          nftId,
          created: false,
          reporterIp: existingRequest.ip,
          createdAt: existingRequest.timestamp,
          rationale: existingRequest.rationale,
        }
      }

      const newRequest = new NftFeaturingRequest({
        id: randomAsHex(16).replace('0x', ''),
        nftId,
        ip,
        rationale,
        timestamp: new Date(),
      })
      await em.save(newRequest)

      return {
        id: newRequest.id,
        nftId,
        created: true,
        createdAt: newRequest.timestamp,
        rationale,
        reporterIp: ip,
      }
    })
  }
}
