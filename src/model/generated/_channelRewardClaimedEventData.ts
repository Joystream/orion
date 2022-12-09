import assert from "assert"
import * as marshal from "./marshal"
import {Channel} from "./channel.model"

export class ChannelRewardClaimedEventData {
    public readonly isTypeOf = 'ChannelRewardClaimedEventData'
    private _channel!: string
    private _amount!: bigint

    constructor(props?: Partial<Omit<ChannelRewardClaimedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._channel = marshal.string.fromJSON(json.channel)
            this._amount = marshal.bigint.fromJSON(json.amount)
        }
    }

    /**
     * The channel that claimed the reward
     */
    get channel(): string {
        assert(this._channel != null, 'uninitialized access')
        return this._channel
    }

    set channel(value: string) {
        this._channel = value
    }

    /**
     * Reward amount claimed
     */
    get amount(): bigint {
        assert(this._amount != null, 'uninitialized access')
        return this._amount
    }

    set amount(value: bigint) {
        this._amount = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            channel: this.channel,
            amount: marshal.bigint.toJSON(this.amount),
        }
    }
}
