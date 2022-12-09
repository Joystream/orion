import assert from "assert"
import * as marshal from "./marshal"
import {ContentActor, fromJsonContentActor} from "./_contentActor"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"
import {Auction} from "./auction.model"

export class EnglishAuctionStartedEventData {
    public readonly isTypeOf = 'EnglishAuctionStartedEventData'
    private _actor!: ContentActor
    private _nftOwner!: NftOwner
    private _auction!: string

    constructor(props?: Partial<Omit<EnglishAuctionStartedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._actor = fromJsonContentActor(json.actor)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
            this._auction = marshal.string.fromJSON(json.auction)
        }
    }

    /**
     * Actor that started this auction.
     */
    get actor(): ContentActor {
        assert(this._actor != null, 'uninitialized access')
        return this._actor
    }

    set actor(value: ContentActor) {
        this._actor = value
    }

    /**
     * Nft owner at the time it was put on an auction.
     */
    get nftOwner(): NftOwner {
        assert(this._nftOwner != null, 'uninitialized access')
        return this._nftOwner
    }

    set nftOwner(value: NftOwner) {
        this._nftOwner = value
    }

    /**
     * Auction started.
     */
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
            actor: this.actor.toJSON(),
            nftOwner: this.nftOwner.toJSON(),
            auction: this.auction,
        }
    }
}
