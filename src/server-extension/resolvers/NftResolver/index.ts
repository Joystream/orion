import { Args, Ctx, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { RequestFeaturedNftArgs, NftFeaturedRequstInfo } from './types'
import { ContextWithIP } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import { OwnedNft, Request } from '../../../model'
import { randomAsHex } from '@polkadot/util-crypto'

@Resolver()
export class NftResolver {
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => NftFeaturedRequstInfo)
  async requestNftFeatured(
    @Args() { nftId, rationale }: RequestFeaturedNftArgs,
    @Ctx() ctx: ContextWithIP
  ): Promise<NftFeaturedRequstInfo> {
    const em = await this.em()
    const { ip } = ctx
    return withHiddenEntities(em, async () => {
      const nft = await em.findOne(OwnedNft, {
        where: { id: nftId },
      })

      if (!nft) {
        throw new Error(`Video by id ${nftId} not found!`)
      }

      const existingRequest = await em.findOne(Request, {
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

      const newRequest = new Request({
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
