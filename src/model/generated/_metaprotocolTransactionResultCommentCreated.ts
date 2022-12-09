import assert from "assert"
import * as marshal from "./marshal"
import {Comment} from "./comment.model"

export class MetaprotocolTransactionResultCommentCreated {
    public readonly isTypeOf = 'MetaprotocolTransactionResultCommentCreated'
    private _commentCreated!: string | undefined | null

    constructor(props?: Partial<Omit<MetaprotocolTransactionResultCommentCreated, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._commentCreated = json.commentCreated == null ? undefined : marshal.string.fromJSON(json.commentCreated)
        }
    }

    get commentCreated(): string | undefined | null {
        return this._commentCreated
    }

    set commentCreated(value: string | undefined | null) {
        this._commentCreated = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            commentCreated: this.commentCreated,
        }
    }
}
