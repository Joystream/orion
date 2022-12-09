import assert from "assert"
import * as marshal from "./marshal"

export class StorageBagOwnerDAO {
    public readonly isTypeOf = 'StorageBagOwnerDAO'
    private _daoId!: number | undefined | null

    constructor(props?: Partial<Omit<StorageBagOwnerDAO, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = json.daoId == null ? undefined : marshal.int.fromJSON(json.daoId)
        }
    }

    get daoId(): number | undefined | null {
        return this._daoId
    }

    set daoId(value: number | undefined | null) {
        this._daoId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            daoId: this.daoId,
        }
    }
}
