import {AvatarObject} from "./_avatarObject"
import {AvatarUri} from "./_avatarUri"

export type Avatar = AvatarObject | AvatarUri

export function fromJsonAvatar(json: any): Avatar {
    switch(json?.isTypeOf) {
        case 'AvatarObject': return new AvatarObject(undefined, json)
        case 'AvatarUri': return new AvatarUri(undefined, json)
        default: throw new TypeError('Unknown json object passed as Avatar')
    }
}
