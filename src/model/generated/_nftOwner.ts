import {NftOwnerChannel} from "./_nftOwnerChannel"
import {NftOwnerMember} from "./_nftOwnerMember"

export type NftOwner = NftOwnerChannel | NftOwnerMember

export function fromJsonNftOwner(json: any): NftOwner {
    switch(json?.isTypeOf) {
        case 'NftOwnerChannel': return new NftOwnerChannel(undefined, json)
        case 'NftOwnerMember': return new NftOwnerMember(undefined, json)
        default: throw new TypeError('Unknown json object passed as NftOwner')
    }
}
