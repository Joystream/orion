import {
  Channel,
  Video,
  Event,
  OwnedNft,
  Auction,
  StorageDataObject,
  StorageBag,
  AuctionTypeEnglish,
  AuctionTypeOpen,
  Bid,
  Membership,
  StorageBagOwnerCouncil,
  Comment,
  CommentStatus,
  CommentCreatedEventData,
  CommentTextUpdatedEventData,
  OpenAuctionStartedEventData,
  EnglishAuctionSettledEventData,
  NftOwnerMember,
  NftOwnerChannel,
  ContentActorLead,
  NftIssuedEventData,
  AuctionBidMadeEventData,
  AuctionBidCanceledEventData,
  AuctionCanceledEventData,
  EnglishAuctionStartedEventData,
  BidMadeCompletingAuctionEventData,
  OpenAuctionBidAcceptedEventData,
  NftSellOrderMadeEventData,
  NftBoughtEventData,
  BuyNowCanceledEventData,
  BuyNowPriceUpdatedEventData,
  EventData,
} from './model'
import _ from 'lodash'

const idCounters = {
  Channel: 0,
  Video: 0,
  StorageDataObject: 0,
  Membership: 0,
  StorageBag: 0,
  Event: 0,
  Comment: 0,
  Bid: 0,
  Auction: 0,
}

const randomBlock = () => _.random(1, 1000000)
const randomAccount = () => randomString(48)
const randomString = (length: number) =>
  Array.from({ length }, () => _.random(0, 35).toString(36)).join('')
const randomDate = () =>
  new Date(_.random(new Date('2020-01-01').getTime(), new Date('2023-01-01').getTime()))
const randomHAPIAmount = () => BigInt(_.random(1, 1_000_000)) * 10_000_000_000n
const randomBool = () => Boolean(_.random(0, 1))

export function randomChannel(ownerMember: Membership): Channel {
  return new Channel({
    id: (++idCounters.Channel).toString(),
    createdAt: randomDate(),
    createdInBlock: randomBlock(),
    rewardAccount: randomAccount(),
    channelStateBloatBond: randomHAPIAmount(),
    followsNum: _.random(0, 10_000),
    videoViewsNum: _.random(0, 1_000_000),
    isPublic: randomBool(),
    isCensored: randomBool(),
    ownerMember,
  })
}

export function randomAsset(): StorageDataObject {
  return new StorageDataObject({
    id: (++idCounters.StorageDataObject).toString(),
    createdAt: randomDate(),
    isAccepted: randomBool(),
    size: BigInt(_.random(1, 1_000_000_000)),
    storageBag: randomStorageBag(),
    ipfsHash: randomString(42),
    stateBloatBond: randomHAPIAmount(),
  })
}

export function randomVideo(channel: Channel): Video {
  return new Video({
    id: (++idCounters.Video).toString(),
    createdAt: randomDate(),
    channel,
    thumbnailPhoto: randomAsset(),
    isPublic: Boolean(_.random(0, 1)),
    isCensored: Boolean(_.random(0, 1)),
    isExplicit: Boolean(_.random(0, 1)),
    media: randomAsset(),
    videoStateBloatBond: randomHAPIAmount(),
    createdInBlock: randomBlock(),
    isCommentSectionEnabled: Boolean(_.random(0, 1)),
    commentsCount: _.random(0, 1000),
    isReactionFeatureEnabled: Boolean(_.random(0, 1)),
    reactionsCount: _.random(0, 10_000),
    viewsNum: _.random(0, 100_000),
  })
}

export function randomNFT(video: Video): OwnedNft {
  return new OwnedNft({
    id: video.id,
    createdAt: randomDate(),
    video,
    owner: randomBool()
      ? new NftOwnerMember({ member: video.channel.ownerMember!.id.toString() })
      : new NftOwnerChannel({ channel: video.channel.id.toString() }),
  })
}

export function randomAuction(nft: OwnedNft): Auction {
  return new Auction({
    id: (++idCounters.Auction).toString(),
    nft,
    startingPrice: randomHAPIAmount(),
    auctionType: randomBool()
      ? new AuctionTypeEnglish({
          duration: randomBlock(),
          extensionPeriod: randomBlock(),
          plannedEndAtBlock: randomBlock(),
          minimalBidStep: randomHAPIAmount(),
        })
      : new AuctionTypeOpen({
          bidLockDuration: randomBlock(),
        }),
    startsAtBlock: randomBlock(),
    isCanceled: randomBool(),
    isCompleted: randomBool(),
  })
}

export function randomBid(auction: Auction, bidder: Membership): Bid {
  return new Bid({
    id: (++idCounters.Bid).toString(),
    createdAt: randomDate(),
    auction,
    nft: auction.nft,
    bidder,
    amount: randomHAPIAmount(),
    isCanceled: randomBool(),
    createdInBlock: randomBlock(),
  })
}

export function randomMember(): Membership {
  return new Membership({
    id: (++idCounters.Membership).toString(),
    createdAt: randomDate(),
    handle: randomString(10),
    controllerAccount: randomAccount(),
  })
}

export function randomStorageBag(): StorageBag {
  return new StorageBag({
    id: (++idCounters.StorageBag).toString(),
    owner: new StorageBagOwnerCouncil(),
  })
}

export function randomComment(author: Membership, video: Video): Comment {
  return new Comment({
    id: (++idCounters.Comment).toString(),
    createdAt: randomDate(),
    author,
    video,
    text: randomString(100),
    isEdited: randomBool(),
    reactionsCount: _.random(0, 10_000),
    repliesCount: _.random(0, 10_000),
    reactionsAndRepliesCount: _.random(0, 10_000),
    status: randomBool()
      ? CommentStatus.VISIBLE
      : randomBool()
      ? CommentStatus.DELETED
      : CommentStatus.MODERATED,
  })
}

export function randomContentActor() {
  // Not really random now, but it's unused anyway
  return new ContentActorLead()
}

export function randomEventData(
  members: Membership[],
  nfts: OwnedNft[],
  auctions: Auction[],
  bids: Bid[],
  comments: Comment[]
) {
  const member = _.sample(members)!
  const nft = _.sample(nfts)!
  const auction = _.sample(auctions)!
  const bid = _.sample(bids)!
  const comment = _.sample(comments)!
  switch (_.random(0, 10)) {
    case 0:
      return new CommentCreatedEventData({
        comment: comment.id,
        text: comment.text,
      })
    case 1:
      return new CommentTextUpdatedEventData({
        comment: comment.id,
        newText: comment.text,
      })
    case 2:
      return new OpenAuctionStartedEventData({
        auction: auction.id,
        actor: randomContentActor(),
        nftOwner: auction.nft.owner,
      })
    case 3:
      return new EnglishAuctionStartedEventData({
        auction: auction.id,
        actor: randomContentActor(),
        nftOwner: auction.nft.owner,
      })
    case 4:
      return new NftIssuedEventData({
        actor: randomContentActor(),
        nft: nft.id,
        nftOwner: nft.owner,
      })
    case 5:
      return new AuctionBidMadeEventData({
        bid: bid.id,
        nftOwner: bid.auction.nft.owner,
      })
    case 6:
      return new AuctionBidCanceledEventData({
        bid: bid.id,
        member: bid.bidder.id,
        nftOwner: bid.auction.nft.owner,
      })
    case 7:
      return new AuctionCanceledEventData({
        auction: auction.id,
        actor: randomContentActor(),
        nftOwner: auction.nft.owner,
      })
    case 8:
      return new EnglishAuctionSettledEventData({
        winningBid: bid.id,
        previousNftOwner: bid.auction.nft.owner,
      })
    case 9:
      return new BidMadeCompletingAuctionEventData({
        winningBid: bid.id,
        previousNftOwner: bid.auction.nft.owner,
      })
    case 10:
      return new OpenAuctionBidAcceptedEventData({
        actor: randomContentActor(),
        previousNftOwner: bid.auction.nft.owner,
        winningBid: bid.id,
      })
    case 11:
      return new NftSellOrderMadeEventData({
        actor: randomContentActor(),
        nft: nft.id,
        nftOwner: nft.owner,
        price: randomHAPIAmount(),
      })
    case 12:
      return new NftBoughtEventData({
        buyer: member.id,
        previousNftOwner: nft.owner,
        nft: nft.id,
        price: randomHAPIAmount(),
      })
    case 13:
      return new BuyNowCanceledEventData({
        actor: randomContentActor(),
        nft: nft.id,
        nftOwner: nft.owner,
      })
    default:
      return new BuyNowPriceUpdatedEventData({
        actor: randomContentActor(),
        newPrice: randomHAPIAmount(),
        nft: nft.id,
        nftOwner: nft.owner,
      })
  }
}

export function randomEvent(data: EventData): Event {
  return new Event({
    id: (++idCounters.Event).toString(),
    inBlock: randomBlock(),
    indexInBlock: _.random(0, 1000),
    inExtrinsic: randomString(32),
    timestamp: randomDate(),
    data,
  })
}
