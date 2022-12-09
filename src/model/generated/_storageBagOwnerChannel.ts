import assert from "assert"
import * as marshal from "./marshal"

export class StorageBagOwnerChannel {
    public readonly isTypeOf = 'StorageBagOwnerChannel'
    private _channelId!: string

    constructor(props?: Partial<Omit<StorageBagOwnerChannel, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._channelId = marshal.string.fromJSON(json.channelId)
        }
    }

    get channelId(): string {
        assert(this._channelId != null, 'uninitialized access')
        return this._channelId
    }

    set channelId(value: string) {
        this._channelId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            channelId: this.channelId,
        }
    }
}
