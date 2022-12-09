import assert from "assert"
import * as marshal from "./marshal"

export class ContentActorLead {
    public readonly isTypeOf = 'ContentActorLead'
    private _phantom!: number | undefined | null

    constructor(props?: Partial<Omit<ContentActorLead, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._phantom = json.phantom == null ? undefined : marshal.int.fromJSON(json.phantom)
        }
    }

    get phantom(): number | undefined | null {
        return this._phantom
    }

    set phantom(value: number | undefined | null) {
        this._phantom = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            phantom: this.phantom,
        }
    }
}
