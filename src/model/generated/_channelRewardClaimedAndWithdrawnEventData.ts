import assert from "assert"
import * as marshal from "./marshal"
import {Channel} from "./channel.model"
import {ContentActor, fromJsonContentActor} from "./_contentActor"

export class ChannelRewardClaimedAndWithdrawnEventData {
    public readonly isTypeOf = 'ChannelRewardClaimedAndWithdrawnEventData'
    private _channel!: string
    private _amount!: bigint
    private _account!: string | undefined | null
    private _actor!: ContentActor

    constructor(props?: Partial<Omit<ChannelRewardClaimedAndWithdrawnEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._channel = marshal.string.fromJSON(json.channel)
            this._amount = marshal.bigint.fromJSON(json.amount)
            this._account = json.account == null ? undefined : marshal.string.fromJSON(json.account)
            this._actor = fromJsonContentActor(json.actor)
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

    /**
     * Destination account ID. Null if claimed by curators' channel (paid to council budget in this case)
     */
    get account(): string | undefined | null {
        return this._account
    }

    set account(value: string | undefined | null) {
        this._account = value
    }

    /**
     * Content actor
     */
    get actor(): ContentActor {
        assert(this._actor != null, 'uninitialized access')
        return this._actor
    }

    set actor(value: ContentActor) {
        this._actor = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            channel: this.channel,
            amount: marshal.bigint.toJSON(this.amount),
            account: this.account,
            actor: this.actor.toJSON(),
        }
    }
}
