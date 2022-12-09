import {DataObjectTypeChannelAvatar} from "./_dataObjectTypeChannelAvatar"
import {DataObjectTypeChannelCoverPhoto} from "./_dataObjectTypeChannelCoverPhoto"
import {DataObjectTypeVideoMedia} from "./_dataObjectTypeVideoMedia"
import {DataObjectTypeVideoThumbnail} from "./_dataObjectTypeVideoThumbnail"
import {DataObjectTypeVideoSubtitle} from "./_dataObjectTypeVideoSubtitle"
import {DataObjectTypeChannelPayoutsPayload} from "./_dataObjectTypeChannelPayoutsPayload"

export type DataObjectType = DataObjectTypeChannelAvatar | DataObjectTypeChannelCoverPhoto | DataObjectTypeVideoMedia | DataObjectTypeVideoThumbnail | DataObjectTypeVideoSubtitle | DataObjectTypeChannelPayoutsPayload

export function fromJsonDataObjectType(json: any): DataObjectType {
    switch(json?.isTypeOf) {
        case 'DataObjectTypeChannelAvatar': return new DataObjectTypeChannelAvatar(undefined, json)
        case 'DataObjectTypeChannelCoverPhoto': return new DataObjectTypeChannelCoverPhoto(undefined, json)
        case 'DataObjectTypeVideoMedia': return new DataObjectTypeVideoMedia(undefined, json)
        case 'DataObjectTypeVideoThumbnail': return new DataObjectTypeVideoThumbnail(undefined, json)
        case 'DataObjectTypeVideoSubtitle': return new DataObjectTypeVideoSubtitle(undefined, json)
        case 'DataObjectTypeChannelPayoutsPayload': return new DataObjectTypeChannelPayoutsPayload(undefined, json)
        default: throw new TypeError('Unknown json object passed as DataObjectType')
    }
}
