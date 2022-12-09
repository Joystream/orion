import assert from "assert"
import * as marshal from "./marshal"
import {Comment} from "./comment.model"

export class CommentCreatedEventData {
    public readonly isTypeOf = 'CommentCreatedEventData'
    private _comment!: string
    private _text!: string

    constructor(props?: Partial<Omit<CommentCreatedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._comment = marshal.string.fromJSON(json.comment)
            this._text = marshal.string.fromJSON(json.text)
        }
    }

    /**
     * The comment that was added
     */
    get comment(): string {
        assert(this._comment != null, 'uninitialized access')
        return this._comment
    }

    set comment(value: string) {
        this._comment = value
    }

    /**
     * Comment's original text
     */
    get text(): string {
        assert(this._text != null, 'uninitialized access')
        return this._text
    }

    set text(value: string) {
        this._text = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            comment: this.comment,
            text: this.text,
        }
    }
}
