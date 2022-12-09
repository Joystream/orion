import {StorageBucketOperatorStatusMissing} from "./_storageBucketOperatorStatusMissing"
import {StorageBucketOperatorStatusInvited} from "./_storageBucketOperatorStatusInvited"
import {StorageBucketOperatorStatusActive} from "./_storageBucketOperatorStatusActive"

export type StorageBucketOperatorStatus = StorageBucketOperatorStatusMissing | StorageBucketOperatorStatusInvited | StorageBucketOperatorStatusActive

export function fromJsonStorageBucketOperatorStatus(json: any): StorageBucketOperatorStatus {
    switch(json?.isTypeOf) {
        case 'StorageBucketOperatorStatusMissing': return new StorageBucketOperatorStatusMissing(undefined, json)
        case 'StorageBucketOperatorStatusInvited': return new StorageBucketOperatorStatusInvited(undefined, json)
        case 'StorageBucketOperatorStatusActive': return new StorageBucketOperatorStatusActive(undefined, json)
        default: throw new TypeError('Unknown json object passed as StorageBucketOperatorStatus')
    }
}
