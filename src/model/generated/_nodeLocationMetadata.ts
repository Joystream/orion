import assert from "assert"
import * as marshal from "./marshal"
import {GeoCoordinates} from "./_geoCoordinates"

export class NodeLocationMetadata {
    private _countryCode!: string | undefined | null
    private _city!: string | undefined | null
    private _coordinates!: GeoCoordinates | undefined | null

    constructor(props?: Partial<Omit<NodeLocationMetadata, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._countryCode = json.countryCode == null ? undefined : marshal.string.fromJSON(json.countryCode)
            this._city = json.city == null ? undefined : marshal.string.fromJSON(json.city)
            this._coordinates = json.coordinates == null ? undefined : new GeoCoordinates(undefined, json.coordinates)
        }
    }

    /**
     * ISO 3166-1 alpha-2 country code (2 letters)
     */
    get countryCode(): string | undefined | null {
        return this._countryCode
    }

    set countryCode(value: string | undefined | null) {
        this._countryCode = value
    }

    /**
     * City name
     */
    get city(): string | undefined | null {
        return this._city
    }

    set city(value: string | undefined | null) {
        this._city = value
    }

    /**
     * Geographic coordinates
     */
    get coordinates(): GeoCoordinates | undefined | null {
        return this._coordinates
    }

    set coordinates(value: GeoCoordinates | undefined | null) {
        this._coordinates = value
    }

    toJSON(): object {
        return {
            countryCode: this.countryCode,
            city: this.city,
            coordinates: this.coordinates == null ? undefined : this.coordinates.toJSON(),
        }
    }
}
