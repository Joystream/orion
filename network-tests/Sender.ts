import { Keyring } from "@polkadot/api"
import { SubmittableExtrinsic } from "@polkadot/api/types"

export class Sender {
  private readonly _keyPair: KeyringPair

  constructor(keyPair: KeyringPair) {
    this._keyPair = keyPair 
  }

  public async signAndSend(tx: SubmittableExtrinsic<'promise'>) {
    // provide enough balance 
    const dispatchResult = await tx.signAndSend(this._keyPair)
  }
}

export class ExtrinsicResult {
  private findEvent(section: string, name: string) {
  }

  public getEvent(section: string, name: string) {
    this.findEvent(section, name)
  }

  public isSuccess(): Boolean {
    return false;
  }

  public isError(): Boolean {
    return true;
  } 
}


export class AccountFactory {
  private _keyring: Keyring

  constructor(keyring: Keyring) {
    this._keyring = keyring
  }

  // create from Suri 
  public createSenderFromSuri(suri: string): Sender {
    const pair = this._keyring.addFromUri(suri)
    return new Sender(pair)
  }

  public createAddressFromSuri(suri: string): string {
    const pair = this._keyring.addFromUri(suri)
    return pair.address
  }
}
