import assert from "assert"
import * as marshal from "./marshal"
import {Comment} from "./comment.model"

export class MetaprotocolTransactionResultCommentModerated {
    public readonly isTypeOf = 'MetaprotocolTransactionResultCommentModerated'
    private _commentModerated!: string | undefined | null

    constructor(props?: Partial<Omit<MetaprotocolTransactionResultCommentModerated, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._commentModerated = json.commentModerated == null ? undefined : marshal.string.fromJSON(json.commentModerated)
        }
    }

    get commentModerated(): string | undefined | null {
        return this._commentModerated
    }

    set commentModerated(value: string | undefined | null) {
        this._commentModerated = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            commentModerated: this.commentModerated,
        }
    }
}
