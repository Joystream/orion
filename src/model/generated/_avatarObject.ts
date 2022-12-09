import assert from "assert"
import * as marshal from "./marshal"
import {StorageDataObject} from "./storageDataObject.model"

export class AvatarObject {
    public readonly isTypeOf = 'AvatarObject'
    private _avatarObject!: string

    constructor(props?: Partial<Omit<AvatarObject, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._avatarObject = marshal.string.fromJSON(json.avatarObject)
        }
    }

    /**
     * The avatar data object
     */
    get avatarObject(): string {
        assert(this._avatarObject != null, 'uninitialized access')
        return this._avatarObject
    }

    set avatarObject(value: string) {
        this._avatarObject = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            avatarObject: this.avatarObject,
        }
    }
}
