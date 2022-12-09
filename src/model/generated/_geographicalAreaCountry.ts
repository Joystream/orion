import assert from "assert"
import * as marshal from "./marshal"

export class GeographicalAreaCountry {
    public readonly isTypeOf = 'GeographicalAreaCountry'
    private _countryCode!: string | undefined | null

    constructor(props?: Partial<Omit<GeographicalAreaCountry, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._countryCode = json.countryCode == null ? undefined : marshal.string.fromJSON(json.countryCode)
        }
    }

    /**
     * ISO 3166-1 alpha-2 country code
     */
    get countryCode(): string | undefined | null {
        return this._countryCode
    }

    set countryCode(value: string | undefined | null) {
        this._countryCode = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            countryCode: this.countryCode,
        }
    }
}
