import { ApiPromise } from "@polkadot/api";
import { ISubmittableResult } from '@polkadot/types/types/'
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types"
import { EventRecord } from '@polkadot/types/interfaces'
import AsyncLock from "async-lock";
import BN from "bn.js";

export class TransactionBuilder {
  protected _sender: Sender
  protected _pair: KeyringPair | undefined
  protected _tx: SubmittableExtrinsic<'promise'> | undefined

  constructor(sender: Sender) {
    this._sender = sender
  }

  public extrinsic(tx: SubmittableExtrinsic<'promise'>) {
    this._tx = tx
  }

  public senderKeyPair<KeyPair extends KeyringPair>(pair: KeyringPair) {
    this._pair = pair
  }

  public async execute(): Promise<TxResult | undefined> {
    if (this._pair !== undefined && this._tx !== undefined) {
      return await this._sender.signAndSend(this._pair!, this._tx!);
    } else {
      return undefined;
    }
  }

}

enum ExecutionOutcome {
  Ok,
  Error,
}
export type TxExecutionResult = {
  outcome: ExecutionOutcome | undefined
  eventData: EventRecord | undefined
}
export class TxResult {
  private _outcome: ExecutionOutcome
  private _eventData: EventRecord | undefined

  constructor(outcome: ExecutionOutcome, eventData: EventRecord | undefined) {
    this._outcome = outcome
    this._eventData = eventData
  }

  get isOk(): Boolean {
    return this._outcome === ExecutionOutcome.Ok;
  }

  get isErr(): Boolean {
    return this.isOk!;
  }

  get event(): EventRecord | undefined {
    return this._eventData;
  }
}

export class Sender {
  private _locks: AsyncLock
  private _nonceCache: Map<string, number>
  protected _api: ApiPromise

  constructor(api: ApiPromise) {
    this._locks = new AsyncLock()
    this._nonceCache = new Map()
    this._api = api
  }

  public async signAndSend<KeyPair extends KeyringPair>(pair: KeyPair, tx: SubmittableExtrinsic<'promise'>, tip?: BN): Promise<TxResult | undefined> {
    const stringAddr = pair.address.toString()
    let txResult: TxExecutionResult = { outcome: undefined, eventData: undefined }
    let unsubscribe: () => void
    let finalized: { (result: ISubmittableResult): void }

    await this._locks.acquire(`nonce-${stringAddr}`, async () => {
      // nonce acquisition
      const nodeNonce = await this._api.rpc.system.accountNextIndex(stringAddr)
      const cachedNonce = this._nonceCache.get(stringAddr)
      const nonce = BN.max(nodeNonce, new BN(cachedNonce || 0))

      // signing
      const signedTx = tx.sign(pair, { nonce, tip })
      const { section, method } = signedTx.method

      // sending
      await signedTx.send((result: ISubmittableResult) => {
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

        const success = result.findRecord('system', 'ExtrinsicSuccess')
        const failed = result.findRecord('system', 'ExtrinsicFailed')

        txResult.outcome = success ? ExecutionOutcome.Ok : ExecutionOutcome.Error
        if (success) {
          txResult.eventData = result.findRecord(section, method)
        }

        if (success || failed) {
          if (unsubscribe) {
            unsubscribe()
          }
          finalized(result)
        }
      })

      // set nonce
      this._nonceCache.set(stringAddr, nonce.toNumber() + 1)
    })

    if (txResult.outcome !== undefined) {
      return new TxResult(txResult.outcome, txResult.eventData)
    } else {
      return undefined
    }
  }
}
