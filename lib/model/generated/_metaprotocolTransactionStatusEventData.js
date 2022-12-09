"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaprotocolTransactionStatusEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const _metaprotocolTransactionResult_1 = require("./_metaprotocolTransactionResult");
class MetaprotocolTransactionStatusEventData {
    constructor(props, json) {
        this.isTypeOf = 'MetaprotocolTransactionStatusEventData';
        Object.assign(this, props);
        if (json != null) {
            this._result = (0, _metaprotocolTransactionResult_1.fromJsonMetaprotocolTransactionResult)(json.result);
        }
    }
    /**
     * The result of metaprotocol action
     */
    get result() {
        (0, assert_1.default)(this._result != null, 'uninitialized access');
        return this._result;
    }
    set result(value) {
        this._result = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            result: this.result.toJSON(),
        };
    }
}
exports.MetaprotocolTransactionStatusEventData = MetaprotocolTransactionStatusEventData;
//# sourceMappingURL=_metaprotocolTransactionStatusEventData.js.map