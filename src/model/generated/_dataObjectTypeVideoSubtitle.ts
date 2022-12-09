import assert from "assert"
import * as marshal from "./marshal"
import {VideoSubtitle} from "./videoSubtitle.model"
import {Video} from "./video.model"

export class DataObjectTypeVideoSubtitle {
    public readonly isTypeOf = 'DataObjectTypeVideoSubtitle'
    private _subtitle!: string
    private _video!: string

    constructor(props?: Partial<Omit<DataObjectTypeVideoSubtitle, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._subtitle = marshal.string.fromJSON(json.subtitle)
            this._video = marshal.string.fromJSON(json.video)
        }
    }

    /**
     * Related subtitle entity
     */
    get subtitle(): string {
        assert(this._subtitle != null, 'uninitialized access')
        return this._subtitle
    }

    set subtitle(value: string) {
        this._subtitle = value
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
            subtitle: this.subtitle,
            video: this.video,
        }
    }
}
