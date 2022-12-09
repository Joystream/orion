import assert from "assert"
import * as marshal from "./marshal"
import {Bid} from "./bid.model"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class AuctionBidMadeEventData {
    public readonly isTypeOf = 'AuctionBidMadeEventData'
    private _bid!: string
    private _nftOwner!: NftOwner

    constructor(props?: Partial<Omit<AuctionBidMadeEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._bid = marshal.string.fromJSON(json.bid)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
        }
    }

    /**
     * The bid that was submitted 
     */
    get bid(): string {
        assert(this._bid != null, 'uninitialized access')
        return this._bid
    }

    set bid(value: string) {
        this._bid = value
    }

    /**
     * Nft owner at the time it was being auctioned.
     */
    get nftOwner(): NftOwner {
        assert(this._nftOwner != null, 'uninitialized access')
        return this._nftOwner
    }

    set nftOwner(value: NftOwner) {
        this._nftOwner = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            bid: this.bid,
            nftOwner: this.nftOwner.toJSON(),
        }
    }
}
