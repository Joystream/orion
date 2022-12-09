import assert from "assert"
import * as marshal from "./marshal"
import {Comment} from "./comment.model"

export class CommentTextUpdatedEventData {
    public readonly isTypeOf = 'CommentTextUpdatedEventData'
    private _comment!: string
    private _newText!: string

    constructor(props?: Partial<Omit<CommentTextUpdatedEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._comment = marshal.string.fromJSON(json.comment)
            this._newText = marshal.string.fromJSON(json.newText)
        }
    }

    /**
     * The comment being updated
     */
    get comment(): string {
        assert(this._comment != null, 'uninitialized access')
        return this._comment
    }

    set comment(value: string) {
        this._comment = value
    }

    /**
     * New comment text
     */
    get newText(): string {
        assert(this._newText != null, 'uninitialized access')
        return this._newText
    }

    set newText(value: string) {
        this._newText = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            comment: this.comment,
            newText: this.newText,
        }
    }
}
