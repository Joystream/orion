"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonTransactionalStatus = void 0;
const _transactionalStatusIdle_1 = require("./_transactionalStatusIdle");
const _transactionalStatusInitiatedOfferToMember_1 = require("./_transactionalStatusInitiatedOfferToMember");
const _transactionalStatusBuyNow_1 = require("./_transactionalStatusBuyNow");
const _transactionalStatusAuction_1 = require("./_transactionalStatusAuction");
function fromJsonTransactionalStatus(json) {
    switch (json?.isTypeOf) {
        case 'TransactionalStatusIdle': return new _transactionalStatusIdle_1.TransactionalStatusIdle(undefined, json);
        case 'TransactionalStatusInitiatedOfferToMember': return new _transactionalStatusInitiatedOfferToMember_1.TransactionalStatusInitiatedOfferToMember(undefined, json);
        case 'TransactionalStatusBuyNow': return new _transactionalStatusBuyNow_1.TransactionalStatusBuyNow(undefined, json);
        case 'TransactionalStatusAuction': return new _transactionalStatusAuction_1.TransactionalStatusAuction(undefined, json);
        default: throw new TypeError('Unknown json object passed as TransactionalStatus');
    }
}
exports.fromJsonTransactionalStatus = fromJsonTransactionalStatus;
//# sourceMappingURL=_transactionalStatus.js.map