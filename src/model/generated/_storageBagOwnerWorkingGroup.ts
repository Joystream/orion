import assert from "assert"
import * as marshal from "./marshal"

export class StorageBagOwnerWorkingGroup {
    public readonly isTypeOf = 'StorageBagOwnerWorkingGroup'
    private _workingGroupId!: string | undefined | null

    constructor(props?: Partial<Omit<StorageBagOwnerWorkingGroup, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._workingGroupId = json.workingGroupId == null ? undefined : marshal.string.fromJSON(json.workingGroupId)
        }
    }

    get workingGroupId(): string | undefined | null {
        return this._workingGroupId
    }

    set workingGroupId(value: string | undefined | null) {
        this._workingGroupId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            workingGroupId: this.workingGroupId,
        }
    }
}
