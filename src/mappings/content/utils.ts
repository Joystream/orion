import { IChannelMetadata, ISubtitleMetadata, IVideoMetadata } from '@joystream/metadata-protobuf'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import {
  DataObjectTypeChannelAvatar,
  DataObjectTypeChannelCoverPhoto,
  DataObjectTypeVideoMedia,
  DataObjectTypeVideoSubtitle,
  DataObjectTypeVideoThumbnail,
  Auction,
  AuctionTypeEnglish,
  AuctionTypeOpen,
  AuctionWhitelistedMember,
  Channel,
  Membership,
  NftOwnerChannel,
  NftOwnerMember,
  OwnedNft,
  StorageDataObject,
  TransactionalStatusAuction,
  TransactionalStatusBuyNow,
  TransactionalStatusIdle,
  TransactionalStatusInitiatedOfferToMember,
  Video,
  VideoSubtitle,
  ContentActor as ContentActorEntity,
  ContentActorMember,
  ContentActorCurator,
  ContentActorLead,
  Event,
  NftIssuedEventData,
  DataObjectType,
} from '../../model'
import { EntitiesCollector } from '../../utils'
import {
  ContentActor,
  EnglishAuctionParamsRecord,
  InitTransactionalStatusRecord,
  NftIssuanceParametersRecord,
  OpenAuctionParamsRecord,
} from '../../types/v1000'
import { genericEventFields } from '../utils'
import { SubstrateBlock } from '@subsquid/substrate-processor'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsDecoded<MetaClass> = MetaClass extends { create: (props?: infer I) => any }
  ? DecodedMetadataObject<I>
  : never

export type PropertyOfWithType<E, T> = {
  [K in keyof E]?: E[K] extends T | null | undefined ? K : never
}[keyof E] &
  string &
  keyof E

export type EntityAssetProps<E> = PropertyOfWithType<E, StorageDataObject>
export type MetaNumberProps<M> = PropertyOfWithType<M, number>

export type EntityAssetsMap<
  E,
  M,
  OTC extends { new (): DataObjectType } = { new (): DataObjectType }
> = {
  DataObjectTypeConstructor: OTC
  entityProperty: EntityAssetProps<E>
  metaProperty: MetaNumberProps<M>
  createDataObjectType: (e: E) => InstanceType<OTC>
}[]

export type AssetsMap = {
  channel: EntityAssetsMap<
    Channel,
    IChannelMetadata,
    { new (): DataObjectType & { channel: string } }
  >
  video: EntityAssetsMap<Video, IVideoMetadata, { new (): DataObjectType & { video: string } }>
  subtitle: EntityAssetsMap<
    VideoSubtitle,
    ISubtitleMetadata,
    { new (): DataObjectType & { subtitle: string } }
  >
}

export const ASSETS_MAP: AssetsMap = {
  channel: [
    {
      DataObjectTypeConstructor: DataObjectTypeChannelAvatar,
      entityProperty: 'avatarPhoto',
      metaProperty: 'avatarPhoto',
      createDataObjectType: (e) => new DataObjectTypeChannelAvatar({ channel: e.id }),
    },
    {
      DataObjectTypeConstructor: DataObjectTypeChannelCoverPhoto,
      entityProperty: 'coverPhoto',
      metaProperty: 'coverPhoto',
      createDataObjectType: (e) => new DataObjectTypeChannelCoverPhoto({ channel: e.id }),
    },
  ],
  video: [
    {
      DataObjectTypeConstructor: DataObjectTypeVideoMedia,
      entityProperty: 'media',
      metaProperty: 'video',
      createDataObjectType: (e) => new DataObjectTypeVideoMedia({ video: e.id }),
    },
    {
      DataObjectTypeConstructor: DataObjectTypeVideoThumbnail,
      entityProperty: 'thumbnailPhoto',
      metaProperty: 'thumbnailPhoto',
      createDataObjectType: (e) => new DataObjectTypeVideoThumbnail({ video: e.id }),
    },
  ],
  subtitle: [
    {
      DataObjectTypeConstructor: DataObjectTypeVideoSubtitle,
      entityProperty: 'asset',
      metaProperty: 'newAsset',
      createDataObjectType: (e) =>
        new DataObjectTypeVideoSubtitle({ video: e.video.id, subtitle: e.id }),
    },
  ],
}

export async function deleteVideo(ec: EntitiesCollector, videoId: bigint) {
  const video = await ec.collections.Video.get(videoId.toString(), {
    comments: {
      reactions: true,
    },
    license: true,
    reactions: true,
    views: true,
    mediaMetadata: {
      encoding: true,
    },
    subtitles: true,
  })

  if (video.comments) {
    ec.collections.CommentReaction.remove(...video.comments.flatMap((c) => c.reactions || []))
    ec.collections.Comment.remove(...video.comments)
  }
  if (video.license) {
    ec.collections.License.remove(video.license)
  }
  if (video.reactions) {
    ec.collections.VideoReaction.remove(...video.reactions)
  }
  if (video.views) {
    ec.collections.VideoViewEvent.remove(...video.views)
  }
  if (video.mediaMetadata) {
    if (video.mediaMetadata.encoding) {
      ec.collections.VideoMediaEncoding.remove(video.mediaMetadata.encoding)
    }
    ec.collections.VideoMediaMetadata.remove(video.mediaMetadata)
  }
  if (video.subtitles) {
    ec.collections.VideoSubtitle.remove(...video.subtitles)
  }
  ec.collections.Video.remove(video)
}

export function processNft(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  extrinsicHash: string | undefined,
  video: Video,
  issuer: ContentActor,
  nftIssuanceParameters: NftIssuanceParametersRecord
): void {
  const owner =
    nftIssuanceParameters.nonChannelOwner !== undefined
      ? new NftOwnerMember({ member: nftIssuanceParameters.nonChannelOwner.toString() })
      : new NftOwnerChannel({ channel: video.channel.id })

  const creatorRoyalty =
    nftIssuanceParameters.royalty !== undefined
      ? // Royalty type is Perbill (1/10^9), so we divide by 10^7 to get Percent
        nftIssuanceParameters.royalty / Math.pow(10, 7)
      : undefined

  const nft = new OwnedNft({
    id: video.id,
    video,
    creatorRoyalty,
    owner,
    createdAt: new Date(block.timestamp),
  })
  ec.collections.OwnedNft.push(nft)

  // update NFT transactional status
  processNftTransactionalStatus(ec, block, nft, nftIssuanceParameters.initTransactionalStatus)

  // Push a new NftIssued event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new NftIssuedEventData({
        actor: parseContentActor(issuer),
        nft: nft.id,
        nftOwner: nft.owner,
      }),
    })
  )
}

export function processNftTransactionalStatus(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  nft: OwnedNft,
  transactionalStatus: InitTransactionalStatusRecord
): void {
  switch (transactionalStatus.__kind) {
    case 'Idle': {
      nft.transactionalStatus = new TransactionalStatusIdle()
      return
    }
    case 'InitiatedOfferToMember': {
      const [memberId, price] = transactionalStatus.value
      nft.transactionalStatus = new TransactionalStatusInitiatedOfferToMember({
        member: memberId.toString(),
        price,
      })
      return
    }
    case 'OpenAuction':
    case 'EnglishAuction': {
      const auctionParams = transactionalStatus.value
      const auction = createAuction(ec, block, nft, auctionParams)

      // create new auction
      nft.transactionalStatus = new TransactionalStatusAuction({
        auction: auction.id,
      })
      return
    }
    case 'BuyNow': {
      nft.transactionalStatus = new TransactionalStatusBuyNow({ price: transactionalStatus.value })
      return
    }
    default: {
      throw new Error(`Unknown TransactionalStatus type: ${JSON.stringify(transactionalStatus)}`)
    }
  }
}

function createAuction(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  nft: OwnedNft,
  auctionParams: OpenAuctionParamsRecord | EnglishAuctionParamsRecord
): Auction {
  const startsAtBlock = auctionParams.startsAt ?? block.height
  // prepare auction record
  const auction = new Auction({
    nft,
    startingPrice: auctionParams.startingPrice,
    buyNowPrice: auctionParams.buyNowPrice,
    auctionType: createAuctionType(block, auctionParams),
    startsAtBlock,
    isCanceled: false,
    isCompleted: false,
  })
  ec.collections.Auction.push(auction)

  const whitelistedMembers = auctionParams.whitelist.map(
    (m) =>
      new AuctionWhitelistedMember({
        id: `${m.toString()}-${auction.id}`,
        member: new Membership({ id: m.toString() }),
        auction,
      })
  )

  ec.collections.AuctionWhitelistedMember.push(...whitelistedMembers)

  return auction
}

function createAuctionType(
  block: SubstrateBlock,
  auctionParams: OpenAuctionParamsRecord | EnglishAuctionParamsRecord
) {
  const startsAtBlock = auctionParams.startsAt ?? block.height

  // auction type `english`
  if ('duration' in auctionParams) {
    return new AuctionTypeEnglish({
      duration: auctionParams.duration,
      extensionPeriod: auctionParams.extensionPeriod,
      minimalBidStep: auctionParams.minBidStep,
      plannedEndAtBlock: startsAtBlock + auctionParams.duration,
    })
  }

  // auction type `open`
  return new AuctionTypeOpen({
    bidLockDuration: auctionParams.bidLockDuration,
  })
}

export function parseContentActor(contentActor: ContentActor): ContentActorEntity {
  if (contentActor.__kind === 'Member') {
    return new ContentActorMember({
      member: contentActor.value.toString(),
    })
  }

  if (contentActor.__kind === 'Curator') {
    const [, curatorId] = contentActor.value
    return new ContentActorCurator({
      curator: curatorId.toString(),
    })
  }

  if (contentActor.__kind === 'Lead') {
    return new ContentActorLead()
  }

  throw new Error('Unknown ContentActor type')
}
