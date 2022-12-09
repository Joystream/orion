import assert from "assert"
import * as marshal from "./marshal"

export class StorageBagOwnerMember {
    public readonly isTypeOf = 'StorageBagOwnerMember'
    private _memberId!: string

    constructor(props?: Partial<Omit<StorageBagOwnerMember, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._memberId = marshal.string.fromJSON(json.memberId)
        }
    }

    get memberId(): string {
        assert(this._memberId != null, 'uninitialized access')
        return this._memberId
    }

    set memberId(value: string) {
        this._memberId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            memberId: this.memberId,
        }
    }
}
