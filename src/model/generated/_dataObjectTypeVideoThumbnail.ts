import assert from "assert"
import * as marshal from "./marshal"
import {Video} from "./video.model"

export class DataObjectTypeVideoThumbnail {
    public readonly isTypeOf = 'DataObjectTypeVideoThumbnail'
    private _video!: string

    constructor(props?: Partial<Omit<DataObjectTypeVideoThumbnail, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._video = marshal.string.fromJSON(json.video)
        }
    }

    /**
     * Related video entity
     */
    get video(): string {
        assert(this._video != null, 'uninitialized access')
        return this._video
    }

    set video(value: string) {
        this._video = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            video: this.video,
        }
    }
}
