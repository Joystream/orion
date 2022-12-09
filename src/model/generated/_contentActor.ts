import {ContentActorCurator} from "./_contentActorCurator"
import {ContentActorMember} from "./_contentActorMember"
import {ContentActorLead} from "./_contentActorLead"

export type ContentActor = ContentActorCurator | ContentActorMember | ContentActorLead

export function fromJsonContentActor(json: any): ContentActor {
    switch(json?.isTypeOf) {
        case 'ContentActorCurator': return new ContentActorCurator(undefined, json)
        case 'ContentActorMember': return new ContentActorMember(undefined, json)
        case 'ContentActorLead': return new ContentActorLead(undefined, json)
        default: throw new TypeError('Unknown json object passed as ContentActor')
    }
}
