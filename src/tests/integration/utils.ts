import { KeyringPair } from '@polkadot/keyring/types'
import { Keyring } from '@polkadot/api'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import request from 'supertest'
import { Account, AccountNotificationPreferences } from '../../model'
import { expect } from 'chai'
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { SESSION_COOKIE_NAME } from '../../utils/auth'
import { TestContext } from './extrinsics'
import { EntityManager } from 'typeorm'
import { assert } from 'console'

const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export class UserContext {
  protected _joystreamAccount: KeyringPair
  protected _membershipId: string = ''
  protected _channelId: string = ''
  protected _accountId: string = ''
  protected _sessionId: string = ''
  protected _videoId: string = ''
  protected _uri: string = ''

  constructor(uri: string) {
    this._uri = uri
    this._joystreamAccount = keyring.addFromUri(this._uri)
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
