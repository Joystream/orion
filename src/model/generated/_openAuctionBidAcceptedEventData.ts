import assert from "assert"
import * as marshal from "./marshal"
import {ContentActor, fromJsonContentActor} from "./_contentActor"
import {Bid} from "./bid.model"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class OpenAuctionBidAcceptedEventData {
    public readonly isTypeOf = 'OpenAuctionBidAcceptedEventData'
    private _actor!: ContentActor
    private _winningBid!: string
    private _previousNftOwner!: NftOwner

    constructor(props?: Partial<Omit<OpenAuctionBidAcceptedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._actor = fromJsonContentActor(json.actor)
            this._winningBid = marshal.string.fromJSON(json.winningBid)
            this._previousNftOwner = fromJsonNftOwner(json.previousNftOwner)
        }
    }

    /**
     * Content actor that accepted the bid.
     */
    get actor(): ContentActor {
        assert(this._actor != null, 'uninitialized access')
        return this._actor
    }

    set actor(value: ContentActor) {
        this._actor = value
    }

    /**
     * Accepted/winning bid
     */
    get winningBid(): string {
        assert(this._winningBid != null, 'uninitialized access')
        return this._winningBid
    }

    set winningBid(value: string) {
        this._winningBid = value
    }

    /**
     * NFT owner before the auction was completed
     */
    get previousNftOwner(): NftOwner {
        assert(this._previousNftOwner != null, 'uninitialized access')
        return this._previousNftOwner
    }

    set previousNftOwner(value: NftOwner) {
        this._previousNftOwner = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            actor: this.actor.toJSON(),
            winningBid: this.winningBid,
            previousNftOwner: this.previousNftOwner.toJSON(),
        }
    }
}
