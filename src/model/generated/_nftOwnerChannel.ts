import assert from "assert"
import * as marshal from "./marshal"
import {Channel} from "./channel.model"

export class NftOwnerChannel {
    public readonly isTypeOf = 'NftOwnerChannel'
    private _channel!: string

    constructor(props?: Partial<Omit<NftOwnerChannel, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._channel = marshal.string.fromJSON(json.channel)
        }
    }

    get channel(): string {
        assert(this._channel != null, 'uninitialized access')
        return this._channel
    }

    set channel(value: string) {
        this._channel = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            channel: this.channel,
        }
    }
}
