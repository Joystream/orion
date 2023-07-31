import BN from 'bn.js'
import Long from 'long'
import { IMakeChannelPayment, IMemberRemarked, MemberRemarked } from '@joystream/metadata-protobuf'
import { Bytes } from '@polkadot/types'
import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { u64, BTreeSet } from '@polkadot/types'
import { AnyMetadataClass } from '@joystream/metadata-protobuf/types'
import { PalletContentNftTypesInitTransactionalStatusRecord } from '@polkadot/types/lookup'

export type ChannelCreatedEvent = {
  channelId: string
  channelRewardAccount: string
}

export type ChannelPaymentParams = {
  asMember: string
  msg: IMakeChannelPayment
  payment: [string, BigInt]
}
async function storageBucketsNumWitness(api: ApiPromise, channelId: string): Promise<number> {
  const channelBag = await api.query.storage.bags(
    api.createType('PalletStorageBagIdType', { Dynamic: { Channel: channelId } })
  )
  return channelBag.storedBy.size
}
async function getStorageBucketsAccordingToPolicy(api: ApiPromise): Promise<BTreeSet<u64>> {
  const { numberOfStorageBuckets } = await api.query.storage.dynamicBagCreationPolicies('Channel')
  const storageBuckets = api.createType('BTreeSet<u64>')
  for (let i = 0; numberOfStorageBuckets.toBn().gtn(i); ++i) {
    storageBuckets.add(api.createType('u64', 0))
  }
  return storageBuckets
}

export enum NftStatus {
  Idle,
  Offer,
  EnglishAuction,
  OpenAuction,
  BuyNow,
}

export class TestContext {
  private _api: ApiPromise
  constructor(api: ApiPromise) {
    this._api = api
  }

  protected async nftTransactionalStatus(
    status: NftStatus,
    whitelist?: string[]
  ): Promise<PalletContentNftTypesInitTransactionalStatusRecord> {
    const boundaries = await this.getAuctionParametersBoundaries()
    const buyNowPrice = boundaries.startingPrice.min.add(boundaries.bidStep.min.muln(4))
    switch (status) {
      case NftStatus.BuyNow:
        return this._api.createType('PalletContentNftTypesInitTransactionalStatusRecord', {
          BuyNow: boundaries.startingPrice.min,
        })
      case NftStatus.Offer:
        return this._api.createType('PalletContentNftTypesInitTransactionalStatusRecord', {
          InitiatedOfferToMember: [whitelist ? whitelist[0] : '0', boundaries.startingPrice.min],
        }) as PalletContentNftTypesInitTransactionalStatusRecord
      case NftStatus.EnglishAuction:
        const duration = await this._api.query.content.minAuctionDuration()
        const auctionParams = this._api.createType(
          'PalletContentNftTypesEnglishAuctionParamsRecord',
          {
            startingPrice: boundaries.startingPrice.min,
            buyNowPrice,
            whitelist: whitelist ? whitelist : [],
            startsAt: null,
            duration,
            extensionPeriod: duration,
            minBidStep: boundaries.bidStep.min,
          }
        )
        return this._api.createType('PalletContentNftTypesInitTransactionalStatusRecord', {
          EnglishAuction: auctionParams,
        })
      case NftStatus.OpenAuction:
        const openAuctionParams = this._api.createType(
          'PalletContentNftTypesOpenAuctionParamsRecord',
          {
            startingPrice: boundaries.startingPrice.min,
            buyNowPrice,
            whitelist: whitelist,
            startsAt: null,
            bidLockDuration: boundaries.bidLockDuration.min,
          }
        )
        return this._api.createType('PalletContentNftTypesInitTransactionalStatusRecord', {
          OpenAuction: openAuctionParams,
        })
      default:
        return this._api.createType('PalletContentNftTypesInitTransactionalStatusRecord', {
          Idle: null,
        })
    }
  }
  public async getAuctionParametersBoundaries() {
    const boundaries = {
      extensionPeriod: {
        min: await this._api.query.content.minAuctionExtensionPeriod(),
        max: await this._api.query.content.maxAuctionExtensionPeriod(),
      },
      auctionDuration: {
        min: await this._api.query.content.minAuctionDuration(),
        max: await this._api.query.content.maxAuctionDuration(),
      },
      bidLockDuration: {
        min: await this._api.query.content.minBidLockDuration(),
        max: await this._api.query.content.maxBidLockDuration(),
      },
      startingPrice: {
        min: await this._api.query.content.minStartingPrice(),
        max: await this._api.query.content.maxStartingPrice(),
      },
      bidStep: {
        min: await this._api.query.content.minBidStep(),
        max: await this._api.query.content.maxBidStep(),
      },
    }

    return boundaries
  }

  public async createVideoWithNft(
    memberId: string,
    channelId: string,
    sender: KeyringPair,
    status: NftStatus,
    whitelist?: string[]
  ): Promise<string> {
    const initTransactionalStatus = await this.nftTransactionalStatus(status, whitelist)
    const expectedVideoStateBloatBond = await this._api.query.content.videoStateBloatBondValue()
    const expectedDataObjectStateBloatBond =
      await this._api.query.storage.dataObjectStateBloatBondValue()

    const videoCreationParams = this._api.createType('PalletContentVideoCreationParametersRecord', {
      assets: null,
      meta: null,
      expectedVideoStateBloatBond,
      expectedDataObjectStateBloatBond,
      autoIssueNft: {
        royalty: this._api.createType('Permill', 10),
        nftMetadata: '',
        nonChannelOwner: null,
        initTransactionalStatus,
      },
      storageBucketsNumWitness: await storageBucketsNumWitness(this._api, channelId),
    })

    const actor = this._api.createType('PalletContentPermissionsContentActor', { Member: memberId })
    let unsub: () => void
    let videoId = ''
    await new Promise<() => void>((resolve) => {
      this._api.tx.content
        .createVideo(actor, channelId, videoCreationParams)
        .signAndSend(sender, (result) => {
          if (result.status.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              console.log('error:', name)
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content' && method === 'VideoCreated') {
                videoId = data[2].toString()
              }
            })
            resolve(unsub)
          }
        })
    })
    return videoId
  }

  public async createChannel(memberId: string, sender: KeyringPair): Promise<ChannelCreatedEvent> {
    const storageBuckets = await getStorageBucketsAccordingToPolicy(this._api)
    // FIXME: find a solution like with storage buckets
    const distributionBuckets = this._api.createType('BTreeSet<u64>')
    distributionBuckets.add(this._api.createType('u64', 0))
    const expectedDataObjectStateBloatBond =
      await this._api.query.storage.dataObjectStateBloatBondValue()
    const expectedChannelStateBloatBond = await this._api.query.content.channelStateBloatBondValue()
    const channelOwner = this._api.createType('PalletContentChannelOwner', { Member: memberId })
    const channelCreationParameters = this._api.createType(
      'PalletContentChannelCreationParametersRecord',
      {
        expectedChannelStateBloatBond,
        expectedDataObjectStateBloatBond,
        storageBuckets,
        distributionBuckets,
      }
    )

    let unsub: () => void
    let channelId = ''
    let channelRewardAccount = ''
    await new Promise<() => void>((resolve) => {
      this._api.tx.content
        .createChannel(channelOwner, channelCreationParameters)
        .signAndSend(sender, (result) => {
          if (result.status.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              console.log('error:', name)
            }
            result.events.forEach(({ event: { data, section } }) => {
              if (section === 'content') {
                channelId = data[0].toString()
                channelRewardAccount = data[3].toString()
              }
            })
            resolve(unsub)
          }
        })
    })
    return {
      channelId,
      channelRewardAccount,
    }
  }

  public async createMember(sender: KeyringPair, handle?: string): Promise<string> {
    let unsub: () => void
    let memberId = ''
    await new Promise<() => void>((resolve) => {
      this._api.tx.members
        .buyMembership({
          rootAccount: sender.address,
          controllerAccount: sender.address,
          handle: handle ?? sender.address.toString(),
        })
        .signAndSend(sender, ({ events = [], status }) => {
          if (status.isFinalized) {
            events.forEach(({ event: { data, section } }) => {
              if (section === 'members') {
                memberId = data[0].toString()
              }
            })
            resolve(unsub)
          }
        })
    })

    return memberId
  }

  public async memberPaymentToChannel(
    sender: KeyringPair,
    memberId: string,
    videoId: string,
    channelRewardAccount: string,
    amount: BigInt
  ): Promise<void> {
    const channelPayment: ChannelPaymentParams =
      // Channel Payment for a video:
      {
        msg: {
          // create a Long contaning value for videoId
          videoId: Long.fromNumber(Number(videoId)),
          rationale: 'Really good video',
        },
        payment: [channelRewardAccount, amount],
        asMember: memberId,
      }

    const msg: IMemberRemarked = {
      makeChannelPayment: channelPayment.msg,
    }

    let unsub: () => void
    await new Promise<() => void>((resolve, reject) => {
      this._api.tx.members
        .memberRemark(
          channelPayment.asMember,
          this.metadataToBytes(MemberRemarked, msg)
          // TODO: fix this error by updating @joystream/types
          // channelPayment.payment
        )
        .signAndSend(sender, (result) => {
          if (result.status.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              reject(new Error(name))
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'membership' && method === 'MemberRemarked') {
                resolve(unsub)
              }
            })
          }
        })
    })
    return
  }

  protected metadataToBytes<T>(metaClass: AnyMetadataClass<T>, obj: T): Bytes {
    return this._api.createType('Bytes', TestContext.metadataToString(metaClass, obj))
  }

  public static metadataToString<T>(metaClass: AnyMetadataClass<T>, obj: T): string {
    return '0x' + Buffer.from(metaClass.encode(obj).finish()).toString('hex')
  }

  public async acceptNftOffer(sender: KeyringPair, videoId: string): Promise<void> {
    const boundaries = await this.getAuctionParametersBoundaries()
    let unsub: () => void
    new Promise<() => void>((resolve, reject) => {
      this._api.tx.content
        .acceptIncomingOffer(videoId, boundaries.startingPrice.min)
        .signAndSend(sender, (result) => {
          if (result.status.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              reject(new Error(name))
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content' && method === 'NftOfferAccepted') {
                resolve(unsub)
              }
            })
          }
        })
    })
  }

  public async buyNft(sender: KeyringPair, videoId: string, participantId: string): Promise<void> {
    const price = await this._api.query.content.minStartingPrice()
    let unsub: () => void
    await new Promise((resolve, reject) => {
      this._api.tx.content.buyNft(videoId, participantId, price).signAndSend(sender, (result) => {
        if (result.isFinalized) {
          const error = result.dispatchError
          if (error) {
            const { name } = this._api.registry.findMetaError(error.asModule)
            reject(new Error(name))
          }
          result.events.forEach(({ event: { data, method, section } }) => {
            if (section === 'content' && method === 'NftBought') {
              resolve(unsub)
            }
          })
        }
      })
    })
  }

  public async makeOpenAuctionBid(
    sender: KeyringPair,
    videoId: string,
    participantId: string,
    price?: BN
  ): Promise<BN | undefined> {
    const boundaries = await this.getAuctionParametersBoundaries()
    const bidPrice = price ? price : boundaries.startingPrice.min.add(boundaries.bidStep.min)
    let unsub: () => void
    let bidMadePrice: BN | undefined
    await new Promise<() => void>((resolve, reject) => {
      this._api.tx.content
        .makeOpenAuctionBid(participantId, videoId, bidPrice)
        .signAndSend(sender, (result) => {
          if (result.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              reject(new Error(name))
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content' && method === 'AuctionBidMade') {
                bidMadePrice = new BN(data[2].toString())
                resolve(unsub)
              }
            })
          }
        })
    })
    return bidMadePrice
  }

  public async makeCompletingAuctionBid(
    sender: KeyringPair,
    videoId: string,
    participantId: string
  ): Promise<void> {
    const boundaries = await this.getAuctionParametersBoundaries()
    const bidPrice = boundaries.startingPrice.min.add(boundaries.bidStep.min.muln(4))
    let unsub: () => void
    await new Promise<() => void>((resolve, reject) => {
      this._api.tx.content
        .makeOpenAuctionBid(participantId, videoId, bidPrice)
        .signAndSend(sender, (result) => {
          if (result.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              reject(new Error(name))
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content' && method === 'BidMadeCompletingAuction') {
                resolve(unsub)
              }
            })
          }
        })
    })
    return
  }

  // increase price by minimal bid step
  public async increaseBidByMinStep(price: BN): Promise<BN> {
    const boundaries = await this.getAuctionParametersBoundaries()
    return price.add(boundaries.bidStep.min)
  }

  // make english auction bid: just copy the make openauction bid function
  public async makeEnglishAuctionBid(
    sender: KeyringPair,
    videoId: string,
    participantId: string,
    price?: BN
  ): Promise<BN | undefined> {
    const boundaries = await this.getAuctionParametersBoundaries()
    const bidPrice = price ? price : boundaries.startingPrice.min.add(boundaries.bidStep.min)
    let unsub: () => void
    let bidMadePrice: BN | undefined
    await new Promise<() => void>((resolve, reject) => {
      this._api.tx.content
        .makeEnglishAuctionBid(participantId, videoId, bidPrice)
        .signAndSend(sender, (result) => {
          if (result.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              reject(new Error(name))
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content' && method === 'AuctionBidMade') {
                bidMadePrice = new BN(data[2].toString())
                resolve(unsub)
              }
            })
          }
        })
    })
    return bidMadePrice
  }

  public async settleEnglishAuction(sender: KeyringPair, videoId: string): Promise<void> {
    // await until english auction is finished
    await waitUntil(() => this.checkEnglishAuctionFinished(videoId))

    let unsub: () => void
    await new Promise<() => void>((resolve, reject) => {
      this._api.tx.content.settleEnglishAuction(videoId).signAndSend(sender, (result) => {
        if (result.isFinalized) {
          const error = result.dispatchError
          if (error) {
            const { name } = this._api.registry.findMetaError(error.asModule)
            reject(new Error(name))
          }
          result.events.forEach(({ event: { data, method, section } }) => {
            if (section === 'content' && method === 'EnglishAuctionSettled') {
              resolve(unsub)
            }
          })
        }
      })
    })
    return
  }

  private async checkEnglishAuctionFinished(videoId: string): Promise<boolean> {
    const nft = (await this._api.query.content.videoById(videoId)).nftStatus.unwrap()
    const txStatus = nft.transactionalStatus
    const currentBlock = (await this._api.derive.chain.bestNumber()).toBn()
    if (txStatus.isEnglishAuction) {
      const auction = txStatus.asEnglishAuction
      const end = auction.end.toBn()
      console.log('auction end vs now', end, currentBlock)
      return end.lte(currentBlock)
    } else {
      return false
    }
  }
}

export function waitUntil(condition: () => Promise<boolean>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let attempts = 0
    const interval = setInterval(async () => {
      if (await condition()) {
        clearInterval(interval)
        resolve()
      } else {
        attempts++
        if (attempts > 10) {
          clearInterval(interval)
          reject(new Error('waitUntil timeout'))
        }
      }
    }, 10000)
  })
}
