import assert from "assert"
import * as marshal from "./marshal"
import {OwnedNft} from "./ownedNft.model"
import {Membership} from "./membership.model"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"

export class NftBoughtEventData {
    public readonly isTypeOf = 'NftBoughtEventData'
    private _nft!: string
    private _buyer!: string
    private _previousNftOwner!: NftOwner
    private _price!: bigint

    constructor(props?: Partial<Omit<NftBoughtEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._nft = marshal.string.fromJSON(json.nft)
            this._buyer = marshal.string.fromJSON(json.buyer)
            this._previousNftOwner = fromJsonNftOwner(json.previousNftOwner)
            this._price = marshal.bigint.fromJSON(json.price)
        }
    }

    /**
     * The NFT that was bought
     */
    get nft(): string {
        assert(this._nft != null, 'uninitialized access')
        return this._nft
    }

    set nft(value: string) {
        this._nft = value
    }

    /**
     * Member that bought the NFT.
     */
    get buyer(): string {
        assert(this._buyer != null, 'uninitialized access')
        return this._buyer
    }

    set buyer(value: string) {
        this._buyer = value
    }

    /**
     * NFT owner before it was bought
     */
    get previousNftOwner(): NftOwner {
        assert(this._previousNftOwner != null, 'uninitialized access')
        return this._previousNftOwner
    }

    set previousNftOwner(value: NftOwner) {
        this._previousNftOwner = value
    }

    /**
     * Price for which the NFT was bought
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
            buyer: this.buyer,
            previousNftOwner: this.previousNftOwner.toJSON(),
            price: marshal.bigint.toJSON(this.price),
        }
    }
}
