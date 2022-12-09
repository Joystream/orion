import assert from "assert"
import * as marshal from "./marshal"
import {Comment} from "./comment.model"

export class MetaprotocolTransactionResultCommentDeleted {
    public readonly isTypeOf = 'MetaprotocolTransactionResultCommentDeleted'
    private _commentDeleted!: string | undefined | null

    constructor(props?: Partial<Omit<MetaprotocolTransactionResultCommentDeleted, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._commentDeleted = json.commentDeleted == null ? undefined : marshal.string.fromJSON(json.commentDeleted)
        }
    }

    get commentDeleted(): string | undefined | null {
        return this._commentDeleted
    }

    set commentDeleted(value: string | undefined | null) {
        this._commentDeleted = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            commentDeleted: this.commentDeleted,
        }
    }
}
