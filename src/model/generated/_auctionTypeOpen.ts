import assert from "assert"
import * as marshal from "./marshal"

/**
 * Represents Open auction details
 */
export class AuctionTypeOpen {
    public readonly isTypeOf = 'AuctionTypeOpen'
    private _bidLockDuration!: number

    constructor(props?: Partial<Omit<AuctionTypeOpen, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._bidLockDuration = marshal.int.fromJSON(json.bidLockDuration)
        }
    }

    /**
     * Auction bid lock duration
     */
    get bidLockDuration(): number {
        assert(this._bidLockDuration != null, 'uninitialized access')
        return this._bidLockDuration
    }

    set bidLockDuration(value: number) {
        this._bidLockDuration = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            bidLockDuration: this.bidLockDuration,
        }
    }
}
