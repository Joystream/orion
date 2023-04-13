import { ApiPromise, Keyring, SubmittableResult } from '@polkadot/api'
import { SubmittableExtrinsic, SubmittableExtrinsics, QueryableStorage, QueryableConsts } from '@polkadot/api/types'
import AsyncLock from 'async-lock'
import BN from 'bn.js'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'

export class JsNodeApi {
  private _sender: Sender
  private _keyring: Keyring
  private _treasuryAccount: string
  private _api: ApiPromise
  private _uriIndex = 0

  constructor(treasuryAccountUri: string, api: ApiPromise) {
    this._api = api
    this._keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })
    this._sender = new Sender(this._api, this._keyring)
    this._treasuryAccount = this._keyring.addFromUri(treasuryAccountUri).address
  }

  public createTransaction(): TransactionBuilder {
    return new TransactionBuilder(this._sender, this._treasuryAccount, this._api)
  }

  public treasuryAccount(): string {
    return this._treasuryAccount
  }

  public tx(): SubmittableExtrinsics<'promise'> {
    return this._api.tx
  }

  public query(): QueryableStorage<'promise'> {
    return this._api.query
  }

  public const(): QueryableConsts<'promise'> {
    return this._api.consts
  }

  public existentialDeposit(): BN {
    return this.const().balances.existentialDeposit;
  }

  public async addAccountFromUri(uri: string): Promise<string> {
    // TODO review address seed format
    const pair = this._keyring.addFromUri(this._uriIndex + "//" + uri)
    await this.createTransaction()
      .withSender(this._treasuryAccount)
      .withExtrinsic(this.tx().balances.transfer(pair.address, this.existentialDeposit()))
      .execute()

    this._uriIndex += 1
    return pair.address
  }
}

export class TransactionBuilder {
  protected _sender: Sender
  private _treasuryAccount: string
  protected _address: string | undefined
  protected _tx: SubmittableExtrinsic<'promise'> | undefined
  protected _api: ApiPromise

  constructor(sender: Sender, treasuryAccount: string, api: ApiPromise) {
    this._sender = sender
    this._treasuryAccount = treasuryAccount
    this._api = api
  }

  public withExtrinsic(tx: SubmittableExtrinsic<'promise'>): TransactionBuilder {
    this._tx = tx
    return this
  }

  public withSender(address: string): TransactionBuilder {
    this._address = address
    return this
  }

  private async fundFees(): Promise<void> {
    const fee = (await this._tx!.paymentInfo(this._address!)).partialFee
    const fundingTx = this._api.tx.balances.transfer(this._address!, fee)
    await this._sender.signAndSend(this._treasuryAccount, fundingTx)
  }

  private async _execute(): Promise<SubmittableResult | undefined> {
    await this.fundFees()
    return await this._sender.signAndSend(this._address!, this._tx!)
  }

  public async execute(): Promise<SubmittableResult | undefined> {
    if (this._address !== undefined && this._tx !== undefined) {
      return this._execute()
    } else {
      return undefined
    }
  }
}

export class Sender {
  private _locks: AsyncLock
  private _nonceCache: Map<string, number>
  protected _api: ApiPromise
  protected _keyring: Keyring

  constructor(api: ApiPromise, keyring: Keyring) {
    this._locks = new AsyncLock()
    this._nonceCache = new Map()
    this._api = api
    this._keyring = keyring
  }

  public async signAndSend(
    address: string,
    tx: SubmittableExtrinsic<'promise'>,
    tip?: BN
  ): Promise<SubmittableResult | undefined> {
    let txResult: SubmittableResult | undefined
    let unsubscribe: () => void
    let finalized: { (result: SubmittableResult): void }
    const pair = this._keyring.getPair(address)

    tx.signAndSend(pair, (result: SubmittableResult) => {
      if (result.status.isFuture) {
        // Its virtually impossible for us to continue with tests
        // when this occurs and we don't expect the tests to handle this correctly
        // so just abort!
        console.error('Future Tx, aborting!')
        process.exit(-1)
      }

      if (!(result.status.isInBlock || result.status.isFinalized)) {
        return
      }

      txResult = result

      const success = result.findRecord('system', 'ExtrinsicSuccess')
      const failed = result.findRecord('system', 'ExtrinsicFailed')

      if (success || failed) {
        if (unsubscribe) {
          unsubscribe()
        }
        finalized(result)
      }
    })

    // await this._locks.acquire(`nonce-${address}`, async () => {
    //   // nonce acquisition
    //   const nodeNonce = await this._api.rpc.system.accountNextIndex(address)
    //   const cachedNonce = this._nonceCache.get(address)
    //   const nonce = BN.max(nodeNonce, new BN(cachedNonce || 0))

    //   // signing
    //   console.log(`pair : ${JSON.stringify(pair.toJson())}`)
    //   const signedTx = await tx.signAsync(pair, { nonce, tip })
    //   const { section, method } = signedTx.method

    //   // sending
    //   await signedTx.send((result: SubmittableResult) => {
    //     if (result.status.isFuture) {
    //       // Its virtually impossible for us to continue with tests
    //       // when this occurs and we don't expect the tests to handle this correctly
    //       // so just abort!
    //       console.error('Future Tx, aborting!')
    //       process.exit(-1)
    //     }

    //     if (!(result.status.isInBlock || result.status.isFinalized)) {
    //       return 
    //     }

    //     txResult = result

    //     const success = result.findRecord('system', 'ExtrinsicSuccess')
    //     const failed = result.findRecord('system', 'ExtrinsicFailed')

    //     if (success || failed) {
    //       if (unsubscribe) {
    //         unsubscribe()
    //       }
    //       finalized(result)
    //     }
    //   })

    //   // set nonce
    //   this._nonceCache.set(address, nonce.toNumber() + 1)
    // })

    return txResult
  }
}
