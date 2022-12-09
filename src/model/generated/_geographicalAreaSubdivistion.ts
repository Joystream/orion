import assert from "assert"
import * as marshal from "./marshal"

export class GeographicalAreaSubdivistion {
    public readonly isTypeOf = 'GeographicalAreaSubdivistion'
    private _subdivisionCode!: string | undefined | null

    constructor(props?: Partial<Omit<GeographicalAreaSubdivistion, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._subdivisionCode = json.subdivisionCode == null ? undefined : marshal.string.fromJSON(json.subdivisionCode)
        }
    }

    /**
     * ISO 3166-2 subdivision code
     */
    get subdivisionCode(): string | undefined | null {
        return this._subdivisionCode
    }

    set subdivisionCode(value: string | undefined | null) {
        this._subdivisionCode = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            subdivisionCode: this.subdivisionCode,
        }
    }
}
