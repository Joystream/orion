"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonMetaprotocolTransactionResult = void 0;
const _metaprotocolTransactionResultOk_1 = require("./_metaprotocolTransactionResultOk");
const _metaprotocolTransactionResultCommentCreated_1 = require("./_metaprotocolTransactionResultCommentCreated");
const _metaprotocolTransactionResultCommentEdited_1 = require("./_metaprotocolTransactionResultCommentEdited");
const _metaprotocolTransactionResultCommentDeleted_1 = require("./_metaprotocolTransactionResultCommentDeleted");
const _metaprotocolTransactionResultCommentModerated_1 = require("./_metaprotocolTransactionResultCommentModerated");
const _metaprotocolTransactionResultFailed_1 = require("./_metaprotocolTransactionResultFailed");
const _metaprotocolTransactionResultChannelPaid_1 = require("./_metaprotocolTransactionResultChannelPaid");
function fromJsonMetaprotocolTransactionResult(json) {
    switch (json?.isTypeOf) {
        case 'MetaprotocolTransactionResultOK': return new _metaprotocolTransactionResultOk_1.MetaprotocolTransactionResultOK(undefined, json);
        case 'MetaprotocolTransactionResultCommentCreated': return new _metaprotocolTransactionResultCommentCreated_1.MetaprotocolTransactionResultCommentCreated(undefined, json);
        case 'MetaprotocolTransactionResultCommentEdited': return new _metaprotocolTransactionResultCommentEdited_1.MetaprotocolTransactionResultCommentEdited(undefined, json);
        case 'MetaprotocolTransactionResultCommentDeleted': return new _metaprotocolTransactionResultCommentDeleted_1.MetaprotocolTransactionResultCommentDeleted(undefined, json);
        case 'MetaprotocolTransactionResultCommentModerated': return new _metaprotocolTransactionResultCommentModerated_1.MetaprotocolTransactionResultCommentModerated(undefined, json);
        case 'MetaprotocolTransactionResultFailed': return new _metaprotocolTransactionResultFailed_1.MetaprotocolTransactionResultFailed(undefined, json);
        case 'MetaprotocolTransactionResultChannelPaid': return new _metaprotocolTransactionResultChannelPaid_1.MetaprotocolTransactionResultChannelPaid(undefined, json);
        default: throw new TypeError('Unknown json object passed as MetaprotocolTransactionResult');
    }
}
exports.fromJsonMetaprotocolTransactionResult = fromJsonMetaprotocolTransactionResult;
//# sourceMappingURL=_metaprotocolTransactionResult.js.map