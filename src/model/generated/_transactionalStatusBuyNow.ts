import assert from "assert"
import * as marshal from "./marshal"

/**
 * Represents TransactionalStatus BuyNow
 */
export class TransactionalStatusBuyNow {
    public readonly isTypeOf = 'TransactionalStatusBuyNow'
    private _price!: bigint

    constructor(props?: Partial<Omit<TransactionalStatusBuyNow, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._price = marshal.bigint.fromJSON(json.price)
        }
    }

    get price(): bigint {
        assert(this._price != null, 'uninitialized access')
        return this._price
    }

    set price(value: bigint) {
        this._price = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            price: marshal.bigint.toJSON(this.price),
        }
    }
}
