import assert from "assert"
import * as marshal from "./marshal"
import {Comment} from "./comment.model"

export class MetaprotocolTransactionResultCommentEdited {
    public readonly isTypeOf = 'MetaprotocolTransactionResultCommentEdited'
    private _commentEdited!: string | undefined | null

    constructor(props?: Partial<Omit<MetaprotocolTransactionResultCommentEdited, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._commentEdited = json.commentEdited == null ? undefined : marshal.string.fromJSON(json.commentEdited)
        }
    }

    get commentEdited(): string | undefined | null {
        return this._commentEdited
    }

    set commentEdited(value: string | undefined | null) {
        this._commentEdited = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            commentEdited: this.commentEdited,
        }
    }
}
