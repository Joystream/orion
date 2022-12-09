import assert from "assert"
import * as marshal from "./marshal"
import {OwnedNft} from "./ownedNft.model"
import {ContentActor, fromJsonContentActor} from "./_contentActor"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class BuyNowCanceledEventData {
    public readonly isTypeOf = 'BuyNowCanceledEventData'
    private _nft!: string
    private _actor!: ContentActor
    private _nftOwner!: NftOwner

    constructor(props?: Partial<Omit<BuyNowCanceledEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._nft = marshal.string.fromJSON(json.nft)
            this._actor = fromJsonContentActor(json.actor)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
        }
    }

    /**
     * The NFT for which the buy now offer was canceled
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
     * Owner of the NFT at the time the buy now offer was canceled.
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
            nft: this.nft,
            actor: this.actor.toJSON(),
            nftOwner: this.nftOwner.toJSON(),
        }
    }
}
