import assert from "assert"
import * as marshal from "./marshal"
import {Video} from "./video.model"

export class PaymentContextVideo {
    public readonly isTypeOf = 'PaymentContextVideo'
    private _video!: string

    constructor(props?: Partial<Omit<PaymentContextVideo, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._video = marshal.string.fromJSON(json.video)
        }
    }

    /**
     * Video for which the payment was made
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
