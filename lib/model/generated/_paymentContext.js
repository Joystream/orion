"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonPaymentContext = void 0;
const _paymentContextVideo_1 = require("./_paymentContextVideo");
const _paymentContextChannel_1 = require("./_paymentContextChannel");
function fromJsonPaymentContext(json) {
    switch (json?.isTypeOf) {
        case 'PaymentContextVideo': return new _paymentContextVideo_1.PaymentContextVideo(undefined, json);
        case 'PaymentContextChannel': return new _paymentContextChannel_1.PaymentContextChannel(undefined, json);
        default: throw new TypeError('Unknown json object passed as PaymentContext');
    }
}
exports.fromJsonPaymentContext = fromJsonPaymentContext;
//# sourceMappingURL=_paymentContext.js.map