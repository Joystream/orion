import assert from "assert"
import * as marshal from "./marshal"

export class CommentReactionsCountByReactionId {
    private _reactionId!: number
    private _count!: number

    constructor(props?: Partial<Omit<CommentReactionsCountByReactionId, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._reactionId = marshal.int.fromJSON(json.reactionId)
            this._count = marshal.int.fromJSON(json.count)
        }
    }

    /**
     * The reaction id
     */
    get reactionId(): number {
        assert(this._reactionId != null, 'uninitialized access')
        return this._reactionId
    }

    set reactionId(value: number) {
        this._reactionId = value
    }

    /**
     * No of times the comment has been reacted with given reaction Id
     */
    get count(): number {
        assert(this._count != null, 'uninitialized access')
        return this._count
    }

    set count(value: number) {
        this._count = value
    }

    toJSON(): object {
        return {
            reactionId: this.reactionId,
            count: this.count,
        }
    }
}
