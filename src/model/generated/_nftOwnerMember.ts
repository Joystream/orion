import assert from "assert"
import * as marshal from "./marshal"
import {Membership} from "./membership.model"

export class NftOwnerMember {
    public readonly isTypeOf = 'NftOwnerMember'
    private _member!: string

    constructor(props?: Partial<Omit<NftOwnerMember, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._member = marshal.string.fromJSON(json.member)
        }
    }

    get member(): string {
        assert(this._member != null, 'uninitialized access')
        return this._member
    }

    set member(value: string) {
        this._member = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            member: this.member,
        }
    }
}
