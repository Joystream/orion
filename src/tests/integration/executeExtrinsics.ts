import { ApiPromise, WsProvider } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { NftStatus, TestContext } from './extrinsics'
import { UserContext } from './utils'
import path from 'path'
import { assert } from 'console'

require('dotenv').config()

async function initTestContext(): Promise<TestContext> {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944')
  await cryptoWaitReady()
  const api = await ApiPromise.create({ provider: wsProvider })
  const ctx = new TestContext(api)
  return ctx
}

// read user data from user.json file
async function createUserFromData(jsonFile: string): Promise<UserContext> {
  const userConfig = require(path.join(__dirname, jsonFile))
  const user = new UserContext(`//${userConfig.USER_URI}`)
  user.setSessionId(userConfig.LOGIN_SESSION_ID)
  user.setMembershipId(userConfig.USER_MEMBER_ID)
  return user
}

// main
async function main(): Promise<void> {
  const ctx = await initTestContext()
  const alice = await createUserFromData('Alice.json')
  const bob = await createUserFromData('Bob.json')

  // created via joystreamCLi
  const channelId = process.env.CHANNEL_ID!
  const channelRewardAccount = process.env.CHANNEL_REWARD_ACCOUNT!
  // alice creates channel
  // const { channelId, channelRewardAccount } = await ctx.createChannel(
  //   alice.membershipId,
  //   alice.joystreamAccount
  // )
  // assert(channelId !== '', 'channelId is empty')
  // assert(channelRewardAccount !== '', 'channel reward account is empty')

  // Alice creates video in english auction status
  // doing this early so that the auction has time to expire
  const videoIdWithNftEnglishAuction = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.EnglishAuction,
    [alice.membershipId, bob.membershipId]
  )
  assert(videoIdWithNftEnglishAuction !== '', 'videoIdWithNftEnglishAuction is empty')

  // Alice creates video in offer status
  const videoIdWithNftOffered = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.Offer,
    [bob.membershipId]
  )
  assert(videoIdWithNftOffered !== '', 'videoIdWithNftOffered is empty')

  // Bob accepts the offer
  await ctx.acceptNftOffer(bob.joystreamAccount, videoIdWithNftOffered)

  // Alice creates video in open auction status
  const videoIdWithNftOpenAuction = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.OpenAuction,
    [alice.membershipId, bob.membershipId]
  )
  assert(videoIdWithNftOpenAuction !== '', 'videoIdWithNftOpenAuction is empty')
  // Bob places bid on the open auction
  const firstOpenAuctionBidPrice = await ctx.makeOpenAuctionBid(
    bob.joystreamAccount,
    videoIdWithNftOpenAuction,
    bob.membershipId
  )
  assert(firstOpenAuctionBidPrice !== undefined, 'firstOpenAuctionBidPrice not defined ')
  // Alice outbids on the open auction
  const secondOpenAuctionBidPrice = await ctx.makeOpenAuctionBid(
    alice.joystreamAccount,
    videoIdWithNftOpenAuction,
    alice.membershipId,
    await ctx.increaseBidByMinStep(firstOpenAuctionBidPrice!)
  )
  assert(secondOpenAuctionBidPrice !== undefined, 'firstOpenAuctionBidPrice not defined ')
  // Bob makes completing auciton bid on the open auction
  await ctx.makeCompletingAuctionBid(
    alice.joystreamAccount,
    videoIdWithNftOpenAuction,
    alice.membershipId
  )

  // Bob places bid on the english auction
  const englishAuctionBidPrice = await ctx.makeEnglishAuctionBid(
    bob.joystreamAccount,
    videoIdWithNftEnglishAuction,
    bob.membershipId
  )
  assert(englishAuctionBidPrice !== undefined, 'englishAuctionBidPrice not defined ')

  // Alice settles english auction
  await ctx.settleEnglishAuction(alice.joystreamAccount, videoIdWithNftEnglishAuction)

  // Alice creates video in buy now status
  const videoIdWithNftBuyNow = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.BuyNow,
    [bob.membershipId]
  )
  assert(videoIdWithNftBuyNow !== '', 'videoIdWithNftBuyNow is empty')
  // Bob buys nft
  await ctx.buyNft(bob.joystreamAccount, videoIdWithNftBuyNow, bob.membershipId)

  // Alice withdraws firstAuctionBidPrice amount from channel account into her account
  await ctx.withdrawFundsFromChannel(
    alice.joystreamAccount,
    channelId,
    alice.membershipId,
    firstOpenAuctionBidPrice!
  )

  // Bob sends payment to Alice's channel
  const bobBalance = await ctx.getFreeBalance(bob.joystreamAccount.address)
  await ctx.memberPaymentToChannel(
    bob.joystreamAccount,
    bob.membershipId,
    videoIdWithNftBuyNow,
    channelRewardAccount,
    bobBalance.divn(100)
  )

  // Bob reacts to Alice video
  await ctx.reactToVideo(bob.joystreamAccount, videoIdWithNftBuyNow, bob.membershipId)

  // create video with nft on idle and then set it in offer status
  const videoToBeOffered = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.Idle,
    [alice.membershipId, bob.membershipId]
  )
  await ctx.startNftOffer(
    alice.joystreamAccount,
    videoToBeOffered,
    alice.membershipId,
    bob.membershipId
  )

  // create video with nft on test and then set it in offer status
  const videoWithNftForOpenAuction = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.Idle,
    [alice.membershipId, bob.membershipId]
  )
  await ctx.startOpenAuction(
    alice.joystreamAccount,
    videoWithNftForOpenAuction,
    alice.membershipId,
    [alice.membershipId, bob.membershipId]
  )

  // create video with nft on test and then set it in offer status
  const videoWithNftForEnglishAuction = await ctx.createVideoWithNft(
    alice.membershipId,
    channelId,
    alice.joystreamAccount,
    NftStatus.Idle,
    [alice.membershipId, bob.membershipId]
  )
  await ctx.startEnglishAuction(
    alice.joystreamAccount,
    videoWithNftForOpenAuction,
    alice.membershipId,
    [alice.membershipId, bob.membershipId]
  )
}

main()
  .then(() => {
    return
  })
  .catch((err) => {
    console.log(err)
  })
