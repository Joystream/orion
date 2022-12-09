import assert from "assert"
import * as marshal from "./marshal"
import {Curator} from "./curator.model"

export class ContentActorCurator {
    public readonly isTypeOf = 'ContentActorCurator'
    private _curator!: string

    constructor(props?: Partial<Omit<ContentActorCurator, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._curator = marshal.string.fromJSON(json.curator)
        }
    }

    get curator(): string {
        assert(this._curator != null, 'uninitialized access')
        return this._curator
    }

    set curator(value: string) {
        this._curator = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            curator: this.curator,
        }
    }
}
