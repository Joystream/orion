import assert from "assert"
import * as marshal from "./marshal"

export class GeoCoordinates {
    private _latitude!: number
    private _longitude!: number

    constructor(props?: Partial<Omit<GeoCoordinates, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._latitude = marshal.float.fromJSON(json.latitude)
            this._longitude = marshal.float.fromJSON(json.longitude)
        }
    }

    get latitude(): number {
        assert(this._latitude != null, 'uninitialized access')
        return this._latitude
    }

    set latitude(value: number) {
        this._latitude = value
    }

    get longitude(): number {
        assert(this._longitude != null, 'uninitialized access')
        return this._longitude
    }

    set longitude(value: number) {
        this._longitude = value
    }

    toJSON(): object {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
        }
    }
}
