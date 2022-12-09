import assert from "assert"
import * as marshal from "./marshal"
import {Membership} from "./membership.model"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"
import {Bid} from "./bid.model"

export class AuctionBidCanceledEventData {
    public readonly isTypeOf = 'AuctionBidCanceledEventData'
    private _member!: string
    private _nftOwner!: NftOwner
    private _bid!: string

    constructor(props?: Partial<Omit<AuctionBidCanceledEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._member = marshal.string.fromJSON(json.member)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
            this._bid = marshal.string.fromJSON(json.bid)
        }
    }

    /**
     * Member that canceled the bid.
     */
    get member(): string {
        assert(this._member != null, 'uninitialized access')
        return this._member
    }

    set member(value: string) {
        this._member = value
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

    /**
     * The bid that got canceled.
     */
    get bid(): string {
        assert(this._bid != null, 'uninitialized access')
        return this._bid
    }

    set bid(value: string) {
        this._bid = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            member: this.member,
            nftOwner: this.nftOwner.toJSON(),
            bid: this.bid,
        }
    }
}
