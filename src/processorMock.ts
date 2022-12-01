import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Channel, Video, Event, OwnedNft, Auction, Bid, Membership, Comment } from './model'
import {
  ContentVideoCreatedEvent,
  ContentChannelCreatedEvent,
  SystemExtrinsicSuccessEvent,
} from './types/events'
import _ from 'lodash'
import {
  randomMember,
  randomChannel,
  randomVideo,
  randomNFT,
  randomAuction,
  randomBid,
  randomComment,
  randomEvent,
  randomEventData,
} from './mock'

const defaultEventOptions = {
  data: {
    event: {
      args: true,
    },
  },
} as const

const eventsMap = {
  'Content.VideoCreated': ContentVideoCreatedEvent,
  'Content.ChannelCreated': ContentChannelCreatedEvent,
  'System.ExtrinsicSuccess': SystemExtrinsicSuccessEvent,
} as const

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: 'http://localhost:8888/graphql',
  })
  .addEvent('Content.VideoCreated', defaultEventOptions)
  .addEvent('Content.ChannelCreated', defaultEventOptions)
  .addEvent('System.ExtrinsicSuccess', defaultEventOptions)

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase({ isolationLevel: 'READ COMMITTED' }), async (ctx) => {
  const extrinscSuccessEvents = getEvents(ctx, 'System.ExtrinsicSuccess')

  console.log('Batch length:', ctx.blocks.length)
  console.log('Batch json size:', JSON.stringify(ctx.blocks).length)

  const allMembers: Membership[] = []
  const allChannels: Channel[] = []
  const allVideos: Video[] = []
  const allNfts: OwnedNft[] = []
  const allAuctions: Auction[] = []
  const allBids: Bid[] = []
  const allComments: Comment[] = []
  const allEvents: Event[] = []
  for (const e of extrinscSuccessEvents) {
    const members = Array.from({ length: 5 }, () => randomMember())
    const channels = Array.from({ length: 10 }, () => randomChannel(_.sample(members)!))
    const videos = Array.from({ length: 100 }, () => randomVideo(_.sample(channels)!))
    const nfts = _.sampleSize(videos, 50).map((v) => randomNFT(v))
    const auctions = _.sampleSize(nfts, 30).map((nft) => randomAuction(nft))
    const bids = Array.from({ length: 100 }, () =>
      randomBid(_.sample(auctions)!, _.sample(members)!)
    )
    const comments = Array.from({ length: 200 }, () =>
      randomComment(_.sample(members)!, _.sample(videos)!)
    )
    const events = Array.from({ length: 1000 }, () =>
      randomEvent(randomEventData(members, nfts, auctions, bids, comments))
    )
    allMembers.push(...members)
    allChannels.push(...channels)
    allVideos.push(...videos)
    allNfts.push(...nfts)
    allAuctions.push(...auctions)
    allBids.push(...bids)
    allComments.push(...comments)
    allEvents.push(...events)
  }
  const allAssets = allVideos.map((v) => [v.thumbnailPhoto!, v.media!]).flat()
  const allBags = allAssets.map((a) => a.storageBag)

  await ctx.store.insert(allMembers)
  await ctx.store.insert(allChannels)
  await ctx.store.insert(allBags)
  await ctx.store.insert(allAssets)
  await ctx.store.insert(allVideos)
  await ctx.store.insert(allNfts)
  await ctx.store.insert(allAuctions)
  await ctx.store.insert(allBids)
  await ctx.store.insert(allComments)
  await ctx.store.insert(allEvents)
})

function getEvents<T extends keyof typeof eventsMap>(
  ctx: Ctx,
  type: T
): InstanceType<typeof eventsMap[T]>[] {
  const events: InstanceType<typeof eventsMap[T]>[] = []
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === type) {
        const EventConstructor = eventsMap[type]
        const e = new EventConstructor(ctx, item.event) as InstanceType<typeof eventsMap[T]>
        events.push(e)
      }
    }
  }
  return events
}
