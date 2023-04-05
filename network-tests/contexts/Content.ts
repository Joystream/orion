import { ApiPromise } from "@polkadot/api";
import { Sender } from "../Sender";

export class ContentContext {
  _api: ApiPromise

  constructor(api: ApiPromise) {
    this._api = api
  }

  public async setupMemberChannelCreatedBy(sender: Sender) {
    // set up parameters
    const tx = this._api.tx.content.createChannel()
    const res = await sender.signAndSend(tx)
    // assert res is ok
  }

  public async setupCuratorChannelCreatedBy(sender: Sender) {
    // set up parameters
    const tx = this._api.tx.content.createChannel()
    const res = await sender.signAndSend(tx)
    // assert res is ok
  }
}
