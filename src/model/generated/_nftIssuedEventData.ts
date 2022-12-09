import assert from "assert"
import * as marshal from "./marshal"
import {ContentActor, fromJsonContentActor} from "./_contentActor"
import {OwnedNft} from "./ownedNft.model"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class NftIssuedEventData {
    public readonly isTypeOf = 'NftIssuedEventData'
    private _actor!: ContentActor
    private _nft!: string
    private _nftOwner!: NftOwner

    constructor(props?: Partial<Omit<NftIssuedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._actor = fromJsonContentActor(json.actor)
            this._nft = marshal.string.fromJSON(json.nft)
            this._nftOwner = fromJsonNftOwner(json.nftOwner)
        }
    }

    /**
     * Actor that issued the NFT.
     */
    get actor(): ContentActor {
        assert(this._actor != null, 'uninitialized access')
        return this._actor
    }

    set actor(value: ContentActor) {
        this._actor = value
    }

    /**
     * NFT that was issued.
     */
    get nft(): string {
        assert(this._nft != null, 'uninitialized access')
        return this._nft
    }

    set nft(value: string) {
        this._nft = value
    }

    /**
     * NFT's initial owner.
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
            actor: this.actor.toJSON(),
            nft: this.nft,
            nftOwner: this.nftOwner.toJSON(),
        }
    }
}
