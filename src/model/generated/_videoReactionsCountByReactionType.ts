import assert from "assert"
import * as marshal from "./marshal"
import {VideoReactionOptions} from "./_videoReactionOptions"

export class VideoReactionsCountByReactionType {
    private _reaction!: VideoReactionOptions
    private _count!: number

    constructor(props?: Partial<Omit<VideoReactionsCountByReactionType, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._reaction = marshal.enumFromJson(json.reaction, VideoReactionOptions)
            this._count = marshal.int.fromJSON(json.count)
        }
    }

    /**
     * The reaction option
     */
    get reaction(): VideoReactionOptions {
        assert(this._reaction != null, 'uninitialized access')
        return this._reaction
    }

    set reaction(value: VideoReactionOptions) {
        this._reaction = value
    }

    /**
     * No of times the video has been reacted with given reaction
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
            reaction: this.reaction,
            count: this.count,
        }
    }
}
