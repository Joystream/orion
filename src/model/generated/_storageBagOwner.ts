import {StorageBagOwnerCouncil} from "./_storageBagOwnerCouncil"
import {StorageBagOwnerWorkingGroup} from "./_storageBagOwnerWorkingGroup"
import {StorageBagOwnerMember} from "./_storageBagOwnerMember"
import {StorageBagOwnerChannel} from "./_storageBagOwnerChannel"
import {StorageBagOwnerDAO} from "./_storageBagOwnerDao"

export type StorageBagOwner = StorageBagOwnerCouncil | StorageBagOwnerWorkingGroup | StorageBagOwnerMember | StorageBagOwnerChannel | StorageBagOwnerDAO

export function fromJsonStorageBagOwner(json: any): StorageBagOwner {
    switch(json?.isTypeOf) {
        case 'StorageBagOwnerCouncil': return new StorageBagOwnerCouncil(undefined, json)
        case 'StorageBagOwnerWorkingGroup': return new StorageBagOwnerWorkingGroup(undefined, json)
        case 'StorageBagOwnerMember': return new StorageBagOwnerMember(undefined, json)
        case 'StorageBagOwnerChannel': return new StorageBagOwnerChannel(undefined, json)
        case 'StorageBagOwnerDAO': return new StorageBagOwnerDAO(undefined, json)
        default: throw new TypeError('Unknown json object passed as StorageBagOwner')
    }
}
