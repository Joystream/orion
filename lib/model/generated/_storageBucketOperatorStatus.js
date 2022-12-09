"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonStorageBucketOperatorStatus = void 0;
const _storageBucketOperatorStatusMissing_1 = require("./_storageBucketOperatorStatusMissing");
const _storageBucketOperatorStatusInvited_1 = require("./_storageBucketOperatorStatusInvited");
const _storageBucketOperatorStatusActive_1 = require("./_storageBucketOperatorStatusActive");
function fromJsonStorageBucketOperatorStatus(json) {
    switch (json?.isTypeOf) {
        case 'StorageBucketOperatorStatusMissing': return new _storageBucketOperatorStatusMissing_1.StorageBucketOperatorStatusMissing(undefined, json);
        case 'StorageBucketOperatorStatusInvited': return new _storageBucketOperatorStatusInvited_1.StorageBucketOperatorStatusInvited(undefined, json);
        case 'StorageBucketOperatorStatusActive': return new _storageBucketOperatorStatusActive_1.StorageBucketOperatorStatusActive(undefined, json);
        default: throw new TypeError('Unknown json object passed as StorageBucketOperatorStatus');
    }
}
exports.fromJsonStorageBucketOperatorStatus = fromJsonStorageBucketOperatorStatus;
//# sourceMappingURL=_storageBucketOperatorStatus.js.map