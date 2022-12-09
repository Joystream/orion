import {GeographicalAreaContinent} from "./_geographicalAreaContinent"
import {GeographicalAreaCountry} from "./_geographicalAreaCountry"
import {GeographicalAreaSubdivistion} from "./_geographicalAreaSubdivistion"

export type GeographicalArea = GeographicalAreaContinent | GeographicalAreaCountry | GeographicalAreaSubdivistion

export function fromJsonGeographicalArea(json: any): GeographicalArea {
    switch(json?.isTypeOf) {
        case 'GeographicalAreaContinent': return new GeographicalAreaContinent(undefined, json)
        case 'GeographicalAreaCountry': return new GeographicalAreaCountry(undefined, json)
        case 'GeographicalAreaSubdivistion': return new GeographicalAreaSubdivistion(undefined, json)
        default: throw new TypeError('Unknown json object passed as GeographicalArea')
    }
}
