import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/api';
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Account } from '../../model';
import { expect } from 'chai';

const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export class UserContext {
  protected _joystreamAccount: KeyringPair
  protected _membershipId: string = ''
  protected _channelId: string = ''
  protected _accountId: string = ''
  protected _sessionId: string = ''
  protected _treasury: KeyringPair
  protected _videoId: string = ''

  public static createUserFromUri(uri: string): UserContext {
    const account = keyring.addFromUri(uri)
    const treasury = keyring.addFromUri('//testing//5')
    return new UserContext(account, treasury)
  }
  constructor(joystreamAccount: KeyringPair, treasury: KeyringPair) {
    this._joystreamAccount = joystreamAccount
    this._treasury = treasury
  }

  get videoId(): string {
    return this._videoId
  }
  get joystreamAccount(): KeyringPair {
    return this._joystreamAccount
  }
  get membershipId(): string {
    return this._membershipId
  }
  get accountId(): string {
    return this._accountId
  }
  get channelId(): string {
    return this._channelId
  }
  get sessionId(): string {
    return this._sessionId
  }

  public setSessionId(sessionId: string): void {
    this._sessionId = sessionId
  }
  public setMembershipId(membershipId: string): void {
    this._membershipId = membershipId
  }
  public setAccountId(accountId: string): void {
    this._accountId = accountId
  }
  public setChannelId(channelId: string): void {
    this._channelId = channelId
  }
  public setVideoId(videoId: string): void {
    this._videoId = videoId
  }
}

// write a function that waits for n seconds where n is a number 
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function expectAccountNotificationPreferencesToBeTrue(account: Account) {
  expect(account.channelRewardClaimedAndWithdrawnInAppNotificationEnabled).to.be.true
  expect(account.channelRewardClaimedAndWithdrawnMailNotificationEnabled).to.be.true
  expect(account.metaprotocolTransactionStatusInAppNotificationEnabled).to.be.true
  expect(account.metaprotocolTransactionStatusMailNotificationEnabled).to.be.true
  expect(account.bidMadeCompletingAuctionInAppNotificationEnabled).to.be.true
  expect(account.bidMadeCompletingAuctionMailNotificationEnabled).to.be.true
  expect(account.openAuctionBidAcceptedInAppNotificationEnabled).to.be.true
  expect(account.openAuctionBidAcceptedMailNotificationEnabled).to.be.true
  expect(account.memberBannedFromChannelMailNotificationEnabled).to.be.true
  expect(account.memberBannedFromChannelInAppNotificationEnabled).to.be.true
  expect(account.englishAuctionSettledMailNotificationEnabled).to.be.true
  expect(account.englishAuctionSettledInAppNotificationEnabled).to.be.true
  expect(account.channelFundsWithdrawnInAppNotificationEnabled).to.be.true
  expect(account.channelFundsWithdrawnMailNotificationEnabled).to.be.true
  expect(account.englishAuctionStartedMailNotificationEnabled).to.be.true
  expect(account.englishAuctionStartedInAppNotificationEnabled).to.be.true
  expect(account.channelPayoutsUpdatedMailNotificationEnabled).to.be.true
  expect(account.channelPayoutsUpdatedInAppNotificationEnabled).to.be.true
  expect(account.channelRewardClaimedMailNotificationEnabled).to.be.true
  expect(account.channelRewardClaimedInAppNotificationEnabled).to.be.true
  expect(account.channelRewardClaimedAndWithdrawnMailNotificationEnabled).to.be.true
  expect(account.channelRewardClaimedAndWithdrawnInAppNotificationEnabled).to.be.true
  expect(account.nftBoughtMailNotificationEnabled).to.be.true
  expect(account.nftBoughtInAppNotificationEnabled).to.be.true
  expect(account.nftIssuedMailNotificationEnabled).to.be.true
  expect(account.nftIssuedInAppNotificationEnabled).to.be.true
}
