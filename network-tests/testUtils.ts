import { IExtrinsic } from '@polkadot/types/types'
import { compactToU8a, stringToU8a } from '@polkadot/util'
import { blake2AsHex } from '@polkadot/util-crypto'
import BN from 'bn.js'
import fs from 'fs'
import { decodeAddress } from '@polkadot/keyring'
import { Bytes } from '@polkadot/types'
import { createType } from '@joystream/types'
import { encodeDecode, metaToObject } from '@joystream/metadata-protobuf/utils'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { JsNodeApi } from './joystreamNodeApi'
import { HttpLink, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import fetch from 'cross-fetch'

export function waitMilliSec(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds) // 5000 milliseconds = 5 seconds
  })
}

export function pollCondition(condition: () => boolean, maxRetries = 10, retryInterval = 6000): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let retries = 0
    const intervalId = setInterval(() => {
      retries++
      if (condition()) {
        clearInterval(intervalId)
        resolve(true)
      } else if (retries >= maxRetries) {
        clearInterval(intervalId)
        resolve(false)
      }
    }, retryInterval)
  })
}

export class TestContext {
  private _waitTimeForBlockProductionMs = 5000
  private _jsNode: JsNodeApi | undefined
  private _treasuryUri = ''
  private _provider: WsProvider | undefined
  private _apolloClient: ApolloClient<NormalizedCacheObject> | undefined

  public setWaitTimeForBlockProduction(milliSec: number) {
    this._waitTimeForBlockProductionMs = milliSec
  }

  public setTreasuryUri(uri: string) {
    this._treasuryUri = uri
  }

  public async connectToJsNodeEndpoint(url: string): Promise<void> {
    if (this._treasuryUri === '') {
      console.error('treasury uri not set, impossible to continue testing')
      process.exit(-1)
    }
    this._provider = new WsProvider(url)
    const api = await ApiPromise.create({ provider: this._provider! })
    try {
      await api.isReadyOrError
    } catch (error) {
      console.error(error)
      process.exit(-1)
    }
    this._jsNode = new JsNodeApi(this._treasuryUri, api)
    await waitMilliSec(this._waitTimeForBlockProductionMs)
  }

  public jsNodeApi(): JsNodeApi {
    return this._jsNode!
  }

  public orionClient(): ApolloClient<NormalizedCacheObject> {
    return this._apolloClient!
  }

  public connectToGraphqlEndpoint(orionUrl: string) {
    this._apolloClient = new ApolloClient({
      link: new HttpLink({ uri: orionUrl, fetch }),
      cache: new InMemoryCache({ addTypename: false }),
      defaultOptions: { query: { fetchPolicy: 'no-cache', errorPolicy: 'all' } },
    })
  }

  public disconnectJsNode() {
    if (this._provider !== undefined) {
      this._provider!.disconnect().catch(() => {})
    }
  }
}

export class StateBuilderHelper {
  private _jsNodeApi: JsNodeApi

  constructor(jsNodeApi: JsNodeApi) {
    this._jsNodeApi = jsNodeApi
  }

  public async addAccounts(n: number): Promise<string[]> {
    let addresses = []
      for (let i = 1; i <= n; i++) {
        const addr = await this._jsNodeApi!.addAccountFromUri(i.toString())
        addresses.push(addr)
      }
    return addresses
  }
}


type MemberCreationParams = {
  root_account: string
  controller_account: string
  handle: string
  name?: string
  about?: string
  avatarUri?: string | null
  externalResources?: "string" | null
  metadata: Bytes
  is_founding_member: boolean
}

export function membershipParamsFromAccount(accountId: string, isFoundingMember = false): MemberCreationParams {
  const affix = accountId.substring(0, 14)
  const name = `name${affix}`
  const about = `about${affix}`
  const avatarUri = `https://example.com/${affix}.jpg`
  const externalResources = 'test'
  const metadataBytes = createType('Bytes', "test")
  return {
    root_account: accountId,
    controller_account: accountId,
    handle: `handle${accountId.substring(0, 14)}`,
    name,
    about,
    avatarUri,
    externalResources: null,
    metadata: metadataBytes,
    is_founding_member: isFoundingMember,
  }
}

export class Utils {
  private static LENGTH_ADDRESS = 32 + 1 // publicKey + prefix
  private static LENGTH_ERA = 2 // assuming mortals
  private static LENGTH_SIGNATURE = 64 // assuming ed25519 or sr25519
  private static LENGTH_VERSION = 1 // 0x80 & version

  public static calcTxLength = (extrinsic?: IExtrinsic | null, nonce?: BN): BN => {
    return new BN(
      Utils.LENGTH_VERSION +
        Utils.LENGTH_ADDRESS +
        Utils.LENGTH_SIGNATURE +
        Utils.LENGTH_ERA +
        compactToU8a(nonce || 0).length +
        (extrinsic ? extrinsic.encodedLength : 0)
    )
  }

  /** hash(accountId + salt) */
  public static hashVote(accountId: string, salt: string): string {
    const accountU8a = decodeAddress(accountId)
    const saltU8a = stringToU8a(salt)
    const voteU8a = new Uint8Array(accountU8a.length + saltU8a.length)
    voteU8a.set(accountU8a)
    voteU8a.set(saltU8a, accountU8a.length)

    const hash = blake2AsHex(voteU8a, 256)
    return hash
  }

  public static wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public static readContentFromFile(path: string): string {
    return '0x' + fs.readFileSync(path).toString('hex')
  }

  public static camelToSnakeCase(key: string): string {
    return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }

  public static metadataToBytes<T>(metaClass: AnyMetadataClass<T>, obj: T): Bytes {
    return createType('Bytes', Utils.metadataToString(metaClass, obj))
  }

  public static metadataToString<T>(metaClass: AnyMetadataClass<T>, obj: T): string {
    return '0x' + Buffer.from(metaClass.encode(obj).finish()).toString('hex')
  }

  public static metadataFromBytes<T>(metaClass: AnyMetadataClass<T>, bytes: Bytes): DecodedMetadataObject<T> {
    // We use `toObject()` to get rid of .prototype defaults for optional fields
    return metaToObject(metaClass, metaClass.decode(bytes.toU8a(true)))
  }

  public static getDeserializedMetadataFormInput<T>(
    metadataClass: AnyMetadataClass<T>,
    input: MetadataInput<T>
  ): DecodedMetadataObject<T> | null {
    if (typeof input.value === 'string') {
      try {
        return Utils.metadataFromBytes(metadataClass, createType('Bytes', input.value))
      } catch (e) {
        if (!input.expectFailure) {
          throw e
        }
        return null
      }
    }

    return encodeDecode(metadataClass, input.value)
  }

  public static getMetadataBytesFromInput<T>(metadataClass: AnyMetadataClass<T>, input: MetadataInput<T>): Bytes {
    return typeof input.value === 'string'
      ? createType('Bytes', input.value)
      : Utils.metadataToBytes(metadataClass, input.value)
  }

  public static bytesToString(b: Bytes): string {
    return (
      Buffer.from(b.toU8a(true))
        .toString()
        // eslint-disable-next-line no-control-regex
        .replace(/\u0000/g, '')
    )
  }

  public static asText(textOrHex: string): string {
    return Utils.bytesToString(createType('Bytes', textOrHex))
  }

  public static assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
      throw new Error(msg || 'Assertion failed')
    }
  }

  public static hasDuplicates<T>(values: T[] | null | undefined): boolean {
    return !!values && values.length > new Set(values).size
  }

  public static joy(amount: number): BN {
    const oneJoy = new BN(10_000_000_000)
    return new BN(amount).mul(oneJoy)
  }

}

export type MetadataInput<T> = {
  value: T | string
  expectFailure?: boolean
}

