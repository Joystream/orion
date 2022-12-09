import assert from "assert"
import * as marshal from "./marshal"

export class AvatarUri {
    public readonly isTypeOf = 'AvatarUri'
    private _avatarUri!: string

    constructor(props?: Partial<Omit<AvatarUri, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._avatarUri = marshal.string.fromJSON(json.avatarUri)
        }
    }

    /**
     * The avatar URL
     */
    get avatarUri(): string {
        assert(this._avatarUri != null, 'uninitialized access')
        return this._avatarUri
    }

    set avatarUri(value: string) {
        this._avatarUri = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            avatarUri: this.avatarUri,
        }
    }
}
