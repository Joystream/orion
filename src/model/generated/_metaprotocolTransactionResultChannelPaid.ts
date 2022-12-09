import assert from "assert"
import * as marshal from "./marshal"
import {Channel} from "./channel.model"

export class MetaprotocolTransactionResultChannelPaid {
    public readonly isTypeOf = 'MetaprotocolTransactionResultChannelPaid'
    private _channelPaid!: string | undefined | null

    constructor(props?: Partial<Omit<MetaprotocolTransactionResultChannelPaid, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._channelPaid = json.channelPaid == null ? undefined : marshal.string.fromJSON(json.channelPaid)
        }
    }

    get channelPaid(): string | undefined | null {
        return this._channelPaid
    }

    set channelPaid(value: string | undefined | null) {
        this._channelPaid = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            channelPaid: this.channelPaid,
        }
    }
}
