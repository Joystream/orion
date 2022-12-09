import assert from "assert"
import * as marshal from "./marshal"

/**
 * Represents English auction details
 */
export class AuctionTypeEnglish {
    public readonly isTypeOf = 'AuctionTypeEnglish'
    private _duration!: number
    private _extensionPeriod!: number
    private _plannedEndAtBlock!: number
    private _minimalBidStep!: bigint

    constructor(props?: Partial<Omit<AuctionTypeEnglish, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._duration = marshal.int.fromJSON(json.duration)
            this._extensionPeriod = marshal.int.fromJSON(json.extensionPeriod)
            this._plannedEndAtBlock = marshal.int.fromJSON(json.plannedEndAtBlock)
            this._minimalBidStep = marshal.bigint.fromJSON(json.minimalBidStep)
        }
    }

    /**
     * English auction duration in blocks
     */
    get duration(): number {
        assert(this._duration != null, 'uninitialized access')
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }

    /**
     * Auction extension period in blocks
     */
    get extensionPeriod(): number {
        assert(this._extensionPeriod != null, 'uninitialized access')
        return this._extensionPeriod
    }

    set extensionPeriod(value: number) {
        this._extensionPeriod = value
    }

    /**
     * Block when auction is supposed to end
     */
    get plannedEndAtBlock(): number {
        assert(this._plannedEndAtBlock != null, 'uninitialized access')
        return this._plannedEndAtBlock
    }

    set plannedEndAtBlock(value: number) {
        this._plannedEndAtBlock = value
    }

    /**
     * Minimal step between auction bids
     */
    get minimalBidStep(): bigint {
        assert(this._minimalBidStep != null, 'uninitialized access')
        return this._minimalBidStep
    }

    set minimalBidStep(value: bigint) {
        this._minimalBidStep = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            duration: this.duration,
            extensionPeriod: this.extensionPeriod,
            plannedEndAtBlock: this.plannedEndAtBlock,
            minimalBidStep: marshal.bigint.toJSON(this.minimalBidStep),
        }
    }
}
