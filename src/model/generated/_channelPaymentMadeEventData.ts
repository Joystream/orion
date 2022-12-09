import assert from "assert"
import * as marshal from "./marshal"
import {Membership} from "./membership.model"
import {PaymentContext, fromJsonPaymentContext} from "./_paymentContext"
import {Channel} from "./channel.model"

/**
 * Direct channel payment by any member by-passing the council payouts
 */
export class ChannelPaymentMadeEventData {
    public readonly isTypeOf = 'ChannelPaymentMadeEventData'
    private _payer!: string
    private _amount!: bigint
    private _paymentContext!: PaymentContext | undefined | null
    private _payeeChannel!: string | undefined | null
    private _rationale!: string | undefined | null

    constructor(props?: Partial<Omit<ChannelPaymentMadeEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._payer = marshal.string.fromJSON(json.payer)
            this._amount = marshal.bigint.fromJSON(json.amount)
            this._paymentContext = json.paymentContext == null ? undefined : fromJsonPaymentContext(json.paymentContext)
            this._payeeChannel = json.payeeChannel == null ? undefined : marshal.string.fromJSON(json.payeeChannel)
            this._rationale = json.rationale == null ? undefined : marshal.string.fromJSON(json.rationale)
        }
    }

    /**
     * Actor that made the payment
     */
    get payer(): string {
        assert(this._payer != null, 'uninitialized access')
        return this._payer
    }

    set payer(value: string) {
        this._payer = value
    }

    /**
     * Amount of the payment
     */
    get amount(): bigint {
        assert(this._amount != null, 'uninitialized access')
        return this._amount
    }

    set amount(value: bigint) {
        this._amount = value
    }

    /**
     * Payment and payee context
     */
    get paymentContext(): PaymentContext | undefined | null {
        return this._paymentContext
    }

    set paymentContext(value: PaymentContext | undefined | null) {
        this._paymentContext = value
    }

    /**
     * Channel that received the payment (if any)
     */
    get payeeChannel(): string | undefined | null {
        return this._payeeChannel
    }

    set payeeChannel(value: string | undefined | null) {
        this._payeeChannel = value
    }

    /**
     * Reason of the payment
     */
    get rationale(): string | undefined | null {
        return this._rationale
    }

    set rationale(value: string | undefined | null) {
        this._rationale = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            payer: this.payer,
            amount: marshal.bigint.toJSON(this.amount),
            paymentContext: this.paymentContext == null ? undefined : this.paymentContext.toJSON(),
            payeeChannel: this.payeeChannel,
            rationale: this.rationale,
        }
    }
}
