import assert from "assert"
import * as marshal from "./marshal"
import {Continent} from "./_continent"

export class GeographicalAreaContinent {
    public readonly isTypeOf = 'GeographicalAreaContinent'
    private _continentCode!: Continent | undefined | null

    constructor(props?: Partial<Omit<GeographicalAreaContinent, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._continentCode = json.continentCode == null ? undefined : marshal.enumFromJson(json.continentCode, Continent)
        }
    }

    get continentCode(): Continent | undefined | null {
        return this._continentCode
    }

    set continentCode(value: Continent | undefined | null) {
        this._continentCode = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            continentCode: this.continentCode,
        }
    }
}
