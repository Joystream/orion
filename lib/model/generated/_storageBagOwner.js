"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonStorageBagOwner = void 0;
const _storageBagOwnerCouncil_1 = require("./_storageBagOwnerCouncil");
const _storageBagOwnerWorkingGroup_1 = require("./_storageBagOwnerWorkingGroup");
const _storageBagOwnerMember_1 = require("./_storageBagOwnerMember");
const _storageBagOwnerChannel_1 = require("./_storageBagOwnerChannel");
const _storageBagOwnerDao_1 = require("./_storageBagOwnerDao");
function fromJsonStorageBagOwner(json) {
    switch (json?.isTypeOf) {
        case 'StorageBagOwnerCouncil': return new _storageBagOwnerCouncil_1.StorageBagOwnerCouncil(undefined, json);
        case 'StorageBagOwnerWorkingGroup': return new _storageBagOwnerWorkingGroup_1.StorageBagOwnerWorkingGroup(undefined, json);
        case 'StorageBagOwnerMember': return new _storageBagOwnerMember_1.StorageBagOwnerMember(undefined, json);
        case 'StorageBagOwnerChannel': return new _storageBagOwnerChannel_1.StorageBagOwnerChannel(undefined, json);
        case 'StorageBagOwnerDAO': return new _storageBagOwnerDao_1.StorageBagOwnerDAO(undefined, json);
        default: throw new TypeError('Unknown json object passed as StorageBagOwner');
    }
}
exports.fromJsonStorageBagOwner = fromJsonStorageBagOwner;
//# sourceMappingURL=_storageBagOwner.js.map