
import { ApiPromise } from "@polkadot/api";
import { AccountFactory } from "../Sender";

export class CouncilContext {
  _api: ApiPromise

  constructor(api: ApiPromise) {
    this._api = api
  }

  public async setupCouncilFromAccounts(accountFactory: AccountFactory, accounts: string[]) {
  }

}
