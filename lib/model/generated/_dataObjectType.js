"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonDataObjectType = void 0;
const _dataObjectTypeChannelAvatar_1 = require("./_dataObjectTypeChannelAvatar");
const _dataObjectTypeChannelCoverPhoto_1 = require("./_dataObjectTypeChannelCoverPhoto");
const _dataObjectTypeVideoMedia_1 = require("./_dataObjectTypeVideoMedia");
const _dataObjectTypeVideoThumbnail_1 = require("./_dataObjectTypeVideoThumbnail");
const _dataObjectTypeVideoSubtitle_1 = require("./_dataObjectTypeVideoSubtitle");
const _dataObjectTypeChannelPayoutsPayload_1 = require("./_dataObjectTypeChannelPayoutsPayload");
function fromJsonDataObjectType(json) {
    switch (json?.isTypeOf) {
        case 'DataObjectTypeChannelAvatar': return new _dataObjectTypeChannelAvatar_1.DataObjectTypeChannelAvatar(undefined, json);
        case 'DataObjectTypeChannelCoverPhoto': return new _dataObjectTypeChannelCoverPhoto_1.DataObjectTypeChannelCoverPhoto(undefined, json);
        case 'DataObjectTypeVideoMedia': return new _dataObjectTypeVideoMedia_1.DataObjectTypeVideoMedia(undefined, json);
        case 'DataObjectTypeVideoThumbnail': return new _dataObjectTypeVideoThumbnail_1.DataObjectTypeVideoThumbnail(undefined, json);
        case 'DataObjectTypeVideoSubtitle': return new _dataObjectTypeVideoSubtitle_1.DataObjectTypeVideoSubtitle(undefined, json);
        case 'DataObjectTypeChannelPayoutsPayload': return new _dataObjectTypeChannelPayoutsPayload_1.DataObjectTypeChannelPayoutsPayload(undefined, json);
        default: throw new TypeError('Unknown json object passed as DataObjectType');
    }
}
exports.fromJsonDataObjectType = fromJsonDataObjectType;
//# sourceMappingURL=_dataObjectType.js.map