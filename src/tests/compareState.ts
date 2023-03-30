import {
  ApolloClient,
  InMemoryCache,
  ApolloClientOptions,
  NormalizedCacheObject,
  HttpLink,
  ApolloLink,
  from,
} from '@apollo/client/core'
import _ from 'lodash'
import { has, isObject } from '../utils/misc'
import {
  BidFieldsFragment,
  StateQueryV1,
  StateQueryV1Query,
  StateQueryV1QueryVariables,
  VideoMediaEncodingFieldsFragment,
} from './v1/generated/queries'
import {
  StateQueryAuctionRefFieldsFragment,
  StateQueryBidRefFieldsFragment,
  StateQueryMetaprotocolTransactionResultFieldsFragment,
  StateQueryNftOwnerFieldsFragment,
  StateQueryV2,
  StateQueryV2Query,
  StateQueryV2QueryVariables,
  StateQueryTransactionalStatusFieldsFragment,
} from './v2/generated/queries'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

function normalizeDeep(
  obj: Record<string, any>,
  callback: (path: string, value: unknown, parent: unknown) => Record<string, any> | undefined,
  path = ''
) {
  for (const [key, val] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key
    const res = callback(currentPath, val, { ...obj })
    if (res !== undefined) {
      delete obj[key]
      normalizeDeep(res, callback, path)
      Object.assign(obj, res)
    } else if (Array.isArray(val) && isObject(val[0])) {
      val.forEach((v) => normalizeDeep(v, callback, currentPath))
    } else if (isObject(val)) {
      normalizeDeep(val, callback, currentPath)
    }
  }
}

function deepSort<T>(value: T): T {
  if (Array.isArray(value)) {
    return _(value)
      .sortBy((v) => {
        if (isObject(v) && has(v, 'id')) {
          return v.id
        }
        return v
      })
      .map((v) => deepSort(v)) as T
  }
  if (isObject(value)) {
    return _(value)
      .mapValues((v) => deepSort(v))
      .toPairs()
      .sortBy(0)
      .fromPairs()
      .value() as T
  }
  return value
}

function prepareV1Data(data: StateQueryV1Query) {
  const prepared = { ...data }
  normalizeDeep(prepared, (path, val, parent) => {
    if (path.endsWith('.minimalBidStep') && typeof val === 'number') {
      return { minimalBidStep: val.toString() }
    }
    if (path.endsWith('.buyNowPrice') && val === '0') {
      return { buyNowPrice: null }
    }
    if (path.endsWith('.topBid') && isObject(val) && has(val, 'id') && has(val, 'isCanceled')) {
      return {
        topBid:
          val.isCanceled &&
          !data.bidMadeCompletingAuctionEvents.find((e) => e.winningBid.id === val.id) &&
          !data.openAuctionBidAcceptedEvents.find((e) => e.winningBid?.id === val.id)
            ? null
            : { id: val.id },
      }
    }
    if (path.endsWith('.reactionsCountByReactionId') && Array.isArray(val) && val.length === 0) {
      return { reactionsCountByReactionId: null }
    }
    if (path.endsWith('.areas') && Array.isArray(val) && val.length === 0) {
      return { areas: null }
    }
    if (path.endsWith('.areas.area') && isObject(val)) {
      return { ...val }
    }
    if (path.endsWith('storageBags.owner.channelId') && typeof val === 'number') {
      return { channelId: val.toString() }
    }
    if (path.endsWith('videoCategories.description') && val === '') {
      return { description: null }
    }
    if (path.endsWith('transactionalStatus.price') && typeof val === 'number') {
      return { price: BigInt(val).toString() }
    }
    if (
      path.endsWith('bids.isCanceled') &&
      val === true &&
      isObject(parent) &&
      has(parent, 'id') &&
      (data.bidMadeCompletingAuctionEvents.find((e) => e.winningBid.id === parent.id) ||
        data.openAuctionBidAcceptedEvents.find((e) => e.winningBid?.id === parent.id))
    ) {
      // Known bug in Orion v1 - bid is getting canceled even when it's a winning bid in already completed auction
      // We also need to fix auction.topBid in this case (as it gets set to `null`)
      const auctionId = (parent as BidFieldsFragment).auction.id
      const auction = data.auctions.find((a) => a.id === auctionId)
      if (!auction) {
        throw new Error(`Auction ${auctionId} not found!`)
      }
      ;(auction.topBid as { id: string }) = { id: (parent as BidFieldsFragment).id }
      return { isCanceled: false }
    }
    if (path.endsWith('.encoding') && isObject(val) && has(val, 'codecName')) {
      const encoding = val as VideoMediaEncodingFieldsFragment
      if (
        encoding.codecName === null &&
        encoding.container === null &&
        encoding.mimeMediaType === null
      ) {
        return { encoding: null }
      }
    }
  })
  return deepSort(prepared)
}

function prepareV2Data(data: StateQueryV2Query) {
  const prepared = { ...data }
  normalizeDeep(prepared, (path, val, parent) => {
    const lastKey = path.split('.').slice(-1)[0]
    if (lastKey === 'language' && typeof val === 'string') {
      return { language: { iso: val } }
    }
    if (typeof val === 'string' && val.match(/[0-9]000Z$/)) {
      return { [lastKey]: val.replace('000Z', 'Z') }
    }
    if (path.endsWith('Events.data') && isObject(val)) {
      return { ...val }
    }
    if (path.endsWith('auctionBidCanceledEvents.bid') && isObject(val)) {
      const bid = val as StateQueryBidRefFieldsFragment
      return {
        video: { id: bid.auction.nft.id },
      }
    }
    if (path.endsWith('auctionBidMadeEvents.bid') && isObject(val)) {
      const bid = val as StateQueryBidRefFieldsFragment
      return {
        bidAmount: bid.amount,
        previousTopBid: bid.previousTopBid ? { id: bid.previousTopBid.id } : null,
        previousTopBidder: bid.previousTopBid?.bidder || null,
      }
    }
    if (path.endsWith('auctionCanceledEvents.auction') && isObject(val)) {
      const auction = val as StateQueryAuctionRefFieldsFragment
      return { video: { id: auction.nft.id } }
    }
    if (path.endsWith('openAuctionStartedEvents.auction') && isObject(val) && has(val, 'nft')) {
      const auction = val as StateQueryAuctionRefFieldsFragment
      return { auction: { id: auction.id } }
    }
    if (path.endsWith('Events.nft')) {
      return { video: val }
    }
    if (
      path.endsWith('Events.id') &&
      !path.startsWith('OLYMPIA') &&
      isObject(parent) &&
      has(parent, 'inBlock') &&
      has(parent, 'indexInBlock')
    ) {
      // Convert to backward-compatible event id
      return { id: `OLYMPIA-${parent.inBlock}-${parent.indexInBlock}` }
    }
    if (
      lastKey === 'nftOwner' ||
      lastKey === 'previousNftOwner' ||
      path.endsWith('ownedNfts.owner')
    ) {
      const nftOwner = val as StateQueryNftOwnerFieldsFragment
      if (nftOwner.__typename === 'NftOwnerChannel') {
        return {
          ownerMember: nftOwner.channel.ownerMember,
          ownerCuratorGroup: null,
        }
      }
      if (nftOwner.__typename === 'NftOwnerMember') {
        return {
          ownerMember: nftOwner.member,
          ownerCuratorGroup: null,
        }
      }
    }
    if (
      lastKey === 'transactionalStatus' &&
      isObject(val) &&
      isObject(parent) &&
      !('transactionalStatusAuction' in parent)
    ) {
      const transactionalStatus = val as StateQueryTransactionalStatusFieldsFragment
      if (transactionalStatus.__typename === 'TransactionalStatusAuction') {
        return {
          transactionalStatus: null,
          transactionalStatusAuction: transactionalStatus.auction,
        }
      } else {
        return {
          transactionalStatus: val,
          transactionalStatusAuction: null,
        }
      }
    }
    if (
      (path.endsWith('.bannedMembers.member') ||
        path.endsWith('.whitelistedMembers.member') ||
        path.endsWith('.whitelistedInAuctions.auction') ||
        path.endsWith('.bags.bag') ||
        path.endsWith('.storageBuckets.storageBucket') ||
        path.endsWith('.distributionBuckets.distributionBucket')) &&
      isObject(val) &&
      has(val, 'id')
    ) {
      return { id: val.id }
    }
    if (path.endsWith('Events.result') && isObject(val)) {
      const result = val as StateQueryMetaprotocolTransactionResultFieldsFragment
      if (result.__typename !== 'MetaprotocolTransactionResultFailed') {
        return {
          status: {
            __typename: 'MetaprotocolTransactionSuccessful',
            commentCreated: (result as any).commentCreated || null,
            commentEdited: (result as any).commentEdited || null,
            commentDeleted: (result as any).commentDeleted || null,
            commentModerated: (result as any).commentModerated || null,
            videoCategoryCreated: (result as any).videoCategoryCreated || null,
            videoCategoryUpdated: (result as any).videoCategoryUpdated || null,
            videoCategoryDeleted: (result as any).videoCategoryDeleted || null,
          },
        }
      } else {
        return {
          status: {
            __typename: 'MetaprotocolTransactionErrored',
          },
        }
      }
    }
    if (lastKey === 'winningBid' && isObject(val) && has(val, 'auction')) {
      const winningBid = val as StateQueryBidRefFieldsFragment
      if (path.includes('englishAuctionSettledEvents')) {
        return {
          winningBid: { id: winningBid.id },
          winner: { id: winningBid.bidder.id },
          video: { id: winningBid.auction.nft.id },
        }
      }
      return {
        winningBid: { id: winningBid.id },
        video: { id: winningBid.auction.nft.id },
      }
    }
  })
  return deepSort(prepared)
}

export async function compareState() {
  const config: ApolloClientOptions<NormalizedCacheObject> = {
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
      mutate: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
    },
  }
  const orionV1Url = process.env.ORION_V1_URL
  const orionV2Url = process.env.ORION_V2_URL

  console.log(`Orion V1 endpoint: ${orionV1Url}`)
  console.log(`Orion V2 endpoint: ${orionV2Url}`)

  const orionV1Client = new ApolloClient({
    link: new HttpLink({
      uri: orionV1Url,
    }),
    uri: orionV1Url,
    ...config,
  })

  const startV1 = performance.now()
  const v1Result = await orionV1Client.query<StateQueryV1Query, StateQueryV1QueryVariables>({
    query: StateQueryV1,
  })
  console.log(`V1 query took: ${performance.now() - startV1}`)
  console.log(!!v1Result.data)
  // console.log(v1Result.error)
  // console.log(v1Result.errors)

  const v1Data = prepareV1Data(v1Result.data)
  fs.writeFileSync('./resultV1.json', JSON.stringify(v1Data, null, 4))

  const operatorMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'x-operator-secret': process.env.OPERATOR_SECRET,
      },
    }))

    return forward(operation)
  })
  const orionV2Client = new ApolloClient({
    link: from([
      operatorMiddleware,
      new HttpLink({
        uri: orionV2Url,
      }),
    ]),
    ...config,
  })

  const startV2 = performance.now()
  const v2Result = await orionV2Client.query<StateQueryV2Query, StateQueryV2QueryVariables>({
    query: StateQueryV2,
  })
  console.log(`V2 query took: ${performance.now() - startV2}`)
  console.log(!!v2Result.data)

  const v2Data = prepareV2Data(v2Result.data)
  fs.writeFileSync('./resultV2.json', JSON.stringify(v2Data, null, 4))

  const execP = promisify(exec)
  try {
    await execP('git diff --no-index --color resultV1.json resultV2.json')
    console.log('OK')
  } catch (e) {
    if (isObject(e) && has(e, 'stdout')) {
      console.log('Diff encountered')
      console.log(e.stdout)
      process.exit(1)
    } else {
      throw e
    }
  }
}

compareState()
  .then(() => process.exit(0))
  .catch(console.error)
