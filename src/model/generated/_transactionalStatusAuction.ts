import assert from "assert"
import * as marshal from "./marshal"
import {Auction} from "./auction.model"

/**
 * Represents TransactionalStatus Auction
 */
export class TransactionalStatusAuction {
    public readonly isTypeOf = 'TransactionalStatusAuction'
    private _auction!: string

    constructor(props?: Partial<Omit<TransactionalStatusAuction, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._auction = marshal.string.fromJSON(json.auction)
        }
    }

    get auction(): string {
        assert(this._auction != null, 'uninitialized access')
        return this._auction
    }

    set auction(value: string) {
        this._auction = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            auction: this.auction,
        }
    }
}
