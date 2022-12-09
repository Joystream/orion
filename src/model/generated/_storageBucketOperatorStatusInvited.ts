import assert from "assert"
import * as marshal from "./marshal"

export class StorageBucketOperatorStatusInvited {
    public readonly isTypeOf = 'StorageBucketOperatorStatusInvited'
    private _workerId!: number

    constructor(props?: Partial<Omit<StorageBucketOperatorStatusInvited, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._workerId = marshal.int.fromJSON(json.workerId)
        }
    }

    get workerId(): number {
        assert(this._workerId != null, 'uninitialized access')
        return this._workerId
    }

    set workerId(value: number) {
        this._workerId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            workerId: this.workerId,
        }
    }
}
