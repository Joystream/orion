import assert from "assert"
import * as marshal from "./marshal"
import {OwnedNft} from "./ownedNft.model"
import {ContentActor, fromJsonContentActor} from "./_contentActor"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class BuyNowPriceUpdatedEventData {
    public readonly isTypeOf = 'BuyNowPriceUpdatedEventData'
    private _nft!: string
    private _actor!: ContentActor
    private _nftOwner!: NftOwner
    private _newPrice!: bigint

    constructor(props?: Partial<Omit<BuyNowPriceUpdatedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._nft = marshal.string.fromJSON(json.nft)
            this._actor = fromJsonContentActor(json.actor)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
            this._newPrice = marshal.bigint.fromJSON(json.newPrice)
        }
    }

    /**
     * NFT being sold
     */
    get nft(): string {
        assert(this._nft != null, 'uninitialized access')
        return this._nft
    }

    set nft(value: string) {
        this._nft = value
    }

    /**
     * Content actor acting as NFT owner.
     */
    get actor(): ContentActor {
        assert(this._actor != null, 'uninitialized access')
        return this._actor
    }

    set actor(value: ContentActor) {
        this._actor = value
    }

    /**
     * NFT owner at the time it was on sale
     */
    get nftOwner(): NftOwner {
        assert(this._nftOwner != null, 'uninitialized access')
        return this._nftOwner
    }

    set nftOwner(value: NftOwner) {
        this._nftOwner = value
    }

    /**
     * New sell order price.
     */
    get newPrice(): bigint {
        assert(this._newPrice != null, 'uninitialized access')
        return this._newPrice
    }

    set newPrice(value: bigint) {
        this._newPrice = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            nft: this.nft,
            actor: this.actor.toJSON(),
            nftOwner: this.nftOwner.toJSON(),
            newPrice: marshal.bigint.toJSON(this.newPrice),
        }
    }
}
