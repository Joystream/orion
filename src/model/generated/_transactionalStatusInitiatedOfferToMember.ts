import assert from "assert"
import * as marshal from "./marshal"
import {Membership} from "./membership.model"

/**
 * Represents TransactionalStatus InitiatedOfferToMember
 */
export class TransactionalStatusInitiatedOfferToMember {
    public readonly isTypeOf = 'TransactionalStatusInitiatedOfferToMember'
    private _member!: string
    private _price!: bigint | undefined | null

    constructor(props?: Partial<Omit<TransactionalStatusInitiatedOfferToMember, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._member = marshal.string.fromJSON(json.member)
            this._price = json.price == null ? undefined : marshal.bigint.fromJSON(json.price)
        }
    }

    /**
     * Member that recieved the offer
     */
    get member(): string {
        assert(this._member != null, 'uninitialized access')
        return this._member
    }

    set member(value: string) {
        this._member = value
    }

    /**
     * The price that the member should pay to accept offer (optional)
     */
    get price(): bigint | undefined | null {
        return this._price
    }

    set price(value: bigint | undefined | null) {
        this._price = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            member: this.member,
            price: this.price == null ? undefined : marshal.bigint.toJSON(this.price),
        }
    }
}
