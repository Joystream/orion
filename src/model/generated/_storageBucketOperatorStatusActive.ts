import assert from "assert"
import * as marshal from "./marshal"

export class StorageBucketOperatorStatusActive {
    public readonly isTypeOf = 'StorageBucketOperatorStatusActive'
    private _workerId!: number
    private _transactorAccountId!: string

    constructor(props?: Partial<Omit<StorageBucketOperatorStatusActive, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._workerId = marshal.int.fromJSON(json.workerId)
            this._transactorAccountId = marshal.string.fromJSON(json.transactorAccountId)
        }
    }

    get workerId(): number {
        assert(this._workerId != null, 'uninitialized access')
        return this._workerId
    }

    set workerId(value: number) {
        this._workerId = value
    }

    get transactorAccountId(): string {
        assert(this._transactorAccountId != null, 'uninitialized access')
        return this._transactorAccountId
    }

    set transactorAccountId(value: string) {
        this._transactorAccountId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            workerId: this.workerId,
            transactorAccountId: this.transactorAccountId,
        }
    }
}
