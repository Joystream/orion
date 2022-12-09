import assert from "assert"
import * as marshal from "./marshal"
import {OwnedNft} from "./ownedNft.model"
import {ContentActor, fromJsonContentActor} from "./_contentActor"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class NftSellOrderMadeEventData {
    public readonly isTypeOf = 'NftSellOrderMadeEventData'
    private _nft!: string
    private _actor!: ContentActor
    private _nftOwner!: NftOwner
    private _price!: bigint

    constructor(props?: Partial<Omit<NftSellOrderMadeEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._nft = marshal.string.fromJSON(json.nft)
            this._actor = fromJsonContentActor(json.actor)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
            this._price = marshal.bigint.fromJSON(json.price)
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
     * NFT owner at the time it was put on sale
     */
    get nftOwner(): NftOwner {
        assert(this._nftOwner != null, 'uninitialized access')
        return this._nftOwner
    }

    set nftOwner(value: NftOwner) {
        this._nftOwner = value
    }

    /**
     * Offer's price.
     */
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
            nft: this.nft,
            actor: this.actor.toJSON(),
            nftOwner: this.nftOwner.toJSON(),
            price: marshal.bigint.toJSON(this.price),
        }
    }
}
