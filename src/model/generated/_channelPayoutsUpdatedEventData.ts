import assert from "assert"
import * as marshal from "./marshal"
import {StorageDataObject} from "./storageDataObject.model"

export class ChannelPayoutsUpdatedEventData {
    public readonly isTypeOf = 'ChannelPayoutsUpdatedEventData'
    private _commitment!: string | undefined | null
    private _payloadDataObject!: string | undefined | null
    private _minCashoutAllowed!: bigint | undefined | null
    private _maxCashoutAllowed!: bigint | undefined | null
    private _channelCashoutsEnabled!: boolean | undefined | null

    constructor(props?: Partial<Omit<ChannelPayoutsUpdatedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._commitment = json.commitment == null ? undefined : marshal.string.fromJSON(json.commitment)
            this._payloadDataObject = json.payloadDataObject == null ? undefined : marshal.string.fromJSON(json.payloadDataObject)
            this._minCashoutAllowed = json.minCashoutAllowed == null ? undefined : marshal.bigint.fromJSON(json.minCashoutAllowed)
            this._maxCashoutAllowed = json.maxCashoutAllowed == null ? undefined : marshal.bigint.fromJSON(json.maxCashoutAllowed)
            this._channelCashoutsEnabled = json.channelCashoutsEnabled == null ? undefined : marshal.boolean.fromJSON(json.channelCashoutsEnabled)
        }
    }

    /**
     * Merkle root of the channel payouts
     */
    get commitment(): string | undefined | null {
        return this._commitment
    }

    set commitment(value: string | undefined | null) {
        this._commitment = value
    }

    /**
     * Storage data object corresponding to the channel payouts payload
     */
    get payloadDataObject(): string | undefined | null {
        return this._payloadDataObject
    }

    set payloadDataObject(value: string | undefined | null) {
        this._payloadDataObject = value
    }

    /**
     * Minimum amount of channel reward cashout allowed at a time
     */
    get minCashoutAllowed(): bigint | undefined | null {
        return this._minCashoutAllowed
    }

    set minCashoutAllowed(value: bigint | undefined | null) {
        this._minCashoutAllowed = value
    }

    /**
     * Maximum amount of channel reward cashout allowed at a time
     */
    get maxCashoutAllowed(): bigint | undefined | null {
        return this._maxCashoutAllowed
    }

    set maxCashoutAllowed(value: bigint | undefined | null) {
        this._maxCashoutAllowed = value
    }

    /**
     * Can channel cashout the rewards
     */
    get channelCashoutsEnabled(): boolean | undefined | null {
        return this._channelCashoutsEnabled
    }

    set channelCashoutsEnabled(value: boolean | undefined | null) {
        this._channelCashoutsEnabled = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            commitment: this.commitment,
            payloadDataObject: this.payloadDataObject,
            minCashoutAllowed: this.minCashoutAllowed == null ? undefined : marshal.bigint.toJSON(this.minCashoutAllowed),
            maxCashoutAllowed: this.maxCashoutAllowed == null ? undefined : marshal.bigint.toJSON(this.maxCashoutAllowed),
            channelCashoutsEnabled: this.channelCashoutsEnabled,
        }
    }
}
